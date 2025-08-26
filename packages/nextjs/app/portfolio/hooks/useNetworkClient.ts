import { useMemo } from "react";
import { arbitrum, arbitrumNitro, mainnet } from "~~/utils/scaffold-stylus/supportedChains";
import { createPublicClient, http } from "viem";

export default function useNetworkClient({ selectedChainId }: { selectedChainId: number }) {
  const client = useMemo(() => {
    let rpcUrl: string;
    let chain: any;

    if (selectedChainId === mainnet.id) {
      // Ethereum mainnet
      rpcUrl = "https://eth.llamarpc.com"; // Free RPC
      chain = { id: mainnet.id, name: "Ethereum" };
    } else if (selectedChainId === arbitrum.id) {
      // Arbitrum mainnet
      rpcUrl = "https://arb1.arbitrum.io/rpc";
      chain = arbitrum;
    } else if (selectedChainId === arbitrumNitro.id) {
      // Local arbitrumNitro
      rpcUrl = "http://localhost:8547";
      chain = arbitrumNitro;
    } else {
      rpcUrl = "https://arb1.arbitrum.io/rpc";
      chain = arbitrum;
    }

    return createPublicClient({
      chain,
      transport: http(rpcUrl),
    });
  }, [selectedChainId]);

  return client;
}
