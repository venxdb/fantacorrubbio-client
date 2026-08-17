import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, Target, Users, Coins } from 'lucide-react';
import API_URL from '../config/api';
import { getUserColor, darkenColor } from '../utils/userColors';

// Keyframes per animazioni
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const shine = keyframes`
  0% { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
`;

// Styled Components
const Container = styled.div`
  padding: 1rem;

  /* Mobile */
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
  
  /* 🎯 TABLET: Container ottimizzato 481px-1200px */
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 8px !important;
    height: 100vh !important;
    overflow-y: auto !important;
  }
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const MaxWidthContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const LoadingContainer = styled.div`
  text-align: center;
  color: white;
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 4px solid ${props => props.theme.colors.podium.gold};
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 1rem auto;
`;

const LoadingText = styled.p`
  font-size: 1.125rem;
  margin: 0;
`;

const EmptyContainer = styled.div`
  text-align: center;
  color: white;
`;

const EmptyIcon = styled(Users)`
  width: 4rem;
  height: 4rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 auto 1rem auto;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 0.75rem;

  /* Mobile */
  @media (max-width: 480px) {
    margin-bottom: 0.5rem;
  }
  
  /* 🎯 TABLET: Header compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    margin-bottom: 1rem !important;
  }
`;

const Title = styled(motion.h1)`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
  }
  
  /* 🎯 TABLET: Titolo compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 1.8rem !important;
    font-weight: 700 !important;
    margin-bottom: 0.5rem !important;
    gap: 0.5rem !important;
  }
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const TitleIcon = styled(Target)`
  width: 1.8rem;
  height: 1.8rem;
  color: ${props => props.theme.colors.podium.gold};
  flex-shrink: 0;
  
  /* Mobile */
  @media (max-width: 480px) {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  /* 🎯 TABLET: Icona compatta */
  @media (min-width: 481px) and (max-width: 1200px) {
    width: 1.8rem !important;
    height: 1.8rem !important;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 32rem;
  margin: 0 auto;
  padding: 0 1rem;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  /* 🎯 TABLET: Subtitle compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.9rem !important;
    padding: 0 0.5rem !important;
    margin-bottom: 0.5rem !important;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  /* Mobile: 1 colonna molto compatta */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  /* 🎯 TABLET: 4 colonne come richiesto */
  @media (min-width: 481px) and (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 6px !important;
  }
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
`;

const Card = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: translateY(0);
  transition: all 0.3s ease;
  
  ${props => props.$isTopThree ? `
    box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  ` : ''}

  &:hover {
    transform: translateY(-5px) scale(1.02);
    ${props => !props.$isTopThree ? `
      box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.5), 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    ` : ''}
  }
`;

const CardBackground = styled.div`
  position: absolute;
  inset: 0;
  background: ${props => {
    const { podium } = props.theme.colors;
    switch(props.$position) {
      case 1: return `linear-gradient(135deg, ${podium.gold} 0%, ${podium.goldDark} 100%)`;
      case 2: return `linear-gradient(135deg, ${podium.silver} 0%, ${podium.silverDark} 100%)`;
      case 3: return `linear-gradient(135deg, ${podium.bronze} 0%, ${podium.bronzeDark} 100%)`;
      default: return `linear-gradient(135deg, ${props.$userColor} 0%, ${props.$userColorDark} 100%)`;
    }
  }};
`;

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
`;

const CardContent = styled.div`
  position: relative;
  padding: 0.75rem;
  color: white;
  
  /* Mobile */
  @media (max-width: 480px) {
    padding: 0.4rem;
  }
  
  /* 🎯 TABLET: Content compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 0.4rem !important;
  }
  
  @media (min-width: 768px) {
    padding: 0.65rem;
  }
`;

const PositionBadge = styled.div`
  position: absolute;
  top: -0.5rem;
  right: -0.15rem;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.125rem;
  
  /* Mobile */
  @media (max-width: 480px) {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.7rem;
    top: -0.3rem;
    right: -0.1rem;
  }
  
  /* 🎯 TABLET: Badge compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    width: 1.8rem !important;
    height: 1.8rem !important;
    font-size: 0.8rem !important;
    top: -0.3rem !important;
    right: -0.1rem !important;
  }
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;

  /* Mobile */
  @media (max-width: 480px) {
    gap: 0.25rem;
    margin-bottom: 0.4rem;
  }
  
  /* 🎯 TABLET: Header utente compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    gap: 0.3rem !important;
    margin-bottom: 0.4rem !important;
  }
`;

const UserTitle = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.7rem;
    line-height: 1.2;
  }
  
  /* 🎯 TABLET: Nome compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.75rem !important;
    font-weight: 600 !important;
    line-height: 1.2 !important;
  }
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;
const AdminCrown = styled.span`
  color: ${props => props.theme.colors.podium.gold};
  margin-left: 0.5rem;
  font-size: 0.875rem;
`;

const PositionLabel = styled.p`
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
  
  /* 🎯 TABLET: Label compatta */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.6rem !important;
  }
