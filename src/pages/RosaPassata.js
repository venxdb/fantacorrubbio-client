import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { History, Coins, Archive } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import rosaPassataData from '../data/rosaPassata.json';

const RUOLI = {
  P: { nome: 'Portieri', icon: '🥅', color: '#F59E0B' },
  D: { nome: 'Difensori', icon: '🛡️', color: '#22C55E' },
  C: { nome: 'Centrocampisti', icon: '⚽', color: '#3B82F6' },
  A: { nome: 'Attaccanti', icon: '🎯', color: '#EF4444' },
};

const Container = styled.div`
  padding: ${props => props.theme.spacing.md} 0;
  max-width: 1150px;
  margin: 0 auto;

  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm} 0;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.85rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg};
`;

const EmptyIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${props => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  max-width: 400px;
  margin: 0 auto;
`;

const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.sm};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const RoleCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-top: 3px solid ${props => props.$color};
  border-radius: ${props => props.theme.radius.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.md};
`;

const RoleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.sm};
  gap: ${props => props.theme.spacing.sm};
`;

const RoleName = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 0.95rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const RoleIconBadge = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: ${props => `${props.$color}22`};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
`;

const RoleSpend = styled.div`
  text-align: right;
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const RoleSpendValue = styled.div`
  font-weight: 800;
  color: ${props => props.$color};
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 3px;
`;

const RoleSpendPct = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.7rem;
`;

const RoleBarTrack = styled.div`
  width: 100%;
  height: 5px;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.radius.pill};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const RoleBarFill = styled.div`
  height: 100%;
  border-radius: ${props => props.theme.radius.pill};
  background: ${props => props.$color};
  width: ${props => Math.min(props.$pct, 100)}%;
  transition: width 0.6s ease;
`;

const PlayersList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

const PlayerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.radius.sm};
  min-width: 0;
`;

const PlayerName = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: 0.76rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;

const PlayerPrice = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${props => props.$color};
  font-weight: 700;
  font-size: 0.76rem;
  flex-shrink: 0;
  margin-left: 4px;
`;

const RosaPassata = () => {
  const { user } = useAuth();
  const dati = user ? rosaPassataData[user.username] : null;

  return (
    <Container>
      <Header>
        <Title>
          <History size={20} />
          Rosa Passata
        </Title>
        <Subtitle>La tua squadra della scorsa stagione, guarda che disastro hai combinato, mentecatto che non sei altro!</Subtitle>
      </Header>

      {!dati ? (
        <EmptyState>
          <EmptyIcon>
            <Archive size={32} />
          </EmptyIcon>
          <EmptyTitle>Nessun dato disponibile</EmptyTitle>
          <EmptyText>
            Non abbiamo dati della scorsa stagione per l'account "{user?.username}".
            Questa sezione mostra le rose di chi ha partecipato all'edizione precedente.
          </EmptyText>
        </EmptyState>
      ) : (
        <RolesGrid>
          {Object.entries(RUOLI).map(([ruolo, config], index) => {
            const roleData = dati.ruoli[ruolo];

            return (
              <RoleCard
                key={ruolo}
                $color={config.color}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * index }}
              >
                <RoleHeader>
                  <RoleName>
                    <RoleIconBadge $color={config.color}>{config.icon}</RoleIconBadge>
                    {config.nome}
                  </RoleName>
                  <RoleSpend>
                    <RoleSpendValue $color={config.color}>
                      <Coins size={11} />
                      {roleData.spesa}
                    </RoleSpendValue>
                    <RoleSpendPct>({roleData.percentuale}%)</RoleSpendPct>
                  </RoleSpend>
                </RoleHeader>

                <RoleBarTrack>
                  <RoleBarFill $color={config.color} $pct={roleData.percentuale} />
                </RoleBarTrack>

                <PlayersList>
                  {roleData.giocatori.map((g) => (
                    <PlayerRow key={g.nome}>
                      <PlayerName title={g.nome}>{g.nome}</PlayerName>
                      <PlayerPrice $color={config.color}>
                        <Coins size={10} />
                        {g.prezzo}
                      </PlayerPrice>
                    </PlayerRow>
                  ))}
                </PlayersList>
              </RoleCard>
            );
          })}
        </RolesGrid>
      )}
    </Container>
  );
};

export default RosaPassata;
