import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ConfigTiendaService {
    constructor(
         @InjectModel('configTienda') private configTiendaModel,
         @InjectModel('tenant') private tenantModel,
         @InjectModel('contacto') private contactoModel
    ){}

 async getConfigTienda(tenant: string) {
        try {
            const config = await this.configTiendaModel.findOne({ tenant }).populate('contacto');
            if (!config) {
                const defaultConfig = {
                    tenant,
                    logo: null,
                    banner: null,
                    colorPrimario: '#000000',
                    colorSecundario: '#FFFFFF',
                    contacto: null
                };
                const newConfig = await this.configTiendaModel.create(defaultConfig);
                return newConfig;
            }
            return config || null;
        } catch (error) {
            console.error('Error al obtener la configuración de la tienda:', error);
            throw new Error('No se pudo obtener la configuración de la tienda');
        }
    }

    async getConfigTiendaPublic(tenant: string) {
        try {
            const tenantData= await this.tenantModel.findOne({ nombreTienda:tenant });
            if (!tenant) {
                throw new Error('Tenant no encontrado');
            }
            const config = await this.configTiendaModel.findOne({ tenant:tenantData._id }).populate('contacto');
            if (!config) {
                const defaultConfig = {
                    tenant,
                    logo: null,
                    banner: null,
                    colorPrimario: '#000000',
                    colorSecundario: '#FFFFFF',
                    contacto: null
                };
                const newConfig = await this.configTiendaModel.create(defaultConfig);
                return newConfig;
            }
            return config || null;
        } catch (error) {
            console.error('Error al obtener la configuración de la tienda:', error);
            throw new Error('No se pudo obtener la configuración de la tienda');
        }
    }

    async updateLogo(tenant: string, logoPath: string) {
        try {
            const config = await this.configTiendaModel.findOneAndUpdate(
                { tenant },
                { logo: logoPath },
                { new: true }
            );
            return config;
        } catch (error) {
            console.error('Error al actualizar el logo de la tienda:', error);
            throw new Error('No se pudo actualizar el logo de la tienda');
        }
    }

    // Nuevo método para el banner (simple, igual que el logo)
    async updateBanner(tenant: string, bannerPath: string) {
        try {
            const config = await this.configTiendaModel.findOneAndUpdate(
                { tenant },
                { banner: bannerPath },
                { new: true }
            );
            return config;
        } catch (error) {
            console.error('Error al actualizar el banner de la tienda:', error);
            throw new Error('No se pudo actualizar el banner de la tienda');
        }
    }
   

    async getContacto(tenant: string) {
        try {
            // Primero buscamos la configuración para obtener la referencia al contacto
            const config = await this.configTiendaModel.findOne({ tenant }).populate('contacto');
            
            // Si ya existe un contacto, lo devolvemos
            if (config && config.contacto) {
                return config.contacto;
            }
            
            // Si no existe, creamos uno vacío
            return null;
        } catch (error) {
            console.error('Error al obtener el contacto:', error);
            throw new Error('No se pudo obtener la información de contacto');
        }
    }
    
 async getContactoPublic(tenant: string) {
        try {
            
              const tenantData= await this.tenantModel.findOne({ nombreTienda:tenant });
            if (!tenant) {
                throw new Error('Tenant no encontrado');
            }
            const config = await this.configTiendaModel.findOne({ tenant:tenantData._id }).populate('contacto');
            
            // Si ya existe un contacto, lo devolvemos
            if (config && config.contacto) {
                return config.contacto;
            }
            
            // Si no existe, creamos uno vacío
            return null;
        } catch (error) {
            console.error('Error al obtener el contacto:', error);
            throw new Error('No se pudo obtener la información de contacto');
        }
    }

    async updateContacto(tenant: string, contactoData: any) {
        try {
            // Buscamos la configuración actual
            const config = await this.configTiendaModel.findOne({ tenant });
            
            if (!config) {
                throw new Error('No se encontró la configuración para este tenant');
            }
            
            // Si ya existe un contacto, lo actualizamos
            if (config.contacto) {
                await this.contactoModel.findByIdAndUpdate(
                    config.contacto, 
                    { 
                        ...contactoData,
                        tenant
                    },
                    { new: true }
                );
            } else {
                // Si no existe, creamos uno nuevo y actualizamos la referencia en config
                const nuevoContacto = await this.contactoModel.create({
                    ...contactoData,
                    tenant
                });
                
                await this.configTiendaModel.findOneAndUpdate(
                    { tenant },
                    { contacto: nuevoContacto._id },
                    { new: true }
                );
            }
            
            // Devolvemos la configuración actualizada con el contacto populado
            return await this.configTiendaModel.findOne({ tenant }).populate('contacto');
        } catch (error) {
            console.error('Error al actualizar el contacto:', error);
            throw new Error('No se pudo actualizar la información de contacto');
        }
    }
}
