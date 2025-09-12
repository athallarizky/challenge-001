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

  isValidAddress(address: string) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },
};

export default portofolioUtils;
