// components/AuthGuard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/lib/axios';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');

            if (!token) {
                router.push('/admin/login');
                return;
            }

            try {
                // Verify token dengan backend
                const response = await axiosInstance.get('/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('auth_token');
                    router.push('/admin/login');
                }
            } catch (error) {
                localStorage.removeItem('auth_token');
                router.push('/admin/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : null;
}