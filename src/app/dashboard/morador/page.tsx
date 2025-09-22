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
      window.location.href = '/';
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
        const perfilResponse = await api.get(`/api/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        const condominoId = perfilResponse.data.id;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmingPayment, setConfirmingPayment] = useState<number | null>(null);
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingPayment, setUploadingPayment] = useState<number | null>(null);

  const fetchPagamentos = async () => {
    setLoading(true);
    setError('');
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        setError('Não foi possível obter informações do usuário.');
        return;
      }

      // Primeiro buscar o perfil do usuário para obter o condominoId
      const perfilResponse = await api.get(`/api/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      const condominoId = perfilResponse.data.id;

      // Buscar propriedades do morador
      const propriedadesResponse = await api.get(`/api/v1/condominos/${condominoId}/propriedades`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });

      // Extrair todos os pagamentos de todas as propriedades
      const todosPagamentos: any[] = [];
      propriedadesResponse.data.forEach((propriedade: any) => {
        if (propriedade.pagamentos && propriedade.pagamentos.length > 0) {
          propriedade.pagamentos.forEach((pagamento: any) => {
            todosPagamentos.push({
              ...pagamento,
              propriedade: {
                tipo: propriedade.moradia.tipo,
                numero: propriedade.moradia.numero,
                tipologia: propriedade.moradia.tipologia,
                condominioNome: propriedade.moradia.condominioNome,
                blocoNome: propriedade.moradia.blocoNome
              }
            });
          });
        }
      });

      // Ordenar por data de vencimento (mais recentes primeiro)
      todosPagamentos.sort((a, b) => new Date(b.dataVencimento).getTime() - new Date(a.dataVencimento).getTime());
      
      setPagamentos(todosPagamentos);
    } catch (err: any) {
      console.error('Erro ao buscar pagamentos:', err);
      setError('Erro ao buscar seus pagamentos.');
      setPagamentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagamentos();
  }, []);

  const handleFileSelect = (pagamentoId: number, file: File) => {
    setSelectedFile(file);
    setUploadingPayment(pagamentoId);
  };

  const handleConfirmarPagamento = async (pagamentoId: number) => {
    if (!selectedFile && uploadingPayment === pagamentoId) {
      setError('Por favor, selecione um comprovativo de pagamento.');
      return;
    }

    setConfirmingPayment(pagamentoId);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      await api.post(`/api/v1/pagamentos/${pagamentoId}/confirmar`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      setSuccess('Pagamento confirmado com sucesso! Aguarde a validação do síndico.');
      setSelectedFile(null);
      setUploadingPayment(null);
      
      // Atualizar a lista de pagamentos
      await fetchPagamentos();
    } catch (err: any) {
      console.error('Erro ao confirmar pagamento:', err);
      setError(err?.response?.data?.message || 'Erro ao confirmar pagamento.');
    } finally {
      setConfirmingPayment(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pago':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'vencido':
        return 'bg-red-100 text-red-800';
      case 'confirmado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pago':
        return 'Pago';
      case 'pendente':
        return 'Pendente';
      case 'vencido':
        return 'Vencido';
      case 'confirmado':
        return 'Aguardando Validação';
      default:
        return status || 'Desconhecido';
    }
  };

  const isVencido = (dataVencimento: string) => {
    return new Date(dataVencimento) < new Date() && !['pago', 'confirmado'].includes(pagamentos.find(p => p.dataVencimento === dataVencimento)?.status?.toLowerCase() || '');
  };

  if (loading) return <p className="text-blue-700">Carregando pagamentos...</p>;

  return (
    <div>
      <h2 className="text-blue-900 mb-6 text-2xl font-semibold">Meus Pagamentos</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {pagamentos.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-700">Você não possui pagamentos registrados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pagamentos.map(pagamento => (
            <div key={pagamento.id} className="bg-white border rounded-lg p-6 shadow-sm border-blue-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-blue-900 text-lg font-semibold mb-2">
                    Pagamento #{pagamento.id}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-blue-700">
                      <strong>Propriedade:</strong> {pagamento.propriedade.tipo} {pagamento.propriedade.numero} - {pagamento.propriedade.tipologia}
                    </p>
                    <p className="text-blue-700">
                      <strong>Condomínio:</strong> {pagamento.propriedade.condominioNome}
                    </p>
                    <p className="text-blue-700">
                      <strong>Bloco:</strong> {pagamento.propriedade.blocoNome}
                    </p>
                    <p className="text-blue-700">
                      <strong>Descrição:</strong> {pagamento.descricao || 'Quota mensal'}
                    </p>
                    <p className="text-blue-700">
                      <strong>Valor:</strong> {pagamento.valor?.toLocaleString()} AOA
                    </p>
                    <p className="text-blue-700">
                      <strong>Vencimento:</strong> {new Date(pagamento.dataVencimento).toLocaleDateString('pt-AO')}
                    </p>
                    {pagamento.dataPagamento && (
                      <p className="text-blue-700">
                        <strong>Data de Pagamento:</strong> {new Date(pagamento.dataPagamento).toLocaleDateString('pt-AO')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(pagamento.status)}`}>
                    {getStatusText(pagamento.status)}
                  </span>
                  {isVencido(pagamento.dataVencimento) && (
                    <span className="px-3 py-1 rounded text-sm font-medium bg-red-100 text-red-800">
                      Vencido
                    </span>
                  )}
                </div>
              </div>

              {/* Área de upload e confirmação de pagamento */}
              {pagamento.status?.toLowerCase() === 'pendente' && (
                <div className="border-t border-blue-200 pt-4 mt-4">
                  <h4 className="text-blue-900 font-medium mb-3">Confirmar Pagamento</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-blue-900 block mb-1 text-sm">
                        Comprovativo de Pagamento:
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileSelect(pagamento.id, file);
                          }
                        }}
                        className="w-full text-black p-2 border rounded border-blue-300 text-sm"
                      />
                      <p className="text-blue-600 text-xs mt-1">
                        Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
                      </p>
                    </div>
                    
                    {uploadingPayment === pagamento.id && selectedFile && (
                      <div className="flex items-center justify-between bg-blue-50 p-3 rounded border">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-200 rounded"></div>
                          <span className="text-blue-800 text-sm">{selectedFile.name}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setUploadingPayment(null);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Remover
                        </button>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleConfirmarPagamento(pagamento.id)}
                      disabled={confirmingPayment === pagamento.id || (uploadingPayment === pagamento.id && !selectedFile)}
                      className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors disabled:opacity-50 text-sm"
                    >
                      {confirmingPayment === pagamento.id 
                        ? 'Confirmando...' 
                        : 'Confirmar Pagamento'
                      }
                    </button>
                  </div>
                </div>
              )}

              {/* Informações adicionais para pagamentos confirmados/pagos */}
              {['confirmado', 'pago'].includes(pagamento.status?.toLowerCase()) && pagamento.comprovanteUrl && (
                <div className="border-t border-blue-200 pt-4 mt-4">
                  <p className="text-blue-700 text-sm">
                    <strong>Comprovativo:</strong> 
                    <a 
                      href={pagamento.comprovanteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline ml-1"
                    >
                      Ver documento
                    </a>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-blue-900 font-medium mb-2">Informações Importantes:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Certifique-se de que o comprovativo está legível e completo</li>
          <li>• Pagamentos vencidos podem estar sujeitos a multas</li>
          <li>• Em caso de dúvidas, entre em contato com a administração</li>
        </ul>
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