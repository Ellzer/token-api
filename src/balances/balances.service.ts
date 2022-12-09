import { Injectable } from '@nestjs/common';
import { Balance, NetworkNames, Networks } from './balances.interface';
import { BigNumber, ethers } from 'ethers';
import { ApiService } from './api.service';
import genericErc20Abi from '../utils/genericErc20Abi.json';
import arbErc20Tokens from '../utils/arbErc20Tokens.json';
import ethErc20Tokens from '../utils/ethErc20Tokens.json';
import polyErc20Tokens from '../utils/polyErc20Tokens.json';

const infuraAPIKey = '92354089326049f5b3b4d635be42b27f';
const currency = 'usd';
const coinGeckoPriceDecimals = 18;

@Injectable()
export class BalancesService {
  constructor(private readonly apiService: ApiService) {}

  async getBalancesByAddressAndNetwork(
    network: Networks,
    ownerAddress: string,
  ): Promise<Balance[]> {
    const erc20TokensInfo = selectErc20TokensInfo(network);
    const tokenIds: string[] = [];

    const provider = new ethers.providers.InfuraProvider(
      NetworkNames[network],
      infuraAPIKey,
    );

    const erc20Tokens: (Omit<Balance, 'balanceUsd'> & { id: string })[] =
      await Promise.all(
        erc20TokensInfo.map(async ({ address, name, symbol, decimals, id }) => {
          const erc20Balance = await getErc20Balance(
            address,
            ownerAddress,
            provider,
          );
          if (erc20Balance !== '0') {
            tokenIds.push(id);
          }
          return {
            address,
            name,
            symbol,
            decimals,
            balance: erc20Balance,
            id,
          };
        }),
      );

    const tokenIdsString = tokenIds.join(',');

    const tokenPrices = await this.apiService.getTokenPrices(
      tokenIdsString,
      currency,
    );

    const balances: Balance[] = erc20Tokens.map(
      ({ address, name, symbol, decimals, balance, id }) => {
        let balanceUsd = 0;

        if (balance !== '0') {
          balanceUsd = calculateBalanceInUsd(
            balance,
            tokenPrices[id][currency],
            decimals,
          );
        }

        return {
          address,
          name,
          symbol,
          decimals,
          balance: ethers.utils.formatUnits(balance, 0),
          balanceUsd,
        };
      },
    );

    return balances;
  }
}

async function getErc20Balance(
  erc20ContractAddress: string,
  address: string,
  provider: ethers.providers.InfuraProvider,
): Promise<string> {
  const contract = new ethers.Contract(
    erc20ContractAddress,
    genericErc20Abi,
    provider,
  );
  const erc20Balance = await contract.balanceOf(address);
  return erc20Balance.toString();
}

export function toFixedNumber(num: BigNumber, decimals): number {
  return parseFloat(
    parseFloat(ethers.utils.formatUnits(num, decimals)).toFixed(2),
  );
}

export function calculateBalanceInUsd(
  balance: string,
  tokenPrice: number,
  decimals: number,
): number {
  const tokenPriceBN = ethers.utils.parseUnits(
    tokenPrice.toString(),
    coinGeckoPriceDecimals,
  );
  const balanceUsd = toFixedNumber(
    BigNumber.from(balance).mul(tokenPriceBN),
    decimals + coinGeckoPriceDecimals,
  );
  return balanceUsd;
}

export function selectErc20TokensInfo(network: Networks) {
  switch (network) {
    case 'arb':
      return arbErc20Tokens;
    case 'poly':
      return polyErc20Tokens;
    case 'eth':
      return ethErc20Tokens;
    default:
      return ethErc20Tokens;
  }
}
