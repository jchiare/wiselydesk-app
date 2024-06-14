import { generateRandomLorem } from "@/lib/shared/utils";

export default function LoadingConversations() {
  return (
    <table className="min-w-full table-fixed divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
            ID
          </th>
          <th
            scope="col"
            className="py-3.5 pl-1 pr-3 text-left text-sm font-semibold text-gray-900">
            Summary
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
            Escalated
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
            Rating
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            First Message
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-gray-100 backdrop-blur-md">
        {[...Array(20).keys()].map(i => {
          return (
            <tr
              className="h-5 animate-pulse"
              key={i}
              style={{
                animationDelay: `${i * 0.05}s`,
                animationDuration: "1s"
              }}>
              <td className="rounded-md bg-gray-200 px-3 py-4 ">
                <span className="blur-sm">{2000 - i}</span>
              </td>
              <td className="w-[50%] rounded-md bg-gray-200 py-4 pl-2 pr-3">
                <span className="blur-sm">{generateRandomLorem()}</span>
              </td>
              <td className="hidden rounded-md bg-gray-200 px-3 py-4 sm:table-cell">
                <span className="blur-sm">Anonymous</span>
              </td>
              <td className="hidden rounded-md bg-gray-200 px-3 py-4 lg:table-cell">
                <span className="blur-sm">Sep 3, 7:49 PM</span>
              </td>
              <td className="hidden rounded-md bg-gray-200 px-3 py-4 lg:table-cell">
                <span className="blur-sm">Sep 3, 7:49 PM</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
