import prisma from "@/lib/prisma";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table-old";
import Link from "next/link";

// Simple Tag component for styling individual tags
const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="mx-2 my-1 inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
    {children}
  </span>
);

// Function to render a string of tags as a list of Tag components
const renderTags = (tagString: string | null) => {
  if (!tagString) return null;
  return tagString
    .split(",")
    .map((tag, index) => <Tag key={index}>{tag.trim()}</Tag>);
};

function truncateSummary(summary: string | null, truncateLength = 200): string {
  if (!summary) return "";
  return summary.length > truncateLength
    ? `${summary.slice(0, truncateLength)}...`
    : summary;
}

export default async function TicketPage({
  params
}: {
  params: { id: string };
}) {
  const botId = parseInt(params.id, 10);
  const tickets = await prisma.ticketTagging.findMany({
    where: { bot_id: botId }
  });

  return (
    <Table>
      <TableCaption>List of tickets and their tags</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Link</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>AI tags</TableHead>
          <TableHead>Zendesk Tags</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map(ticket => (
          <TableRow className="max-h-32 overflow-auto" key={ticket.id}>
            <TableCell className="w-fit">
              <Link
                className="text-blue-600 hover:text-blue-800"
                href={ticket.zendesk_url}
                target="_blank">
                Link
              </Link>
            </TableCell>
            <TableCell className="max-w-[250px]">
              {truncateSummary(ticket.ticket_description)}
            </TableCell>
            <TableCell className="max-w-[100px]">
              {renderTags(ticket.tags)}
            </TableCell>
            <TableCell className="max-w-[100px]">
              {renderTags(ticket.ai_generated_tags)}
            </TableCell>
            <TableCell className="max-w-[100px]">
              {renderTags(ticket.zendesk_tags)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
