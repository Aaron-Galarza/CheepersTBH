import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    authService.logout();
    router.push('/login');
  };

  return { logout };
}
