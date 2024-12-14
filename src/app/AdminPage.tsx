"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { userRoleStore } from './zustand/store';



interface AuthRequiredPageProps {
  children: React.ReactNode;
}

const AdminPage = ({ children }: AuthRequiredPageProps) => {
  const {isAdmin} = userRoleStore();
  const router = useRouter();

  useEffect(() => {
    if (isAdmin !== "admin") router.push('/error');
  }, [isAdmin, router]);

  return <>{children}</>;
};

export default AdminPage;