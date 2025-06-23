import { Injectable } from '@nestjs/common';
import PDFDocument = require('pdfkit');


@Injectable()
export class PdfService {
    async generarReporte(datos: any[], entidad?: string): Promise<Buffer> {
        if (!entidad) {
            throw new Error("El parámetro 'entidad' es requerido para generar el reporte.");
        }

        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => { });

        doc.fontSize(20).fillColor('blue').text(`Reporte de ${entidad.toUpperCase()}`, { align: 'center' });
        doc.moveDown();

        if(entidad === 'compras'){

            doc.fontSize(12).fillColor('black').text('Fecha', 50, doc.y, { continued: true })
            .text('Total', 100, doc.y, { continued: true })
            .text('Usuario', 180, doc.y, { continued: true })
            .text('Proveedor', 250, doc.y, { continued: true })
            .text('Almacen', 300, doc.y);
         
         doc.moveDown(0.5);
         doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); 
         
         datos.forEach((item) => {
             doc.fontSize(8).text(new Date(item.createdAT).toLocaleDateString(), 50, doc.y, { continued: true })
                .text(`BS ${(item.total || 0).toFixed(2)}`, 95, doc.y, { continued: true })
                .text(item.usuario.email || 'N/A', 160, doc.y, { continued: true })
                .text(item.proveedor.nombre || 'N/A', 200, doc.y, { continued: true })
                 .text(item.almacen.nombre || 'N/A', 250, doc.y);
             doc.moveDown(0.5);
             doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(1, { space: 2 }).stroke();  // Línea punteada
             doc.undash(); // Quitar el estilo punteado para futuras líneas
         });

        }else if(entidad === 'ventas'){

            doc.fontSize(12).fillColor('black').text('Fecha', 50, doc.y, { continued: true })
            .text('Total', 100, doc.y, { continued: true })
            .text('Cliente', 180, doc.y, { continued: true })
            .text('Estado', 250, doc.y);
         
         doc.moveDown(0.5);
         doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); 
         
         datos.forEach((item) => {
             doc.fontSize(8).text(new Date(item.createdAT).toLocaleDateString(), 50, doc.y, { continued: true })
                .text(`BS ${(item.total || 0).toFixed(2)}`, 95, doc.y, { continued: true })
                .text(item.cliente.email || 'N/A', 160, doc.y, { continued: true })
                .text(item.estado || 'N/A', 200, doc.y)
                
             doc.moveDown(0.5);
             doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(1, { space: 2 }).stroke();  // Línea punteada
             doc.undash(); // Quitar el estilo punteado para futuras líneas
         });

        }
        
        else if(entidad === 'ingresos'){

            doc.fontSize(12).fillColor('black').text('Fecha', 50, doc.y, { continued: true })
            .text('Total', 100, doc.y, { continued: true })
            .text('Usuario', 180, doc.y, { continued: true })
            .text('Almacen', 250, doc.y, { continued: true })
            .text('razon', 300, doc.y);
         
         doc.moveDown(0.5);
         doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); 
         
         datos.forEach((item) => {
             doc.fontSize(8).text(new Date(item.createdAT).toLocaleDateString(), 50, doc.y, { continued: true })
                .text(`BS ${(item.total || 0).toFixed(2)}`, 95, doc.y, { continued: true })
                .text(item.usuario.email || 'N/A', 160, doc.y, { continued: true })
                .text(item.almacen.nombre || 'N/A', 200, doc.y, { continued: true })
                 .text(item.razon || 'N/A', 250, doc.y);
             doc.moveDown(0.5);
             doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(1, { space: 2 }).stroke();  // Línea punteada
             doc.undash(); // Quitar el estilo punteado para futuras líneas
         });

        }
        
        else if(entidad === 'egresos'){

            doc.fontSize(12).fillColor('black').text('Fecha', 50, doc.y, { continued: true })
            .text('Usuario', 180, doc.y, { continued: true })
            .text('Almacen', 250, doc.y, { continued: true })
            .text('razon', 300, doc.y);
         
         doc.moveDown(0.5);
         doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); 
         
         datos.forEach((item) => {
             doc.fontSize(8).text(new Date(item.createdAT).toLocaleDateString(), 50, doc.y, { continued: true })
                .text(item.usuario.email || 'N/A', 160, doc.y, { continued: true })
                .text(item.almacen.nombre || 'N/A', 200, doc.y, { continued: true })
                 .text(item.razon || 'N/A', 250, doc.y);
             doc.moveDown(0.5);
             doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(1, { space: 2 }).stroke();  // Línea punteada
             doc.undash(); // Quitar el estilo punteado para futuras líneas
         });
        }

        doc.end();
        return new Promise((resolve) => {
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
        });
    }




    async generarReporteDetalles(datos: any[], entidad?: string): Promise<Buffer> {
        if (!entidad) {
            throw new Error("El parámetro 'entidad' es requerido para generar el reporte.");
        }

        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => { });

        doc.font('Helvetica').fontSize(20).fillColor('blue').text(`Reporte de ${entidad.toUpperCase()} detallado`, { align: 'center' });
        doc.moveDown();

        if(entidad === 'compras'){

            doc.fontSize(10).fillColor('black').text('Fecha', 50, doc.y, { continued: true })
            .text('Producto', 180, doc.y, { continued: true })
            .text('Color', 250, doc.y, { continued: true })
            .text('Talla', 280, doc.y, { continued: true })
            .text('Almacen', 300, doc.y,{ continued: true })
            .text('Precio', 350, doc.y);

         
         doc.moveDown(0.5);
         doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); 
         
         datos.forEach((item) => {
             doc.fontSize(8).text(new Date(item.createdAT).toLocaleDateString(), 50, doc.y, { continued: true })
                .text(item.producto.titulo || 'N/A', 160, doc.y, { continued: true })
                .text(item.producto_variedad.color || 'N/A', 200, doc.y, { continued: true })
                .text(item.producto_variedad.talla || 'N/A', 250, doc.y, { continued: true })
                .text(item.almacen.nombre || 'N/A', 300, doc.y, { continued: true })
                .text(item.precioUnidad || 'N/A', 350, doc.y);
             doc.moveDown(0.5);
             doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(1, { space: 2 }).stroke();  // Línea punteada
             doc.undash(); // Quitar el estilo punteado para futuras líneas
         });

        }else if(entidad === 'ventas'){

            doc.fontSize(10).fillColor('black')
            .text('Fecha', 50, doc.y, { continued: true })
            .text('Producto', 120, doc.y, { continued: true })
            .text('Color', 250, doc.y, { continued: true })
            .text('Talla', 320, doc.y, { continued: true })
            .text('Cliente', 380, doc.y, { continued: true })
            .text('Cantidad', 480, doc.y);
         
         doc.moveDown(0.5);
         doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); 
         
         datos.forEach((item) => {
            doc.fontSize(8)
                .text(new Date(item.createdAT).toLocaleDateString(), 50, doc.y, { continued: true })
                .text(item.producto.titulo || 'N/A', 120, doc.y, { continued: true })
                .text(item.variedad.color || 'N/A', 250, doc.y, { continued: true })
                .text(item.variedad.talla || 'N/A', 320, doc.y, { continued: true })
                .text(item.cliente.email || 'N/A', 380, doc.y, { continued: true })
                .text(item.cantidad || 'N/A', 480, doc.y);
        
            doc.moveDown(0.5);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(1, { space: 2 }).stroke();
            doc.undash();
        });

        }
        
        else if(entidad === 'ingresos'){

            doc.fontSize(12).fillColor('black').text('Fecha', 50, doc.y, { continued: true })
            .text('Producto', 180, doc.y, { continued: true })
            .text('Color', 250, doc.y, { continued: true })
            .text('Talla', 280, doc.y, { continued: true })
            .text('Almacen', 300, doc.y,{ continued: true })
            .text('Precio', 350, doc.y);

         doc.moveDown(0.5);
         doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); 
         
         datos.forEach((item) => {
             doc.fontSize(8).text(new Date(item.createdAT).toLocaleDateString(), 50, doc.y, { continued: true })
             .text(item.producto.titulo || 'N/A', 160, doc.y, { continued: true })
             .text(item.producto_variedad.color || 'N/A', 200, doc.y, { continued: true })
             .text(item.producto_variedad.talla || 'N/A', 250, doc.y, { continued: true })
             .text(item.almacen.nombre || 'N/A', 300, doc.y, { continued: true })
             .text(item.precioUnidad || 'N/A', 350, doc.y);
             doc.moveDown(0.5);
             doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(1, { space: 2 }).stroke();  // Línea punteada
             doc.undash(); // Quitar el estilo punteado para futuras líneas
         });

        }
        
        else if(entidad === 'egresos'){

            doc.fontSize(12).fillColor('black').text('Fecha', 50, doc.y, { continued: true })
            .text('Producto', 180, doc.y, { continued: true })
            .text('Color', 250, doc.y, { continued: true })
            .text('Talla', 280, doc.y, { continued: true })
            .text('Almacen', 300, doc.y);
           
         
         doc.moveDown(0.5);
         doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); 
         
         datos.forEach((item) => {
             doc.fontSize(8).text(new Date(item.createdAT).toLocaleDateString(), 50, doc.y, { continued: true })
             .text(item.producto.titulo || 'N/A', 160, doc.y, { continued: true })
             .text(item.producto_variedad.color || 'N/A', 200, doc.y, { continued: true })
             .text(item.producto_variedad.talla || 'N/A', 250, doc.y, { continued: true })
             .text(item.almacen.nombre || 'N/A', 300, doc.y )
             
             doc.moveDown(0.5);
             doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(1, { space: 2 }).stroke();  // Línea punteada
             doc.undash(); // Quitar el estilo punteado para futuras líneas
         });
        }

        doc.end();
        return new Promise((resolve) => {
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
        });
    }


}
