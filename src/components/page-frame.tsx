import Footer from "./footer";
import Layout from "./layout";
import NavBar from "./navbar";

const PageFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <div className="min-h-screen bg-transparent text-white">
        <NavBar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </div>
    </Layout>
  );
};

export default PageFrame;
