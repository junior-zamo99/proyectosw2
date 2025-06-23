
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from "bcrypt";
import { EmailsService } from '../emails/emails.service';
import * as moment from 'moment'
@Injectable()
export class TclienteService {

    constructor(
        @InjectModel('cliente') private readonly clienteModel,
        private readonly _jwtService: JwtService,
        private readonly _emailService: EmailsService,
        @InjectModel('carrito') private readonly carritoModel,
        @InjectModel('venta') private readonly ventaModel,
        @InjectModel('ventaDetalle') private readonly ventaDetalleModel,
        @InjectModel('ingreso') private readonly ingresoModel,
        @InjectModel('ingresoDetalle') private readonly ingresoDetalleModel,
        @InjectModel('cupon') private readonly cuponModel,
        @InjectModel('cupon_detalle') private cuponDetalleModel,
        @InjectModel('tenant') private readonly tenantModel
    ) { }

    async createClienteTienda(data: any, tenant: any) {
        try {
            if (!tenant) {
                return { data: undefined, message: 'Tenant no proporcionado' };
            }
            const tenantData = await this.tenantModel.findOne({ nombreTienda: tenant });
            if (!tenantData) {
                return { data: undefined, message: 'Tenant no encontrado' };
            }
            const _cliente = await this.clienteModel.find({ email: data.email, tenant: tenantData._id })
            if (_cliente.length > 0) {
                return { data: undefined, message: 'el correo electronico ya existe' }
            } else {
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(data.password, salt)
                data.password = hash
                data.tenant = tenantData._id
                data.fullname = data.nombres + ' ' + data.apellidos
                const cliente = await this.clienteModel.create(data)
                return { data: cliente }

            }
        } catch (error) {
            console.log(error)
            return { data: undefined, message: 'error al crear el cliente' }
        }
    }


    async loginCliente(data: any,tenant:any) {
        try {
            if (!tenant) {
                return { data: undefined, message: 'Tenant no proporcionado' };
            }
            const tenantData = await this.tenantModel.findOne({ nombreTienda: tenant });
            if (!tenantData) {
                return { data: undefined, message: 'Tenant no encontrado' };
            }
            const cliente = await this.clienteModel.findOne({ email: data.email,tenant: tenantData._id })
            if (cliente != null) {
                if (cliente.email_validacion) {
                    const compare = await bcrypt.compare(data.password, cliente.password)
                    console.log(compare)
                    if (compare) {
                        const jwt = this._jwtService.sign({
                            sub: cliente._id,
                            email: cliente.email,
                            nombres: cliente.nombres,
                            apellidos: cliente.apellidos,
                            tenant: cliente.tenant,
                        })


                        return { data: cliente, jwt }
                    } else {
                        return { data: undefined, message: 'contraseña incorrecta', tipo: 'password' }

                    }
                } else {
                    return { data: undefined, message: 'el correo electronico no ha sido verificado', tipo: 'email' }
                }
            } else {
                return { data: undefined, message: 'el correo electronico no existe', tipo: 'email' }
            }

        } catch (error) {
            return { data: undefined, message: 'error al iniciar sesion' }
        }
    }

    async getClientes(filtro: any) {
        try {
            const buscarTerm = filtro.split(' ')
            const regTerm = buscarTerm.map((term) => `(?=.*\\b${term}\\b)`);
            const regex = new RegExp(`^${regTerm.join('')}`, 'i');
            const clientes = await this.clienteModel.find({
                $or: [
                    { fullname: regex },
                    { nombres: new RegExp(filtro, 'i') },
                    { apellidos: new RegExp(filtro, 'i') },
                    { email: new RegExp(filtro, 'i') }
                ]
            })

            return { data: clientes }
        } catch (error) {
            return { data: undefined, message: 'error al obtener los clientes' }
        }
    }


    async verificacionCliente(token: any) {
        try {
            const decode = this._jwtService.verify(token)

            const today = moment().unix()

            const cliente = await this.clienteModel.findOne({ _id: decode.cliente })
            if (cliente) {
                if (today <= decode.exp) {
                    await this.clienteModel.findOneAndUpdate({ _id: decode.cliente }, { email_validacion: true })
                    return { estado: true, message: 'el correo de confirmacion ha sido verificado' }
                } else {
                    return { estado: false, message: 'el correo de confirmacion ha expirado' }
                }

            } else {
                return { estado: false, message: 'el token de verificacion no es correcto' }
            }
        } catch (error) {
            console.log(error)
            return { data: undefined, estado: false, message: 'error al verificar el cliente' }
        }
    }


