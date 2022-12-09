import { Controller, Get, Param } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { Balance, Networks } from './balances.interface';
import { IsAddressPipe, IsNetworkPipe } from './balances.pipe';

@Controller('balances')
export class BalancesController {
  constructor(private readonly balanceService: BalancesService) {}

  @Get(':network/:address')
  async findOne(
    @Param('network', new IsNetworkPipe()) network: Networks,
    @Param('address', new IsAddressPipe()) ownerAddress: string,
  ): Promise<Balance[]> {
    return await this.balanceService.getBalancesByAddressAndNetwork(
      network,
      ownerAddress,
    );
  }
}
