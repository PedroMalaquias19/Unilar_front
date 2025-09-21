'use client';
import { useState, useEffect } from 'react';
import api from '@/services/api';
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
          href="/dashboard/sindico/blocos" 
          className="text-amber-800 hover:text-amber-900 font-medium transition-colors"
        >
          Gerir Blocos
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

// Troque para o condominioId correto (pode vir da URL, contexto, etc)
const condominioId = 1;

function BlocoForm({ onBlocoAdded }: { onBlocoAdded: () => void }) {
  const [nomeBloco, setNomeBloco] = useState('');
  const [numMoradias, setNumMoradias] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('access_token');
      const payload = { nomeBloco, numMoradias };
      await api.post(`/api/v1/condominios/${condominioId}/blocos`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Bloco cadastrado com sucesso!');
      setNomeBloco('');
      setNumMoradias(0);
      onBlocoAdded();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao cadastrar bloco.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Novo Bloco</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Nome do Bloco:</label>
          <input
            type="text"
            value={nomeBloco}
            onChange={e => setNomeBloco(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Número de Moradias:</label>
          <input
            type="number"
            value={numMoradias}
            onChange={e => setNumMoradias(Number(e.target.value))}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            min={0}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        {success && <p className="text-green-600 mt-4">{success}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
    </div>
  );
}

function BlocoList({ reload }: { reload: boolean }) {
  const [blocos, setBlocos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlocos = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get(`/api/v1/condominios/${condominioId}/blocos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlocos(response.data);
      } catch (err: any) {
        setError('Erro ao buscar blocos.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlocos();
  }, [reload]);

  return (
    <div>
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Blocos Cadastrados</h2>
      {loading && <p className="text-amber-700">Carregando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {blocos.map(bloco => (
        <div key={bloco.id} className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
          <h3 className="text-amber-900 text-lg font-semibold">{bloco.nomeBloco}</h3>
          <p className="text-amber-700">Moradias: {bloco.numMoradias}</p>
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

export default function BlocosPage() {
  const [reload, setReload] = useState(false);

  const handleBlocoAdded = () => {
    setReload(r => !r);
  };

  return (
    <div className="flex min-h-screen bg-white">
         <SindicoSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-amber-900 text-3xl font-bold mb-8">Gestão de Blocos</h1>
        <BlocoForm onBlocoAdded={handleBlocoAdded} />
        <div className="mt-8">
          <BlocoList reload={reload} />
        </div>
      </main>
    </div>
  );
}