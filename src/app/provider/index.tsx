'use client'

import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';

export const Providers = ({children}: {children:React.ReactNode})=>{
    return (
        <QueryProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </QueryProvider>
    );
}