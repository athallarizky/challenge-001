import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { arbitrum } from "~~/utils/scaffold-stylus/supportedChains";
import portofolioUtils from "../utils/portofolioUtils";
import { TOKEN_CONFIGS } from "../constants/token";
import useNetworkClient from "./useNetworkClient";
import { Address, erc20Abi, formatUnits } from "viem";

export const useFetchPortofolio = () => {
  const { address: connectedAddress } = useAccount();
  const [walletAddress, setWalletAddress] = useState(connectedAddress ?? "0x0000000000000000000000000000000000000000");
  const [selectedChainId, setSelectedChainId] = useState<number>(arbitrum.id); // Default: arbitrum mainnet

  const [isFetchingPortfolio, setIsFetchingPortfolio] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});

  // data for storing user balances for each token
  // ms = milliseconds for counting performance
  const [individualRpcCalls, setIndividualRpcCalls] = useState<{ balances: bigint[]; ms: number }>();
  const [batchRpcCalls, setBatchRpcCalls] = useState<{ balances: bigint[]; ms: number }>();

  const client = useNetworkClient({ selectedChainId });

  useEffect(() => {
    if (connectedAddress && portofolioUtils.isValidAddress(connectedAddress)) {
      setWalletAddress(connectedAddress);
    }
  }, [connectedAddress]);

  const tokenConfigs = TOKEN_CONFIGS[selectedChainId as keyof typeof TOKEN_CONFIGS] || TOKEN_CONFIGS[arbitrum.id];

  async function triggerFetchPortofolio() {
    if (!portofolioUtils.isValidAddress(walletAddress)) return;
    setIsFetchingPortfolio(true);

    try {
      // get current prices for each token from coingecko
      const cgkoPrices = await portofolioUtils.pricesUSDFromCoingecko(tokenConfigs.map(t => t.coingeckoId));
      setPrices(cgkoPrices);

      // t1 = (time) for count performance for individual rpc fetch
      const t1 = performance.now();
      const individualRpcCallBalances: bigint[] = [];

      // doing for-loop for get balance of each token
      for (const token of tokenConfigs) {
        try {
          let balance: bigint;

          if (token.type === "native") {
            // "native" ETH will call getBalance directly instead of balanceOf
            balance = await client.getBalance({ address: walletAddress as Address });
          } else if (token.type === "contract") {
            // "contract" will call local contract
            try {
              balance = (await client.readContract({
                address: token.address as Address,
                abi: erc20Abi,
                functionName: "balanceOf",
                args: [walletAddress as Address],
              })) as bigint;
            } catch (contractError) {
              console.log(`Error Reading Contract: ${contractError}`);
              balance = 0n; // set to 0
            }
          } else {
            balance = (await client.readContract({
              address: token.address as Address,
              abi: erc20Abi,
              functionName: "balanceOf",
              args: [walletAddress as Address],
            })) as bigint;
          }

          individualRpcCallBalances.push(balance);
        } catch (error) {
          console.error(`Error reading ${token.symbol} balance:`, error);
          individualRpcCallBalances.push(0n);
        }
      }

      // t2 = (time) for count performance for batch rpc fetch
      const t2 = performance.now();

      // multicall for ERC20 tokens only (excluding ETH)
      const erc20Tokens = tokenConfigs.filter(t => t.type !== "native");
      const batchBalances: bigint[] = [];

      if (erc20Tokens.length > 0) {
        try {
          const mc = await client.multicall({
            allowFailure: true,
            contracts: erc20Tokens.map(t => ({
              address: t.address as Address,
              abi: erc20Abi,
              functionName: "balanceOf" as const,
              args: [walletAddress as Address],
            })),
          });

          const t3 = performance.now(); // t3 = (time) for count performance for multicall
          const mcResults: any = (mc as any).results ?? mc;
          batchBalances.push(individualRpcCallBalances[0]);

          const erc20Balances = mcResults.map((r: any) => (r?.status === "success" ? (r.result as bigint) : 0n));
          batchBalances.push(...erc20Balances);

          setBatchRpcCalls({ balances: batchBalances, ms: t3 - t2 });
        } catch (error) {
          console.error("Multicall error:", error);
          setBatchRpcCalls({ balances: individualRpcCallBalances, ms: 0 });
        }
      } else {
        // if only ETH, set batch same as individual
        setBatchRpcCalls({ balances: individualRpcCallBalances, ms: 0 });
      }

      setIndividualRpcCalls({ balances: individualRpcCallBalances, ms: t2 - t1 });
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    } finally {
      setIsFetchingPortfolio(false);
    }
  }

  const tokenTableRows = tokenConfigs.map((t, i) => {
    const raw = (batchRpcCalls?.balances ?? individualRpcCalls?.balances)?.[i] ?? 0n;
    const formattedBalance = Number(formatUnits(raw, t.decimals));
    const usdValue = formattedBalance * (prices[t.coingeckoId] ?? 0);
    return { ...t, formattedBalance, usdValue };
  });

  return {
    tokenTableRows,

    tokenConfigs,
    isFetchingPortfolio,
    individualRpcCalls,
    batchRpcCalls,

    walletAddress,
    selectedChainId,

    setWalletAddress,
    setSelectedChainId,
    triggerFetchPortofolio,
  };
};
