import { isAddress, parseEther } from "viem";
import { IRecipient } from "../interfaces/Recipient";

export const multisendUtils = {
  // valiate every recipent row
  validateRecipients: (
    recipients: IRecipient[],
    recipientsAndAmounts: { recipients: string[]; amounts: bigint[] },
  ): boolean => {
    const next: IRecipient[] = recipients.map(r => ({ ...r, error: undefined }));
    let isValid = true;

    next.forEach((r, idx) => {
      if (!r.address && !r.amount) return;
      if (!isAddress(r.address)) {
        next[idx].error = "Invalid address";
        isValid = false;
        return;
      }
      try {
        const amt = parseEther(r.amount as `${string}`);
        if (amt <= 0n) {
          next[idx].error = "Amount must be > 0";
          isValid = false;
        }
      } catch {
        next[idx].error = "Invalid amount";
        isValid = false;
      }
    });

    if (recipientsAndAmounts.recipients.length === 0) isValid = false;

    return isValid;
  },
};
