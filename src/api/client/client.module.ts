import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ClientRepository } from '@/api/client/client.repository';

@Module({
  providers: [ClientService, ClientRepository],
  controllers: [ClientController],
})
export class ClientModule {}
