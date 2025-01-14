import AboutDesc from "@/components/aboutdesc";
import Footer from "@/components/footer";
import Layout from "@/components/layout";
import NavBar from "@/components/navbar";
import React from "react";

const AboutPage = () => {
  return (
    <Layout>
      <div>
        <NavBar />
        <AboutDesc />
        <Footer />
      </div>
    </Layout>
  );
};

export default AboutPage;
