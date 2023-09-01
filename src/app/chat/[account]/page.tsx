type Params = {
  account: string;
};

export default function Page({ params }: { params: Params }) {
  return (
    <main className="h-full w-full antialiased">
      <h1>chat page {params.account}</h1>
    </main>
  );
}
