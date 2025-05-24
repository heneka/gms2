'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [currentUrl, setCurrentUrl] = useState('Loading...');
  const { login } = useAuth();
  const router = useRouter();

  // Fix hydration issue by getting current URL only on client side
  useEffect(() => {
    setCurrentUrl(window.location.href);
    // Clear any existing auth data to prevent loops
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }, []);

  const demoAccounts = [
    { role: 'ÖĞRENCİ', email: 'student@iyte.edu.tr', name: 'Ahmet Yılmaz' },
    { role: 'DANIŞMAN', email: 'advisor@iyte.edu.tr', name: 'Prof. Dr. Mehmet Kaya' },
    { role: 'SEKRETERLİK', email: 'secretary@iyte.edu.tr', name: 'Ayşe Demir' },
    { role: 'DEKANLIK', email: 'dean@iyte.edu.tr', name: 'Prof. Dr. Ali Özkan' },
    { role: 'ÖĞRENCİ İŞLERİ', email: 'studentaffairs@iyte.edu.tr', name: 'Fatma Şahin' }
  ];

  const API_BASE = 'http://localhost:5000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDebugInfo('');

    const apiUrl = `${API_BASE}/api/auth/login`;
    const requestData = { email, password };

    try {
      setDebugInfo(`İstek gönderiliyor: ${apiUrl}`);
      console.log('Making API request to:', apiUrl);
      console.log('Request data:', requestData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      setDebugInfo(`Yanıt alındı: ${response.status} ${response.statusText}`);
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      setDebugInfo(`Veri alındı: ${JSON.stringify(data)}`);

      if (data.success) {
        setDebugInfo('Login başarılı, token ve user kaydediliyor...');
        await login(data.token, data.user);
        setDebugInfo('Token kaydedildi, dashboard\'a yönlendiriliyor...');
        console.log('About to redirect to dashboard');
        
        // Use window.location instead of router.push to avoid potential loops
        window.location.href = '/dashboard';
        setDebugInfo('window.location.href set to /dashboard');
      } else {
        setError(data.message || 'Giriş başarısız');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(`Bağlantı hatası: ${errorMessage}`);
      setDebugInfo(`Hata: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (email: string) => {
    setEmail(email);
    setPassword('123456');
    setError('');
    setDebugInfo('');
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    setDebugInfo('localStorage temizlendi');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img className="h-12 w-auto" src="/iyte-logo.svg" alt="IYTE Logo" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          IYTE Mezuniyet Yönetim Sistemi
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hesabınızla giriş yapın
        </p>
        
        {/* Debug Info */}
        <div className="mt-4 p-3 bg-gray-100 text-xs text-gray-600 rounded">
          <strong>Debug:</strong> API Base: {API_BASE}<br/>
          Current URL: {currentUrl}<br/>
          {debugInfo && <span className="text-blue-600">{debugInfo}</span>}
          <br/>
          <button 
            onClick={clearLocalStorage}
            className="mt-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
          >
            LocalStorage Temizle
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta Adresi
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="ornek@iyte.edu.tr"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Hesaplar</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleDemoLogin(account.email)}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="text-xs">
                    <div className="font-medium text-gray-900">{account.role}</div>
                    <div className="text-gray-500">{account.name}</div>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500 text-center">
              Demo hesaplar için şifre: <strong>123456</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 