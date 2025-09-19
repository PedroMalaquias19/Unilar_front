'use client';
import { useState } from 'react';
import AdminSidebar from '../AdminSidebar';

const CondominiumForm = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quota, setQuota] = useState(0);
  const [juros, setJuros] = useState(0);
  const [multaFixa, setMultaFixa] = useState(0);
  const [toleranciaDias, setToleranciaDias] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Adicione integração com API aqui
    const payload = {
      nome,
      descricao,
      quota,
      juros,
      multaFixa,
      toleranciaDias,
    };
    console.log('Cadastrar condomínio:', payload);
  };

  return (
    <div className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Novo Condomínio</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Descrição:</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900"
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Quota:</label>
          <input
            type="number"
            value={quota}
            onChange={(e) => setQuota(Number(e.target.value))}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900"
            min={0}
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Juros (%):</label>
          <input
            type="number"
            value={juros}
            onChange={(e) => setJuros(Number(e.target.value))}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900"
            min={0}
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Multa Fixa:</label>
          <input
            type="number"
            value={multaFixa}
            onChange={(e) => setMultaFixa(Number(e.target.value))}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900"
            min={0}
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Tolerância (dias):</label>
          <input
            type="number"
            value={toleranciaDias}
            onChange={(e) => setToleranciaDias(Number(e.target.value))}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900"
            min={0}
            step="1"
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
};

const CondominiumList = () => {
  // Adicione integração com API para buscar condomínios
  const condominiums = [
    { id: 1, nome: 'Condomínio Exemplo', descricao: 'Exemplo', quota: 100, juros: 2, multaFixa: 10, toleranciaDias: 5 }
  ];

  return (
    <div>
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Condomínios Cadastrados</h2>
      {condominiums.map(cond => (
        <div key={cond.id} className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
          <h3 className="text-amber-900 text-lg font-semibold">{cond.nome}</h3>
          <p className="text-amber-700">{cond.descricao}</p>
          <div className="text-amber-900 text-sm mb-2">
            <span>Quota: {cond.quota} | Juros: {cond.juros}% | Multa Fixa: {cond.multaFixa} | Tolerância: {cond.toleranciaDias} dias</span>
          </div>
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
};

export default function Condominios() {
  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-amber-900 text-3xl font-bold mb-8">Gestão de Condomínios</h1>
        <CondominiumForm />
        <div className="mt-8">
          <CondominiumList />
        </div>
      </main>
    </div>
  );
}