import { arbitrum, arbitrumNitro, mainnet } from "~~/utils/scaffold-stylus/supportedChains";

// Token configurations for different networks
export const TOKEN_CONFIGS = {
  // Arbitrum Mainnet
  [arbitrum.id]: [
    {
      symbol: "USDC.e",
      decimals: 6,
      coingeckoId: "usd-coin",
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // Arbitrum USDC.e
      type: "erc20" as const,
      network: "Arbitrum",
    },
    {
      symbol: "DAI",
      decimals: 18,
      coingeckoId: "dai",
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", // Arbitrum DAI
      type: "erc20" as const,
      network: "Arbitrum",
    },
    {
      symbol: "WETH",
      decimals: 18,
      coingeckoId: "weth",
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // Arbitrum WETH
      type: "erc20" as const,
      network: "Arbitrum",
    },
    {
      symbol: "LINK",
      decimals: 18,
      coingeckoId: "chainlink",
      address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", // Arbitrum LINK
      type: "erc20" as const,
      network: "Arbitrum",
    },
    {
      symbol: "ETH",
      decimals: 18,
      coingeckoId: "ethereum",
      address: "0x0000000000000000000000000000000000000000", // Native ETH
      type: "native" as const,
      network: "Arbitrum",
    },
  ],

  // Ethereum Mainnet
  [mainnet.id]: [
    {
      symbol: "USDC",
      decimals: 6,
      coingeckoId: "usd-coin",
      address: "0xA0b86a33E6441b8c4C8C1C0bF0b8c4C8C1C0bF0b", // Ethereum USDC
      type: "erc20" as const,
      network: "Ethereum",
    },
    {
      symbol: "DAI",
      decimals: 18,
      coingeckoId: "dai",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // Ethereum DAI
      type: "erc20" as const,
      network: "Ethereum",
    },
    {
      symbol: "WETH",
      decimals: 18,
      coingeckoId: "weth",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // Ethereum WETH
      type: "erc20" as const,
      network: "Ethereum",
    },
    {
      symbol: "LINK",
      decimals: 18,
      coingeckoId: "chainlink",
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", // Ethereum LINK
      type: "erc20" as const,
      network: "Ethereum",
    },
    {
      symbol: "ETH",
      decimals: 18,
      coingeckoId: "ethereum",
      address: "0x0000000000000000000000000000000000000000", // Native ETH
      type: "native" as const,
      network: "Ethereum",
    },
  ],

  // Local Arbitrum Nitro DevNode
  [arbitrumNitro.id]: [
    {
      symbol: "ETH",
      decimals: 18,
      coingeckoId: "ethereum",
      address: "0x0000000000000000000000000000000000000000",
      type: "native" as const,
      network: "Local Dev",
    },
    {
      symbol: "Counter",
      decimals: 0,
      coingeckoId: "ethereum",
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      type: "contract" as const,
      network: "Local Dev",
    },
    {
      symbol: "YourContract",
      decimals: 0,
      coingeckoId: "ethereum",
      address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      type: "contract" as const,
      network: "Local Dev",
    },
  ],
} as const;
