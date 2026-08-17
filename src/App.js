import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import './App.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Calciatori from './pages/Calciatori';
import AstaLive from './pages/AstaLive';
import RisultatiAsta from './pages/RisultatiAsta';
import RosaPassata from './pages/RosaPassata';
import Preferiti from './pages/Preferiti';
import TutteLeRose from './pages/TutteLeRose';
import Classifica from './pages/Classifica';
import AdminPanel from './pages/AdminPanel';
import RandomPlayerWheel from './pages/RandomPlayerWheel';
import Login from './pages/Login';
import Register from './pages/Register';
import DealerSelection from './pages/DealerSelection';

const theme = {
  colors: {
    primary: '#059669',
    primaryDark: '#047857',
    secondary: '#FBBF24',
    accent2: '#6366F1',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#0A0E14',
    surface: '#141B26',
    surfaceHover: '#1C2534',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#243044',
    gradient: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
    gradientHover: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
    roles: {
      P: '#F59E0B',
      D: '#22C55E',
      C: '#3B82F6',
      A: '#EF4444',
      default: '#94A3B8'
    },
    podium: {
      gold: '#FBBF24',
      goldDark: '#D97706',
      silver: '#CBD5E1',
      silverDark: '#94A3B8',
      bronze: '#F97316',
      bronzeDark: '#C2410C'
    }
  },
  shadows: {
    small: '0 2px 6px rgba(0,0,0,0.28)',
    medium: '0 8px 24px rgba(0,0,0,0.32)',
    large: '0 20px 48px rgba(0,0,0,0.4)',
    glow: '0 0 0 1px rgba(5, 150, 105, 0.4), 0 0 32px rgba(5, 150, 105, 0.45)'
  },
  borderRadius: '18px',
  radius: {
    sm: '10px',
    md: '18px',
    lg: '28px',
    pill: '999px'
  },
  fonts: {
    heading: "'Sora', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    large: '1200px'
  }
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    width: 100%;
    height: 100%;
    font-size: 16px;
    scrollbar-gutter: stable;

    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: 15px;
    }

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: 14px;
    }

    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${props => props.theme.fonts.body};
    background:
      radial-gradient(ellipse 900px 600px at 12% -10%, rgba(5, 150, 105, 0.16) 0%, transparent 55%),
      radial-gradient(ellipse 700px 500px at 105% 15%, rgba(99, 102, 241, 0.14) 0%, transparent 55%),
      radial-gradient(ellipse 800px 600px at 50% 120%, rgba(251, 191, 36, 0.07) 0%, transparent 60%),
      ${props => props.theme.colors.background};
    background-attachment: fixed;
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.heading};
    letter-spacing: -0.02em;
    font-weight: 700;
  }

  #root {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  ::-webkit-scrollbar {
    width: 8px;

    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      width: 4px;
    }
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: transparent;
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  
  margin-left: ${props => props.$sidebarOpen ? '280px' : '60px'};

  @media (min-width: 481px) {
    margin-left: ${props => props.$sidebarOpen ? '280px' : '65px'};
  }
  
  @media (min-width: 769px) {
    margin-left: ${props => props.$sidebarOpen ? '280px' : '70px'};
  }
  
  @media (min-width: 1025px) {
    margin-left: ${props => props.$sidebarOpen ? '280px' : '80px'};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 1024px) {
    padding: ${props => props.theme.spacing.md};
  }

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.sm};
    padding-left: ${props => props.theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm};
    padding-left: ${props => props.theme.spacing.md};
  }
`;

const SidebarOverlay = styled.div`
  display: none;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: ${props => props.$visible ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 199;
    cursor: pointer;
  }
`;

function AppContent() {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = React.useState(() => {
    return window.innerWidth > 1024;
  });

  React.useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth > 1024;
      
      if (!isDesktop && sidebarOpen) {
        setSidebarOpen(false);
      } else if (isDesktop && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  React.useEffect(() => {
    if (window.innerWidth <= 1024 && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const toggleSidebar = React.useCallback((value) => {
    if (typeof value === 'boolean') {
      setSidebarOpen(value);
    } else {
      setSidebarOpen(prev => !prev);
    }
  }, []);

  const handleOverlayClick = React.useCallback(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <AuthProvider>
      <AppContainer>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme.colors.surface,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius,
              fontSize: '0.9rem',
              maxWidth: '90vw',
            },
            success: {
              iconTheme: {
                primary: theme.colors.success,
                secondary: theme.colors.text,
              },
            },
            error: {
              iconTheme: {
                primary: theme.colors.error,
                secondary: theme.colors.text,
              },
            },
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
                  <SidebarOverlay $visible={sidebarOpen} onClick={handleOverlayClick} />
                  <MainContent $sidebarOpen={sidebarOpen}>
                    <Header 
                      onToggleSidebar={toggleSidebar} 
                      sidebarOpen={sidebarOpen} 
                    />
                    <ContentArea>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/calciatori" element={<Calciatori />} />
                        <Route path="/asta-live" element={<AstaLive />} />
                        <Route path="/risultati-asta/:id" element={<RisultatiAsta />} />
                        <Route path="/rosa-passata" element={<RosaPassata />} />
                        <Route path="/preferiti" element={<Preferiti />} />
                        <Route path="/tutte-le-rose" element={<TutteLeRose />} />
                        <Route path="/classifica" element={<Classifica />} />
                        <Route path="/giocatore-random" element={<RandomPlayerWheel />} />
                        <Route path="/dealer-selection" element={<DealerSelection />} />
                        <Route path="/admin" element={<AdminPanel />} />
                      </Routes>
                    </ContentArea>
                  </MainContent>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppContainer>
    </AuthProvider>
  );
}

function App() {
  // 🔥 FAVICON: Aggiungi questo useEffect per impostare la favicon
  React.useEffect(() => {
    const setFavicon = () => {
      const faviconSvg = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚽</text></svg>";
      
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconSvg;
    };

    setFavicon();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;