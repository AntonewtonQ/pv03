import Footer from "@/components/footer";
import Layout from "@/components/layout";
import NavBar from "@/components/navbar";
import ShopList from "@/components/ShopList";
import React from "react";

const ShopPage = () => {
  return (
    <Layout>
      <div>
        <NavBar />
        <ShopList />
        <Footer />
      </div>
    </Layout>
  );
};

export default ShopPage;
