import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  Gavel, 
  Trophy, 
  Star, 
  Coins, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Dice6,
  Crown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';


const SidebarContainer = styled(motion.aside)`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  transition: width 0.3s ease;
  z-index: 200;
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.theme.shadows.large};
  overflow: hidden;

 
  width: ${props => props.$isOpen ? '280px' : '60px'};
  transform: translateX(0);
  
 
  
  
  
  @media (min-width: 481px) {
    width: ${props => props.$isOpen ? '280px' : '65px'};
  }
  
  @media (min-width: 769px) {
    width: ${props => props.$isOpen ? '280px' : '70px'};
  }
  
  
  @media (min-width: 1025px) {
    width: ${props => props.$isOpen ? '280px' : '80px'};
  }
`;


const SidebarHeader = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$isOpen ? 'space-between' : 'center'};
  padding: 0 ${props => props.$isOpen ? props.theme.spacing.lg : props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
  

  @media (min-width: 769px) {
    height: 60px;
    padding: 0 ${props => props.$isOpen ? props.theme.spacing.md : props.theme.spacing.sm};
  }
  

  @media (min-width: 1025px) {
    height: 70px;
    padding: 0 ${props => props.$isOpen ? props.theme.spacing.lg : props.theme.spacing.sm};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  opacity: ${props => props.$isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  

  @media (max-width: 768px) {
    opacity: ${props => props.$isOpen ? 1 : 0};
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${props => props.theme.colors.gradient};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
  
  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

const LogoText = styled.span`
  font-weight: 700;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  
  /* Mobile: testo più piccolo */
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;


const ToggleButton = styled(motion.button)`
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
  min-width: 40px;
  min-height: 40px;
  position: relative;
  z-index: 10;
  opacity: 1 !important; /* 🔥 FIX: Sempre visibile */
  pointer-events: auto !important; /* 🔥 FIX: Sempre cliccabile */

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.surfaceHover};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }


  @media (max-width: 1024px) {
    min-width: 44px;
    min-height: 44px;
  }
  
 
  @media (min-width: 1025px) {
    min-width: 44px;
    min-height: 44px;
    
    
    ${props => !props.$isOpen && `
      background: ${props.theme.colors.primary};
      color: white;
      box-shadow: ${props.theme.shadows.medium};
      
      &:hover {
        background: ${props.theme.colors.secondary};
        transform: scale(1.15);
        box-shadow: ${props.theme.shadows.large};
      }
    `}
  }
`;


const Navigation = styled.nav`
  flex: 1;
  padding: ${props => props.theme.spacing.lg} 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  

  @media (max-width: 1024px) {
    padding: ${props => props.theme.spacing.md} 0;
  }
  

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.sm} 0;
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.xs} 0;
  }
`;

const NavSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
 
  @media (max-width: 768px) {
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const NavSectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${props => props.theme.colors.textSecondary};
  padding: 0 ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.sm};
  opacity: ${props => props.$isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
  
 
  @media (max-width: 768px) {
    padding: 0 ${props => props.theme.spacing.md};
    font-size: 0.7rem;
    opacity: ${props => props.$isOpen ? 1 : 0};
  }
  
  @media (max-width: 480px) {
    padding: 0 ${props => props.theme.spacing.sm};
    font-size: 0.65rem;
  }
`;


const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  margin: 0 ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius};
  min-height: 44px;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.surfaceHover};
  }

  &.active {
    color: ${props => props.theme.colors.secondary};
    background: rgba(255, 167, 38, 0.1);
    
    &::before {
      content: '';
      position: absolute;
      left: -${props => props.theme.spacing.sm};
      top: 0;
      bottom: 0;
      width: 3px;
      background: ${props => props.theme.colors.secondary};
      border-radius: 0 2px 2px 0;
    }
  }
  
  @media (min-width: 769px) {
    padding: ${props => props.theme.spacing.md};
    margin: 0 ${props => props.theme.spacing.xs};
  }
  

  @media (min-width: 1025px) {
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
    margin: 0 ${props => props.theme.spacing.sm};
  }
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  flex-shrink: 0;
  

  opacity: 1;

  @media (max-width: 768px) {
    min-width: 28px;
  }
`;

const NavText = styled.span`
  font-weight: 500;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    opacity: ${props => props.$isOpen ? 1 : 0};
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const AdminBadge = styled.span`
  background: ${props => props.theme.colors.error};
  color: white;
  font-size: 0.6rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
  white-space: nowrap;
  

  @media (max-width: 768px) {
    opacity: ${props => props.$isOpen ? 1 : 0};
    font-size: 0.55rem;
    padding: 1px 4px;
  }
`;

const RandomBadge = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.6rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    opacity: ${props => props.$isOpen ? 1 : 0};
    font-size: 0.55rem;
    padding: 1px 4px;
  }
