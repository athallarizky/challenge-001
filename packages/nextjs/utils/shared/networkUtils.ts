import { arbitrum, arbitrumNitro } from "~~/utils/scaffold-stylus/supportedChains";

const networkUtils = {
  getNetworkNameByChainId(chainId: number) {
    if (chainId === 1) return "Ethereum";
    if (chainId === arbitrum.id) return "Arbitrum";
    if (chainId === arbitrumNitro.id) return "Local Dev";
    return "Unknown";
  },

  getRpcUrlByChainId(chainId: number) {
    if (chainId === 1) return "https://eth.llamarpc.com";
    if (chainId === arbitrum.id) return "https://arb1.arbitrum.io/rpc";
    if (chainId === arbitrumNitro.id) return "http://localhost:8547";
    return "https://arb1.arbitrum.io/rpc";
  },
};

export default networkUtils;
