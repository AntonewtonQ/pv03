import AboutDesc from "@/components/aboutdesc";
import Layout from "@/components/layout";
import NavBar from "@/components/navbar";
import React from "react";

const AboutPage = () => {
  return (
    <Layout>
      <div>
        <NavBar />
        <AboutDesc />
      </div>
    </Layout>
  );
};

export default AboutPage;
