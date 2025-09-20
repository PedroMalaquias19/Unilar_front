'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '../AdminSidebar';
import api from '@/services/api';

const MandatoForm = () => {
  const [sindicos, setSindicos] = useState<any[]>([]);
  const [condominios, setCondominios] = useState<any[]>([]);
  const [sindicoId, setSindicoId] = useState(0);
  const [condominioId, setCondominioId] = useState(0);
  const [inicioMandato, setInicioMandato] = useState('');
  const [fimMandato, setFimMandato] = useState('');
  const [salario, setSalario] = useState(0);
  const [contratoUrl, setContratoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Buscar síndicos
    const fetchSindicos = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get('/api/v1/sindicos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSindicos(response.data);
      } catch {
        setSindicos([]);
      }
    };
    // Buscar condomínios
    const fetchCondominios = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get('/api/v1/condominios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCondominios(response.data);
      } catch {
        setCondominios([]);
      }
    };
    fetchSindicos();
    fetchCondominios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('access_token');
      const payload = {
        sindicoId: Number(sindicoId),
        condominioId: Number(condominioId),
        inicioMandato,
        fimMandato,
        salario,
        contratoUrl,
      };
      await api.post(`/api/v1/condominios/${condominioId}/mandatos`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Mandato atribuído com sucesso!');
      setSindicoId(0);
      setCondominioId(0);
      setInicioMandato('');
      setFimMandato('');
      setSalario(0);
      setContratoUrl('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao atribuir mandato.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Atribuir Condomínio ao Síndico</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Síndico:</label>
          <select
            value={sindicoId}
            onChange={e => setSindicoId(Number(e.target.value))}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          >
            <option value={0}>Selecione o síndico</option>
            {sindicos.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.nome} {s.sobrenome}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Condomínio:</label>
          <select
            value={condominioId}
            onChange={e => setCondominioId(Number(e.target.value))}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          >
            <option value={0}>Selecione o condomínio</option>
            {condominios.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Início do Mandato:</label>
          <input
            type="date"
            value={inicioMandato}
            onChange={e => setInicioMandato(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Fim do Mandato:</label>
          <input
            type="date"
            value={fimMandato}
            onChange={e => setFimMandato(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Salário:</label>
          <input
            type="number"
            value={salario}
            onChange={e => setSalario(Number(e.target.value))}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            min={0}
            step="0.01"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">URL do Contrato:</label>
          <input
            type="text"
            value={contratoUrl}
            onChange={e => setContratoUrl(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Atribuindo...' : 'Atribuir'}
        </button>
        {success && <p className="text-green-600 mt-4">{success}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default function MandatosPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-amber-900 text-3xl font-bold mb-8">Atribuir Condomínio ao Síndico</h1>
        <MandatoForm />
      </main>
    </div>
  );
}