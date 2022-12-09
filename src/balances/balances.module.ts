import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BalancesController } from './balances.controller';
import { BalancesService } from './balances.service';
import { ApiService } from './api.service';

@Module({
  imports: [HttpModule],
  controllers: [BalancesController],
  providers: [BalancesService, ApiService],
})
export class BalancesModule {}
