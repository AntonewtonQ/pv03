import Layout from "@/components/layout";
import Menu from "@/components/menu";

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center w-full">
        <main className="max-w-[1440px]">
          <Menu />
        </main>
      </div>
    </Layout>
  );
}
