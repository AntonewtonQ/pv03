import ContactList from "@/components/ContactList";
import ContactForm from "@/components/forms/ContactForm";
import PageFrame from "@/components/page-frame";

const ContactPage = () => {
  return (
    <PageFrame>
      <ContactList />
      <ContactForm />
    </PageFrame>
  );
};

export default ContactPage;
