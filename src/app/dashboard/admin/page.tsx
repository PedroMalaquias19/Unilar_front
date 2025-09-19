// AdminDashboard.js
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import SindicoList from "@/components/admin/SindicoList";
import CondominioList from "@/components/admin/CondominioList";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <main className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-xl font-bold text-amber-900 mb-4">Gestão de Síndico</h2>
            <SindicoList />
          </section>
          <section>
            <h2 className="text-xl font-bold text-amber-900 mb-4">Gestão de Condomínio</h2>
            <CondominioList />
          </section>
        </div>
      </main>
    </div>
  );
}