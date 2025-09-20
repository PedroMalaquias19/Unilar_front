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
  const [contratoFile, setContratoFile] = useState<File | null>(null);
  const [contratoBase64, setContratoBase64] = useState<string>('');
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

  // Função para converter arquivo para Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setContratoFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setContratoBase64(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setContratoBase64('');
    }
  };

  // Função para fazer download do arquivo
  const downloadFile = (base64Data: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const token = localStorage.getItem('access_token');
      
      // Preparar dados do contrato
      let contratoData = null;
      if (contratoFile && contratoBase64) {
        contratoData = {
          fileName: contratoFile.name,
          fileType: contratoFile.type,
          fileSize: contratoFile.size,
          base64Data: contratoBase64
        };
      }

      const payload = {
        sindicoId: Number(sindicoId),
        condominioId: Number(condominioId),
        inicioMandato,
        fimMandato,
        salario,
        contrato: contratoData, // Enviando dados do arquivo em vez de URL
      };

      await api.post(`/api/v1/condominios/${condominioId}/mandatos`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Mandato atribuído com sucesso!');
      
      // Fazer download automático do contrato (opcional)
      if (contratoFile && contratoBase64) {
        downloadFile(contratoBase64, `contrato_mandato_${Date.now()}_${contratoFile.name}`);
      }

      // Limpar formulário
      setSindicoId(0);
      setCondominioId(0);
      setInicioMandato('');
      setFimMandato('');
      setSalario(0);
      setContratoFile(null);
      setContratoBase64('');
      
      // Limpar input de arquivo
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
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
          <label className="text-amber-900 block mb-1">Arquivo do Contrato:</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          />
          {contratoFile && (
            <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Arquivo selecionado:</strong> {contratoFile.name} ({(contratoFile.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Atribuindo...' : 'Atribuir'}
        </button>
        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
            <p className="text-green-800">{success}</p>
            <p className="text-sm text-green-600 mt-1">O arquivo do contrato foi baixado automaticamente.</p>
          </div>
        )}
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