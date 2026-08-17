import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Hammer,
  Trophy,
  History,
  LayoutGrid,
  Coins,
  ChevronLeft,
  ChevronRight,
  Dices,
  Crown,
  Star,
  Heart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';


const SidebarContainer = styled(motion.aside)`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background: rgba(20, 27, 38, 0.72);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
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
    color: ${props => props.$isOpen ? '#1A1300' : props.theme.colors.text};
    background: ${props => props.$isOpen ? 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)' : 'transparent'};
    box-shadow: ${props => props.$isOpen ? '0 4px 16px rgba(251, 191, 36, 0.35)' : 'none'};
    font-weight: 700;

    svg {
      color: ${props => props.$isOpen ? '#1A1300' : 'inherit'};
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
  width: 32px;
  height: 32px;
  min-width: 32px;
  flex-shrink: 0;
  border-radius: 10px;
  background: ${props => props.$color ? `${props.$color}26` : 'transparent'};
  color: ${props => props.$color || 'currentColor'};
  transition: all 0.2s ease;

  .active & {
    background: ${props => props.$isOpen ? 'rgba(26, 19, 0, 0.15)' : 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)'};
    color: #1A1300;
    box-shadow: ${props => props.$isOpen ? 'none' : '0 3px 10px rgba(251, 191, 36, 0.45)'};
  }

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    min-width: 30px;
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
  display: flex;
  align-items: center;
  flex-shrink: 0;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // 🔥 LOGICA AGGIORNATA: Gli admin vedono il pannello admin come dashboard
  const navigationItems = [];

  if (user?.is_admin) {
    // ADMIN: Pannello Admin come prima voce (dashboard)
    navigationItems.push({
      section: 'Dashboard',
      items: [
        { path: '/admin', icon: LayoutDashboard, label: 'Pannello Admin', exact: true, admin: true, color: '#6366F1' }
      ]
    });

    navigationItems.push({
      section: 'Principale',
      items: [
        { path: '/calciatori', icon: Users, label: 'Calciatori', color: '#3B82F6' },
        { path: '/asta-live', icon: Hammer, label: 'Asta Live', color: '#F59E0B' }
      ]
    });

    navigationItems.push({
      section: 'Rose',
      items: [
        { path: '/rosa-passata', icon: History, label: 'Rosa Passata', color: '#22C55E' },
        { path: '/tutte-le-rose', icon: LayoutGrid, label: 'Tutte le Rose', color: '#EC4899' },
        { path: '/preferiti', icon: Heart, label: 'Preferiti', color: '#F43F5E' },
        { path: '/classifica', icon: Coins, label: 'Crediti', color: '#FBBF24' }
      ]
    });

    navigationItems.push({
      section: 'Strumenti',
      items: [
        { path: '/giocatore-random', icon: Dices, label: 'Giocatore Random', random: true, color: '#A855F7' },
        { path: '/dealer-selection', icon: Crown, label: 'Selezione Dealer', random: true, color: '#F97316' }
      ]
    });
  } else {
    // UTENTI NORMALI: Dashboard normale
    navigationItems.push({
      section: 'Principale',
      items: [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true, color: '#6366F1' },
        { path: '/calciatori', icon: Users, label: 'Calciatori', color: '#3B82F6' },
        { path: '/asta-live', icon: Hammer, label: 'Asta Live', color: '#F59E0B' }
      ]
    });

    navigationItems.push({
      section: 'Rose',
      items: [
        { path: '/rosa-passata', icon: History, label: 'Rosa Passata', color: '#22C55E' },
        { path: '/tutte-le-rose', icon: LayoutGrid, label: 'Tutte le Rose', color: '#EC4899' },
        { path: '/preferiti', icon: Heart, label: 'Preferiti', color: '#F43F5E' },
        { path: '/classifica', icon: Coins, label: 'Crediti', color: '#FBBF24' }
      ]
    });
  }

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
                  $isOpen={isOpen}
                >
                  <NavIcon $color={item.color} $isOpen={isOpen}>
                    <IconComponent size={window.innerWidth <= 480 ? 18 : 20} />
                  </NavIcon>
                  <NavText $isOpen={isOpen}>
                    {item.label}
                  </NavText>
                  {item.admin && (
                    <AdminBadge $isOpen={isOpen}>ADMIN</AdminBadge>
                  )}
                  {item.random && (
                    <RandomBadge $isOpen={isOpen} title="Solo admin">
                      <Star size={14} fill="#FBBF24" color="#FBBF24" />
                    </RandomBadge>
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