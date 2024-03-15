export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mx-auto mt-20 max-w-5xl space-y-6 p-4">
        <div className="mx-auto h-6 w-1/3 rounded bg-gray-300"></div>
        <div className="space-y-4">
          <div className="h-96 rounded bg-gray-300"></div>
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-4 w-24 rounded bg-gray-300"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