    async addProductoCarrito(data: any, id: any, tenant: any) {
        try {
            if (!tenant) {
                return { data: undefined, message: 'Tenant no proporcionado' };
            }
            const tenantData = await this.tenantModel.findOne({ nombreTienda: tenant });
            if (!tenantData) {
                return { data: undefined, message: 'Tenant no encontrado' };
            }
            data.cliente = id
            data.tenant = tenantData._id
            const producto = await this.carritoModel.create(data)
            return { data: producto }
        } catch (error) {
            return { data: undefined, message: 'error al agregar el producto al carrito' }
        }
    }

    async getCliente(id: any, tenant: any) {
        try {
            if (!tenant) {
                return { data: undefined, message: 'Tenant no proporcionado' };
            }
            const tenantData = await this.tenantModel.findOne({ nombreTienda: tenant });
            if (!tenantData) {
                return { data: undefined, message: 'Tenant no encontrado' };
            }
            const cliente = await this.clienteModel.findOne({ _id: id, tenant: tenantData._id })
            return { data: cliente }
        } catch (error) {
            return { data: undefined, message: 'error al obtener el cliente' }
        }
    }

      async getClienteAuth(id: any) {
        try {
           
            const cliente = await this.clienteModel.findOne({ _id: id })
            return { data: cliente }
        } catch (error) {
            return { data: undefined, message: 'error al obtener el cliente' }
        }
    }
    async getCarritoCliente(id: any, tenant: any) {
        try {
            if (!tenant) {
                return { data: undefined, message: 'Tenant no proporcionado' };
            }
            const tenantData = await this.tenantModel.findOne({ nombreTienda: tenant });
            if (!tenantData) {
                return { data: undefined, message: 'Tenant no encontrado' };
            }
            const carrito = await this.carritoModel.find({ cliente: id,tenant:tenantData._id }).populate('producto').populate('cliente').populate('producto_variedad')
            return { data: carrito }
        } catch (error) {
            return { data: undefined, message: 'error al obtener el carrito del cliente' }
        }
    }

    async deleteProductoCarrito(id: any, tenant: any) {
        try {
            if (!tenant) {
                return { data: undefined, message: 'Tenant no proporcionado' };
            }
            const tenantData = await this.tenantModel.findOne({ nombreTienda: tenant });
            if (!tenantData) {
                return { data: undefined, message: 'Tenant no encontrado' };
            }
            const carrito = await this.carritoModel.findOneAndDelete({ _id: id, tenant: tenantData._id })
            return { data: carrito }
        } catch (error) {

            return { data: undefined, message: 'error al eliminar el producto del carrito' }
        }
    }

    async updateCantidadProductoCarrito(id: any, data: any, tenant: any) {
        try {
            if (!tenant) {
                return { data: undefined, message: 'Tenant no proporcionado' };
            }
            const tenantData = await this.tenantModel.findOne({ nombreTienda: tenant });
            if (!tenantData) {
                return { data: undefined, message: 'Tenant no encontrado' };
            }
            const carrito = await this.carritoModel.findOne({ _id: id, tenant: tenantData._id })
            if (carrito) {
                const reg = await this.carritoModel.findOneAndUpdate({ _id: id,tenant:tenantData._id }, { cantidad: data.cantidad })
                return { data: reg }
            } else {
                return { data: undefined, message: 'el producto no existe en el carrito' }
            }
        } catch (error) {
            return { data: undefined, message: 'error al actualizar la cantidad del producto del carrito' }
        }
    }


