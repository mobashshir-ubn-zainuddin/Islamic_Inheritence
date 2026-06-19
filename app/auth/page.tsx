'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { AuthForm } from '../components/AuthForm';

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-gray-100 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--primary)] mb-2">Islamic Inheritance</h1>
          <p className="text-gray-600">Calculator & Fatwa Reference</p>
        </div>

        {/* Auth Form */}
        <AuthForm
          mode={mode}
          onSuccess={() => router.push('/')}
        />

        {/* Mode Toggle */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-[var(--primary)] font-medium hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
