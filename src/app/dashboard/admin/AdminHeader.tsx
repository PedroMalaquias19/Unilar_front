// AdminHeader.js
export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-amber-300 px-8 py-4 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-amber-900">Dashboard do Administrador</h1>
      <span className="bg-amber-200 text-amber-900 px-4 py-1 rounded font-semibold">
        Admin
      </span>
    </header>
  );
}