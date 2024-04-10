import {
  ConversationDataTable,
  columns
} from "@/components/web/conversations/table/columns";
import { DataTable } from "@/components/web/conversations/table/data-table";

async function getData(): Promise<ConversationDataTable[]> {
  // Fetch data from your API here.
  return [
    {
      id: 32423,
      summary: "This is a summary",
      public_id: 123,
      bot_id: 3,
      user_id: 456, // Assuming a user_id is available
      created_at: new Date(),
      // Add default or mock values for missing model fields as necessary
      updated_at: new Date(),
      livemode: false,
      escalated: true,
      ended: false
    }
    // ...
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
