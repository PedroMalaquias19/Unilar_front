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
        <button className="text-black hover:text-amber-900 hover:underline transition-colors">
          Sair
        </button>
      </div>
    </aside>
  );
}

function MoradorForm({ onMoradorAdded }: { onMoradorAdded: () => void }) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [NIF, setNIF] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState('PROPRIETARIO');
  
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
      const payload = {
        nome,
        sobrenome,
        email,
        password,
        NIF,
        telefone,
        tipo
      };
      
      await api.post('/api/v1/auth/register/condomino', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccess('Morador cadastrado com sucesso!');
      setNome('');
      setSobrenome('');
      setEmail('');
      setPassword('');
      setNIF('');
      setTelefone('');
      setTipo('PROPRIETARIO');
      onMoradorAdded();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao cadastrar morador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Novo Morador</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="text-amber-900 block mb-1">Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full text-black p-2 border rounded border-amber-300"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="text-amber-900 block mb-1">Sobrenome:</label>
            <input
              type="text"
              value={sobrenome}
              onChange={e => setSobrenome(e.target.value)}
              className="w-full text-black p-2 border rounded border-amber-300"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full text-black p-2 border rounded border-amber-300"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full text-black p-2 border rounded border-amber-300"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="text-amber-900 block mb-1">NIF:</label>
            <input
              type="text"
              value={NIF}
              onChange={e => setNIF(e.target.value)}
              className="w-full text-black p-2 border rounded border-amber-300"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="text-amber-900 block mb-1">Telefone:</label>
            <input
              type="text"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
              className="w-full text-black p-2 border rounded border-amber-300"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Tipo:</label>
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="w-full text-black p-2 border rounded border-amber-300"
            required
          >
            <option value="PROPRIETARIO">Proprietário</option>
            <option value="INQUILINO">Inquilino</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Morador'}
        </button>
        
        {success && <p className="text-green-600 mt-4">{success}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
    </div>
  );
}

