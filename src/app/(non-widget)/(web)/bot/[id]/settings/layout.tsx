type BotSettingsLayoutProps = {
  children: React.ReactNode;
  params: { id: string };
};

export default function ConversationsLayout({
  children,
  params
}: BotSettingsLayoutProps) {
  return (
    <div className="p-4 sm:p-6 lg:px-16 lg:py-10">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            Bot Settings
          </h1>
        </div>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
