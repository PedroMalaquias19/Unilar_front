'use client';
import Link from "next/link";
import { useState } from "react";

// Sidebar exclusivo para o síndico
function SindicoSidebar() {
  return (
    <aside className="bg-amber-100 text-amber-900 w-64 min-h-screen flex flex-col px-6 py-8">
      <h2 className="text-2xl font-bold mb-8 text-amber-900">Área do Síndico</h2>
      <nav className="flex flex-col gap-4">
        <Link 
          href="/dashboard/sindico/moradas" 
          className="text-amber-800 hover:text-amber-900 font-medium transition-colors"
        >
          Gerir Moradas
        </Link>
        <Link 
          href="/dashboard/sindico/moradores" 
          className="text-amber-800 hover:text-amber-900 font-medium transition-colors"
        >
          Gerir Moradores
        </Link>
        <Link 
          href="/dashboard/sindico/despesas" 
          className="text-amber-800 hover:text-amber-900 font-medium transition-colors"
        >
          Gerir Despesas
        </Link>
        <Link 
          href="/dashboard/sindico/perfil" 
          className="text-amber-800 hover:text-amber-900 font-medium transition-colors"
        >
          Editar Perfil
        </Link>
      </nav>
      <div className="mt-auto pt-8">
      <Link 
          href="/" 
          className="text-red-600 hover:text-red-800 font-medium transition-colors"
        >
          Sair
        </Link>
      </div>
    </aside>
  );
}

// Placeholder para conteúdo principal
function SindicoDashboardContent() {
  return (
    <div>
      <h1 className="text-amber-900 text-3xl font-bold mb-8">Bem-vindo, Síndico!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-amber-300 rounded-lg p-6 shadow-sm">
          <h2 className="text-amber-900 text-xl font-semibold mb-2">Gerir Moradas</h2>
          <p className="text-amber-700 mb-4">Adicione, edite ou remova moradas do condomínio.</p>
          <Link href="/dashboard/sindico/moradas">
            <button className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors">
              Acessar
            </button>
          </Link>
        </div>
        <div className="bg-white border border-amber-300 rounded-lg p-6 shadow-sm">
          <h2 className="text-amber-900 text-xl font-semibold mb-2">Gerir Moradores</h2>
          <p className="text-amber-700 mb-4">Controle os moradores e suas informações.</p>
          <Link href="/dashboard/sindico/moradores">
            <button className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors">
              Acessar
            </button>
          </Link>
        </div>
        <div className="bg-white border border-amber-300 rounded-lg p-6 shadow-sm">
          <h2 className="text-amber-900 text-xl font-semibold mb-2">Gerir Despesas</h2>
          <p className="text-amber-700 mb-4">Registre e acompanhe as despesas do condomínio.</p>
          <Link href="/dashboard/sindico/despesas">
            <button className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors">
              Acessar
            </button>
          </Link>
        </div>
        <div className="bg-white border border-amber-300 rounded-lg p-6 shadow-sm">
          <h2 className="text-amber-900 text-xl font-semibold mb-2">Editar Perfil</h2>
          <p className="text-amber-700 mb-4">Atualize seus dados pessoais e de acesso.</p>
          <Link href="/dashboard/sindico/perfil">
            <button className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors">
              Editar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SindicoDashboard() {
  return (
    <div className="flex min-h-screen bg-white">
      <SindicoSidebar />
      <main className="flex-1 p-8">
        <SindicoDashboardContent />
      </main>
    </div>
  );
}