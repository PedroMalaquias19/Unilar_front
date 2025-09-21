'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '../AdminSidebar';
import api from '@/services/api';

// Adicione este componente acima ou abaixo do CondominiumList
function AddBlocoForm({ condominioId }: { condominioId: number }) {
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
      await api.post(`/api/v1/condominios/${condominioId}/blocos`, {
        nomeBloco,
        numMoradias,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Bloco cadastrado com sucesso!');
      setNomeBloco('');
      setNumMoradias(0);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao cadastrar bloco.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      <div>
        <label className="text-amber-900 text-sm">Nome do Bloco:</label>
        <input
          type="text"
          value={nomeBloco}
          onChange={e => setNomeBloco(e.target.value)}
          className="w-full text-black p-1 border rounded border-amber-300"
          required
        />
      </div>
      <div>
        <label className="text-amber-900 text-sm">Nº Moradias:</label>
        <input
          type="number"
          value={numMoradias}
          onChange={e => setNumMoradias(Number(e.target.value))}
          className="w-full text-black p-1 border rounded border-amber-300"
          min={0}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-amber-700 text-white px-2 py-1 rounded hover:bg-amber-800 transition-colors disabled:opacity-50"
      >
        {loading ? 'Cadastrando...' : 'Cadastrar Bloco'}
      </button>
      {success && <p className="text-green-600">{success}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}

const CondominiumForm = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quota, setQuota] = useState(0);
  const [juros, setJuros] = useState(0);
  const [multaFixa, setMultaFixa] = useState(0);
  const [toleranciaDias, setToleranciaDias] = useState(0);
  const [diaCobranca, setDiaCobranca] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const payload = {
        nome,
        descricao,
        quota,
        juros,
        multaFixa,
        toleranciaDias,
        diaCobranca,
      };
      const seuTokenAqui = localStorage.getItem('access_token');
      await api.post('/api/v1/condominios', payload, {
        headers: {
          Authorization: `Bearer ${seuTokenAqui}`,
        },
      });
      setSuccess('Condomínio cadastrado com sucesso!');
      setNome('');
      setDescricao('');
      setQuota(0);
      setJuros(0);
      setMultaFixa(0);
      setToleranciaDias(0);
      setDiaCobranca(1);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao cadastrar condomínio.');
    } finally {
      setLoading(false);
    }
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
            required
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
            required
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
            required
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
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Dia da Cobrança:</label>
          <input
            type="number"
            value={diaCobranca}
            onChange={(e) => setDiaCobranca(Number(e.target.value))}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900"
            min={1}
            max={31}
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
};

const CondominiumList = () => {
  const [condominiums, setCondominiums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCondominiums = async () => {
      setLoading(true);
      setError('');
      try {
        const seuTokenAqui = localStorage.getItem('access_token');
        const response = await api.get('/api/v1/condominios', {
          headers: {
            Authorization: `Bearer ${seuTokenAqui}`,
          },
        });
        setCondominiums(response.data);
      } catch (err: any) {
        setError('Erro ao buscar condomínios.');
      } finally {
        setLoading(false);
      }
    };
    fetchCondominiums();
  }, []);

  return (
    <div>
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Condomínios Cadastrados</h2>
      {loading && <p className="text-amber-700">Carregando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {condominiums.map(cond => (
      <div key={cond.id} className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
        <h3 className="text-amber-900 text-lg font-semibold">{cond.nome}</h3>
        <p className="text-amber-700">{cond.descricao}</p>
        <div className="text-amber-900 text-sm mb-2">
          <span>
            Quota: {cond.quota} | Juros: {cond.juros}% | Multa Fixa: {cond.multaFixa} | Tolerância: {cond.toleranciaDias} dias | Dia da Cobrança: {cond.diaCobranca}
          </span>
        </div>
        <AddBlocoForm condominioId={cond.id} />
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