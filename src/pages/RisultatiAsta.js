import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Coins, Users, ArrowLeft, Clock, Crown, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL from '../config/api';
const Container = styled.div`
  padding: ${props => props.theme.spacing.md} 0;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 70vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const PlayerCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PlayerName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const PlayerInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const InfoLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.85rem;
`;

const InfoValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 1rem;
`;

const ResultsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.3rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
`;

const RevealButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradient};
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  margin: 0 auto ${props => props.theme.spacing.lg};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ManualModeIndicator = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  border: 2px dashed #ff6b6b;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CardContainer = styled.div`
  perspective: 1000px;
  height: 140px;
`;

const FlippingCard = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  cursor: ${props => props.$manualMode && !props.$isFlipped ? 'pointer' : 'default'};
  
  ${props => props.$manualMode && !props.$isFlipped && `
    &:hover {
      transform: scale(1.05);
    }
  `}
`;

const CardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: ${props => props.theme.borderRadius};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.sm};
  border: 2px solid;
`;

const CardFront = styled(CardSide)`
  background: ${props => props.theme.colors.background};
  border-color: ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  
  ${props => props.$showUsername && `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: #667eea;
  `}
`;

const CardBack = styled(CardSide)`
  background: ${props => {
    // ✅ In modalità manuale, colore neutro sempre, tranne il vincitore quando tutte sono girate
    if (props.$manualMode) {
      // Se tutte le carte sono state girate E questa è la vincitrice
      if (props.$allRevealed && props.$rank === 1) {
        return 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)'; // Solo il vincitore si illumina
      }
      // Altrimenti sempre neutro
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    // Colori normali per modalità automatica
    if (props.$isTied) return 'linear-gradient(135deg, #FFA726 0%, #FF9800 100%)';
    if (props.$rank === 1) return 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)';
    if (props.$rank === 2) return 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)';
    if (props.$rank === 3) return 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)';
    return props.theme.colors.primary;
  }};
  border-color: ${props => {
    // ✅ In modalità manuale, bordo neutro sempre, tranne il vincitore quando tutte sono girate
    if (props.$manualMode) {
      if (props.$allRevealed && props.$rank === 1) {
        return '#FFD700'; // Solo il vincitore ha bordo dorato
      }
      return '#667eea'; // Altrimenti sempre neutro
    }
    
    // Bordi normali per modalità automatica
    if (props.$isTied) return '#FFA726';
    if (props.$rank === 1) return '#FFD700';
    if (props.$rank === 2) return '#C0C0C0';
    if (props.$rank === 3) return '#CD7F32';
    return props.theme.colors.primary;
  }};
  color: white;
  transform: rotateY(180deg);
`;

const CardRank = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${props => {
    // ✅ In modalità manuale, badge neutro sempre, tranne il vincitore quando tutte sono girate
    if (props.$manualMode) {
      if (props.$allRevealed && props.$rank === 1) {
        return '#FFD700'; // Solo il vincitore ha badge dorato
      }
      return '#667eea'; // Altrimenti sempre neutro
    }
    
    // Colori normali per modalità automatica
    if (props.$isTied) return '#FFA726';
    if (props.$rank === 1) return '#FFD700';
    if (props.$rank === 2) return '#C0C0C0';
    if (props.$rank === 3) return '#CD7F32';
    return props.theme.colors.secondary;
  }};
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.7rem;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
`;

