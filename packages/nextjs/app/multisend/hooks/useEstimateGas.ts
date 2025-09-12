import { useState } from "react";
import { getPublicClient } from "wagmi/actions";
import { notification } from "~~/utils/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

export default function useEstimateGas(props: {
  contract: any;
  connectedAddress: string;
  recipientsAndAmounts: { recipients: string[]; amounts: bigint[] };
  totalValueWei: bigint;
  validate: () => boolean;
}) {
  const [isEstimatingGas, setIsEstimatingGas] = useState(false);
  const [batchGas, setBatchGas] = useState<bigint | null>(null);
  const [individualGas, setIndividualGas] = useState<bigint | null>(null);

  const handleEstimateGas = async () => {
    if (!props.contract) {
      notification.error("Contract not deployed. Run yarn deploy.");
      return;
    }
    if (!props.connectedAddress) {
      notification.error("Please connect your wallet to estimate gas");
      return;
    }
    if (!props.validate()) return;
    setIsEstimatingGas(true);
    try {
      const publicClient = getPublicClient(wagmiConfig);
      const [batch, indiv] = await Promise.all([
        publicClient.estimateContractGas({
          account: props.connectedAddress,
          address: props.contract.address,
          abi: props.contract.abi,
          functionName: "multiSendEth",
          args: [props.recipientsAndAmounts.recipients, props.recipientsAndAmounts.amounts],
          value: props.totalValueWei,
        }),

        Promise.all(
          props.recipientsAndAmounts.recipients.map((to, i) =>
            publicClient.estimateGas({
              account: props.connectedAddress,
              to,
              value: props.recipientsAndAmounts.amounts[i],
            }),
          ),
        ).then(g => g.reduce((a, b) => a + b, 0n)),
      ]);

      setBatchGas(batch);
      setIndividualGas(indiv);
    } catch (e: any) {
      notification.error(e?.shortMessage || e?.message || "Failed to estimate gas");
      setBatchGas(null);
      setIndividualGas(null);
    } finally {
      setIsEstimatingGas(false);
    }
  };

  return {
    isEstimatingGas,
    batchGas,
    individualGas,
    handleEstimateGas,
  };
}
