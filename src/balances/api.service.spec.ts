import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let apiService: ApiService;

  const response = {
    data: {
      ethereum: { usd: 10000 },
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };

  beforeEach(async () => {
    const HttpServiceProvider = {
      provide: HttpService,
      useFactory: () => ({
        get: jest.fn(() => of(response)),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiService, HttpServiceProvider],
      imports: [HttpModule],
    }).compile();

    apiService = module.get<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(apiService).toBeDefined();
  });

  describe('getTokenPrices', () => {
    it('should fetch token prices', async () => {
      const response = {
        data: {
          ethereum: { usd: 10000 },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      expect(await apiService.getTokenPrices('ethereum', 'usd')).toEqual(
        response.data,
      );
    });
  });
});
