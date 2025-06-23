import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioModule } from './api/usuario/usuario.module';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ProductoModule } from './api/producto/producto.module';

import { LogModule } from './api/log/log.module';
import { RolModule } from './api/rol/rol.module';
import { FuncionalidadModule } from './api/funcionalidad/funcionalidad.module';
import { IngresoModule } from './api/ingreso/ingreso.module';
import { InventarioModule } from './api/inventario/inventario.module';
import { TenantModule } from './api/tenant/tenant.module';
import { TclienteModule } from './api/tcliente/tcliente.module';

import { RegresionModule } from './api/ml-regresion/regresion.module';
import { EmailsModule } from './api/emails/emails.module';

import { VisitanteModule } from './api/visitante/visitante.module';

import { VentaModule } from './api/venta/venta.module';
import { RecomendacionModule } from './api/ml-recomendacion/recomendacion.module';

import { ProveedorModule } from './api/proveedor/proveedor.module';

import { AlmacenModule } from './api/almacen/almacen.module';
import { EstadisticaModule } from './api/estadistica/estadistica.module';
import { ReporteModule } from './api/reporte/reporte.module';
import { PagoModule } from './api/pago/pago.module';
import { LinealModule } from './api/ml-lineal/lineal.module';
import { ArbolModule } from './api/ml-arboles/arbol.module';
import { SegmentacionModule } from './api/ml-segmentation/segmentation.module';
import { TenantMiddleware } from './middleware/tenant.middleware';
import { ConfigTiendaModule } from './api/config-tienda/config-tienda.module';




@Module({

  imports: [

    //MongooseModule.forRoot('mongodb+srv://will:will@cluster0.rmkpe.mongodb.net/EcommerML'),
    //MongooseModule.forRoot('mongodb+srv://will:will@cluster0.rmkpe.mongodb.net/EcommerML', { connectionName: 'logsConnection' }),
    //MongooseModule.forRoot('mongodb+srv://juniorzamo:juniorzamo1999@prueba1.8qtyd.mongodb.net/proyecto1?retryWrites=true&w=majority&appName=proyecto1'),
    //MongooseModule.forRoot('mongodb+srv://juniorzamo:juniorzamo1999@prueba1.8qtyd.mongodb.net/log?retryWrites=true&w=majority&appName=proyecto1', { connectionName: 'logsConnection' }),
    //MongooseModule.forRoot('mongodb://localhost:27017/prueba1'),
    //MongooseModule.forRoot('mongodb://localhost:27017/prueba1', { connectionName: 'logsConnection' }),
    MongooseModule.forRoot('mongodb://localhost:27017/EcommerTenants'),
    MongooseModule.forRoot('mongodb://localhost:27017/EcommerTenants', { connectionName: 'logsConnection' }),
    UsuarioModule,
    ProductoModule,
    LogModule,
    RolModule,
    FuncionalidadModule,
    IngresoModule,
    InventarioModule,
    TenantModule,
    TclienteModule,
    EmailsModule,
    VisitanteModule,
    VentaModule,
    ProveedorModule,
    AlmacenModule,
    EstadisticaModule,
    ReporteModule,
    PagoModule,
    SegmentacionModule,
    RegresionModule,
    LinealModule,
    RecomendacionModule,
    ArbolModule,
    ConfigTiendaModule,
     NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService
  ],
})
export class AppModule implements NestModule {
  configure(consumer:MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}