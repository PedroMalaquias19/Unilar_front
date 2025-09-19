'use client';
import { useState } from 'react';
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

function MoradorForm() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [NIF, setNIF] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState('PROPRIETARIO');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Adicione integração com API aqui
    const payload = { nome, sobrenome, email, password, NIF, telefone, tipo };
    console.log('Cadastrar morador:', payload);
  };

  return (
    <div className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Novo Morador</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Sobrenome:</label>
          <input
            type="text"
            value={sobrenome}
            onChange={e => setSobrenome(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">NIF:</label>
          <input
            type="text"
            value={NIF}
            onChange={e => setNIF(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Telefone:</label>
          <input
            type="text"
            value={telefone}
            onChange={e => setTelefone(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-amber-900 block mb-1">Tipo:</label>
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="w-full p-2 border rounded border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-900"
            required
          >
            <option value="PROPRIETARIO">Proprietário</option>
            <option value="ARRENDATARIO">Arrendatário</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}

function MoradorList() {
  // Adicione integração com API para buscar moradores
  const moradores = [
    { id: 1, nome: 'Ana', sobrenome: 'Costa', email: 'ana@email.com', NIF: '123456789', telefone: '912345678', tipo: 'PROPRIETARIO' }
  ];

  return (
    <div>
      <h2 className="text-amber-900 mb-4 text-xl font-semibold">Moradores Cadastrados</h2>
      {moradores.map(morador => (
        <div key={morador.id} className="bg-white border rounded-lg p-6 mb-4 shadow-sm border-amber-300">
          <h3 className="text-amber-900 text-lg font-semibold">{morador.nome} {morador.sobrenome}</h3>
          <p className="text-amber-700">Email: {morador.email}</p>
          <p className="text-amber-700">NIF: {morador.NIF}</p>
          <p className="text-amber-700">Telefone: {morador.telefone}</p>
          <p className="text-amber-700">Tipo: {morador.tipo}</p>
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
  return (
    <div className="flex min-h-screen bg-white">
        <SindicoSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-amber-900 text-3xl font-bold mb-8">Gerir Moradores</h1>
        <MoradorForm />
        <div className="mt-8">
          <MoradorList />
        </div>
      </main>
    </div>
  );
}