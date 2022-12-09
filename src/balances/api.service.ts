import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  async getTokenPrices(
    tokenIds: string,
    currency: string,
  ): Promise<{ [id: string]: { [currency: string]: number } }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=${currency}`,
        ),
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        'Error fetching API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
