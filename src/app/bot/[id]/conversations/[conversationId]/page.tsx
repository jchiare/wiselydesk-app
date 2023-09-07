type ParamsType = {
  conversationId: string;
};

export default async function SingleConversationPage({
  params
}: {
  params: ParamsType;
}) {
  return (
    <h1>
      hello from single conversation page for convo id {params.conversationId}
    </h1>
  );
}
