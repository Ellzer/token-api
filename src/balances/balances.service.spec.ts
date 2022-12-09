import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { BalancesService } from './balances.service';

describe('BalancesService', () => {
  let balancesService: BalancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalancesService, ApiService],
      imports: [HttpModule],
    }).compile();

    balancesService = module.get<BalancesService>(BalancesService);
  });

  it('should be defined', () => {
    expect(balancesService).toBeDefined();
  });
});
