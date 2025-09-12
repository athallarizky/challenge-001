import React from "react";
import networkUtils from "~~/utils/shared/networkUtils";

export default function NetworkInfoCard({
  selectedChainId,
  walletAddress,
}: {
  selectedChainId: number;
  walletAddress: string;
}) {
  return (
    <div className="mt-2 p-3 rounded-lg bg-gray-800 border border-gray-700">
      <div className="text-md font-semibold text-white mb-2">Network Status</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>Network: {networkUtils.getNetworkNameByChainId(selectedChainId)}</div>
        <div>Chain ID: {selectedChainId}</div>
        <div>RPC URL: {networkUtils.getRpcUrlByChainId(selectedChainId)}</div>
      </div>
      <div className="mt-2 text-xs text-gray-400">Wallet: {walletAddress}</div>
    </div>
  );
}