`;

const CreditsSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  
  /* Mobile */
  @media (max-width: 480px) {
    padding: 0.4rem;
    margin-bottom: 0.4rem;
    border-radius: 0.3rem;
  }
  
  /* 🎯 TABLET: Credits compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 0.4rem !important;
    margin-bottom: 0.4rem !important;
    border-radius: 0.3rem !important;
  }
`;
const CreditsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const CreditsLabel = styled.span`
  font-size: 0.875rem;
  opacity: 0.8;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
  
  /* 🎯 TABLET: Label compatta */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.65rem !important;
  }
`;

const CreditsIcon = styled(Coins)`
  width: 1.25rem;
  height: 1.25rem;
  color: ${props => props.theme.colors.podium.gold};
  
  /* Mobile */
  @media (max-width: 480px) {
    width: 0.8rem;
    height: 0.8rem;
  }
  
  /* 🎯 TABLET: Icona compatta */
  @media (min-width: 481px) and (max-width: 1200px) {
    width: 0.9rem !important;
    height: 0.9rem !important;
  }
`;

const CreditsValue = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${props => props.theme.colors.podium.gold};
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1rem;
    font-weight: 700;
  }
  
  /* 🎯 TABLET: Value compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 1.1rem !important;
    font-weight: 700 !important;
  }
`;

const RosaSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RosaHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
`;

const RosaIcon = styled(Users)`
  width: 1rem;
  height: 1rem;
`;

const RosaLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.375rem;
  
  /* Mobile */
  @media (max-width: 480px) {
    gap: 0.2rem;
  }
  
  /* 🎯 TABLET: Grid compatta */
  @media (min-width: 481px) and (max-width: 1200px) {
    gap: 0.2rem !important;
  }
`;
const RoleCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 0.375rem;
  padding: 0.375rem;
  
  /* Mobile */
  @media (max-width: 480px) {
    padding: 0.2rem;
    border-radius: 0.2rem;
  }
  
  /* 🎯 TABLET: Role card compatta */
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 0.25rem !important;
    border-radius: 0.2rem !important;
  }
`;
/* Aggiungi questo CSS per ridurre le icone dei ruoli su mobile/tablet */
const RoleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  
  /* Mobile */
  @media (max-width: 480px) {
    margin-bottom: 0.1rem;
  }
  
  /* 🎯 TABLET: Header ruolo compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    margin-bottom: 0.15rem !important;
  }
`;

const RoleLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.5rem;
    gap: 0.1rem;
  }
  
  /* 🎯 TABLET: Label ruolo compatta */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.55rem !important;
    gap: 0.1rem !important;
    font-weight: 400 !important;
  }
`;

const RoleCount = styled.span`
  font-size: 0.75rem;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.5rem;
  }
  
  /* 🎯 TABLET: Count compatto */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.55rem !important;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  height: 0.375rem;
  overflow: hidden;
  
  /* Mobile */
  @media (max-width: 480px) {
    height: 0.2rem;
  }
  
  /* 🎯 TABLET: Progress bar compatta */
  @media (min-width: 481px) and (max-width: 1200px) {
    height: 0.25rem !important;
  }
`;
const ProgressFill = styled.div`
  height: 100%;
  border-radius: 9999px;
  transition: all 0.3s ease;
  background: ${props => {
    const { success, warning, error, podium } = props.theme.colors;
    const percentage = props.$current / props.$max;
    if (percentage >= 1) return success;
    if (percentage >= 0.7) return warning;
    if (percentage >= 0.4) return podium.bronze;
    return error;
  }};
  width: ${props => Math.min((props.$current / props.$max) * 100, 100)}%;
