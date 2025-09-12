"use client";

import { formatEther } from "viem";

import useEstimateGas from "./hooks/useEstimateGas";
import useRecipientForm from "./hooks/useRecipientForm";
import useFetchMultisend from "./hooks/useFetchMultisend";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { CONTRACT_NAME } from "./constant/contract";
import { multisendUtils } from "./utils/multisendUtils";

import StatCard from "~~/components/shared/StatCard";
import InputRecipientInfo from "./components/InputRecipientInfo";
import NetworkInfoCard from "~~/components/shared/NetworkInfoCard";

export default function SendTokenPage() {
  const { data: contract } = useDeployedContractInfo({ contractName: CONTRACT_NAME });

  const {
    recipients,
    recipientsAndAmounts,
    totalValueWei,
    addRecipient,
    setRecipients,
    removeRecipient,
    updateRecipient,
  } = useRecipientForm();

  const { chainId, connectedAddress, isSendingTransaction, isDisableButtonSend, handleSendTransaction } =
    useFetchMultisend({
      contract,
      recipients,
      recipientsAndAmounts,
      totalValueWei,
      setRecipients,
    });

  const { isEstimatingGas, batchGas, individualGas, handleEstimateGas } = useEstimateGas({
    contract,
    connectedAddress,
    recipientsAndAmounts,
    totalValueWei,
    validate: () => multisendUtils.validateRecipients(recipients, recipientsAndAmounts),
  });

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-100">
      <h1 className="text-2xl font-semibold">Challenge 02: Send ETH to Multiple Addresses</h1>
      <NetworkInfoCard selectedChainId={chainId} walletAddress={connectedAddress} />

      <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4">
        <div className="grid grid-cols-12 gap-3 items-center text-sm text-gray-400 mb-2">
          <div className="col-span-7">Recipient Address</div>
          <div className="col-span-4">Amount (ETH)</div>
          <div className="col-span-1 text-right"> </div>
        </div>

        {recipients.map(recipient => (
          <InputRecipientInfo
            key={recipient.id}
            recipient={recipient}
            isShowRemoveButton={recipients.length > 5}
            updateRow={updateRecipient}
            removeRow={removeRecipient}
          />
        ))}

        <div className="mt-2">
          <button className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20" onClick={addRecipient}>
            Add recipient
          </button>
        </div>
      </div>

      <section className="mt-4 flex flex-row gap-4 items-stretch">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex-1">
          <div className="text-sm text-gray-400">Total recipients</div>
          <div className="text-lg font-semibold">{recipientsAndAmounts.recipients.length}</div>
          <div className="text-sm text-gray-400 mt-2">Total to send</div>
          <div className="text-lg font-semibold">{formatEther(totalValueWei)} ETH</div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50"
              onClick={handleEstimateGas}
              disabled={isEstimatingGas}
            >
              {isEstimatingGas ? "Estimating..." : "Estimate Gas"}
            </button>
            <button
              className="px-4 py-3 rounded-xl bg-emerald-500/80 hover:bg-emerald-500 text-black disabled:opacity-50"
              onClick={handleSendTransaction}
              disabled={isDisableButtonSend}
            >
              {isSendingTransaction ? "Sending..." : "Send Batch"}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <StatCard
            className="flex-1"
            title="Gas (estimated): Batch"
            value={batchGas != null ? batchGas.toString() : "—"}
          />
          <StatCard
            className="flex-1"
            title="Gas (estimated): Individual"
            value={individualGas != null ? individualGas.toString() : "—"}
          />
        </div>
      </section>
    </div>
  );
}
