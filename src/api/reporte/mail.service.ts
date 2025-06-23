import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Cambia esto si usas Gmail o Outlook
        port: 587,
        secure: false,
        auth: {
            user: 'junior.zf.99@gmail.com',
            pass: 'exis igvj uegr tmjc'
        },
    });

    async enviarCorreoConAdjunto(email:string, subject: string, body: string, pdfBuffer: Buffer,pdfBufferDetalles:Buffer, fileName: string,filenameDetalles:string) {
        try {
            console.log('email', email);
            const info = await this.transporter.sendMail({
                from: '"Tkm jeans" <sopote@tecnoweb.edu>',
                to: email,
                subject,
                text: body,
                attachments: [
                    {
                        filename: fileName,
                        content: pdfBuffer
                    },
                    {
                        filename: filenameDetalles, 
                        content: pdfBufferDetalles
                    }
                ]
            });

            return { message: 'Correo enviado con éxito a ' + email, info };
        } catch (error) {
            console.error('Error al enviar correo:', error);
        }
    }
}
