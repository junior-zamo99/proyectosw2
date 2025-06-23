import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwt:JwtService
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request=context.switchToHttp().getRequest()
    const token=context.switchToHttp().getRequest().headers.autorization
  

    if(!token){
      throw new UnauthorizedException('Token no encontrado')
    }
    try {
      const decoded= this.jwt.verify(token) 
      request.user=decoded;
    
      return true
    } catch (error) {
      console.log(error)
      return false
     
      
    }
    
  }
}
