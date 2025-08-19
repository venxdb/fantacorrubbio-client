import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Star, Trophy, Coins, Users, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../config/api';

const RosaContainer = styled.div`
  padding: ${props => props.theme.spacing.lg} 0;
  max-width: 1200px;
  margin: 0 auto;
  
  /* 🎯 TABLET: Padding ancora più ridotto e altezza controllata */
  @media (min-width: 481px) and (max-width: 1023px) {
    padding: ${props => props.theme.spacing.xs} 0;
    max-height: calc(100vh - 60px); /* Considera header fisso */
    overflow-y: auto;
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm} 0;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  
  /* 🎯 TABLET: Header ultra compatto */
  @media (min-width: 481px) and (max-width: 1023px) {
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  @media (max-width: 480px) {
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
  
  /* 🎯 TABLET: Titolo molto più piccolo */
  @media (min-width: 481px) and (max-width: 1023px) {
    font-size: 1.4rem;
    gap: ${props => props.theme.spacing.xs};
    margin-bottom: 0;
  }
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
    gap: ${props => props.theme.spacing.xs};
    flex-direction: column;
  }
`;

// 🎯 Stats Grid ultra compatto per tablet
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  
  /* Desktop: 4 colonne */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  /* 🎯 TABLET: 4 colonne ultra compatte, gap mini */
  @media (min-width: 481px) and (max-width: 1023px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  /* Mobile: 2 colonne compatte */
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.theme.spacing.sm};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  
  /* 🎯 TABLET: Padding ultra ridotto */
  @media (min-width: 481px) and (max-width: 1023px) {
    padding: 6px 4px;
    border-radius: 6px;
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm};
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.color || props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
  
  /* 🎯 TABLET: Font ancora più piccolo */
  @media (min-width: 481px) and (max-width: 1023px) {
    font-size: 1.1rem;
    margin-bottom: 1px;
    line-height: 1.2;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  
  /* 🎯 TABLET: Font ultra piccolo */
  @media (min-width: 481px) and (max-width: 1023px) {
    font-size: 0.6rem;
    line-height: 1.1;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const RoleSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  
  /* 🎯 TABLET: Margini ultra ridotti */
  @media (min-width: 481px) and (max-width: 1023px) {
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  @media (max-width: 480px) {
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const RoleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
  gap: ${props => props.theme.spacing.md};
  
  /* 🎯 TABLET: Margine ultra ridotto */
  @media (min-width: 481px) and (max-width: 1023px) {
    margin-bottom: 4px;
    gap: ${props => props.theme.spacing.xs};
  }
  
  @media (max-width: 768px) {
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.sm};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const RoleTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  
  /* 🎯 TABLET: Font più piccolo */
  @media (min-width: 481px) and (max-width: 1023px) {
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const RoleStats = styled.div`
  background: ${props => props.background};
  color: ${props => props.color};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  
  /* 🎯 TABLET: Dimensioni ultra ridotte */
  @media (min-width: 481px) and (max-width: 1023px) {
    padding: 2px 6px;
    border-radius: 8px;
    font-size: 0.6rem;
    font-weight: 500;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    border-radius: 16px;
    align-self: flex-end;
  }
`;

// 🎯 Players Grid ultra compatto per tablet
const PlayersGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
  
  /* Desktop: 3 colonne */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
  
  /* 🎯 TABLET: 4 colonne ultra compatte per massimizzare spazio */
  @media (min-width: 481px) and (max-width: 1023px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 3px;
  }
  
  /* Mobile: 1 colonna */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const PlayerCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.large};
  }
  
  /* 🎯 TABLET: Padding ultra ridotto, card molto compatta */
  @media (min-width: 481px) and (max-width: 1023px) {
    padding: 4px;
    border-radius: 4px;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: ${props => props.theme.shadows.small};
    }
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm};
    
    &:hover {
      transform: none;
    }
    
    &:active {
      transform: scale(0.98);
      background: ${props => props.theme.colors.surfaceHover};
    }
  }
`;

const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
  gap: ${props => props.theme.spacing.sm};
  
  /* 🎯 TABLET: Margine ultra ridotto */
  @media (min-width: 481px) and (max-width: 1023px) {
    margin-bottom: 2px;
    gap: 2px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: ${props => props.theme.spacing.sm};
    align-items: center;
  }
`;

const PlayerInfo = styled.div`
  flex: 1;
  min-width: 0; /* Permette text-overflow */
`;

const PlayerName = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  /* 🎯 TABLET: Font ultra piccolo */
  @media (min-width: 481px) and (max-width: 1023px) {
    font-size: 0.7rem;
    font-weight: 500;
    margin-bottom: 1px;
    line-height: 1.1;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 2px;
  }
`;

const PlayerTeam = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  /* 🎯 TABLET: Font ultra piccolo */
  @media (min-width: 481px) and (max-width: 1023px) {
    font-size: 0.6rem;
    line-height: 1.1;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const PurchaseInfo = styled.div`
  text-align: right;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    text-align: center;
  }
