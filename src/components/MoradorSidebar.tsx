'use client';
import Link from 'next/link';

export default function MoradorSidebar() {
  return (
    <aside className="bg-blue-100 text-blue-900 w-64 min-h-screen flex flex-col px-6 py-8">
      <h2 className="text-2xl font-bold mb-8 text-blue-900">Área do Morador</h2>
      <nav className="flex flex-col gap-4">
        <Link 
          href="/dashboard/morador/moradias" 
          className="text-blue-800 hover:text-blue-900 font-medium transition-colors"
        >
          Minhas Moradias
        </Link>
        <Link 
          href="/dashboard/morador/pagamentos" 
          className="text-blue-800 hover:text-blue-900 font-medium transition-colors"
        >
          Pagamentos
        </Link>
        <Link 
          href="/dashboard/morador/perfil" 
          className="text-blue-800 hover:text-blue-900 font-medium transition-colors"
        >
          Editar Perfil
        </Link>
      </nav>
      <div className="mt-auto pt-8">
        <button className="text-black hover:text-blue-900 hover:underline transition-colors">
          Sair
        </button>
      </div>
    </aside>
  );
}