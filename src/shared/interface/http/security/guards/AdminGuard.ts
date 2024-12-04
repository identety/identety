import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const tenantId = request.headers['x-tenant-id'] as string;

    // Cloud deployment (with tenant)
    if (tenantId) {
      const cloudToken = request.headers.authorization?.split('Bearer ')[1];
      if (!cloudToken) {
        throw new UnauthorizedException(
          'Cloud token required when using tenant',
        );
      }

      // TODO: Validate cloud token and tenant access
      // For now, just scaffold
      return true;
    }

    // Self-hosted (API Key)
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('API key required');
    }

    const validApiKey = this.configService.get<string>('API_KEY');

    // console.log('validApiKey', validApiKey);
    // console.log('passedApiKey', apiKey);

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
