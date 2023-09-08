export default function ConversationsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 sm:p-6 lg:px-16 lg:py-10 ">
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
      <div className="-mx-4 mt-8 sm:-mx-0">{children}</div>
    </div>
  );
}
