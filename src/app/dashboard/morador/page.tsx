'use client';
import { useState } from 'react';

function Moradias() {
  // Aqui você pode buscar as moradias do usuário via API
  return (
    <div>
      <h2 className="text-amber-900 text-xl font-semibold mb-2">Minhas Moradias</h2>
      <p>Lista de moradias vinculadas ao seu perfil.</p>
      {/* Renderize a lista de moradias aqui */}
    </div>
  );
}

function Pagamentos() {
  // Aqui você pode listar boletos, status e permitir pagamento
  return (
    <div>
      <h2 className="text-amber-900 text-xl font-semibold mb-2">Pagamentos</h2>
      <p>Visualize e realize pagamentos das suas moradias.</p>
      {/* Renderize os pagamentos e opções de pagamento aqui */}
    </div>
  );
}

function EditarPerfil() {
  // Aqui você pode permitir edição dos dados do usuário
  return (
    <div>
      <h2 className="text-amber-900 text-xl font-semibold mb-2">Editar Perfil</h2>
      <p>Atualize seus dados pessoais.</p>
      {/* Formulário para editar perfil */}
    </div>
  );
}

export default function MoradorDashboard() {
  const [menu, setMenu] = useState<'moradias' | 'pagamentos' | 'perfil'>('moradias');

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 bg-amber-100 p-6 flex flex-col gap-4">
        <button
          className={`text-amber-900 font-semibold py-2 px-4 rounded ${menu === 'moradias' ? 'bg-amber-300' : ''}`}
          onClick={() => setMenu('moradias')}
        >
          Minhas Moradias
        </button>
        <button
          className={`text-amber-900 font-semibold py-2 px-4 rounded ${menu === 'pagamentos' ? 'bg-amber-300' : ''}`}
          onClick={() => setMenu('pagamentos')}
        >
          Pagamentos
        </button>
        <button
          className={`text-amber-900 font-semibold py-2 px-4 rounded ${menu === 'perfil' ? 'bg-amber-300' : ''}`}
          onClick={() => setMenu('perfil')}
        >
          Editar Perfil
        </button>
      </aside>
      <main className="flex-1 p-8">
        {menu === 'moradias' && <Moradias />}
        {menu === 'pagamentos' && <Pagamentos />}
        {menu === 'perfil' && <EditarPerfil />}
      </main>
    </div>
  );
}