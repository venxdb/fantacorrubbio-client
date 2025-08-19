import React from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, Bell, User, LogOut, Settings, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 0 ${props => props.theme.spacing.lg};
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${props => props.theme.shadows.medium};
  
  @media (max-width: 768px) {
    padding: 0 ${props => props.theme.spacing.md};
    height: 60px;
  }
  
 
  @media (max-width: 480px) {
    padding: 0 ${props => props.theme.spacing.sm};
    height: 56px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  flex: 1;
  min-width: 0;
  
  @media (max-width: 480px) {
    gap: ${props => props.theme.spacing.sm};
  }
`;

const MenuButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradient};
  border: none;
  color: white;
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius};
  display: ${props => props.$sidebarOpen ? 'none' : 'flex'}; /* 🔥 Nascondi quando aperta */
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  min-width: 44px;
  min-height: 44px;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.medium};

  &:hover {
    background: ${props => props.theme.colors.secondary};
    transform: scale(1.05);
    box-shadow: ${props => props.theme.shadows.large};
  }

  &:active {
    transform: scale(0.95);
  }

  /* Animazione di hover per la freccia */
  &:hover svg {
    transform: translateX(2px);
  }

  svg {
    transition: transform 0.3s ease;
  }
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    gap: ${props => props.theme.spacing.xs};
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.colors.gradient};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.glow};
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
`;

const LogoText = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
  
  /* Nascondi su mobile molto piccoli */
  @media (max-width: 400px) {
    display: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    gap: ${props => props.theme.spacing.sm};
  }
  
  @media (max-width: 480px) {
    gap: ${props => props.theme.spacing.xs};
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: ${props => props.theme.spacing.sm};
  

  @media (max-width: 768px) {
    display: none;
  }
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
`;

const Credits = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
`;

const ProfileSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  @media (max-width: 480px) {
    gap: ${props => props.theme.spacing.xs};
  }
`;

const NotificationButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
  min-width: 44px;
  min-height: 44px;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.surfaceHover};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.xs};
    min-width: 40px;
    min-height: 40px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: ${props => props.theme.colors.error};
  border-radius: 50%;
  
  @media (max-width: 480px) {
    top: 6px;
    right: 6px;
    width: 6px;
    height: 6px;
  }
`;

const UserButton = styled(motion.button)`
  background: ${props => props.theme.colors.primary};
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  min-width: 44px;
  min-height: 44px;

  &:hover {
    background: ${props => props.theme.colors.secondary};
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    min-width: 42px;
    min-height: 42px;
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    min-width: 40px;
    min-height: 40px;
  }
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.large};
  padding: ${props => props.theme.spacing.sm};
  min-width: 180px;
  z-index: 1000;
  

  @media (max-width: 480px) {

    right: 0;
    left: auto;
    min-width: 200px;
    max-width: 90vw; /* Massimo 90% della larghezza viewport */
    margin-top: ${props => props.theme.spacing.xs};
    
 
    transform: translateX(0);
    box-sizing: border-box;
  }
  
  @media (max-width: 360px) {
    min-width: 180px;
    right: -${props => props.theme.spacing.xs}; /* Piccolo offset per centrare meglio */
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 0.9rem;
  transition: all 0.2s ease;
  text-align: left;
  min-height: 44px;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.secondary};
  }

  &.danger:hover {
    background: rgba(244, 67, 54, 0.1);
    color: ${props => props.theme.colors.error};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.md};
    font-size: 1rem;
    min-height: 48px;
  }
`;

const MobileUserInfo = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    padding: ${props => props.theme.spacing.md};
    border-bottom: 1px solid ${props => props.theme.colors.border};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const MobileUsername = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const MobileCredits = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const Header = ({ onToggleSidebar, sidebarOpen = false }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [notifications] = React.useState(2); // Mock notifications

  const creditiDisponibili = user ? (user.crediti_totali - user.crediti_spesi) : 0;

  const isSidebarOpen = Boolean(sidebarOpen);


  const getToggleIcon = () => {
    return <ChevronRight size={20} />;
  };

  
  const getToggleTooltip = () => {
    return "Espandi sidebar";
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  const handleMenuAction = (action) => {
    setShowUserMenu(false);
    
    switch(action) {
      case 'profile':
        
        toast.success('👤 Profilo Utente', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#2D5A87',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 10px 40px rgba(45, 90, 135, 0.3)',
          },
          iconTheme: {
            primary: '#FFD700',
            secondary: '#2D5A87',
          },
        });
        
        setTimeout(() => {
          toast('📊 Qui potrai modificare i tuoi dati, vedere statistiche e gestire preferenze personali', {
            duration: 6000,
            position: 'top-center',
            style: {
              background: '#37474F',
              color: '#E0E0E0',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              maxWidth: '400px',
            },
          });
        }, 500);
        break;
        
      case 'settings':
        
        toast.success('⚙️ Impostazioni', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#2D5A87',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 10px 40px rgba(45, 90, 135, 0.3)',
          },
          iconTheme: {
            primary: '#FFD700',
            secondary: '#2D5A87',
          },
        });
        
        setTimeout(() => {
          toast('🔧 Qui potrai cambiare password, gestire notifiche, tema scuro/chiaro e preferenze generali', {
            duration: 6000,
            position: 'top-center',
            style: {
              background: '#37474F',
              color: '#E0E0E0',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              maxWidth: '400px',
            },
          });
        }, 500);
        break;
        
      default:
        break;
    }
  };


  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('[data-user-menu]')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  return (
    <HeaderContainer>
      <LeftSection>
      
        {!isSidebarOpen && (
          <MenuButton
            $sidebarOpen={isSidebarOpen}
            onClick={onToggleSidebar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={getToggleTooltip()}
          >
            {getToggleIcon()}
          </MenuButton>
        )}

        <Logo
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogoIcon>
            <Trophy size={20} color="white" />
          </LogoIcon>
          <LogoText>FantaCorrubbio</LogoText>
        </Logo>
      </LeftSection>

      <RightSection>
        {user && (
          <UserInfo>
            <Username>{user.username}</Username>
            
          </UserInfo>
        )}

        <NotificationButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Notifiche"
        >
          <Bell size={20} />
          {notifications > 0 && <NotificationBadge />}
        </NotificationButton>

        <ProfileSection data-user-menu>
          <UserButton
            onClick={() => setShowUserMenu(!showUserMenu)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Menu Utente"
          >
            <User size={18} />
          </UserButton>

          <AnimatePresence>
            {showUserMenu && (
              <UserDropdown
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                {user && (
                  <MobileUserInfo>
                    <MobileUsername>{user.username}</MobileUsername>
                    <MobileCredits>{creditiDisponibili} crediti disponibili</MobileCredits>
                  </MobileUserInfo>
                )}
                
                <DropdownItem onClick={() => handleMenuAction('profile')}>
                  <User size={16} />
                  Profilo
                </DropdownItem>
                <DropdownItem onClick={() => handleMenuAction('settings')}>
                  <Settings size={16} />
                  Impostazioni
                </DropdownItem>
                <hr style={{ 
                  border: 'none', 
                  borderTop: `1px solid #37474F`, 
                  margin: '8px 0' 
                }} />
                <DropdownItem onClick={handleLogout} className="danger">
                  <LogOut size={16} />
                  Logout
                </DropdownItem>
              </UserDropdown>
            )}
          </AnimatePresence>
        </ProfileSection>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;