`;

const PurchasePrice = styled.div`
  background: ${props => props.theme.colors.gradient};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: ${props => props.theme.spacing.xs};
  white-space: nowrap;
  
  /* 🎯 TABLET: Ultra compatto */
  @media (min-width: 481px) and (max-width: 1023px) {
    padding: 1px 4px;
    border-radius: 8px;
    font-size: 0.6rem;
    font-weight: 500;
    margin-bottom: 1px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    border-radius: 16px;
  }
`;

const PurchaseDate = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.xs};
  
  /* 🎯 TABLET: Font ultra piccolo, nascondi icona */
  @media (min-width: 481px) and (max-width: 1023px) {
    font-size: 0.5rem;
    gap: 1px;
    
    svg {
      display: none; /* Nascondi icona per risparmiare spazio */
    }
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    justify-content: center;
  }
`;

const PlayerQuote = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
  
  /* 🎯 TABLET: Margini e padding ultra ridotti */
  @media (min-width: 481px) and (max-width: 1023px) {
    margin-top: 2px;
    padding-top: 2px;
  }
  
  @media (max-width: 480px) {
    margin-top: ${props => props.theme.spacing.sm};
    padding-top: ${props => props.theme.spacing.sm};
  }
`;

const QuoteLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.85rem;
  
  /* 🎯 TABLET: Font ultra piccolo */
  @media (min-width: 481px) and (max-width: 1023px) {
    font-size: 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const QuoteValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  
  /* 🎯 TABLET: Font più piccolo */
  @media (min-width: 481px) and (max-width: 1023px) {
    font-size: 0.6rem;
    font-weight: 500;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

// 🎯 Empty State compatto
const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
  margin-bottom: ${props => props.theme.spacing.lg};
  
  /* 🎯 TABLET: Padding molto ridotto */
  @media (min-width: 481px) and (max-width: 1023px) {
    padding: ${props => props.theme.spacing.sm};
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.lg};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.md};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.theme.colors.gradient};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.lg};
  
  /* 🎯 TABLET: Icona più piccola */
  @media (min-width: 481px) and (max-width: 1023px) {
    width: 40px;
    height: 40px;
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const EmptyTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.sm};
  
  /* 🎯 TABLET: Font più piccolo */
  @media (min-width: 481px) and (max-width: 1023px) {
    font-size: 0.9rem;
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.5;
  max-width: 400px;
  margin: 0 auto;
  
  /* 🎯 TABLET: Font più piccolo */
  @media (min-width: 481px) and (max-width: 1023px) {
    font-size: 0.7rem;
    line-height: 1.3;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  
  /* 🎯 TABLET: Padding ridotto */
  @media (min-width: 481px) and (max-width: 1023px) {
    padding: ${props => props.theme.spacing.md};
    gap: ${props => props.theme.spacing.sm};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.lg};
  }
`;

// 🎯 Summary Card per mobile (nascosta su tablet per risparmiare spazio)
const SummaryCard = styled.div`
  display: none;
  
  @media (max-width: 480px) {
    display: block;
    background: ${props => props.theme.colors.surface};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius};
    padding: ${props => props.theme.spacing.md};
    margin-bottom: ${props => props.theme.spacing.md};
    text-align: center;
  }
`;

const SummaryTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
`;

const SummaryStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.sm};
`;

const SummaryStatItem = styled.div`
  text-align: center;
`;

const SummaryStatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.color || props.theme.colors.text};
  margin-bottom: 2px;
