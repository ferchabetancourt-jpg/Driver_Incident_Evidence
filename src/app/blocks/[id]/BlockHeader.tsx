"use client";

import Link from "next/link";
import { formatPayAmount, formatStationLabel, formatTime12h, type Block } from "@/lib/types";
import { DeleteBlockButton } from "@/components/DeleteBlockButton";
import { deleteBlock } from "../actions";

export function BlockHeader({ block }: { block: Block }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <Link href="/blocks" className="text-sm text-brand-600 hover:underline">
          ← {formatStationLabel(block.stations)}
        </Link>
        <h1 className="text-xl font-semibold">
          {block.block_date} · {formatTime12h(block.start_time)}
          {formatPayAmount(block.pay_amount) && (
            <span className="ml-2 text-success">{formatPayAmount(block.pay_amount)}</span>
          )}
        </h1>
      </div>
      <DeleteBlockButton onDelete={() => deleteBlock(block.id, "/blocks")} />
    </div>
  );
}
