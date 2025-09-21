// AdminSidebar.js
import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="bg-amber-100 text-amber-900 w-64 min-h-screen flex flex-col px-6 py-8">
      <h2 className="text-2xl font-bold mb-8 text-amber-900">Administração</h2>
      <nav className="flex flex-col gap-4">
        <Link 
          href="/dashboard/admin/sindicos" 
          className="text-amber-800 hover:text-amber-900 font-medium transition-colors"
        >
          Gestão de Síndico
        </Link>
        <Link 
          href="/dashboard/admin/condominios" 
          className="text-amber-800 hover:text-amber-900 font-medium transition-colors"
        >
          Gestão de Condomínio
        </Link>
        <Link 
          href="/dashboard/admin/mandatos" 
          className="text-amber-800 hover:text-amber-900 font-medium transition-colors"
        >
          Gestão de Mandatos
        </Link>
      </nav>
      <div className="mt-auto pt-8">
        <Link 
          href="/logout" 
          className="text-red-600 hover:text-red-800 font-medium transition-colors"
        >
          Sair
        </Link>
      </div>
    </aside>
  );
}