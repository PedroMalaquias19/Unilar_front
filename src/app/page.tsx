import LoginForm from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg_fundo.jpeg')",
      }}
    >
      <LoginForm />
    </div>
  );
}