import { Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, Req, Res, Param, Body } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigTiendaService } from './config-tienda.service';

@Controller('')
export class ConfigTiendaController {
     constructor(
        private readonly configTiendaService: ConfigTiendaService
    ) {}
 @Get('logo')
    @UseGuards(AuthGuard)
    async getLogo(@Res() res, @Req() req) {
        try {
            const user = req.user;
            const tenant = user.tenant;
            const config = await this.configTiendaService.getConfigTienda(tenant);
            res.status(200).send({ logo: config?.logo || null });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al obtener el logo', error });
        }
    }

    @Post('logo')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('logo', {
        storage: diskStorage({
            destination: './uploads/logos',
            filename: (req, file, cb) => {
                cb(null, uuidv4() + '' + extname(file.originalname));
            }
        }),
        limits: {
            fileSize: 1024 * 1024 * 2 // 2MB
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                cb(null, true);
            } else {
                cb(new Error('Formato de archivo no permitido'), false);
            }
        }
    }))
    async updateLogo(@Res() res, @Req() req, @UploadedFile() file) {
        try {
            const user = req.user;
            const tenant = user.tenant;
            
            if (!file) {
                return res.status(400).send({ message: 'No se ha subido ninguna imagen' });
            }

            const logoPath = file.filename;
            const config = await this.configTiendaService.updateLogo(tenant, logoPath);
            
            res.status(200).send({ 
                success: true, 
                config,
                logo: logoPath
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al actualizar el logo', error });
        }
    }

    @Get('getLogo/:img')
    async getLogoImage(@Res() res, @Param('img') img) {
        const filename = 'uploads/logos/' + img;
        if (fs.existsSync(filename)) {
            res.sendFile(path.resolve(filename));
        } else {
            res.status(404).send({ message: 'No existe la imagen' });
        }
    }

    // --- Nuevos métodos para el banner (simple, como el logo) ---
    @Get('banner')
    @UseGuards(AuthGuard)
    async getBanner(@Res() res, @Req() req) {
        try {
            const user = req.user;
            const tenant = user.tenant;
            const config = await this.configTiendaService.getConfigTienda(tenant);
            res.status(200).send({ banner: config?.banner || null });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al obtener el banner', error });
        }
    }

    @Post('banner')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('banner', {
        storage: diskStorage({
            destination: './uploads/banners',
            filename: (req, file, cb) => {
                cb(null, uuidv4() + '' + extname(file.originalname));
            }
        }),
        limits: {
            fileSize: 1024 * 1024 * 5 // 5MB para el banner (un poco más grande)
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                cb(null, true);
            } else {
                cb(new Error('Formato de archivo no permitido'), false);
            }
        }
    }))
    async updateBanner(@Res() res, @Req() req, @UploadedFile() file) {
        try {
            const user = req.user;
            const tenant = user.tenant;
            
            if (!file) {
                return res.status(400).send({ message: 'No se ha subido ninguna imagen' });
            }

            const bannerPath = file.filename;
            const config = await this.configTiendaService.updateBanner(tenant, bannerPath);
            
            res.status(200).send({ 
                success: true, 
                config,
                banner: bannerPath
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al actualizar el banner', error });
        }
    }

    @Get('getBanner/:img')
    async getBannerImage(@Res() res, @Param('img') img) {
        const filename = 'uploads/banners/' + img;
        if (fs.existsSync(filename)) {
            res.sendFile(path.resolve(filename));
        } else {
            res.status(404).send({ message: 'No existe la imagen' });
        }
    }


      @Get('contacto')
    @UseGuards(AuthGuard)
    async getContacto(@Res() res, @Req() req) {
        try {
            const user = req.user;
            const tenant = user.tenant;
            const contacto = await this.configTiendaService.getContacto(tenant);
            res.status(200).send({ contacto });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al obtener la información de contacto', error });
        }
    }

    @Post('contacto')
    @UseGuards(AuthGuard)
    async updateContacto(@Res() res, @Req() req, @Body() contactoData) {
        try {
            const user = req.user;
            const tenant = user.tenant;
            
            const config = await this.configTiendaService.updateContacto(tenant, contactoData);
            
            res.status(200).send({ 
                success: true, 
                contacto: config.contacto
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al actualizar la información de contacto', error });
        }
    }

    @Get('config-tienda-public')
    async getConfigTiendaPublic(@Res() res, @Req() req) {
  try {
    
   const tenant = req['tenant'];
    const config = await this.configTiendaService.getConfigTiendaPublic(tenant);
    res.status(200).send({ 
      success: true, 
      logo: config?.logo || null,
      banner: config?.banner || null
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener la configuración de la tienda', error });
  }
}

@Get('contacto-public')
async getContactoPublic(@Res() res, @Req() req) {
  try {
   
    const tenant = req['tenant'];
    const config = await this.configTiendaService.getContactoPublic(tenant);
    res.status(200).send({ 
      success: true, 
      contacto: config || null
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener la información de contacto', error });
  }
}
   
}
