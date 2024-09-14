import { AgentMessage } from "@/components/web/conversation/agent-message";
import { UserMessage } from "@/components/web/conversation/user-message";
import { RightBar } from "@/components/web/conversation/right-bar";

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

export default function WebConversationLoading() {
  return (
    <div className="flex flex-col-reverse sm:flex-col">
      <div className="p-4 sm:mr-[300px] sm:px-6 sm:py-14 lg:px-16">
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
      <div className="border-2 border-y-0 border-gray-300 bg-gray-200 sm:fixed sm:right-0 sm:h-screen sm:min-w-[350px] sm:max-w-[350px]">
        <RightBar
          conversationId={123}
          botId="2"
          toReview={null}
          userId={123}
          publicConversationId={123}
          zendeskTicketUrl={null}
          isLoading={true}
        />
      </div>
    </div>
  );
}
