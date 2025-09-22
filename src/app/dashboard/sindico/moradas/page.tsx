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

function MoradaForm({ onMoradaAdded }: { onMoradaAdded: () => void }) {
  const [condominios, setCondominios] = useState<any[]>([]);
  const [condominioId, setCondominioId] = useState<number>(0);
  const [blocos, setBlocos] = useState<any[]>([]);
  const [blocoId, setBlocoId] = useState<number>(0);

  const [numero, setNumero] = useState(0);
  const [area, setArea] = useState(0);
  const [tipo, setTipo] = useState('CASA');
  const [tipologia, setTipologia] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Buscar condomínios vinculados ao síndico
  useEffect(() => {
    const fetchCondominios = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get('/api/v1/condominios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCondominios(response.data);
        if (response.data.length > 0) setCondominioId(response.data[0].id);
      } catch {
        setCondominios([]);
      }
    };
    fetchCondominios();
  }, []);

  // Buscar blocos do condomínio selecionado
  useEffect(() => {
    if (!condominioId) return;
    const fetchBlocos = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get(`/api/v1/condominios/${condominioId}/blocos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlocos(response.data);
        if (response.data.length > 0) setBlocoId(response.data[0].id);
      } catch {
        setBlocos([]);
      }
    };
    fetchBlocos();
  }, [condominioId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('access_token');
      const blocoSelecionado = blocos.find(b => b.id === Number(blocoId));
      const payload = {
        numero,
        area,
        tipo,
        tipologia,
        blocoId: Number(blocoId),
        blocoNome: blocoSelecionado?.nomeBloco || '',
      };
      await api.post(`/api/v1/condominios/${condominioId}/moradias`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Morada cadastrada com sucesso!');
      setNumero(0);
      setArea(0);
      setTipo('CASA');
      setTipologia('');
      setBlocoId(blocos.length > 0 ? blocos[0].id : 0);
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
          <label className="text-amber-900 block mb-1">Condomínio:</label>
          <select
            value={condominioId}
            onChange={e => setCondominioId(Number(e.target.value))}
            className="w-full text-black p-2 border rounded border-amber-300"
            required
          >
            {condominios.map(cond => (
              <option key={cond.id} value={cond.id}>
                {cond.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Bloco:</label>
          <select
            value={blocoId}
            onChange={e => setBlocoId(Number(e.target.value))}
            className="w-full text-black p-2 border rounded border-amber-300"
            required
          >
            {blocos.map(bloco => (
              <option key={bloco.id} value={bloco.id}>
                {bloco.nomeBloco}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Número:</label>
          <input
            type="number"
            value={numero}
            onChange={e => setNumero(Number(e.target.value))}
            className="w-full text-black p-2 border rounded border-amber-300"
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
            className="w-full text-black p-2 border rounded border-amber-300"
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
            className="w-full text-black p-2 border rounded border-amber-300"
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
            className="w-full text-black p-2 border rounded border-amber-300"
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

function MoradaList({ condominioId, reload }: { condominioId: number, reload: boolean }) {
  const [moradas, setMoradas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!condominioId) return;
    const fetchMoradas = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get(`/api/v1/condominios/${condominioId}/moradias`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMoradas(response.data);
      } catch (err: any) {
        setError('Erro ao buscar moradas.');
      } finally {
        setLoading(false);
      }
    };
    fetchMoradas();
  }, [condominioId, reload]);

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
          <p className="text-amber-700">Bloco: {morada.blocoNome}</p>
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
  const [selectedCondominioId, setSelectedCondominioId] = useState<number>(0);

  // Opcional: buscar condomínios para o filtro da lista
  // Ou use o mesmo estado do formulário se quiser sincronizar

  const handleMoradaAdded = () => {
    setReload(r => !r);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar pode ser importado */}
          <SindicoSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-amber-900 text-3xl font-bold mb-8">Gerir Moradas</h1>
        <MoradaForm onMoradaAdded={handleMoradaAdded} />
        <div className="mt-8">
          {/* Passe o condominioId selecionado para a lista */}
          <MoradaList condominioId={selectedCondominioId} reload={reload} />
        </div>
      </main>
    </div>
  );
}