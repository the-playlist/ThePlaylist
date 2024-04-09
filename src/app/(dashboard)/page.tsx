import Players from "./players/page";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Players />
    </main>
  );
}