function ContratoForm({ onContratoAdded, moradores }: { onContratoAdded: () => void, moradores: any[] }) {
  const [condominios, setCondominios] = useState<any[]>([]);
  const [condominioId, setCondominioId] = useState<number>(0);
  const [moradas, setMoradas] = useState<any[]>([]);
  const [moradiaId, setMoradiaId] = useState<number>(0);
  const [proprietarioId, setProprietarioId] = useState<number>(0);
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [contratoUrl, setContratoUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Buscar condomínios
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

  // Buscar moradas do condomínio selecionado
  useEffect(() => {
    if (!condominioId) return;
    const fetchMoradas = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get(`/api/v1/condominios/${condominioId}/moradias`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMoradas(response.data);
        if (response.data.length > 0) setMoradiaId(response.data[0].id);
      } catch {
        setMoradas([]);
      }
    };
    fetchMoradas();
  }, [condominioId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const token = localStorage.getItem('access_token');
      const payload = {
        proprietarioId: Number(proprietarioId),
        inicio,
        fim,
        contratoUrl
      };
      
      await api.post(`/api/v1/moradias/${moradiaId}/contratos-propriedade`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccess('Contrato criado com sucesso!');
      setProprietarioId(0);
      setInicio('');
      setFim('');
      setContratoUrl('');
      onContratoAdded();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao criar contrato.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Novo Contrato de Propriedade</h2>
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
          <label className="text-amber-900 block mb-1">Morada:</label>
          <select
            value={moradiaId}
            onChange={e => setMoradiaId(Number(e.target.value))}
            className="w-full text-black p-2 border rounded border-amber-300"
            required
          >
            <option value={0}>Selecione uma morada</option>
            {moradas.map(morada => (
              <option key={morada.id} value={morada.id}>
                {morada.tipo} {morada.numero} - {morada.tipologia} (Bloco: {morada.blocoNome})
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Morador:</label>
          <select
            value={proprietarioId}
            onChange={e => setProprietarioId(Number(e.target.value))}
            className="w-full text-black p-2 border rounded border-amber-300"
            required
          >
            <option value={0}>Selecione um morador</option>
            {moradores.map(morador => (
              <option key={morador.id} value={morador.id}>
                {morador.nome} {morador.sobrenome} - {morador.tipo}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="text-amber-900 block mb-1">Data de Início:</label>
            <input
              type="date"
              value={inicio}
              onChange={e => setInicio(e.target.value)}
              className="w-full text-black p-2 border rounded border-amber-300"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="text-amber-900 block mb-1">Data de Fim:</label>
            <input
              type="date"
              value={fim}
              onChange={e => setFim(e.target.value)}
              className="w-full text-black p-2 border rounded border-amber-300"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Arquivo do Contrato:</label>
          <input
            type="file"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                setContratoUrl(file.name); // Por enquanto, armazena o nome do arquivo
              }
            }}
            className="w-full text-black p-2 border rounded border-amber-300"
            accept=".pdf,.doc,.docx"
          />
          {contratoUrl && (
            <p className="text-amber-700 text-sm mt-1">Arquivo selecionado: {contratoUrl}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading || !moradiaId || !proprietarioId}
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar Contrato'}
        </button>
        
        {success && <p className="text-green-600 mt-4">{success}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
    </div>
  );
}

function MoradorList({ reload }: { reload: boolean }) {
  const [moradores, setMoradores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMoradores = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('access_token');
        // Assumindo que existe um endpoint para listar moradores
        // Se não existir, você pode ajustar conforme necessário
        const response = await api.get('/api/v1/condominos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMoradores(response.data);
      } catch (err: any) {
        setError('Erro ao buscar moradores.');
        setMoradores([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchMoradores();
  }, [reload]);

   return (
    <div>
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Moradores Cadastrados</h2>
      {loading && <p className="text-amber-700">Carregando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {moradores.length === 0 && !loading && !error && (
        <p className="text-amber-700">Nenhum morador encontrado.</p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {moradores.map(morador => (
          <div key={morador.id} className="bg-white border rounded-lg p-6 shadow-sm border-amber-300">
            <h3 className="text-amber-900 text-lg font-semibold mb-2">{morador.nome} {morador.sobrenome}</h3>
            <div className="space-y-1 text-sm">
              <p className="text-amber-700"><strong>Email:</strong> {morador.email}</p>
              <p className="text-amber-700"><strong>NIF:</strong> {morador.nif}</p>
              <p className="text-amber-700"><strong>Telefone:</strong> {morador.telefone}</p>
              <p className="text-amber-700"><strong>Tipo:</strong> {morador.tipo}</p>
              {morador.moradia && (
                <p className="text-amber-700">
                  <strong>Moradia:</strong> {morador.moradia.tipo} {morador.moradia.numero} - {morador.moradia.tipologia}
                </p>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="bg-amber-700 text-white px-3 py-1 rounded hover:bg-amber-800 transition-colors text-sm">
                Editar
              </button>
              <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function MoradoresPage() {
  const [reload, setReload] = useState(false);
  const [moradores, setMoradores] = useState<any[]>([]);

  const handleMoradorAdded = () => {
    setReload(r => !r);
  };

  const handleContratoAdded = () => {
    setReload(r => !r);
  };

  // Buscar moradores para usar no ContratoForm
  useEffect(() => {
    const fetchMoradores = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get('/api/v1/condominos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMoradores(response.data);
      } catch {
        setMoradores([]);
      }
    };
    fetchMoradores();
  }, [reload]);

  return (
    <div className="flex min-h-screen bg-white">
      <SindicoSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-amber-900 text-3xl font-bold mb-8">Gerir Moradores</h1>
        
        <MoradorForm onMoradorAdded={handleMoradorAdded} />
        
        <ContratoForm onContratoAdded={handleContratoAdded} moradores={moradores} />
        
        <div className="mt-8">
          <MoradorList reload={reload} />
        </div>
      </main>
    </div>
  );
}