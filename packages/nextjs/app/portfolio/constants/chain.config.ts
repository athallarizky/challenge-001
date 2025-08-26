import { mainnet, arbitrum, arbitrumNitro } from "~~/utils/scaffold-stylus/supportedChains";

export const CHAIN_CONFIG = {
  mainnet: {
    rpcUrl: "https://eth.llamarpc.com",
    chain: { id: mainnet.id, name: "Ethereum" },
  },
  arbitrum: {
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    chain: arbitrum,
  },
  arbitrumNitro: {
    rpcUrl: "http://localhost:8547",
    chain: arbitrumNitro,
  },
};
