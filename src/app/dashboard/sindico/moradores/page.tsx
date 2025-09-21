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

function MoradorForm({ onMoradorAdded }: { onMoradorAdded: () => void }) {
  const [condominios, setCondominios] = useState<any[]>([]);
  const [condominioId, setCondominioId] = useState<number>(0);
  const [moradias, setMoradias] = useState<any[]>([]);
  const [moradiaId, setMoradiaId] = useState<number>(0);

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nif, setNIF] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState('PROPRIETARIO');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [contratoFile, setContratoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Buscar condomínios vinculados ao síndico (usando mesmo endpoint da página de moradas)
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

  // Buscar moradias do condomínio selecionado (usando mesmo endpoint da página de moradas)
  useEffect(() => {
    if (!condominioId) return;
    const fetchMoradias = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get(`/api/v1/condominios/${condominioId}/moradias`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMoradias(response.data);
        if (response.data.length > 0) setMoradiaId(response.data[0].id);
      } catch {
        setMoradias([]);
      }
    };
    fetchMoradias();
  }, [condominioId]);

  // Upload do contrato e cadastro do morador + contrato de propriedade
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('access_token');
      // 1. Cadastrar morador
      const payload = { nome, sobrenome, email, password, nif, telefone, tipo };
      const moradorRes = await api.post('/api/v1/auth/register/condomino', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const proprietarioId = moradorRes.data.id;

      // 2. Upload do contrato (se houver)
      let contratoUrl = '';
      if (contratoFile) {
        const formData = new FormData();
        formData.append('file', contratoFile);
        const uploadRes = await api.post('/api/v1/upload', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        contratoUrl = uploadRes.data.url;
      }

      // 3. Cadastrar contrato de propriedade
      await api.post(`/api/v1/moradias/${moradiaId}/contratos-propriedade`, {
        proprietarioId,
        inicio,
        fim,
        contratoUrl,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Morador cadastrado e contrato vinculado com sucesso!');
      setNome('');
      setSobrenome('');
      setEmail('');
      setPassword('');
      setNIF('');
      setTelefone('');
      setTipo('PROPRIETARIO');
      setInicio('');
      setFim('');
      setContratoFile(null);
      onMoradorAdded();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao cadastrar morador ou contrato.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Novo Morador</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Condomínio:</label>
          <select
            value={condominioId}
            onChange={e => setCondominioId(Number(e.target.value))}
            className="w-full text-black p-2 border rounded border-amber-300"
            required
          >
            <option value={0}>Selecione um condomínio</option>
            {condominios.map(cond => (
              <option key={cond.id} value={cond.id}>
                {cond.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Moradia:</label>
          <select
            value={moradiaId}
            onChange={e => setMoradiaId(Number(e.target.value))}
            className="w-full text-black p-2 border rounded border-amber-300"
            required
            disabled={!condominioId || moradias.length === 0}
          >
            <option value={0}>
              {!condominioId 
                ? 'Selecione um condomínio primeiro' 
                : moradias.length === 0 
                  ? 'Nenhuma moradia disponível' 
                  : 'Selecione uma moradia'}
            </option>
            {moradias.map(moradia => (
              <option key={moradia.id} value={moradia.id}>
                {moradia.tipo} {moradia.numero} - {moradia.tipologia} (Bloco: {moradia.blocoNome})
              </option>
            ))}
          </select>
        </div>
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
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">NIF:</label>
          <input
            type="text"
            value={nif}
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
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Tipo:</label>
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="w-full text-black p-2 border rounded border-amber-300"
            required
          >
            <option value="PROPRIETARIO">Proprietário</option>
            <option value="INCLINO">Arrendatário</option>
            <option value="DEPENDENTE">Dependente</option>
            <option value="FUNCIONARIO">Funcionário</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Início do Contrato:</label>
          <input
            type="date"
            value={inicio}
            onChange={e => setInicio(e.target.value)}
            className="w-full text-black p-2 border rounded border-amber-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Fim do Contrato:</label>
          <input
            type="date"
            value={fim}
            onChange={e => setFim(e.target.value)}
            className="w-full text-black p-2 border rounded border-amber-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Contrato (arquivo):</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={e => setContratoFile(e.target.files?.[0] || null)}
            className="w-full text-black p-2 border rounded border-amber-300"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !condominioId || !moradiaId}
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

function MoradorList({ reload, selectedCondominioId }: { reload: boolean; selectedCondominioId: number }) {
  const [moradores, setMoradores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMoradores = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('access_token');
        // Se um condomínio específico foi selecionado, busque moradores desse condomínio
        // Caso contrário, busque todos os moradores
        let url = '/api/v1/condominos';
        if (selectedCondominioId) {
          url = `/api/v1/condominios/${selectedCondominioId}/moradores`;
        }
        
        const response = await api.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMoradores(response.data);
      } catch (err: any) {
        setError('Erro ao buscar moradores.');
      } finally {
        setLoading(false);
      }
    };
    fetchMoradores();
  }, [reload, selectedCondominioId]);

  return (
    <div>
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Moradores Cadastrados</h2>
      {loading && <p className="text-amber-700">Carregando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {moradores.length === 0 && !loading && !error && (
        <p className="text-amber-700">Nenhum morador encontrado.</p>
      )}
      {moradores.map(morador => (
        <div key={morador.id} className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
          <h3 className="text-amber-900 text-lg font-semibold">{morador.nome} {morador.sobrenome}</h3>
          <p className="text-amber-700">Email: {morador.email}</p>
          <p className="text-amber-700">NIF: {morador.nif}</p>
          <p className="text-amber-700">Telefone: {morador.telefone}</p>
          <p className="text-amber-700">Tipo: {morador.tipo}</p>
          {morador.moradia && (
            <p className="text-amber-700">
              Moradia: {morador.moradia.tipo} {morador.moradia.numero} - {morador.moradia.tipologia}
            </p>
          )}
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

export default function MoradoresPage() {
  const [reload, setReload] = useState(false);
  const [condominios, setCondominios] = useState<any[]>([]);
  const [selectedCondominioId, setSelectedCondominioId] = useState<number>(0);

  const handleMoradorAdded = () => {
    setReload(r => !r);
  };

  // Buscar condomínios para o filtro da lista
  useEffect(() => {
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
    fetchCondominios();
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <SindicoSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-amber-900 text-3xl font-bold mb-8">Gerir Moradores</h1>
        <MoradorForm onMoradorAdded={handleMoradorAdded} />
        
        <div className="mt-8">
          {/* Filtro por condomínio para a lista */}
          <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm border-amber-300">
            <label className="text-amber-900 block mb-2 font-medium">Filtrar por Condomínio:</label>
            <select
              value={selectedCondominioId}
              onChange={e => setSelectedCondominioId(Number(e.target.value))}
              className="w-full text-black p-2 border rounded border-amber-300"
            >
              <option value={0}>Todos os condomínios</option>
              {condominios.map(cond => (
                <option key={cond.id} value={cond.id}>
                  {cond.nome}
                </option>
              ))}
            </select>
          </div>
          
          <MoradorList reload={reload} selectedCondominioId={selectedCondominioId} />
        </div>
      </main>
    </div>
  );
}