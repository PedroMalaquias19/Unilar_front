'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      if (data.user?.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (data.user?.role === 'sindico') {
        router.push('/dashboard/sindico');
      } else if (data.user?.role === 'morador') {
        router.push('/dashboard/morador');
      } else {
        setError('Tipo de usuário desconhecido');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-md p-8 flex flex-col">
      <h1 className="text-3xl font-bold text-amber-900 mb-2 text-center">Iniciar Sessão</h1>
      <p className="text-amber-700 text-center mb-6">Acesse sua conta para continuar</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-amber-900 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="exemplo@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900 placeholder-gray-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-900 mb-1">
            Senha
          </label>
          <input
            type="password"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900 placeholder-gray-500"
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-amber-700 text-white py-2 px-4 rounded-md hover:bg-amber-800 transition-colors font-semibold"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <div className="flex items-center my-2">
          <div className="flex-grow border-t border-amber-300" />
          <span className="mx-2 text-amber-600 text-sm">ou</span>
          <div className="flex-grow border-t border-amber-300" />
        </div>
        <button
          type="button"
          className="w-full border border-amber-300 text-amber-900 py-2 px-4 rounded-md hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
        >
          <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
            G
          </div>
          Entrar com Google
        </button>
        <div className="mt-4 text-center space-y-2">
          <button className="text-sm text-amber-700 hover:text-amber-900 hover:underline">
            Esqueci minha senha
          </button>
        </div>
      </form>
    </div>
  );
}