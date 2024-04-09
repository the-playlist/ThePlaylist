import RootLayout from "./(dashboard)/layout";
import Dashboard from "./(dashboard)/page";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <RootLayout children={undefined} />
    </main>
  );
}
