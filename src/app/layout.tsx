'use client';

import React, { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserData } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import ImageGenerator from '@/components/generators/ImageGenerator';
import VideoGenerator from '@/components/generators/VideoGenerator';
import AuthForm from '@/components/auth/AuthForm';
import HomePage from './page';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { 
    user, 
    setUser, 
    isAuthenticated, 
    setAuthenticated, 
    currentPage, 
    sidebarOpen,
    loading,
    setLoading 
  } = useStore();
  
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          const userData = await getUserData(firebaseUser.uid);
          if (userData) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || userData.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              tokens: userData.tokens || 0,
              plan: userData.plan || 'free',
              isAdmin: userData.isAdmin || false,
            });
            setAuthenticated(true);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setAuthenticated(false);
      }
      
      setLoading(false);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, [setUser, setAuthenticated, setLoading]);

  // Initialize Google Analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(...args: any[]) {
          (window as any).dataLayer.push(args);
        }
        gtag('js', new Date());
        gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
      };
    }
  }, []);

  if (initializing) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Fusion AI 2.0</h1>
              <p className="text-gray-400">Initializing...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  if (!isAuthenticated) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <AuthForm />
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#374151',
                color: '#fff',
                border: '1px solid #4B5563',
              },
            }}
          />
        </body>
      </html>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'chat':
        return <ChatInterface />;
      case 'image':
        return <ImageGenerator />;
      case 'video':
        return <VideoGenerator />;
      case 'audio':
        return <div className="p-6 text-white">Audio Generator - Coming Soon</div>;
      case 'code':
        return <div className="p-6 text-white">Code Generator - Coming Soon</div>;
      case 'documents':
        return <div className="p-6 text-white">Document Generator - Coming Soon</div>;
      case 'face-swap':
        return <div className="p-6 text-white">Face Swap - Coming Soon</div>;
      case 'content':
        return <div className="p-6 text-white">Content Creator - Coming Soon</div>;
      case 'blog':
        return <div className="p-6 text-white">Blog Generator - Coming Soon</div>;
      case 'profile':
        return <div className="p-6 text-white">Profile Settings - Coming Soon</div>;
      case 'billing':
        return <div className="p-6 text-white">Billing & Subscriptions - Coming Soon</div>;
      case 'admin-dashboard':
        return <div className="p-6 text-white">Admin Dashboard - Coming Soon</div>;
      case 'admin-users':
        return <div className="p-6 text-white">User Management - Coming Soon</div>;
      case 'admin-settings':
        return <div className="p-6 text-white">Admin Settings - Coming Soon</div>;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-900">
          <Sidebar />
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
            {renderCurrentPage()}
          </main>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#374151',
              color: '#fff',
              border: '1px solid #4B5563',
            },
          }}
        />
      </body>
    </html>
  );
}