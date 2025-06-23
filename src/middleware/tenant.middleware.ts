import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction,Request,Response } from "express";


@Injectable()
export class TenantMiddleware implements NestMiddleware{
  use(req: Request, res: Response, next: NextFunction) {
   const host = req.get('host');
    const origin = req.get('origin'); 
    const referer = req.get('referer');
    
    console.log('🌐 HOST detectado:', host);
    console.log('🎯 ORIGIN detectado:', origin);
    console.log('🔗 REFERER detectado:', referer);

  
    if (origin && origin.includes('.shopmind.test')) {
 
      const url = new URL(origin);
      const tenant = url.hostname.replace('.shopmind.test', '');
      
      req['tenant'] = tenant;
      req['context'] = 'store';
      
      console.log('🏪 TIENDA detectada desde ORIGIN');
      console.log('🏷️ TENANT extraído:', tenant);
      return next();
    }


    if (!origin && referer && referer.includes('.shopmind.test')) {
      const url = new URL(referer);
      const tenant = url.hostname.replace('.shopmind.test', '');
      
      req['tenant'] = tenant;
      req['context'] = 'store';
      
      console.log('🏪 TIENDA detectada desde REFERER');
      console.log('🏷️ TENANT extraído:', tenant);
      return next();
    }
    
    // 🎯 Header X-Tenant (si Angular lo envía)
    const tenantHeader = req.headers['x-tenant'] as string;
    if (tenantHeader) {
      req['tenant'] = tenantHeader;
      req['context'] = 'store';
      console.log('📡 TENANT desde header:', tenantHeader);
      return next();
    }

    console.log('ℹ️ No es petición de tienda');
    next();
} 

    
}
