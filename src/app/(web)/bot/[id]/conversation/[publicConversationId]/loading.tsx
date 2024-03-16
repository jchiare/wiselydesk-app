import AgentMessage from "@/components/web/conversation/agent-message";
import RightBar from "@/components/web/conversation/right-bar";
import UserMessage from "@/components/web/conversation/user-message";

const aiMessage = {
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque hendrerit ligula vel arcu tincidunt, vel varius urna consequat. Integer sit amet lectus quis tortor placerat commodo. Pellentesque fermentum, sapien in viverra dapibus, massa risus viverra elit. <br> <br> nec volutpat lacus sem aliquam arcu. Morbi odio justo, dapibus vel placerat non, maximus nec est. Aliquam erat volutpat. Integer accumsan nisi eget ante maximus aliquam. Proin bibendum metus at tristique scelerisque.",
  created_at: "Tue, 05 Sep 2023 06:13:06 GMT",
  sources:
    "https://d3v-daspu.zendesk.com/hc/en-us/articles/13814641155985-Welcome-to-your-Help-Center-, https://d3v-daspu.zendesk.com/hc/en-us/articles/13814641155985-helcom-george, https://d3v-daspu.zendesk.com/hc/en-us/articles/13814641155985-Looking-great-tonight",
  is_helpful: null
};

const userMessage = {
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  created_at: "Tue, 05 Sep 2023 06:13:06 GMT",
  is_helpful: null
};

const firstMessage = {
  text: "hi there how are you doing t need to ask you a few questions hi there how need to ask you a few questions",
  created_at: "Tue, 05 Sep 2023 06:13:06 GMT",
  sources: "",
  is_helpful: null
};

export default function SingleConversationLoading() {
  return (
    <div className="flex">
      <div className="px-4 py-10 sm:px-6 lg:px-16 lg:py-10">
        <div>
          <AgentMessage
            text={firstMessage.text}
            sentTime={firstMessage.created_at}
            sources={firstMessage.sources}
            isHelpful={firstMessage.is_helpful}
            isFirstMessage={true}
            isLoading={true}
            isFinished={true}
          />
          <UserMessage
            text={userMessage.text}
            sentTime={userMessage.created_at}
            isLoading={true}
          />
          <AgentMessage
            text={aiMessage.text}
            sentTime={aiMessage.created_at}
            sources={aiMessage.sources}
            isHelpful={aiMessage.is_helpful}
            isFirstMessage={false}
            isLoading={true}
            isFinished={true}
          />
        </div>
      </div>
      <div className="h-screen min-w-[350px] max-w-[350px] border-2 border-y-0 border-gray-300 bg-gray-200">
        <RightBar
          conversationId={123}
          botId="123"
          ticketDeflected={null}
          toReview={null}
          userId={123}
          publicConversationId={"hello"}
          zendeskTicketUrl={null}
        />
      </div>
    </div>
  );
}
