import React from "react";
import { IRecipient } from "../interfaces/Recipient";

type Props = {
  recipient: IRecipient;
  isShowRemoveButton: boolean;
  updateRow: (id: number, patch: Partial<{ address: string; amount: string }>) => void;
  removeRow: (id: number) => void;
};

export default function InputRecipientInfo({ recipient, isShowRemoveButton, updateRow, removeRow }: Props) {
  return (
    <div key={recipient.id} className="grid grid-cols-12 gap-3 items-center mb-2">
      <input
        className={`w-full px-3 py-2 rounded-lg bg-gray-900 border border-white/10 col-span-7 ${recipient.error?.includes("address") ? "border-red-500" : ""}`}
        placeholder="0x..."
        value={recipient.address}
        onChange={e => updateRow(recipient.id, { address: e.target.value })}
      />
      <input
        className={`w-full px-3 py-2 rounded-lg bg-gray-900 border border-white/10 col-span-4 ${recipient.error?.includes("Amount") || recipient.error?.includes("amount") ? "border-red-500" : ""}`}
        placeholder="0.0"
        value={recipient.amount}
        onChange={e => updateRow(recipient.id, { amount: e.target.value })}
      />
      <div className="col-span-1 flex items-center justify-end gap-2">
        {isShowRemoveButton && (
          <button
            className="px-2 py-1 text-xs rounded-lg bg-white/10 hover:bg-white/20"
            onClick={() => removeRow(recipient.id)}
          >
            Remove
          </button>
        )}
      </div>
      {recipient.error && <div className="col-span-12 text-red-400 text-xs -mt-1">{recipient.error}</div>}
      {recipient.txStatus && (
        <div
          className={`col-span-12 text-xs -mt-1 ${recipient.txStatus === "success" ? "text-green-400" : recipient.txStatus === "error" ? "text-red-400" : "text-gray-400"}`}
        >
          Status: {recipient.txStatus}
        </div>
      )}
    </div>
  );
}
