import React from "react";
import portofolioUtils from "../utils/portofolioUtils";
import { TOKEN_CONFIGS } from "../constants/token";

type Props = {
  tableRows: ((typeof TOKEN_CONFIGS)[keyof typeof TOKEN_CONFIGS][number] & {
    formattedBalance: number;
    usdValue: number;
  })[];
};

export default function BalanceTable({ tableRows }: Props) {
  const total = tableRows.reduce((s: number, r: any) => s + r.usdValue, 0);

  return (
    <>
      <table className="mt-6 w-full text-sm">
        <thead className="text-gray-400">
          <tr>
            <th className="text-left">Token</th>
            <th className="text-left">Network</th>
            <th className="text-right">Balance</th>
            <th className="text-right">USD</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map(row => (
            <tr key={`${row.network}-${row.symbol}`} className="border-t border-white/5">
              <td className="py-2">{row.symbol}</td>
              <td className="py-2 text-gray-400">{row.network}</td>
              <td className="py-2 text-right">
                {row.formattedBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </td>
              <td className="py-2 text-right">{portofolioUtils.convertToUSD(row.usdValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex px-4 rounded-xl bg-white/5 border border-white/10 justify-between items-center mt-4">
        <p className="text-2xl font-bold">Total:</p>
        <p className="text-2xl font-bold">{portofolioUtils.convertToUSD(total)}</p>
      </div>
    </>
  );
}
