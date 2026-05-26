import Footer from "./footer";
import Layout from "./layout";
import NavBar from "./navbar";

const PageFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <main>{children}</main>
        <Footer />
      </div>
    </Layout>
  );
};

export default PageFrame;
