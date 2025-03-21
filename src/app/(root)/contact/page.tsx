import ContactList from "@/components/ContactList";
import Footer from "@/components/footer";
import ContactForm from "@/components/forms/ContactForm";
import Layout from "@/components/layout";
import NavBar from "@/components/navbar";
import React from "react";

const ContactPage = () => {
  return (
    <Layout>
      <div>
        <NavBar />
        <ContactList />
        <ContactForm />
        <Footer />
      </div>
    </Layout>
  );
};

export default ContactPage;
