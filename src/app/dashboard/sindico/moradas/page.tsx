'use client';
import { useState } from 'react';
import Link from 'next/link';

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
        <button className="text-black hover:text-amber-900 hover:underline transition-colors">
          Sair
        </button>
      </div>
    </aside>
  );
}

function MoradaForm() {
  const [numero, setNumero] = useState(0);
  const [area, setArea] = useState(0);
  const [tipo, setTipo] = useState('CASA');
  const [tipologia, setTipologia] = useState('');
  const [quota, setQuota] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Adicione integração com API aqui
    const payload = { numero, area, tipo, tipologia, quota };
    console.log('Cadastrar morada:', payload);
  };

  return (
    <div className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Nova Morada</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Número:</label>
          <input
            type="number"
            value={numero}
            onChange={e => setNumero(Number(e.target.value))}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            min={0}
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Área (m²):</label>
          <input
            type="number"
            value={area}
            onChange={e => setArea(Number(e.target.value))}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            min={0}
            step="0.01"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Tipo:</label>
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          >
            <option value="CASA">Casa</option>
            <option value="APARTAMENTO">Apartamento</option>
            <option value="LOJA">Loja</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Tipologia:</label>
          <input
            type="text"
            value={tipologia}
            onChange={e => setTipologia(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Quota:</label>
          <input
            type="number"
            value={quota}
            onChange={e => setQuota(Number(e.target.value))}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            min={0}
            step="0.01"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}

function MoradaList() {
  // Adicione integração com API para buscar moradas
  const moradas = [
    { id: 1, numero: 101, area: 80, tipo: 'APARTAMENTO', tipologia: 'T2', quota: 50 },
    { id: 2, numero: 5, area: 120, tipo: 'CASA', tipologia: 'T3', quota: 80 }
  ];

  return (
    <div>
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Moradas Cadastradas</h2>
      {moradas.map(morada => (
        <div key={morada.id} className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
          <h3 className="text-amber-900 text-lg font-semibold">
            {morada.tipo} {morada.numero} - {morada.tipologia}
          </h3>
          <p className="text-amber-700">Área: {morada.area} m²</p>
          <p className="text-amber-700">Quota: {morada.quota}</p>
          <div className="mt-4 flex gap-2">
            <button className="bg-amber-700 text-white px-3 py-1 rounded hover:bg-amber-800 transition-colors">
              Editar
            </button>
            <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MoradasPage() {
  return (
    <div className="flex min-h-screen bg-white">
        <SindicoSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-amber-900 text-3xl font-bold mb-8">Gerir Moradas</h1>
        <MoradaForm />
        <div className="mt-8">
          <MoradaList />
        </div>
      </main>
    </div>
  );
}