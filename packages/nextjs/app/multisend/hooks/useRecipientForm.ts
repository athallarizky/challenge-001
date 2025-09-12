import { useMemo, useState } from "react";
import { Address, isAddress, parseEther } from "viem";
import { IRecipient } from "../interfaces/Recipient";

export default function useRecipientForm() {
  const MINIMUM_RECIPIENTS = 5;

  const [recipients, setRecipients] = useState<IRecipient[]>(() =>
    Array.from({ length: MINIMUM_RECIPIENTS }).map((_, i) => ({ id: i + 1, address: "", amount: "" })),
  );

  // checking if the recipients is empty or not
  const cleanRows = useMemo(
    () => recipients.filter(r => r.address.trim() !== "" && r.amount.trim() !== ""),
    [recipients],
  );

  // calculate total value in wei
  const totalValueWei = useMemo(() => {
    try {
      return cleanRows.reduce((acc, r) => acc + parseEther(r.amount as `${string}`), 0n);
    } catch {
      return 0n;
    }
  }, [cleanRows]);

  // get the recipients and amounts
  const recipientsAndAmounts = useMemo(() => {
    const recipients: Address[] = [];
    const amounts: bigint[] = [];
    for (const r of cleanRows) {
      if (isAddress(r.address)) {
        recipients.push(r.address as Address);
        try {
          amounts.push(parseEther(r.amount as `${string}`));
        } catch {
          amounts.push(0n);
        }
      }
    }
    return { recipients, amounts };
  }, [cleanRows]);

  const addRecipient = () => {
    setRecipients(prev => [...prev, { id: (prev[prev.length - 1]?.id ?? 0) + 1, address: "", amount: "" }]);
  };

  const removeRecipient = (id: number) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
  };

  const updateRecipient = (id: number, patch: Partial<IRecipient>) => {
    setRecipients(prev => prev.map(r => (r.id === id ? { ...r, ...patch, status: undefined, error: undefined } : r)));
  };

  return {
    recipients,
    totalValueWei,
    recipientsAndAmounts,
    addRecipient,
    setRecipients,
    removeRecipient,
    updateRecipient,
  };
}
