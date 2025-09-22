'use client';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import Link from 'next/link';

// Sidebar exclusivo para o síndico
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

function DespesaForm({ condominioId, onDespesaAdded }: { condominioId: number, onDespesaAdded: () => void }) {
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState(0);
  const [montante, setMontante] = useState(0);
  const [dataPagamento, setDataPagamento] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [categorias, setCategorias] = useState<any[]>([]);

  // Buscar categorias do condomínio
  useEffect(() => {
    const fetchCategorias = async () => {
      if (!condominioId) return;
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get(`/api/v1/categorias/condominio/${condominioId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategorias(response.data);
        // Resetar categoria selecionada quando mudar de condomínio
        setCategoriaId(0);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, [condominioId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (categoriaId === 0) {
      setError('Por favor, selecione uma categoria.');
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      await api.post('/api/v1/despesas', {
        descricao,
        categoriaId,
        condominioId,
        montante,
        dataPagamento,
        dataVencimento,
        fornecedor,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccess('Despesa cadastrada com sucesso!');
      
      // Limpar formulário
      setDescricao('');
      setCategoriaId(0);
      setMontante(0);
      setDataPagamento('');
      setDataVencimento('');
      setFornecedor('');
      
      onDespesaAdded();
    } catch (err: any) {
      console.error('Erro ao cadastrar despesa:', err);
      setError(err?.response?.data?.message || 'Erro ao cadastrar despesa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Nova Despesa</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="text-amber-900 block mb-1">Descrição:</label>
            <input
              type="text"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              className="w-full text-black p-2 border rounded border-amber-300"
              placeholder="Descrição da despesa"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="text-amber-900 block mb-1">Categoria:</label>
            <select
              value={categoriaId}
              onChange={e => setCategoriaId(Number(e.target.value))}
              className="w-full text-black p-2 border rounded border-amber-300"
              required
            >
              <option value={0}>Selecione uma categoria</option>
              {categorias.map(cat => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="text-amber-900 block mb-1">Montante (AOA):</label>
            <input
              type="number"
              value={montante}
              onChange={e => setMontante(Number(e.target.value))}
              className="w-full text-black p-2 border rounded border-amber-300"
              placeholder="0.00"
              required
              min={0}
              step="0.01"
            />
          </div>

          <div className="mb-4">
            <label className="text-amber-900 block mb-1">Fornecedor:</label>
            <input
              type="text"
              value={fornecedor}
              onChange={e => setFornecedor(e.target.value)}
              className="w-full text-black p-2 border rounded border-amber-300"
              placeholder="Nome do fornecedor"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="text-amber-900 block mb-1">Data de Pagamento:</label>
            <input
              type="date"
              value={dataPagamento}
              onChange={e => setDataPagamento(e.target.value)}
              className="w-full text-black p-2 border rounded border-amber-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="text-amber-900 block mb-1">Data de Vencimento:</label>
            <input
              type="date"
              value={dataVencimento}
              onChange={e => setDataVencimento(e.target.value)}
              className="w-full text-black p-2 border rounded border-amber-300"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || categorias.length === 0}
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Despesa'}
        </button>
        
        {categorias.length === 0 && condominioId > 0 && (
          <p className="text-amber-600 text-sm mt-2">
            Nenhuma categoria encontrada para este condomínio.
          </p>
        )}
        
        {success && <p className="text-green-600 mt-4">{success}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
    </div>
  );
}

function DespesaList({ condominioId, reload }: { condominioId: number, reload: boolean }) {
  const [despesas, setDespesas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Buscar categorias para mapeamento
  useEffect(() => {
    const fetchCategorias = async () => {
      if (!condominioId) return;
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get(`/api/v1/categorias/condominio/${condominioId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategorias(response.data);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, [condominioId]);

  // Buscar despesas
  useEffect(() => {
    const fetchDespesas = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get(`/api/v1/despesas/condominio/${condominioId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Ordenar despesas por data de vencimento (mais recentes primeiro)
        const despesasOrdenadas = response.data.sort((a: any, b: any) => 
          new Date(b.dataVencimento).getTime() - new Date(a.dataVencimento).getTime()
        );
        
        setDespesas(despesasOrdenadas);
      } catch (err: any) {
        console.error('Erro ao buscar despesas:', err);
        setError('Erro ao buscar despesas.');
        setDespesas([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (condominioId) fetchDespesas();
  }, [condominioId, reload]);

  const getCategoriaNome = (categoriaId: number) => {
    const categoria = categorias.find(c => c.idCategoria === categoriaId);
    return categoria ? categoria.nome : `Categoria ${categoriaId}`;
  };

  const getStatusColor = (estado: string) => {
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const formatMontante = (montante: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 2
    }).format(montante);
  };

  return (
    <div>
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Despesas do Condomínio</h2>
      
      {loading && <p className="text-amber-700">Carregando despesas...</p>}
      {error && <p className="text-red-600">{error}</p>}
      
      {despesas.length === 0 && !loading && !error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <p className="text-amber-700">Nenhuma despesa encontrada para este condomínio.</p>
        </div>
      )}
      
      {despesas.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {despesas.map(despesa => (
              <div key={despesa.idDespesa} className="bg-white border rounded-lg p-6 shadow-sm border-amber-300">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-amber-900 text-lg font-semibold line-clamp-2">
                    {despesa.descricao}
                  </h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-700"><strong>Categoria:</strong></span>
                    <span className="text-amber-800">{getCategoriaNome(despesa.categoriaId)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-amber-700"><strong>Montante:</strong></span>
                    <span className="text-amber-900 font-semibold">{formatMontante(despesa.montante)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-amber-700"><strong>Fornecedor:</strong></span>
                    <span className="text-amber-800">{despesa.fornecedor}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-amber-700"><strong>Pagamento:</strong></span>
                    <span className="text-amber-800">{formatDate(despesa.dataPagamento)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-amber-700"><strong>Vencimento:</strong></span>
                    <span className="text-amber-800">{formatDate(despesa.dataVencimento)}</span>
                  </div>
                  
                  {despesa.factura && (
                    <div className="flex justify-between">
                      <span className="text-amber-700"><strong>Fatura:</strong></span>
                      <span className="text-amber-800 truncate">{despesa.factura}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-3 border-t border-amber-200 flex gap-2">
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
          
          {/* Resumo das despesas */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <h3 className="text-amber-900 font-semibold mb-2">Resumo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-amber-700">Total de Despesas</p>
                <p className="text-amber-900 font-semibold text-lg">{despesas.length}</p>
              </div>
              <div className="text-center">
                <p className="text-amber-700">Valor Total</p>
                <p className="text-amber-900 font-semibold text-lg">
                  {formatMontante(despesas.reduce((acc, d) => acc + d.montante, 0))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-amber-700">Pendentes</p>
                <p className="text-amber-900 font-semibold text-lg">
                  {despesas.filter(d => d.estado === 'PENDENTE').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SelectCondominio({ onChange }: { onChange: (id: number) => void }) {
  const [condominios, setCondominios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCondominios = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get('/api/v1/condominios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCondominios(response.data);
      } catch (err) {
        console.error('Erro ao buscar condomínios:', err);
        setError('Erro ao carregar condomínios.');
        setCondominios([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCondominios();
  }, []);

  return (
    <div className="mb-6">
      <label className="text-amber-900 block mb-2 text-lg font-semibold">Selecione o Condomínio:</label>
      <select
        onChange={e => onChange(Number(e.target.value))}
        className="w-full max-w-md text-black p-3 border rounded border-amber-300 bg-white"
        required
      >
        <option value={0}>Selecione um condomínio</option>
        {condominios.map(cond => (
          <option key={cond.id} value={cond.id}>
            {cond.nome}
          </option>
        ))}
      </select>
      {loading && <p className="text-amber-700 mt-2">Carregando condomínios...</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}

export default function DespesasPage() {
  const [condominioId, setCondominioId] = useState(0);
  const [reload, setReload] = useState(false);

  const handleDespesaAdded = () => setReload(r => !r);

  return (
    <div className="flex min-h-screen bg-white">
      <SindicoSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-amber-900 text-3xl font-bold mb-8">Gerir Despesas</h1>
        
        <SelectCondominio onChange={setCondominioId} />
        
        {condominioId > 0 && (
          <>
            <DespesaForm condominioId={condominioId} onDespesaAdded={handleDespesaAdded} />
            <div className="mt-8">
              <DespesaList condominioId={condominioId} reload={reload} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}