import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TclienteService } from 'src/api/tcliente/tcliente.service';


@Injectable()
export class ClienteGuard implements CanActivate {

  constructor(
    private readonly jwt:JwtService,
    private readonly clienteService:TclienteService
  ){}
  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request=context.switchToHttp().getRequest()
    const token=context.switchToHttp().getRequest().headers.autorization
  

    if(!token){
      throw new UnauthorizedException('Token no encontrado')
    }
    try {
      const decoded= this.jwt.verify(token) 
      request.user=decoded;

      const cliente=await this.clienteService.getClienteAuth(decoded.sub)  
      
      if(cliente.data!=undefined){
        return true
      }else{
        return false
      }
      
    } catch (error) {
      console.log(error)
      return false
     
      
    }
    
  }
}
