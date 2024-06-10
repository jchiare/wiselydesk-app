import ConversationsTableFilter, {
  type FilterType
} from "@/components/web/conversations/filter-conversations-table";

type ConversationsLayoutProps = {
  children: React.ReactNode;
  params: { filter: FilterType };
};

export default function ConversationsLayout({
  children,
  params
}: ConversationsLayoutProps) {
  return (
    <div className="p-4 sm:p-6 lg:px-16 lg:py-10">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Conversations
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your conversations.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <ConversationsTableFilter filter={params.filter} />
        <>{children}</>
      </div>
    </div>
  );
}
