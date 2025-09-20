'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';

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

// Defina o blocoId conforme sua lógica (exemplo: vindo de contexto, props, ou rota)
const blocoId = 1; // Troque para o blocoId correto

function MoradaForm({ onMoradaAdded }: { onMoradaAdded: () => void }) {
  const [numero, setNumero] = useState(0);
  const [area, setArea] = useState(0);
  const [tipo, setTipo] = useState('CASA');
  const [tipologia, setTipologia] = useState('');
  const [quota, setQuota] = useState(0);
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
      const payload = { numero, area, tipo, tipologia, quota };
      await api.post(`/api/v1/blocos/${blocoId}/moradias`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Morada cadastrada com sucesso!');
      setNumero(0);
      setArea(0);
      setTipo('CASA');
      setTipologia('');
      setQuota(0);
      onMoradaAdded();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao cadastrar morada.');
    } finally {
      setLoading(false);
    }
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
            <option value="LOJA">Loja</option>
            <option value="SALA_EVENTOS">Sala de Eventos</option>
            <option value="ESPACO_DESPORTIVO">Espaço Desportivo</option>
            <option value="OUTROS">Outro</option>
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

function MoradaList({ reload }: { reload: boolean }) {
  const [moradas, setMoradas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMoradas = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get(`/api/v1/blocos/${blocoId}/moradias`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMoradas(response.data);
      } catch (err: any) {
        setError('Erro ao buscar moradas.');
      } finally {
        setLoading(false);
      }
    };
    fetchMoradas();
  }, [reload]);

  return (
    <div>
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Moradas Cadastradas</h2>
      {loading && <p className="text-amber-700">Carregando...</p>}
      {error && <p className="text-red-600">{error}</p>}
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
  const [reload, setReload] = useState(false);

  const handleMoradaAdded = () => {
    setReload(r => !r);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SindicoSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-amber-900 text-3xl font-bold mb-8">Gerir Moradas</h1>
        <MoradaForm onMoradaAdded={handleMoradaAdded} />
        <div className="mt-8">
          <MoradaList reload={reload} />
        </div>
      </main>
    </div>
  );
}