    async createVentaCliente(data: any, tenant: any) {
        try {
            if (!tenant) {
                return { data: undefined, message: 'Tenant no proporcionado' };
            }
            const tenantData = await this.tenantModel.findOne({ nombreTienda: tenant });
            if (!tenantData) {
                return { data: undefined, message: 'Tenant no encontrado' };
            }
            data.tenant= tenantData._id
            const venta = await this.ventaModel.create(data)
            if (venta) {
                for (const item of data.detalles) {
                    item.venta = venta._id
                    item.tenant = tenantData._id
                    const detalle = await this.ventaDetalleModel.create(item)

                    const ingresos = await this.ingresoDetalleModel.find({ producto_variedad: item.variedad, estado: true, tenant: tenantData._id })
                        .sort({ createdAT: -1 }).limit(item.cantidad)


                    for (const ingreso of ingresos) {
                        await this.ingresoDetalleModel.findOneAndUpdate(
                            { _id: ingreso._id }, { estado: false, venta: venta._id, ventaDetalle: detalle._id })

                    }
                }

                await this.carritoModel.deleteMany({ cliente: data.cliente })
                return { data: venta }
            } else {
                return { data: undefined, message: 'error al crear la venta' }
            }
        } catch (error) {
            console.log(error)
            return { data: undefined, message: 'error al crear la venta' }
        }
    }


    async getVentasCliente(id: any) {
        try {
            
            const cliente = await this.clienteModel.findOne({ _id: id })
            if (cliente) {
                const arrVentas = []
                const ventas = await this.ventaModel.find({ cliente: id}).sort({ createdAT: -1 }).populate('cliente')
                for (const venta of ventas) {
                    const detalles = await this.ventaDetalleModel.find({ venta: venta._id}).populate('variedad').populate('producto')

                    arrVentas.push({
                        venta: venta,
                        detallesV: detalles
                    })
                }

                return { data: arrVentas }
            } else {
                return { data: undefined, message: 'error al obtener la venta' }
            }
        } catch (error) {
            console.log(error)
            return { data: undefined, message: 'error al obtener la venta' }
        }
    }


    async aplicarCupon(codigo, data, tenant) {
        try {
            if (!tenant) {
                return { data: undefined, message: 'Tenant no proporcionado' };
            }
            const tenantData = await this.tenantModel.findOne({ nombreTienda: tenant });
            if (!tenantData) {
                return { data: undefined, message: 'Tenant no encontrado' };
            }
            console.log(data.categorias.length)
            const cupon = await this.cuponModel.findOne({ codigo: codigo, tenant: tenantData._id })
            const today = new Date().getTime()
            console.log(cupon)
            if (cupon) {
                const detalles = await this.cuponDetalleModel.find({ cupon: cupon._id,tenant:tenantData._id }).populate('categoria')
                const tt_inicio = new Date(cupon.f_inicio).getTime()
                const tt_fin = new Date(cupon.f_fin).getTime()
                console.log(detalles)

                if (today >= tt_inicio && today <= tt_fin) {
                    if (data.total <= cupon.monto_max) {
                        if (cupon.tipo == "General") {
                            return { data: cupon, message: 'cupon aplicado' }
                        } else if (cupon.tipo == "Categoria") {
                            let count = 0

                            for (const cat of data.categorias) {
                                const reg = detalles.filter((item) => item.categoria._id == cat)
                                if (reg.length > 0) {
                                    count++
                                }

                            }
                            console.log(count)
                            if (count == data.categorias.length) {
                                return { data: cupon, message: 'cupon aplicado' }
                            } else {
                                return { data: undefined, message: 'el cupon no aplica a las categorias seleccionadas' }
                            }
                        } else if (cupon.tipo == "Producto") {
                            let count = 0

                            for (const prod of data.productos) {
                                const reg = detalles.filter((item) => item.producto == prod)
                                if (reg.length > 0) {
                                    count++
                                }

                            }
                            if (count == data.productos.length) {
                                return { data: cupon, message: 'cupon aplicado' }
                            } else {
                                return { data: undefined, message: 'el cupon no aplica a los productos seleccionados' }
                            }
                        }
                    } else {
                        return { data: undefined, message: 'el monto del cupon es mayor al total de la compra' }
                    }
                } else {
                    return { data: undefined, message: 'el cupon ha expirado' }
                }

            } else {
                return { data: undefined, message: 'el cupon no existe' }
            }
        } catch (error) {
            return { data: undefined, message: 'error al aplicar el cupon' }
        }
    }
}
