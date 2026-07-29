import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      await authService.login(email, password);
      router.push('/admin');
    } catch {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
