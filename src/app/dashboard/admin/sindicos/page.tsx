'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '../AdminSidebar';
import api from '@/services/api';

const SindicoForm = () => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [NIF, setNIF] = useState('');
  const [telefone, setTelefone] = useState('');
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
        sobrenome,
        email,
        password,
        NIF,
        telefone,
      };
      const seuTokenAqui = localStorage.getItem('access_token');
      await api.post('/api/v1/auth/register/sindico', payload, {
        headers: {
          Authorization: `Bearer ${seuTokenAqui}`,
        },
      });
      setSuccess('Síndico cadastrado com sucesso!');
      setNome('');
      setSobrenome('');
      setEmail('');
      setPassword('');
      setNIF('');
      setTelefone('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao cadastrar síndico.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Novo Síndico</h2>
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
          <label className="text-amber-900 block mb-1">Sobrenome:</label>
          <input
            type="text"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">NIF:</label>
          <input
            type="text"
            value={NIF}
            onChange={(e) => setNIF(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Telefone:</label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900"
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

const SindicoList = () => {
  const [sindicos, setSindicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSindicos = async () => {
      setLoading(true);
      setError('');
      try {
        const seuTokenAqui = localStorage.getItem('access_token');
        const response = await api.get('/api/v1/sindicos', {
          headers: {
            Authorization: `Bearer ${seuTokenAqui}`,
          },
        });
        setSindicos(response.data);
      } catch (err: any) {
        setError('Erro ao buscar síndicos.');
      } finally {
        setLoading(false);
      }
    };
    fetchSindicos();
  }, []);

  return (
    <div>
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Síndicos Cadastrados</h2>
      {loading && <p className="text-amber-700">Carregando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {sindicos.map(sindico => (
        <div key={sindico.id} className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
          <h3 className="text-amber-900 text-lg font-semibold">{sindico.nome} {sindico.sobrenome}</h3>
          <p className="text-amber-700">Email: {sindico.email}</p>
          <p className="text-amber-700">NIF: {sindico.NIF}</p>
          <p className="text-amber-700">Telefone: {sindico.telefone}</p>
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

export default function Sindicos() {
  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-amber-900 text-3xl font-bold mb-8">Gestão de Síndicos</h1>
        <SindicoForm />
        <div className="mt-8">
          <SindicoList />
        </div>
      </main>
    </div>
  );
}