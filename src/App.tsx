import React, { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './components/LandingPage';
import { ThemeMode } from './types';

// Code-split / Lazy-loaded components for optimal initial landing bundle
const TacticalDashboard = React.lazy(() => import('./components/TacticalDashboard').then(m => ({ default: m.TacticalDashboard })));
const AuthModal = React.lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));
const AuthPage = React.lazy(() => import('./components/AuthPage').then(m => ({ default: m.AuthPage })));
const StatusDiag = React.lazy(() => import('./pages/StatusDiag').then(m => ({ default: m.StatusDiag })));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService').then(m => ({ default: m.TermsOfService })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export const App: React.FC = () => {
  // Routing State: '/' for Landing Page, '/dashboard' for live map
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  const [theme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('manvis_theme_mode') as ThemeMode) || 'dark';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Canonical casing & duplicate redirects
  useEffect(() => {
    if (window.location.pathname === '/Dashboard') {
      window.history.replaceState({}, '', '/dashboard');
      setCurrentPath('/dashboard');
    }
    if (window.location.pathname.toLowerCase() === '/methodology') {
      window.history.replaceState({}, '', '/about');
      setCurrentPath('/about');
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isDashboard = currentPath.toLowerCase().startsWith('/dashboard');
  const isAuthPage = ['/login', '/signin', '/signup', '/auth'].includes(currentPath.toLowerCase());

  // Mark /login and /signup as noindex, follow without blocking in robots.txt
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (isAuthPage) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, follow');
    } else if (robotsMeta) {
      robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }
  }, [isAuthPage]);

  // Handle OAuth redirect callback (Google / GitHub)
  useEffect(() => {
    if (currentPath.toLowerCase().startsWith('/auth/callback')) {
      const timer = setTimeout(() => {
        window.history.replaceState({}, '', '/dashboard');
        setCurrentPath('/dashboard');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentPath]);

  const handleLaunchDashboard = useCallback(() => {
    window.history.pushState({}, '', '/dashboard');
    setCurrentPath('/dashboard');
    window.scrollTo(0, 0);
  }, []);

  const handleNavigateHome = useCallback(() => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
    window.scrollTo(0, 0);
  }, []);

  const handleNavigateLogin = useCallback((mode: 'signin' | 'signup' = 'signin') => {
    const target = mode === 'signup' ? '/signup' : '/login';
    window.history.pushState({}, '', target);
    setCurrentPath(target);
    window.scrollTo(0, 0);
  }, []);

  const handleOpenAuth = useCallback((mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const pageFallback = (
    <div className="w-full min-h-screen bg-[#06090e] flex items-center justify-center font-mono text-xs text-sky-400">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-sky-400/20 border-t-sky-400 animate-spin" />
        <span>LOADING SECTOR MODULE...</span>
      </div>
    </div>
  );

  const dashboardFallback = (
    <div className="w-full h-full min-h-screen bg-[#06090e] flex items-center justify-center font-mono text-xs text-sky-400">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-sky-400/20 border-t-sky-400 animate-spin" />
        <span>INITIALIZING TACTICAL VECTOR TILES & TELEMETRY...</span>
      </div>
    </div>
  );

  if (isAuthPage) {
    return (
      <React.Suspense fallback={pageFallback}>
        <AuthPage
          initialMode={currentPath.toLowerCase() === '/signup' ? 'signup' : 'signin'}
          onNavigateHome={handleNavigateHome}
          onNavigateDashboard={handleLaunchDashboard}
        />
      </React.Suspense>
    );
  }

  if (currentPath.toLowerCase() === '/privacy' || currentPath.toLowerCase() === '/privacy-policy') {
    return (
      <React.Suspense fallback={pageFallback}>
        <PrivacyPolicy
          onNavigateHome={handleNavigateHome}
          onNavigateDashboard={handleLaunchDashboard}
        />
      </React.Suspense>
    );
  }

  if (currentPath.toLowerCase() === '/terms' || currentPath.toLowerCase() === '/terms-of-service') {
    return (
      <React.Suspense fallback={pageFallback}>
        <TermsOfService
          onNavigateHome={handleNavigateHome}
          onNavigateDashboard={handleLaunchDashboard}
        />
      </React.Suspense>
    );
  }

  if (currentPath.toLowerCase() === '/status') {
    return (
      <React.Suspense fallback={pageFallback}>
        <StatusDiag
          onNavigateHome={handleNavigateHome}
          onNavigateDashboard={handleLaunchDashboard}
          theme={theme}
        />
      </React.Suspense>
    );
  }

  if (currentPath.toLowerCase() === '/about' || currentPath.toLowerCase() === '/methodology') {
    return (
      <React.Suspense fallback={pageFallback}>
        <AboutPage
          onNavigateHome={handleNavigateHome}
          onNavigateDashboard={handleLaunchDashboard}
        />
      </React.Suspense>
    );
  }

  const isHome = currentPath === '/' || currentPath === '';
  if (!isDashboard && !isHome) {
    return (
      <React.Suspense fallback={pageFallback}>
        <NotFoundPage
          onNavigateHome={handleNavigateHome}
          onNavigateDashboard={handleLaunchDashboard}
        />
      </React.Suspense>
    );
  }

  if (!isDashboard) {
    return (
      <div className="w-full min-h-screen overflow-y-auto bg-[#06090e]">
        <LandingPage
          onLaunchDashboard={handleLaunchDashboard}
          onOpenAuthModal={() => handleOpenAuth('signin')}
          onNavigateLogin={() => handleNavigateLogin('signin')}
        />
        <React.Suspense fallback={null}>
          {isAuthModalOpen && (
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              defaultMode={authModalMode}
            />
          )}
        </React.Suspense>
      </div>
    );
  }

  return (
    <React.Suspense fallback={dashboardFallback}>
      <TacticalDashboard
        onNavigateHome={handleNavigateHome}
        onNavigateLogin={handleNavigateLogin}
      />
    </React.Suspense>
  );
};

export default App;