`;


const SidebarFooter = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
  
 
  @media (max-width: 1024px) {
    padding: ${props => props.theme.spacing.md};
  }
  

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.sm};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.xs};
  }
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  opacity: ${props => props.$isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
  

  @media (max-width: 768px) {
    opacity: ${props => props.$isOpen ? 1 : 0};
    gap: ${props => props.theme.spacing.sm};
    justify-content: center;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
  

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const UserCredits = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

const Sidebar = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  

  React.useEffect(() => {
    if (window.innerWidth <= 1024 && isOpen) {
      const timer = setTimeout(() => {
        onToggle();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // 🔥 LOGICA AGGIORNATA: Gli admin vedono il pannello admin come dashboard
  const navigationItems = [];

  if (user?.is_admin) {
    // ADMIN: Pannello Admin come prima voce (dashboard)
    navigationItems.push({
      section: 'Dashboard',
      items: [
        { path: '/admin', icon: Settings, label: 'Pannello Admin', exact: true, admin: true }
      ]
    });
    
    navigationItems.push({
      section: 'Principale',
      items: [
        { path: '/calciatori', icon: Users, label: 'Calciatori' },
        { path: '/asta-live', icon: Gavel, label: 'Asta Live' }
      ]
    });
    
    navigationItems.push({
      section: 'Rose',
      items: [
        { path: '/mia-rosa', icon: Star, label: 'La Mia Rosa' },
        { path: '/tutte-le-rose', icon: Trophy, label: 'Tutte le Rose' },
        { path: '/classifica', icon: Coins, label: 'Crediti' }
      ]
    });
    
    navigationItems.push({
      section: 'Strumenti',
      items: [
        { path: '/giocatore-random', icon: Dice6, label: 'Giocatore Random', random: true },
        { path: '/dealer-selection', icon: Crown, label: 'Selezione Dealer', random: true }
      ]
    });
  } else {
    // UTENTI NORMALI: Dashboard normale
    navigationItems.push({
      section: 'Principale',
      items: [
        { path: '/', icon: Home, label: 'Dashboard', exact: true },
        { path: '/calciatori', icon: Users, label: 'Calciatori' },
        { path: '/asta-live', icon: Gavel, label: 'Asta Live' }
      ]
    });
    
    navigationItems.push({
      section: 'Rose',
      items: [
        { path: '/mia-rosa', icon: Star, label: 'La Mia Rosa' },
        { path: '/tutte-le-rose', icon: Trophy, label: 'Tutte le Rose' },
        { path: '/classifica', icon: Coins, label: 'Crediti' }
      ]
    });
  }

  const creditiDisponibili = user ? (user.crediti_totali - user.crediti_spesi) : 0;

  const handleToggle = () => {
    onToggle();
  };

 
  const getToggleIcon = () => {
    return isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />;
  };

  return (
    <SidebarContainer
      $isOpen={isOpen}
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SidebarHeader $isOpen={isOpen}>
        <Logo $isOpen={isOpen}>
          <LogoIcon>
            <Trophy size={16} color="white" />
          </LogoIcon>
          <LogoText>FantaCorrubbio</LogoText>
        </Logo>
        
        <ToggleButton
          $isOpen={isOpen}
          onClick={handleToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isOpen ? "Comprimi sidebar" : "Espandi sidebar"}
        >
          {getToggleIcon()}
        </ToggleButton>
      </SidebarHeader>

      <Navigation>
        {navigationItems.map((section, sectionIndex) => (
          <NavSection key={sectionIndex}>
            <NavSectionTitle $isOpen={isOpen}>
              {section.section}
            </NavSectionTitle>
            
            {section.items.map((item) => {
              const IconComponent = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);

              return (
                <NavItem
                  key={item.path}
                  to={item.path}
                  className={isActive ? 'active' : ''}
                  title={!isOpen ? item.label : ''}
                >
                  <NavIcon>
                    <IconComponent size={window.innerWidth <= 480 ? 20 : 22} />
                  </NavIcon>
                  <NavText $isOpen={isOpen}>
                    {item.label}
                  </NavText>
                  {item.admin && (
                    <AdminBadge $isOpen={isOpen}>ADMIN</AdminBadge>
                  )}
                  {item.random && (
                    <RandomBadge $isOpen={isOpen}>YUP</RandomBadge>
                  )}
                </NavItem>
              );
            })}
          </NavSection>
        ))}
      </Navigation>

      {user && (
        <SidebarFooter>
          <UserCard $isOpen={isOpen}>
            <UserAvatar>
              {user.username.charAt(0).toUpperCase()}
            </UserAvatar>
            <UserInfo>
              <UserName>{user.username}</UserName>
          
            </UserInfo>
          </UserCard>
        </SidebarFooter>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;