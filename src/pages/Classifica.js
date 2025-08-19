import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, Target, Users, Coins } from 'lucide-react';
import API_URL from '../config/api';

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
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
  padding: 1rem;
  
  /* Mobile */
  @media (max-width: 480px) {
    padding: 0.5rem;
    min-height: 100vh;
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
  border: 4px solid #facc15;
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
  color: #9ca3af;
  margin: 0 auto 1rem auto;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
`;

const EmptyText = styled.p`
  color: #9ca3af;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
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
    font-size: 3rem;
  }
`;

const TitleIcon = styled(Target)`
  width: 2.5rem;
  height: 2.5rem;
  color: #facc15;
  flex-shrink: 0;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.125rem;
  color: #d1d5db;
  max-width: 32rem;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
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
    box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  ` : ''}
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    ${props => !props.$isTopThree ? `
      box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5), 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    ` : ''}
  }
`;

const CardBackground = styled.div`
  position: absolute;
  inset: 0;
  background: ${props => {
    switch(props.$position) {
      case 1: return 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)';
      case 2: return 'linear-gradient(135deg, #d1d5db 0%, #6b7280 100%)';
      case 3: return 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)';
      default: return 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)';
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
  
  @media (min-width: 768px) {
    padding: 1rem;
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
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
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
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const AdminCrown = styled.span`
  color: #fcd34d;
  margin-left: 0.5rem;
  font-size: 0.875rem;
`;

const PositionLabel = styled.p`
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
`;

const CreditsSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  text-align: center;
`;

const CreditsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const CreditsIcon = styled(Coins)`
  width: 1.25rem;
  height: 1.25rem;
  color: #fcd34d;
`;

const CreditsLabel = styled.span`
  font-size: 0.875rem;
  opacity: 0.8;
`;

const CreditsValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fcd34d;
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
  margin-bottom: 0.5rem;
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
`;

const RoleCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 0.375rem;
  padding: 0.375rem;
`;

const RoleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

const RoleLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RoleCount = styled.span`
  font-size: 0.75rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  height: 0.375rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 9999px;
  transition: all 0.3s ease;
  background: ${props => {
    const percentage = props.$current / props.$max;
    if (percentage >= 1) return '#10b981';
    if (percentage >= 0.7) return '#eab308';
    if (percentage >= 0.4) return '#f97316';
    return '#ef4444';
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
  color: #9ca3af;
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
            🏆 <span style={{ color: '#facc15', fontWeight: 600 }}>Ebrei:</span> Poveracci, sembrate il Milan!
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
                <CardBackground $position={position} />
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