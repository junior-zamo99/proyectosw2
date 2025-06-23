import { Controller, Post, Body} from '@nestjs/common';
import { LinealService } from './lineal.service';

@Controller('lineal')
export class LinealController {
  constructor(private readonly linealService: LinealService) {}

  @Post('predicciones')
  async predecirCategoria(@Body() body: any) {
    return this.linealService.predecirVentasCategoria(
      body.categoria_id,
      body.meses || 3,
      body.incluir_grafico || false
    );
  }

//   @Get('categorias')
//   async obtenerCategorias() {
//     return this.linealService.listarCategorias();
//   }

//   @Get('predicciones/tendencias')
//   async obtenerTendencias() {
//     return this.linealService.obtenerTendencias();
//   }
}