const CardUsername = styled.div`
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const CardAmount = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const WinnerAnnouncement = styled(motion.div)`
  background: linear-gradient(135deg, #FFD700 0%, #FFA000 100%);
  color: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  position: relative;
  overflow: hidden;
`;

const TieAnnouncement = styled(motion.div)`
  background: linear-gradient(135deg, #FFA726 0%, #FF9800 100%);
  color: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  position: relative;
  overflow: hidden;
`;

const AnnouncementText = styled.h2`
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
`;

const AnnouncementDetails = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`;

const NoOffersAnnouncement = styled(motion.div)`
  background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%);
  color: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  position: relative;
  overflow: hidden;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RisultatiAsta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);
  const [manualMode, setManualMode] = useState(false); // ✅ NUOVO STATO
  const [shuffledBids, setShuffledBids] = useState([]); // ✅ NUOVO: Array ordinato fisso per modalità manuale
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuctionResults();
  }, [id]);

  const fetchAuctionResults = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/aste/${id}`);
      const auctionData = response.data;

      setAuction(auctionData);
      
      // Ordina le offerte dalla più alta alla più bassa per il ranking
      const sortedBids = (auctionData.offerte || [])
        .sort((a, b) => b.importo - a.importo)
        .map((bid, index) => ({
          ...bid,
          rank: index + 1
        }));
      
      setBids(sortedBids);
    } catch (error) {
      console.error('Errore caricamento risultati:', error);
      toast.error('Errore nel caricamento dei risultati');
      navigate('/asta-live');
    } finally {
      setLoading(false);
    }
  };

  const startReveal = async () => {
    setIsRevealing(true);
    setFlippedCards([]);
    setRevealComplete(false);
    
    // Ordina per rivelazione: dalla più bassa alla più alta
    const revealOrder = [...bids].sort((a, b) => a.importo - b.importo);
    
    for (let i = 0; i < revealOrder.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setFlippedCards(prev => [...prev, revealOrder[i].id]);
    }
    
    setIsRevealing(false);
    
    // Aspetta 1.5 secondi dopo l'ultima carta prima di mostrare il risultato
    setTimeout(() => {
      setRevealComplete(true);
    }, 1500);
  };

  // ✅ NUOVA FUNZIONE: Fisher-Yates shuffle per vero ordine casuale
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // ✅ NUOVA FUNZIONE: Avvia modalità manuale
  const startManualReveal = () => {
    setManualMode(true);
    setFlippedCards([]);
    setRevealComplete(false);
    setIsRevealing(false);
    // ✅ CONGELA l'ordine casuale una sola volta
    setShuffledBids(shuffleArray(bids));
  };

  // ✅ NUOVA FUNZIONE: Gestisce il click su singola card
  const handleCardClick = (bidId) => {
    if (!manualMode || flippedCards.includes(bidId)) return;
    
    setFlippedCards(prev => {
      const newFlipped = [...prev, bidId];
      
      // Se tutte le carte sono state girate, mostra il risultato dopo 1.5 secondi
      if (newFlipped.length === bids.length) {
        setTimeout(() => {
          setRevealComplete(true);
        }, 1500);
      }
      
      return newFlipped;
    });
  };

  // ✅ NUOVA FUNZIONE: Reset per tornare all'inizio
  const resetReveal = () => {
    setFlippedCards([]);
    setRevealComplete(false);
    setIsRevealing(false);
    setManualMode(false);
    setShuffledBids([]); // ✅ Pulisce anche l'array shufflato
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <Clock size={36} color="#B0BEC5" />
          <p>Caricamento risultati...</p>
        </LoadingState>
      </Container>
    );
  }

  if (!auction) {
    return (
      <Container>
        <LoadingState>
          <p>Asta non trovata</p>
        </LoadingState>
      </Container>
    );
  }

  // 🎯 LOGICA CORRETTA: Determina il tipo di risultato
  const hasOffers = bids.length > 0;
  const topBid = hasOffers ? bids[0] : null;
  const topBidAmount = topBid ? topBid.importo : 0;
  const tiedBids = hasOffers ? bids.filter(bid => bid.importo === topBidAmount) : [];
  const hasTie = tiedBids.length > 1;
  const hasWinner = auction.vincitore_id !== null;

  return (
    <Container>
      <BackButton
        onClick={() => navigate('/asta-live')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft size={18} />
      </BackButton>

      <Header>
        <Title>
          <Trophy size={28} />
          Risultati Asta
        </Title>
      </Header>

      <PlayerCard>
        <PlayerName>{auction.calciatore_nome}</PlayerName>
        <PlayerInfo>
          <InfoItem>
            <InfoLabel>Squadra</InfoLabel>
            <InfoValue>{auction.squadra}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Ruolo</InfoLabel>
            <InfoValue>{auction.ruolo}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Quotazione</InfoLabel>
            <InfoValue>{auction.quotazione}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Partecipanti</InfoLabel>
            <InfoValue>{bids.length}</InfoValue>
          </InfoItem>
        </PlayerInfo>
      </PlayerCard>

      {/* 🎯 ANNUNCI SOLO PER CASI SPECIALI */}
      {revealComplete && (
        <>
          {!hasOffers && (
            <NoOffersAnnouncement
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            >
              <AnnouncementText>
                <AlertTriangle size={28} />
                📭 NESSUNA OFFERTA 📭
                <AlertTriangle size={28} />
              </AnnouncementText>
              <AnnouncementDetails>
                {auction.calciatore_nome} resta disponibile per future aste
              </AnnouncementDetails>
            </NoOffersAnnouncement>
          )}

          {hasOffers && hasTie && !hasWinner && (
            <TieAnnouncement
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            >
              <AnnouncementText>
                <AlertTriangle size={28} />
                ⚖️ PAREGGIO! ⚖️
                <AlertTriangle size={28} />
              </AnnouncementText>
              <AnnouncementDetails>
                {tiedBids.length} partecipanti hanno offerto {topBidAmount} crediti
                <br />
                <strong>L'amministratore assegnerà manualmente {auction.calciatore_nome}</strong>
              </AnnouncementDetails>
            </TieAnnouncement>
          )}
        </>
      )}

      {hasOffers && (
        <ResultsSection>
          <SectionTitle>
            <Star size={20} />
            Tutte le Offerte
          </SectionTitle>

          {/* ✅ BOTTONI DI SCELTA MODALITÀ */}
          {!isRevealing && !manualMode && flippedCards.length === 0 && (
            <>
              <RevealButton
                onClick={startReveal}
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users size={18} />
                Rivela Automaticamente
              </RevealButton>
              
              <RevealButton
                onClick={startManualReveal}
                style={{ 
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  marginBottom: '1rem'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Crown size={18} />
                Rivela Manualmente
              </RevealButton>
            </>
          )}

          {/* ✅ INDICAZIONI PER MODALITÀ MANUALE */}
          {manualMode && flippedCards.length < bids.length && !revealComplete && (
            <ManualModeIndicator>
              <div style={{ 
                color: '#ff6b6b', 
                fontWeight: 600, 
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <Crown size={18} />
                MODALITÀ MANUALE ATTIVA
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                Clicca sulle carte per rivelare le offerte una alla volta!
                <br />
                Carte rivelate: {flippedCards.length}/{bids.length}
              </div>
            </ManualModeIndicator>
          )}

          {/* ✅ BOTTONE RESET */}
          {(flippedCards.length > 0 || manualMode) && !revealComplete && (
            <RevealButton
              onClick={resetReveal}
              style={{ 
                background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
                marginBottom: '1rem'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={18} />
              Ricomincia
            </RevealButton>
          )}

          <CardsGrid>
            {(manualMode 
              ? shuffledBids // ✅ Usa l'array CONGELATO in modalità manuale
              : bids // Ordine normale per modalità automatica
            ).map((bid) => {
              const isFlipped = flippedCards.includes(bid.id);
              const isTied = hasTie && bid.importo === topBidAmount;
              const allRevealed = manualMode && flippedCards.length === shuffledBids.length; // ✅ Tutte le carte girate
              
              return (
                <CardContainer key={bid.id}>
                  <FlippingCard
                    $manualMode={manualMode}
                    $isFlipped={isFlipped}
                    onClick={() => handleCardClick(bid.id)}
                    animate={{ 
                      rotateY: isFlipped ? 180 : 0 
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                    whileHover={manualMode && !isFlipped ? { scale: 1.05 } : {}}
                  >
                    <CardFront $showUsername={manualMode}>
                      {manualMode ? (
                        <>
                          <Users size={24} />
                          <CardUsername style={{ color: 'white', fontSize: '0.9rem', marginTop: '4px' }}>
                            {bid.username}
                          </CardUsername>
                          <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
                            Clicca per rivelare
                          </div>
                        </>
                      ) : (
                        <>
                          <Users size={28} />
                          <div style={{ marginTop: '6px', fontSize: '0.8rem' }}>
                            Offerta Nascosta
                          </div>
                        </>
                      )}
                    </CardFront>
                    
                    <CardBack 
                      $rank={bid.rank} 
                      $isTied={isTied} 
                      $manualMode={manualMode} 
                      $isFlipped={isFlipped}
                      $allRevealed={allRevealed}
                    >
                      <CardRank 
                        $rank={bid.rank} 
                        $isTied={isTied} 
                        $manualMode={manualMode} 
                        $isFlipped={isFlipped}
                        $allRevealed={allRevealed}
                      >
                        {/* ✅ In modalità manuale: NESSUN numero finché non sono tutte girate */}
                        {manualMode ? (
                          allRevealed ? (bid.rank === 1 ? '👑' : bid.rank) : '●'
                        ) : (
                          isTied ? '⚖️' : bid.rank === 1 ? '👑' : bid.rank
                        )}
                      </CardRank>
                      <CardUsername>{bid.username}</CardUsername>
                      <CardAmount>
                        <Coins size={18} />
                        {bid.importo}
                      </CardAmount>
                      {isTied && <AlertTriangle size={16} style={{ marginTop: '2px' }} />}
                      {!isTied && bid.rank === 1 && hasWinner && <Trophy size={16} style={{ marginTop: '2px' }} />}
                    </CardBack>
                  </FlippingCard>
                </CardContainer>
              );
            })}
          </CardsGrid>
        </ResultsSection>
      )}
    </Container>
  );
};

export default RisultatiAsta;