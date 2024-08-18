import prisma from "@/lib/prisma";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import Link from "next/link";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="mx-2 my-1 inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
    {children}
  </span>
);

const renderTags = (tagString: string | null) => {
  if (!tagString) return null;
  return tagString
    .split(",")
    .map((tag, index) => <Tag key={index}>{tag.trim()}</Tag>);
};

export default async function TicketPage({
  params
}: {
  params: { id: string };
}) {
  const botId = parseInt(params.id, 10);
  const taggedChats = await prisma.chatTagging.findMany({
    where: { bot_id: botId }
  });

  return (
    <Table>
      <TableCaption>Chats and Tags</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Link</TableHead>
          <TableHead className="relative">
            Tags
            <span className="group inline-block">
              <InformationCircleIcon className="ml-1.5 inline-block h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              <span className="absolute left-0 top-full mt-2 hidden rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                AI tags chosen from predefined list
              </span>
            </span>
          </TableHead>
          <TableHead className="relative">
            AI Tags
            <span className="group inline-block">
              <InformationCircleIcon className="ml-1.5 inline-block h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              <span className="absolute left-0 top-full mt-2 hidden rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                AI generated tags about the conversation
              </span>
            </span>
          </TableHead>
          <TableHead className="relative">
            User Tags
            <span className="group inline-block">
              <InformationCircleIcon className="ml-1.5 inline-block h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              <span className="absolute left-0 top-full mt-2 hidden rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                AI generated tags about the user
              </span>
            </span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {taggedChats.map(taggedChat => (
          <TableRow className="max-h-32 overflow-auto" key={taggedChat.id}>
            <TableCell className="w-fit">
              <Link
                className="text-blue-600 hover:text-blue-800"
                href={`/conversation_finder/${taggedChat.conversation_id}`}>
                Link
              </Link>
            </TableCell>
            <TableCell className="max-w-[100px]">
              {renderTags(taggedChat.tags)}
            </TableCell>
            <TableCell className="max-w-[100px]">
              {renderTags(taggedChat.ai_generated_tags)}
            </TableCell>
            <TableCell className="max-w-[100px]">
              {renderTags(taggedChat.user_tags)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
