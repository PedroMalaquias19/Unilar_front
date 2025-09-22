'use client';
import { useState, useEffect } from 'react';

import api from '@/services/api';

// Helper function para decodificar JWT token
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}

// Helper function para obter user_id do token
function getUserIdFromToken(): string | null {
  if (typeof window === 'undefined') return null; // SSR protection
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  return decoded?.idUsuario || decoded?.sub || null;
}

function MoradorSidebar({ activeTab, onTabChange }: { 
  activeTab: string; 
  onTabChange: (tab: 'moradias' | 'pagamentos' | 'perfil') => void 
}) {
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
  };

  return (
    <aside className="bg-blue-100 text-blue-900 w-64 min-h-screen flex flex-col px-6 py-8">
      <h2 className="text-2xl font-bold mb-8 text-blue-900">Área do Morador</h2>
      <nav className="flex flex-col gap-4">
        <button 
          onClick={() => onTabChange('moradias')}
          className={`text-left font-medium transition-colors ${
            activeTab === 'moradias' 
              ? 'text-blue-900 font-bold' 
              : 'text-blue-800 hover:text-blue-900'
          }`}
        >
          Minhas Moradias
        </button>
        <button 
          onClick={() => onTabChange('pagamentos')}
          className={`text-left font-medium transition-colors ${
            activeTab === 'pagamentos' 
              ? 'text-blue-900 font-bold' 
              : 'text-blue-800 hover:text-blue-900'
          }`}
        >
          Pagamentos
        </button>
        <button 
          onClick={() => onTabChange('perfil')}
          className={`text-left font-medium transition-colors ${
            activeTab === 'perfil' 
              ? 'text-blue-900 font-bold' 
              : 'text-blue-800 hover:text-blue-900'
          }`}
        >
          Editar Perfil
        </button>
      </nav>
      <div className="mt-auto pt-8">
        <button 
          onClick={handleLogout}
          className="text-black hover:text-blue-900 hover:underline transition-colors"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}

