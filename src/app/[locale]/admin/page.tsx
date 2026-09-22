import AdminDashboard from "@/components/admin-dashboard";
import PageFrame from "@/components/page-frame";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const AdminPage = () => {
  return (
    <PageFrame>
      <AdminDashboard />
    </PageFrame>
  );
};

export default AdminPage;
