import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { utils } from 'ethers';
import { NetworkNames } from './balances.interface';

@Injectable()
export class IsAddressPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (utils.isAddress(value)) {
      return value;
    } else {
      throw new BadRequestException('Invalid address.');
    }
  }
}

@Injectable()
export class IsNetworkPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (value in NetworkNames) {
      return value;
    } else {
      throw new BadRequestException('Invalid network name.');
    }
  }
}
