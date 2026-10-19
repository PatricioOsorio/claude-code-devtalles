import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = {
  title: "Acceso al Sistema | Arcade Vault",
  description: "Inicia sesión o crea una cuenta para competir en Arcade Vault.",
};

export default function AuthPage() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 animate-fade-in">
      <AuthCard />
    </div>
  );
}
