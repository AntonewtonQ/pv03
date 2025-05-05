import ChangeLogPort from "@/components/changelogport";
import Footer from "@/components/footer";
import Layout from "@/components/layout";
import NavBar from "@/components/navbar";

const VersionPage = () => {
  return (
    <Layout>
      <NavBar />
      <ChangeLogPort />
      <Footer />
    </Layout>
  );
};

export default VersionPage;
