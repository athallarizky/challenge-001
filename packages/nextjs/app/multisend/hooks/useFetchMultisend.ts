import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useChainId, useAccount } from "wagmi";
import { CONTRACT_NAME } from "../constant/contract";
import { IRecipient } from "../interfaces/Recipient";
import { notification } from "~~/utils/scaffold-eth";
import { multisendUtils } from "../utils/multisendUtils";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function useFetchMultisend(props: {
  contract: any;
  recipients: IRecipient[];
  recipientsAndAmounts: { recipients: string[]; amounts: bigint[] };
  totalValueWei: bigint;
  setRecipients: Dispatch<SetStateAction<IRecipient[]>>;
}) {
  const chainId = useChainId();
  const { address } = useAccount();
  const [isSendingTransaction, setIsSendingTransaction] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: CONTRACT_NAME });

  useEffect(() => {
    if (isMining) setIsSendingTransaction(true);
  }, [isMining]);

  const handleSendTransaction = async () => {
    if (!props.contract) {
      notification.error("No Contract Found.");
      return;
    }
    if (!multisendUtils.validateRecipients(props.recipients, props.recipientsAndAmounts)) return;
    setIsSendingTransaction(true);
    setTxHash(null);

    props.setRecipients(prev => prev.map(r => ({ ...r, txStatus: r.address && r.amount ? "pending" : r.txStatus })));

    try {
      const hash = (await writeContractAsync({
        functionName: "multiSendEth",
        args: [props.recipientsAndAmounts.recipients as any, props.recipientsAndAmounts.amounts as any],
        value: props.totalValueWei,
      })) as `0x${string}` | undefined;
      if (hash) {
        setTxHash(hash);
        props.setRecipients(prev =>
          prev.map(r => ({ ...r, txStatus: r.address && r.amount ? "success" : r.txStatus })),
        );
      }
    } catch (e: any) {
      notification.error(e?.shortMessage || e?.message || "Transaction failed");
      props.setRecipients(prev => prev.map(r => ({ ...r, txStatus: r.address && r.amount ? "pending" : r.txStatus })));
    } finally {
      setIsSendingTransaction(false);
    }
  };

  const isDisableButtonSend = useMemo(() => {
    return isSendingTransaction || props.recipientsAndAmounts.recipients.length < 5 || props.totalValueWei === 0n;
  }, [isSendingTransaction, props.recipientsAndAmounts.recipients.length, props.totalValueWei]);

  return {
    txHash,
    chainId,
    connectedAddress: address ?? "0x0000000000000000000000000000000000000000",
    isSendingTransaction,
    isDisableButtonSend,
    handleSendTransaction,
  };
}
