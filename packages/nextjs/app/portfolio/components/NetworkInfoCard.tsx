import React from "react";
import portofolioUtils from "../utils/portofolioUtils";

export default function NetworkInfoCard({
  selectedChainId,
  tokenConfigs,
  walletAddress,
}: {
  selectedChainId: number;
  tokenConfigs: any;
  walletAddress: string;
}) {
  return (
    <div className="mt-2 p-3 rounded-lg bg-gray-800 border border-gray-700">
      <div className="text-sm text-gray-300 mb-2">Network Status:</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>Network: {portofolioUtils.getNetworkNameByChainId(selectedChainId)}</div>
        <div>Chain ID: {selectedChainId}</div>
        <div>RPC URL: {portofolioUtils.getRpcUrlByChainId(selectedChainId)}</div>
        <div>Tokens: {tokenConfigs.length}</div>
      </div>
      <div className="mt-2 text-xs text-gray-400">Wallet: {walletAddress}</div>
    </div>
  );
}