`;

const SummaryStatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const MiaRosa = () => {
  const { user } = useAuth();
  const [rosa, setRosa] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRosa();
  }, []);

  const fetchMyRosa = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/utenti/me/rosa`);
      setRosa(response.data.rosa);
      setStats(response.data.statistiche);
    } catch (error) {
      console.error('❌ Errore caricamento rosa:', error.response?.data || error.message);
      toast.error('Errore nel caricamento della tua rosa');
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = (role) => {
    switch(role) {
      case 'P':
        return {
          title: '🥅 Portieri',
          background: 'rgba(255, 193, 7, 0.1)',
          color: '#FF8F00'
        };
      case 'D':
        return {
          title: '🛡️ Difensori',
          background: 'rgba(76, 175, 80, 0.1)',
          color: '#4CAF50'
        };
      case 'C':
        return {
          title: '⚽ Centrocampisti',
          background: 'rgba(33, 150, 243, 0.1)',
          color: '#2196F3'
        };
      case 'A':
        return {
          title: '🎯 Attaccanti',
          background: 'rgba(244, 67, 54, 0.1)',
          color: '#F44336'
        };
      default:
        return {
          title: role,
          background: 'rgba(158, 158, 158, 0.1)',
          color: '#9E9E9E'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const groupedPlayers = rosa.reduce((acc, player) => {
    if (!acc[player.ruolo]) {
      acc[player.ruolo] = [];
    }
    acc[player.ruolo].push(player);
    return acc;
  }, {});

  const creditiDisponibili = user ? (user.crediti_totali - user.crediti_spesi) : 0;
  const costoMedio = stats ? Math.round(stats.costo_totale / Math.max(stats.totale_calciatori, 1)) : 0;

  if (loading) {
    return (
      <RosaContainer>
        <LoadingContainer>
          <Star size={48} color="#B0BEC5" />
          <span>Caricamento della tua rosa...</span>
        </LoadingContainer>
      </RosaContainer>
    );
  }

  return (
    <RosaContainer>
      <Header>
        <Title>
          <Star size={24} />
          La Mia Rosa
        </Title>
      </Header>

      {/* Desktop/Tablet Stats - Ultra compatte per tablet */}
      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatValue color="#4CAF50">{rosa.length}</StatValue>
          <StatLabel>Calciatori</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatValue color="#F44336">{user?.crediti_spesi || 0}</StatValue>
          <StatLabel>Spesi</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatValue color="#FFA726">{creditiDisponibili}</StatValue>
          <StatLabel>Disponibili</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatValue color="#2196F3">{costoMedio}</StatValue>
          <StatLabel>Medio</StatLabel>
        </StatCard>
      </StatsGrid>

      {rosa.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Users size={40} color="white" />
          </EmptyIcon>
          <EmptyTitle>Rosa Vuota</EmptyTitle>
          <EmptyText>
            Non hai ancora acquistato nessun calciatore. Partecipa alle aste per iniziare a costruire la tua rosa!
          </EmptyText>
        </EmptyState>
      ) : (
        ['P', 'D', 'C', 'A'].map(role => {
          const playersInRole = groupedPlayers[role] || [];
          const roleInfo = getRoleInfo(role);
          
          if (playersInRole.length === 0) return null;

          return (
            <RoleSection key={role}>
              <RoleHeader>
                <RoleTitle>{roleInfo.title}</RoleTitle>
                <RoleStats background={roleInfo.background} color={roleInfo.color}>
                  {playersInRole.length}
                </RoleStats>
              </RoleHeader>

              {/* Mobile Summary per ogni ruolo - nascosta su tablet */}
              <SummaryCard>
                <SummaryTitle>
                  <span>{roleInfo.title.split(' ')[0]}</span>
                  Riepilogo
                </SummaryTitle>
                <SummaryStats>
                  <SummaryStatItem>
                    <SummaryStatValue color={roleInfo.color}>
                      {playersInRole.length}
                    </SummaryStatValue>
                    <SummaryStatLabel>Giocatori</SummaryStatLabel>
                  </SummaryStatItem>
                  <SummaryStatItem>
                    <SummaryStatValue color="#FFA726">
                      {playersInRole.reduce((sum, p) => sum + (p.prezzo_acquisto || 0), 0)}
                    </SummaryStatValue>
                    <SummaryStatLabel>Spesa Totale</SummaryStatLabel>
                  </SummaryStatItem>
                </SummaryStats>
              </SummaryCard>

              <PlayersGrid>
                {playersInRole.map((player, index) => (
                  <PlayerCard
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }} // Animazione più veloce
                  >
                    <PlayerHeader>
                      <PlayerInfo>
                        <PlayerName>{player.nome}</PlayerName>
                        <PlayerTeam>{player.squadra}</PlayerTeam>
                      </PlayerInfo>
                      <PurchaseInfo>
                        <PurchasePrice>{player.prezzo_acquisto}</PurchasePrice>
                        <PurchaseDate>
                          <Calendar size={12} />
                          {formatDate(player.data_acquisto)}
                        </PurchaseDate>
                      </PurchaseInfo>
                    </PlayerHeader>

                    <PlayerQuote>
                      <QuoteLabel>Quotazione:</QuoteLabel>
                      <QuoteValue>{player.quotazione}</QuoteValue>
                    </PlayerQuote>
                  </PlayerCard>
                ))}
              </PlayersGrid>
            </RoleSection>
          );
        })
      )}
    </RosaContainer>
  );
};

export default MiaRosa;