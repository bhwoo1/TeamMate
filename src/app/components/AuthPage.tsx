"use client"

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


interface AuthRequiredPageProps {
  children: React.ReactNode;
}

const AuthPage = ({ children }: AuthRequiredPageProps) => {
  const {data: session} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push('/login');
  }, [session, router]);

  return <>{children}</>;
};

export default AuthPage;