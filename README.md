## Description

Small API using [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

Lists all ERC-20 tokens and their balances with their equivalent in USD of a given address in Ethereum mainnet, Polygon, or Arbitrum.

Uses [Coingecko API](https://www.coingecko.com/en/api) to fetch USD price of the tokens

### Endpoint

`GET http://localhost:8080/balances/{network}/{address}`

### Response Contract

```bash
[
  {
    "address": "0x6b175474e89094c44da98b954eedeac495271d0f",
    "name": "DAI Stablecoin",
    "symbol": "DAI",
    "decimals": 18,
    "balance": "1234990000000000000000",
    "balanceUsd": 1234.99
  },
  ...
]
```

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

## Reasonning behind solution

### ERC20 tokens list

The list of tokens available in Coingecko per network is at [TokenList](https://tokenlists.org/token-list?url=https://gateway.ipfs.io/ipns/tokens.uniswap.org).

To get the usd price of a token from CoinGecko's API, you need to pass the token's id as parameter to the API call. The list of all tokens' id is available at [Coingecko's API](https://api.coingecko.com/api/v3/coins/list)

Once I had the tokenList array and the tokenIds array, I needed to merge them with only the information I needed. The script I used for that is available in the `./scripts` folder.

That's how I generated 3 `.json` files

- `arbErc20Tokens.json`
- `ethErc20Tokens.json`
- `polyErc20Tokens.json`

### Ethers.js

To get information from the blockchain I needed to use a web3 library, web3.js and Ethers.js are the most famous ones. I chose ethers.js for the following reasons:

- user-friendly API structure
- smaller bundle size
- well tested
- extensive and concise documentation
- well maintained
- written in TypeScript

### Infura provider

I first instantiated Ethers.js provider using Etherscan API but it was quite slow and my request timed out because of the high number of ERC20 contract calls the endpoint makes. Switching to Infura API solved the problem.

### Solution explained

It is the method `getBalancesByAddressAndNetwork` from the `BalanceService` that does all the work. Using a map it gets the ERC20 balance for every token of the ERC20 array with ethers.js. After querying the token prices from CoinGecko's API, it maps the new array and adds an attibute with the balance in usd for every token entry, it is calculated using BigNumber utils from Ethers.
