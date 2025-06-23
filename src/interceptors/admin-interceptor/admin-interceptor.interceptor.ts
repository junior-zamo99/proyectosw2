import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsuarioService } from 'src/api/usuario/usuario.service';

@Injectable()
export class AdminInterceptorInterceptor implements NestInterceptor {

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwt:JwtService
  ){}


 async  intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request=context.switchToHttp().getRequest()
    const token=context.switchToHttp().getRequest().headers.autorization

    try {
      const decoded= this.jwt.verify(token)
      const user=await this.usuarioService.getUsuario(decoded.sub,decoded.tenant)
      
      if(user.data!=undefined){
        request.validate=true
      }else{
        request.validate=false
      }
      
    } catch (error) {
      request.validate=false
    }
   
    return next.handle();
  }
}
