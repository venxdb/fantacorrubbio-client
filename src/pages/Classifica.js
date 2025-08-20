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
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    min-height: 100vh;
  }
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
  
  /* 🎯 TABLET: Container ottimizzato - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 8px !important;
    height: 100vh !important;
    overflow-y: auto !important;
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
  
  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
  }
  
  /* 🎯 TABLET: Header compatto - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    margin-bottom: 1rem !important;
  }
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
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
  }
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
  
  /* 🎯 TABLET: Titolo compatto - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 1.8rem !important;
    font-weight: 700 !important;
    margin-bottom: 0.5rem !important;
    gap: 0.5rem !important;
  }
`;

const TitleIcon = styled(Target)`
  width: 2.5rem;
  height: 2.5rem;
  color: #facc15;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  /* 🎯 TABLET: Icona compatta - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    width: 1.8rem !important;
    height: 1.8rem !important;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.125rem;
  color: #d1d5db;
  max-width: 32rem;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
  
  /* 🎯 TABLET: Subtitle compatto - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.9rem !important;
    padding: 0 0.5rem !important;
    margin-bottom: 0.5rem !important;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  /* 🎯 TABLET: 4 colonne */
  @media (min-width: 481px) and (max-width: 1279px) {
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 6px !important;
  }
  
  /* 🎯 DESKTOP: 8 colonne */
  @media (min-width: 1280px) {
    grid-template-columns: repeat(8, 1fr) !important;
    gap: 0.75rem !important;
  }
`;

const Card = styled.div`
  background: #2d2d2d;
  border-radius: 12px;
  padding: 16px;
  color: white;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  /* Mobile */
  @media (max-width: 640px) {
    max-width: 100%;
  }

  /* Desktop */
  @media (min-width: 1280px) {
    width: 100%;         /* si adatta alla colonna */
    max-width: 220px;    /* limite fluido, non troppo largo */
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
  
  @media (max-width: 480px) {
    padding: 0.4rem;
  }
  
  @media (min-width: 768px) {
    padding: 1rem;
  }
  
  /* 🎯 TABLET: Content compatto - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 0.4rem !important;
  }
    @media (min-width: 1280px) {
  padding: 0.5rem; 
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
  
  @media (max-width: 480px) {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.7rem;
    top: -0.3rem;
    right: -0.1rem;
  }
  
  /* 🎯 TABLET: Badge compatto - ALLA FINE */
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
  margin-bottom: 0.75rem;
  
  @media (max-width: 480px) {
    gap: 0.25rem;
    margin-bottom: 0.4rem;
  }
  
  /* 🎯 TABLET: Header utente compatto - ALLA FINE */
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
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    line-height: 1.2;
  }
  
  
  
  /* 🎯 TABLET: Nome compatto - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.75rem !important;
    font-weight: 600 !important;
    line-height: 1.2 !important;
  }
    @media (min-width: 1280px) {
  font-size: 0.9rem; 
}
`;

const AdminCrown = styled.span`
  color: #fcd34d;
  margin-left: 0.5rem;
  font-size: 0.875rem;
  
  @media (max-width: 480px) {
    font-size: 0.6rem;
    margin-left: 0.25rem;
  }
  
  /* 🎯 TABLET: Crown compatta - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.65rem !important;
    margin-left: 0.25rem !important;
  }
`;

const PositionLabel = styled.p`
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
  
  /* 🎯 TABLET: Label compatta - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.6rem !important;
  }
`;

const CreditsSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  text-align: center;
  
  @media (max-width: 480px) {
    padding: 0.4rem;
    margin-bottom: 0.4rem;
    border-radius: 0.3rem;
  }
  
  /* 🎯 TABLET: Credits compatto - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 0.4rem !important;
    margin-bottom: 0.4rem !important;
    border-radius: 0.3rem !important;
  }
    @media (min-width: 1280px) {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}
`;

const CreditsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  @media (max-width: 480px) {
    gap: 0.25rem;
    margin-bottom: 0.25rem;
  }
  
  /* 🎯 TABLET: Header credits compatto - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    gap: 0.3rem !important;
    margin-bottom: 0.3rem !important;
  }
`;

const CreditsLabel = styled.span`
  font-size: 0.875rem;
  opacity: 0.8;
  
  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
  
  /* 🎯 TABLET: Label compatta - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.65rem !important;
  }
`;

const CreditsIcon = styled(Coins)`
  width: 1.25rem;
  height: 1.25rem;
  color: #fcd34d;
  
  @media (max-width: 480px) {
    width: 0.8rem;
    height: 0.8rem;
  }
  
  /* 🎯 TABLET: Icona compatta - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    width: 0.9rem !important;
    height: 0.9rem !important;
  }
    @media (min-width: 1280px) {
  width: 1rem;
  height: 1rem;
}
`;

const CreditsValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fcd34d;
  
  @media (max-width: 480px) {
    font-size: 1rem;
    font-weight: 700;
  }
  
  /* 🎯 TABLET: Value compatto - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 1.1rem !important;
    font-weight: 700 !important;
  }
    @media (min-width: 1280px) {
  font-size: 1.2rem; 
}
`;

const RosaSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    gap: 0.25rem;
  }
  
  /* 🎯 TABLET: Rosa section compatta - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    gap: 0.3rem !important;
  }
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
  
  @media (max-width: 480px) {
    gap: 0.2rem;
  }
  
  /* 🎯 TABLET: Grid compatta - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    gap: 0.2rem !important;
  }
    @media (min-width: 1280px) {
  gap: 0.25rem;
}
`;

const RoleCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 0.375rem;
  padding: 0.375rem;
  
  @media (max-width: 480px) {
    padding: 0.2rem;
    border-radius: 0.2rem;
  }
  
  /* 🎯 TABLET: Role card compatta - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    padding: 0.25rem !important;
    border-radius: 0.2rem !important;
  }
`;

const RoleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  
  @media (max-width: 480px) {
    margin-bottom: 0.1rem;
  }
  
  /* 🎯 TABLET: Header ruolo compatto - ALLA FINE */
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
  
  @media (max-width: 480px) {
    font-size: 0.5rem;
    gap: 0.1rem;
  }
  
  /* 🎯 TABLET: Label ruolo compatta - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    font-size: 0.55rem !important;
    gap: 0.1rem !important;
    font-weight: 400 !important;
  }
`;

const RoleCount = styled.span`
  font-size: 0.75rem;
  
  @media (max-width: 480px) {
    font-size: 0.5rem;
  }
  
  /* 🎯 TABLET: Count compatto - ALLA FINE */
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
  
  @media (max-width: 480px) {
    height: 0.2rem;
  }
  
  /* 🎯 TABLET: Progress bar compatta - ALLA FINE */
  @media (min-width: 481px) and (max-width: 1200px) {
    height: 0.25rem !important;
  }
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
    const iconSize = window.innerWidth <= 480 ? 12 : 
                    window.innerWidth <= 1200 ? 14 : 20;
    
    switch(position) {
      case 1: return <Crown size={iconSize} />;
      case 2: return <Trophy size={iconSize} />;
      case 3: return <Medal size={iconSize} />;
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