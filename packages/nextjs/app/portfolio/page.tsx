"use client";

import React from "react";

// Read defined tokens for each network
import { useFetchPortofolio } from "./hooks/useFetchPortofolio";
import portofolioUtils from "./utils/portofolioUtils";
import StatCard from "./components/StatCard";
import { arbitrum, arbitrumNitro } from "~~/utils/scaffold-stylus/supportedChains";
import BalanceTable from "./components/BalanceTable";
import NetworkInfoCard from "./components/NetworkInfoCard";

export default function Page() {
  const {
    walletAddress,
    selectedChainId,
    tokenConfigs,
    tokenTableRows,

    individualRpcCalls,
    batchRpcCalls,

    isFetchingPortfolio,

    setWalletAddress,
    setSelectedChainId,
    triggerFetchPortofolio,
  } = useFetchPortofolio();

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-100">
      <h1 className="text-2xl font-semibold">
        Multi‑Read Portfolio ({portofolioUtils.getNetworkNameByChainId(selectedChainId)})
      </h1>

      <div className="mt-2 text-sm text-gray-400">
        Connected to: {portofolioUtils.getNetworkNameByChainId(selectedChainId)} (Chain ID: {selectedChainId})
      </div>

      <NetworkInfoCard selectedChainId={selectedChainId} walletAddress={walletAddress} tokenConfigs={tokenConfigs} />

      <div className="mt-4 grid md:grid-cols-[auto_1fr_auto_auto] gap-3">
        <select
          className="px-4 py-3 rounded-xl bg-gray-900 border border-white/10"
          value={selectedChainId}
          onChange={e => setSelectedChainId(Number(e.target.value))}
        >
          <option value={1}>Ethereum Mainnet</option>
          <option value={arbitrum.id}>Arbitrum Mainnet</option>
          <option value={arbitrumNitro.id}>Local Arbitrum Nitro DevNode</option>
        </select>
        <input
          className="px-4 py-3 rounded-xl bg-gray-900 border border-white/10"
          placeholder="0x... wallet address"
          value={walletAddress}
          onChange={e => setWalletAddress(e.target.value)}
        />
        <button
          className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20"
          disabled={!portofolioUtils.isValidAddress(walletAddress) || isFetchingPortfolio}
          onClick={triggerFetchPortofolio}
        >
          {isFetchingPortfolio ? "Loading…" : "Refresh"}
        </button>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <StatCard
          title="Individual calls"
          value={`${individualRpcCalls ? individualRpcCalls.ms.toFixed(0) : "—"} ms`}
          sub={`RPC calls ≈ ${tokenConfigs.length}`}
        />
        <StatCard
          title="Multicall (batched)"
          value={`${batchRpcCalls ? batchRpcCalls.ms.toFixed(0) : "—"} ms`}
          sub={`RPC calls = ${tokenConfigs.filter(t => t.type !== "native").length + 1}`}
        />
      </div>

      <BalanceTable tableRows={tokenTableRows} />
    </div>
  );
}
