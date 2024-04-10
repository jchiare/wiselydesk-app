"use client";

import type { Conversation } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export type ConversationDataTable = Conversation & {
  escalatedReason?: string;
};

export const columns: ColumnDef<ConversationDataTable>[] = [
  {
    accessorKey: "status",
    header: "Status"
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "amount",
    header: "Amount"
  }
];
