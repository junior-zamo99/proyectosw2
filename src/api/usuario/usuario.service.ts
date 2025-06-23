import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from "bcrypt";
@Injectable()
export class UsuarioService {

    constructor(
        @InjectModel('usuario') private usuarioModel,
        private readonly _jwtService: JwtService,
        @InjectModel('rol') private rolModel,
        @InjectModel('funcionalidad') private funcionalidadModel
    ) { }

    async createUsuario(data: any,tenantID:any) {

        try {
            const _usuario = await this.usuarioModel.find({ email: data.email,tenant:tenantID });

            if (_usuario.length >= 1) {
                return { data: undefined, message: 'el correro electronico ya esta en uso' }
            } else {
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash('856341', salt)
                data.password = hash
                data.fullname = data.nombres + ' ' + data.apellidos
                data.tenant = tenantID
                const usuario = await this.usuarioModel.create(data)
                return { data: usuario }
            }
        } catch (error) {
            console.log(error)
            return { data: undefined, message: 'no se pudo crear el usuario' }
        }


    }

    async cambioEstado(id: any, data: any, tenantID: any) {
        const usuario = await this.usuarioModel.findOne({ _id: id,tenant:tenantID });
        if (usuario) {
            const estadoActual = data.estado;
            const reg = await this.usuarioModel.findOneAndUpdate({ _id: id,tenant:tenantID }, {
                estado: !estadoActual
            });

            return reg;
        } else {
            return { data: undefined, message: 'No se pudo obtener los usuarios' };
        }
    }

    async updateUsuario(id: any, data: any,tenantID: any) {
        try {
            const regUser = await this.usuarioModel.findOne({ email: data.email,tenant:tenantID, _id: { $ne: id } });
            if (regUser) {
                return { data: undefined, message: 'El correo ya está en uso' };
            }

            const usuario = await this.usuarioModel.findOneAndUpdate({ _id: id }, {
                nombres: data.nombres,
                apellidos: data.apellidos,
                email: data.email,
                rol: data.rol
            });

            if (usuario) {
                return { data: usuario };
            } else {
                return { data: undefined, message: 'No se pudo obtener el usuario' };
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo actualizar el usuario', error: error.message };
        }
    }


    async getUsuario(id: any,tenantID:any) {
        try {
            const usuario = await this.usuarioModel.findOne({ _id: id,tenant:tenantID }).populate('rol');
            if (usuario) {
                return { data: usuario }
            } else {
                return { data: undefined, message: 'No se pudo obtener el usuario' };
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo obtener el usuario' };
        }
    }


    async getUsuarios(filtro: any,tenantID:any) {
        try {
            let usuarios = [];
            if (filtro == 'Todos') {
                usuarios = await this.usuarioModel.find({tenant:tenantID}).sort({ createdAt: -1 }).populate('rol');
            } else {
                const buscarTerm = filtro.split(' ')
                const regTerm = buscarTerm.map((term) => `(?=.*\\b${term}\\b)`);
                const regex = new RegExp(`^${regTerm.join('')}`, 'i');
                usuarios = await this.usuarioModel.find({
                    $or: [
                        { fullname: regex },
                        { nombres: new RegExp(filtro, 'i') },
                        { apellidos: new RegExp(filtro, 'i') },
                        { email: new RegExp(filtro, 'i') }
                    ]
                }).sort({ createdAt: -1 });
            }
            return usuarios;
        } catch (error) {
            return { data: undefined, message: 'No se pudo obtener los usuarios' };
        }
    }



    async login(data: any) {
        const usuario = await this.usuarioModel.find({ email: data.email }).populate('rol')

        if (usuario.length >= 1) {
            usuario[0].rol = usuario[0].rol._id

            const compare = await bcrypt.compare(data.password, usuario[0].password)

            if (compare) {
                const jwt = this._jwtService.sign({
                    sub: usuario[0]._id,
                    nombres: usuario[0].nombres,
                    apellidos: usuario[0].apellidos,
                    email: usuario[0].email,
                    tenant:usuario[0].tenant,
                    rol: usuario[0].rol,


                })
                if (usuario[0].estado) {
                    return { data: usuario[0], jwt }
                } {
                    return { data: undefined, message: 'el usuario esta desactivado' }
                }

            } else {
                return { data: undefined, message: 'la contraseña es incorrecta' }
            }
        } else {

            return { data: undefined, message: 'el correro electronico no fue encontrado' }
        }
    }


}