`;

const ShineEffect = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  transform: translateX(-100%) skewX(-12deg);
  animation: ${shine} 2s ease-in-out infinite;
  animation-delay: ${props => props.$index * 0.5}s;
`;

const Footer = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const FooterText = styled(motion.p)`
  margin: 0;
`;

const Classifica = () => {
  const [classifica, setClassifica] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Crediti - FantaCorrubbio';
    fetchClassifica();
    
    return () => {
      document.title = 'FantaCorrubbio';
    };
  }, []);

  const fetchClassifica = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/utenti/rose/classifica`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Errore nel caricamento della classifica');
      }
      
      const data = await response.json();
      setClassifica(data.classifica);
    } catch (error) {
      console.error('Errore caricamento classifica:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (position) => {
    switch(position) {
      case 1: return <Crown size={20} />;
      case 2: return <Trophy size={20} />;
      case 3: return <Medal size={20} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Container>
        <MaxWidthContainer>
          <LoadingContainer>
            <Spinner />
            <LoadingText>Caricamento classifica...</LoadingText>
          </LoadingContainer>
        </MaxWidthContainer>
      </Container>
    );
  }

  if (classifica.length === 0) {
    return (
      <Container>
        <MaxWidthContainer>
          <EmptyContainer>
            <EmptyIcon />
            <EmptyTitle>Nessun dato disponibile</EmptyTitle>
            <EmptyText>La classifica sarà disponibile dopo le prime aste</EmptyText>
          </EmptyContainer>
        </MaxWidthContainer>
      </Container>
    );
  }

  return (
    <Container>
      <MaxWidthContainer>
        <Header>
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TitleIcon />
            <span>Classifica Crediti</span>
          </Title>
          <Subtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            🏆 <span style={{ color: '#FBBF24', fontWeight: 600 }}> Poveracci, sembrate il Milan!</span>
          </Subtitle>
        </Header>

        <CardsGrid>
          {classifica.map((user, index) => {
            const position = index + 1;
            const isTopThree = position <= 3;
            const maxLimits = { P: 3, D: 8, C: 8, A: 6 };
            
            return (
              <Card
                key={user.username}
                $isTopThree={isTopThree}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <CardBackground
                  $position={position}
                  $userColor={getUserColor(user.username)}
                  $userColorDark={darkenColor(getUserColor(user.username))}
                />
                <CardOverlay />
                
                <CardContent>
                  <PositionBadge>
                    #{position}
                  </PositionBadge>

                  <UserHeader>
                    {getPositionIcon(position)}
                    <UserTitle>
                      <UserName>
                        {user.username}
                        {user.is_admin && <AdminCrown>👑</AdminCrown>}
                      </UserName>
                      {isTopThree && (
                        <PositionLabel>
                          {position === 1 ? '1° Posto' : position === 2 ? '2° Posto' : '3° Posto'}
                        </PositionLabel>
                      )}
                    </UserTitle>
                  </UserHeader>

                  <CreditsSection>
                    <CreditsHeader>
                      <CreditsIcon />
                      <CreditsLabel>Crediti Rimanenti</CreditsLabel>
                    </CreditsHeader>
                    <CreditsValue>{user.crediti_rimanenti}</CreditsValue>
                  </CreditsSection>

                  <RosaSection>
                    <RolesGrid>
                      {[
                        { label: 'P', current: user.portieri, max: maxLimits.P, icon: '🥅' },
                        { label: 'D', current: user.difensori, max: maxLimits.D, icon: '🛡️' },
                        { label: 'C', current: user.centrocampisti, max: maxLimits.C, icon: '⚽' },
                        { label: 'A', current: user.attaccanti, max: maxLimits.A, icon: '🎯' }
                      ].map((role) => (
                        <RoleCard key={role.label}>
                          <RoleHeader>
                            <RoleLabel>
                              <span>{role.icon}</span>
                              {role.label}
                            </RoleLabel>
                            <RoleCount>
                              {role.current}/{role.max}
                            </RoleCount>
                          </RoleHeader>
                          <ProgressBar>
                            <ProgressFill 
                              $current={role.current} 
                              $max={role.max}
                            />
                          </ProgressBar>
                        </RoleCard>
                      ))}
                    </RolesGrid>
                  </RosaSection>
                </CardContent>

                {isTopThree && (
                  <ShineEffect $index={index} />
                )}
              </Card>
            );
          })}
        </CardsGrid>
      </MaxWidthContainer>
    </Container>
  );
};

export default Classifica;