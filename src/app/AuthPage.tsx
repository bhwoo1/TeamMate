"use client"

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


interface AuthRequiredPageProps {
  children: React.ReactNode;
}

const AuthPage = ({ children }: AuthRequiredPageProps) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status != 'authenticated') router.push('/login');
  }, [status, router]);

  return <>{children}</>;
};

export default AuthPage;