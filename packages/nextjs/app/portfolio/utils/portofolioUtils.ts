import { arbitrum, arbitrumNitro } from "~~/utils/scaffold-stylus/supportedChains";

const portofolioUtils = {
  async pricesUSDFromCoingecko(ids: string[]) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
      Array.from(new Set(ids)).join(","),
    )}&vs_currencies=usd`;
    try {
      const res = await fetch(url);
      const data = (await res.json()) as Record<string, { usd: number }>;
      return Object.fromEntries(ids.map(id => [id, data?.[id]?.usd ?? 0]));
    } catch {
      return Object.fromEntries(ids.map(id => [id, 0]));
    }
  },

  convertToUSD(number: number) {
    return number.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  },

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

  isValidAddress(address: string) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },
};

export default portofolioUtils;
