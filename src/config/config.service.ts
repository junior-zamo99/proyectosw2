import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get stripeSecretKey(): string {
    return this.configService.get<string>('STRIPE_SECRET_KEY');
  }

  get stripeApiVersion(): string {
    return this.configService.get<string>('STRIPE_API_VERSION');
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }
}