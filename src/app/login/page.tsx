'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { usePersonalStore } from '@/stores/personalStore';
import { Button, Input, Card } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const iniciarSesion = useAuthStore((s) => s.iniciarSesion);
  const personal = usePersonalStore((s) => s.personal);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setCargando(true);

    await new Promise((r) => setTimeout(r, 400)); // pequeño delay visual

    const resultado = iniciarSesion(email, password, personal);
    setCargando(false);

    if (!resultado.ok) {
      setError(resultado.error ?? 'Error al iniciar sesión');
      return;
    }

    router.push('/portal');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #F57F17 0%, #FFD600 50%, #FFF9C4 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">✝️</div>
          <h1 className="text-3xl font-extrabold" style={{ color: '#4a2c00' }}>
            Ministerio de Niños
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#78350f' }}>
            Accede con tu cuenta para ver tu panel
          </p>
        </div>

        <Card className="shadow-xl border-yellow-200">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" loading={cargando} size="lg" className="w-full mt-1">
              Ingresar
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-yellow-100">
            <p className="text-xs text-center" style={{ color: '#92400e' }}>
              ¿Primera vez? Tu contraseña son los primeros 6 caracteres de tu correo + 123
            </p>
            <p className="text-xs text-center mt-1" style={{ color: '#92400e' }}>
              Ej: si tu correo es <strong>maria@iglesia.com</strong>, tu contraseña es <strong>maria@123</strong>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
