import {  Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
// import { AuthGuard } from 'src/guards/auth/auth.guard';
import { PdfService } from './pdf.service';
import { MailService } from './mail.service';
import { ReporteService } from './reporte.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('reporte')
export class ReporteController {
  constructor(
    private readonly reportesService: ReporteService,
    private readonly pdfService: PdfService,
    private readonly mailService: MailService
  ) { }

  // Obtener reporte dinámico según la entidad seleccionada
  @Get()
  @UseGuards(AuthGuard)
  async obtenerReporte(
    @Query('entidad') entidad: string,  // ventas, compras, ingresos, egresos, inventario
    @Query('inicio') inicio: string,
    @Query('fin') fin: string,
    @Res() res,
    @Req() req
  ) {
    const user = req.user;
    const tenant = user.tenant;
    return this.reportesService.obtenerDatosPorRango(entidad, inicio, fin,tenant);
  }

 
  @Get('pdf')
  @UseGuards(AuthGuard)
  async generarReportePDF(
    @Query('entidad') entidad: string,
    @Query('inicio') inicio: string,
    @Query('fin') fin: string,
    @Res() res,
    @Req() req
  ) {
    const user = req.user;
    const tenant = user.tenant;
    const datos = await this.reportesService.obtenerDatosPorRango(entidad, inicio, fin,tenant);
    const pdfBuffer = await this.pdfService.generarReporte(datos.data, entidad);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Reporte_${entidad}.pdf`
    });

    res.send(pdfBuffer);
  }

  @Post('enviar')
  @UseGuards(AuthGuard)
  async enviarReporteCorreo(@Res()res, @Req() req) {
    const user = req.user;
    const tenant = user.tenant;
    const { entidad, inicio, fin, email, asunto, mensaje } = req.body;
    
    console.log('req.body', req.body);
    
    const subject = asunto;
    const body = mensaje;
    const datos = await this.reportesService.obtenerDatosPorRango(entidad, inicio, fin,tenant);
    const detalles= await this.reportesService.obtenerDetallesPorRango(entidad, inicio, fin,tenant);

    console.log('detalles del controlador', detalles);
    
    if (!datos.data.length) {
      return { message: `No hay registros en ${entidad} dentro del rango de fechas.` };
    }

    const pdfBuffer = await this.pdfService.generarReporte(datos.data, entidad);

    const pdfBufferDetalles = await this.pdfService.generarReporteDetalles(detalles.data, entidad);

    const respuesta =await this.mailService.enviarCorreoConAdjunto(email, subject, body, pdfBuffer,pdfBufferDetalles, `Reporte_${entidad}.pdf`,`ReporteDetalles_${entidad}.pdf`);

    res.send(respuesta);
  }

  
}