function MinhasMoradias() {
  const [propriedades, setPropriedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMinhasMoradias = async () => {
      setLoading(true);
      setError('');
      try {
        const userId = getUserIdFromToken();
        
        if (!userId) {
          setError('Não foi possível obter informações do usuário.');
          return;
        }
        
        // Buscar perfil do usuário para obter o condominoId
        const perfilResponse = await api.get(`/api/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        const condominoId = perfilResponse.data.id;
        
        // Buscar as propriedades
        const response = await api.get(`/api/v1/condominos/${condominoId}/propriedades`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setPropriedades(response.data);
      } catch (err: any) {
        console.error('Erro ao buscar moradias:', err);
        setError('Erro ao buscar suas moradias.');
        setPropriedades([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMinhasMoradias();
  }, []);

  if (loading) return <p className="text-blue-700">Carregando suas moradias...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-blue-900 mb-6 text-2xl font-semibold">Minhas Moradias</h2>
      {propriedades.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-700">Você não possui moradias cadastradas ainda.</p>
        </div>
      ) : (
        propriedades.map(propriedade => (
          <div key={propriedade.moradia.id} className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-blue-300">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-blue-900 text-lg font-semibold">
                  {propriedade.moradia.tipo} {propriedade.moradia.numero} - {propriedade.moradia.tipologia}
                </h3>
                <p className="text-blue-700">Condomínio: {propriedade.moradia.condominioNome}</p>
                <p className="text-blue-700">Bloco: {propriedade.moradia.blocoNome}</p>
                <p className="text-blue-700">Área: {propriedade.moradia.area} m²</p>
                <p className="text-blue-700">Quota: {propriedade.moradia.quota?.toLocaleString()} AOA</p>
                {propriedade.contrato && (
                  <div className="mt-2">
                    <p className="text-blue-700">
                      Contrato: {new Date(propriedade.contrato.inicio).toLocaleDateString()} - {new Date(propriedade.contrato.fim).toLocaleDateString()}
                    </p>
                    <p className="text-blue-700">Status: {propriedade.contrato.status || 'Ativo'}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <span className="px-3 py-1 rounded text-sm font-medium bg-green-100 text-green-800">
                  Proprietário
                </span>
                {propriedade.pagamentos && propriedade.pagamentos?.length > 0 && (
                  <span className="px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                    {propriedade.pagamentos.filter((p: any) => p.status === 'PAGO').length} pagamentos
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function Pagamentos() {
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [propriedades, setPropriedades] = useState<any[]>([]);
  const [selectedMoradia, setSelectedMoradia] = useState<number>(0);
  const [montante, setMontante] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Buscar moradias do morador
    const fetchPropriedades = async () => {
      try {
        const userId = getUserIdFromToken();
        
        if (!userId) return;
        
        // Buscar perfil do usuário para obter o condominoId
        const perfilResponse = await api.get(`/api/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        const condominoId = perfilResponse.data.id;
        
        // Buscar as propriedades
        const response = await api.get(`/api/v1/condominos/${condominoId}/propriedades`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setPropriedades(response.data);
        
        // Se houver propriedades, buscar pagamentos da primeira
        if (response.data.length > 0) {
          const pagamentosResponse = await api.get(`/api/v1/pagamentos/moradia/${response.data[0].moradia.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
          });
          setPagamentos(pagamentosResponse.data);
        }
      } catch (err) {
        console.error('Erro ao buscar propriedades:', err);
        setPropriedades([]);
      }
    };

    fetchPropriedades();
  }, []);

  const handlePagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMoradia) {
      setError('Selecione uma moradia.');
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const payload = {
        moradiaId: selectedMoradia,
        montante: parseFloat(montante),
        dataCobranca: new Date().toISOString().split('T')[0],
        vencimento: vencimento
      };

      await api.post('/api/v1/pagamentos', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });

      setSuccess('Pagamento processado com sucesso!');
      setSelectedMoradia(0);
      setMontante('');
      setVencimento('');
      
      // Recarregar histórico de pagamentos se houver moradia selecionada
      if (selectedMoradia) {
        const response = await api.get(`/api/v1/pagamentos/moradia/${selectedMoradia}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setPagamentos(response.data);
      }
    } catch (err: any) {
      console.error('Erro ao processar pagamento:', err);
      setError(err?.response?.data?.message || 'Erro ao processar pagamento.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoradiaChange = async (moradiaId: number) => {
    setSelectedMoradia(moradiaId);
    if (moradiaId > 0) {
      try {
        const response = await api.get(`/api/v1/pagamentos/moradia/${moradiaId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setPagamentos(response.data);
      } catch (err) {
        console.error('Erro ao buscar pagamentos:', err);
        setPagamentos([]);
      }
    } else {
      setPagamentos([]);
    }
  };

  return (
    <div>
      <h2 className="text-blue-900 mb-6 text-2xl font-semibold">Pagamentos</h2>
      
      {/* Formulário de Pagamento */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm border-blue-300">
        <h3 className="text-blue-900 mb-4 text-xl font-semibold">Novo Pagamento</h3>
        <form onSubmit={handlePagamento}>
          <div className="mb-4">
            <label className="text-blue-900 block mb-1">Moradia:</label>
            <select
              value={selectedMoradia}
              onChange={e => handleMoradiaChange(Number(e.target.value))}
              className="w-full text-black p-2 border rounded border-blue-300"
              required
            >
              <option value={0}>Selecione uma moradia</option>
              {propriedades.map(propriedade => (
                <option key={propriedade.moradia.id} value={propriedade.moradia.id}>
                  {propriedade.moradia.tipo} {propriedade.moradia.numero} - {propriedade.moradia.condominioNome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="text-blue-900 block mb-1">Montante (AOA):</label>
              <input
                type="number"
                value={montante}
                onChange={e => setMontante(e.target.value)}
                className="w-full text-black p-2 border rounded border-blue-300"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="text-blue-900 block mb-1">Data de Vencimento:</label>
              <input
                type="date"
                value={vencimento}
                onChange={e => setVencimento(e.target.value)}
                className="w-full text-black p-2 border rounded border-blue-300"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Registrar Pagamento'}
          </button>
          
          {success && <p className="text-green-600 mt-4">{success}</p>}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </form>
      </div>

      {/* Histórico de Pagamentos */}
      <div className="bg-white border rounded-lg p-6 shadow-sm border-blue-300">
        <h3 className="text-blue-900 mb-4 text-xl font-semibold">Histórico de Pagamentos</h3>
        {selectedMoradia === 0 ? (
          <p className="text-blue-700">Selecione uma moradia para ver o histórico de pagamentos.</p>
        ) : pagamentos.length === 0 ? (
          <p className="text-blue-700">Nenhum pagamento encontrado para esta moradia.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-200">
                  <th className="text-left text-blue-900 py-2">Data Cobrança</th>
                  <th className="text-left text-blue-900 py-2">Vencimento</th>
                  <th className="text-left text-blue-900 py-2">Tipo</th>
                  <th className="text-right text-blue-900 py-2">Montante</th>
                  <th className="text-center text-blue-900 py-2">Status</th>
                  <th className="text-left text-blue-900 py-2">Data Pagamento</th>
                </tr>
              </thead>
              <tbody>
                {pagamentos.map(pagamento => (
                  <tr key={pagamento.id} className="border-b border-blue-100">
                    <td className="text-blue-700 py-2">
                      {new Date(pagamento.dataCobranca).toLocaleDateString()}
                    </td>
                    <td className="text-blue-700 py-2">
                      {new Date(pagamento.vencimento).toLocaleDateString()}
                    </td>
                    <td className="text-blue-700 py-2">{pagamento.tipo}</td>
                    <td className="text-right text-blue-700 py-2">
                      {pagamento.montante?.toLocaleString()} AOA
                    </td>
                    <td className="text-center py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        pagamento.status === 'PAGO' 
                          ? 'bg-green-100 text-green-800'
                          : pagamento.status === 'PENDENTE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pagamento.status}
                      </span>
                    </td>
                    <td className="text-blue-700 py-2">
                      {pagamento.dataPagamento 
                        ? new Date(pagamento.dataPagamento).toLocaleDateString()
                        : '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function EditarPerfil() {
  const [perfil, setPerfil] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    NIF: ''
  });
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Buscar dados do perfil
    const fetchPerfil = async () => {
      setLoadingPerfil(true);
      try {
        const userId = getUserIdFromToken();
        
        if (!userId) {
          setError('Não foi possível obter informações do usuário.');
          return;
        }
        
        const response = await api.get(`/api/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setPerfil(response.data);
      } catch (err: any) {
        console.error('Erro ao buscar perfil:', err);
        setError('Erro ao buscar dados do perfil.');
      } finally {
        setLoadingPerfil(false);
      }
    };
    fetchPerfil();
  }, []);

  const handleUpdatePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const userId = getUserIdFromToken();
      
      if (!userId) {
        setError('Não foi possível obter informações do usuário.');
        return;
      }
      
      await api.put(`/api/v1/users/${userId}`, perfil, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err?.response?.data?.message || 'Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (novaSenha !== confirmarSenha) {
      setError('A nova senha e a confirmação não coincidem.');
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await api.put('/api/v1/morador/senha', {
        senhaAtual,
        novaSenha
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      setSuccess('Senha atualizada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (err: any) {
      console.error('Erro ao atualizar senha:', err);
      setError(err?.response?.data?.message || 'Erro ao atualizar senha.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingPerfil) {
    return <p className="text-blue-700">Carregando dados do perfil...</p>;
  }

  return (
    <div>
      <h2 className="text-blue-900 mb-6 text-2xl font-semibold">Editar Perfil</h2>
      
      {/* Atualizar Dados Pessoais */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm border-blue-300">
        <h3 className="text-blue-900 mb-4 text-xl font-semibold">Dados Pessoais</h3>
        <form onSubmit={handleUpdatePerfil}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="text-blue-900 block mb-1">Nome:</label>
              <input
                type="text"
                value={perfil.nome}
                onChange={e => setPerfil({...perfil, nome: e.target.value})}
                className="w-full text-black p-2 border rounded border-blue-300"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="text-blue-900 block mb-1">Sobrenome:</label>
              <input
                type="text"
                value={perfil.sobrenome}
                onChange={e => setPerfil({...perfil, sobrenome: e.target.value})}
                className="w-full text-black p-2 border rounded border-blue-300"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="text-blue-900 block mb-1">Email:</label>
            <input
              type="email"
              value={perfil.email}
              onChange={e => setPerfil({...perfil, email: e.target.value})}
              className="w-full text-black p-2 border rounded border-blue-300"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="text-blue-900 block mb-1">Telefone:</label>
              <input
                type="text"
                value={perfil.telefone}
                onChange={e => setPerfil({...perfil, telefone: e.target.value})}
                className="w-full text-black p-2 border rounded border-blue-300"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="text-blue-900 block mb-1">NIF:</label>
              <input
                type="text"
                value={perfil.NIF}
                onChange={e => setPerfil({...perfil, NIF: e.target.value})}
                className="w-full text-black p-2 border rounded border-blue-300"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Atualizando...' : 'Atualizar Perfil'}
          </button>
        </form>
      </div>

      {/* Alterar Senha */}
      <div className="bg-white border rounded-lg p-6 shadow-sm border-blue-300">
        <h3 className="text-blue-900 mb-4 text-xl font-semibold">Alterar Senha</h3>
        <form onSubmit={handleUpdateSenha}>
          <div className="mb-4">
            <label className="text-blue-900 block mb-1">Senha Atual:</label>
            <input
              type="password"
              value={senhaAtual}
              onChange={e => setSenhaAtual(e.target.value)}
              className="w-full text-black p-2 border rounded border-blue-300"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="text-blue-900 block mb-1">Nova Senha:</label>
              <input
                type="password"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
                className="w-full text-black p-2 border rounded border-blue-300"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="text-blue-900 block mb-1">Confirmar Nova Senha:</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                className="w-full text-black p-2 border rounded border-blue-300"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Atualizando...' : 'Alterar Senha'}
          </button>
        </form>
      </div>

      {success && <p className="text-green-600 mt-4">{success}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}

export default function MoradorDashboard() {
  const [activeTab, setActiveTab] = useState<'moradias' | 'pagamentos' | 'perfil'>('moradias');

  const renderContent = () => {
    switch (activeTab) {
      case 'moradias':
        return <MinhasMoradias />;
      case 'pagamentos':
        return <Pagamentos />;
      case 'perfil':
        return <EditarPerfil />;
      default:
        return <MinhasMoradias />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'moradias':
        return 'Minhas Moradias';
      case 'pagamentos':
        return 'Pagamentos';
      case 'perfil':
        return 'Meu Perfil';
      default:
        return 'Minhas Moradias';
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <MoradorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-8">
        <h1 className="text-blue-900 text-3xl font-bold mb-8">
          {getPageTitle()}
        </h1>
        {renderContent()}
      </main>
    </div>
  );
}