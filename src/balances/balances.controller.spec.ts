import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { BalancesController } from './balances.controller';
import { BalancesService } from './balances.service';

const balancesResult = [
  {
    address: '0x111111111117dC0aa78b770fA6A738034120C302',
    name: '1inch',
    symbol: '1INCH',
    decimals: 18,
    balance: '0',
    balanceUsd: 0,
  },
  {
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    name: 'Aave',
    symbol: 'AAVE',
    decimals: 18,
    balance: '119566197278634000',
    balanceUsd: 7.55,
  },
];

describe('BalancesController', () => {
  let balancesController: BalancesController;

  beforeEach(async () => {
    const BalancesServiceProvider = {
      provide: BalancesService,
      useFactory: () => ({
        getBalancesByAddressAndNetwork: jest.fn(() =>
          Promise.resolve(balancesResult),
        ),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalancesController],
      providers: [BalancesServiceProvider, ApiService],
      imports: [HttpModule],
    }).compile();

    balancesController = module.get<BalancesController>(BalancesController);
  });

  it('should be defined', () => {
    expect(balancesController).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an array of tokens with balances', async () => {
      expect(
        await balancesController.findOne(
          'eth',
          '0xb21090c8f6bac1ba614a3f529aae728ea92b6487',
        ),
      ).toBe(balancesResult);
    });
  });
});
