import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCw, Trophy, Users, Sparkles, Crown, Dice6 } from 'lucide-react';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const BackgroundDecorations = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  
  @keyframes floatReverse {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(15px) rotate(-3deg); }
  }
`;

const CircleDecoration = styled.div`
  position: absolute;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.6;
  
  &.circle-1 {
    width: 120px;
    height: 120px;
    top: 10%;
    left: -60px;
    animation: float 8s ease-in-out infinite;
  }
  
  &.circle-2 {
    width: 80px;
    height: 80px;
    top: 60%;
    left: -40px;
    animation: floatReverse 6s ease-in-out infinite;
  }
  
  &.circle-3 {
    width: 100px;
    height: 100px;
    top: 30%;
    right: -50px;
    animation: float 10s ease-in-out infinite;
  }
  
  &.circle-4 {
    width: 60px;
    height: 60px;
    top: 70%;
    right: -30px;
    animation: floatReverse 7s ease-in-out infinite;
  }
  
  &.circle-5 {
    width: 90px;
    height: 90px;
    bottom: 20%;
    right: -45px;
    animation: float 9s ease-in-out infinite;
  }
  
  &.circle-6 {
    width: 70px;
    height: 70px;
    bottom: 10%;
    left: -35px;
    animation: floatReverse 8s ease-in-out infinite;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  z-index: 2;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  z-index: 2;
`;

const PlayerSelectionArea = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.3);
  margin-bottom: 0.5rem;
`;

const ImageUploadSection = styled.div`
  margin-bottom: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 1rem;
`;

const ImageUpload = styled.input`
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  width: 100%;
  max-width: 300px;
  
  &::file-selector-button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 4px;
    padding: 0.3rem 0.6rem;
    color: white;
    margin-right: 0.5rem;
    cursor: pointer;
  }
`;

const ImageUploadLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
`;

const PlayerInputs = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const PlayerInput = styled.input`
  padding: 0.6rem 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  font-size: 0.9rem;
  width: 180px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 500;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    font-weight: 400;
  }
`;

const WheelContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const WheelWrapper = styled.div`
  position: relative;
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WheelSVG = styled.svg`
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
`;

const Pointer = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 20px solid #ff6b6b;
  z-index: 10;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
`;

const ControlArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const SpinButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ResultContent = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  color: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 90%;
`;

const WinnerName = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 1rem 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const SparkleAnimation = styled(motion.div)`
  position: absolute;
  color: #ffd700;
  font-size: 2rem;
  pointer-events: none;
`;

const RandomPlayerWheel = () => {
  const [player1, setPlayer1] = useState('Lore');
  const [player2, setPlayer2] = useState('Edo');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const wheelRef = useRef(null);

  const colors = ['#667eea', '#764ba2'];

  const createSparkles = () => {
    const newSparkles = [];
    for (let i = 0; i < 12; i++) {
      newSparkles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 2,
      });
    }
    setSparkles(newSparkles);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const spinWheel = () => {
    if (isSpinning || !player1.trim() || !player2.trim()) return;

    setIsSpinning(true);
    createSparkles();

    const baseRotation = 360 * (4 + Math.random() * 6);
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + baseRotation + finalAngle;

    setRotation(totalRotation);

    const normalizedAngle = (totalRotation % 360);
    const winnerIndex = normalizedAngle > 180 ? 0 : 1;
    const winnerName = winnerIndex === 0 ? player1 : player2;

    setTimeout(() => {
      setWinner(winnerName);
      setShowResult(true);
      setIsSpinning(false);
    }, 4000);
  };

  const resetWheel = () => {
    setRotation(0);
    setWinner(null);
    setShowResult(false);
    setSparkles([]);
  };

  const canSpin = player1.trim() && player2.trim() && !isSpinning;

  return (
    <Container>
      <BackgroundDecorations>
        {imageUrl && (
          <>
            <CircleDecoration 
              className="circle-1" 
              style={{ backgroundImage: `url(${imageUrl})` }} 
            />
            <CircleDecoration 
              className="circle-2" 
              style={{ backgroundImage: `url(${imageUrl})` }} 
            />
            <CircleDecoration 
              className="circle-3" 
              style={{ backgroundImage: `url(${imageUrl})` }} 
            />
            <CircleDecoration 
              className="circle-4" 
              style={{ backgroundImage: `url(${imageUrl})` }} 
            />
            <CircleDecoration 
              className="circle-5" 
              style={{ backgroundImage: `url(${imageUrl})` }} 
            />
            <CircleDecoration 
              className="circle-6" 
              style={{ backgroundImage: `url(${imageUrl})` }} 
            />
          </>
        )}
      </BackgroundDecorations>
      
      {/* Sparkles Animation */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <SparkleAnimation
            key={sparkle.id}
            initial={{ 
              x: sparkle.x, 
              y: sparkle.y, 
              scale: 0, 
              rotate: 0,
              opacity: 0 
            }}
            animate={{ 
              scale: [0, 1, 0], 
              rotate: 360,
              opacity: [0, 1, 0],
              y: sparkle.y - 100
            }}
            transition={{ 
              duration: 2,
              delay: sparkle.delay,
              ease: "easeOut"
            }}
            style={{
              position: 'fixed',
              left: sparkle.x,
              top: sparkle.y,
            }}
          >
            <Sparkles />
          </SparkleAnimation>
        ))}
      </AnimatePresence>

      <Header>
        <Title>
          <Dice6 size={32} />
          Giocatore Random
          <Dice6 size={32} />
        </Title>
        <Subtitle>
          Se sei un ebreo sei nel posto giusto! Spendilo un credito in più tirchiaccio maledetto!
        </Subtitle>
      </Header>

      <MainContent>
        <PlayerSelectionArea>
          <ImageUploadSection>
            <ImageUpload
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <ImageUploadLabel>
              📸 Carica un'immagine per le decorazioni circolari
            </ImageUploadLabel>
          </ImageUploadSection>
          
          <PlayerInputs>
            <PlayerInput
              type="text"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              placeholder="Nome Primo Giocatore"
              disabled={isSpinning}
            />
            <PlayerInput
              type="text"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              placeholder="Nome Secondo Giocatore"
              disabled={isSpinning}
            />
          </PlayerInputs>
        </PlayerSelectionArea>

        <WheelContainer>
          <WheelWrapper>
            <Pointer />
            <WheelSVG viewBox="0 0 240 240">
              <motion.g
                ref={wheelRef}
                animate={{ rotate: rotation }}
                transition={{ 
                  duration: isSpinning ? 4 : 0,
                  ease: isSpinning ? [0.17, 0.67, 0.12, 0.99] : "linear"
                }}
                style={{ transformOrigin: "120px 120px" }}
              >
                {/* Primo spicchio */}
                <path
                  d="M 120 120 L 120 0 A 120 120 0 0 1 120 240 Z"
                  fill={colors[0]}
                  stroke="white"
                  strokeWidth="3"
                />
                
                {/* Secondo spicchio */}
                <path
                  d="M 120 120 L 120 240 A 120 120 0 0 1 120 0 Z"
                  fill={colors[1]}
                  stroke="white"
                  strokeWidth="3"
                />

                {/* Testo giocatore 1 */}
                <text
                  x="180"
                  y="125"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                >
                  {player1}
                </text>

                {/* Testo giocatore 2 */}
                <text
                  x="60"
                  y="125"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                >
                  {player2}
                </text>

                {/* Centro decorativo */}
                <circle
                  cx="120"
                  cy="120"
                  r="18"
                  fill="white"
                  stroke="#333"
                  strokeWidth="2"
                />
                <circle
                  cx="120"
                  cy="120"
                  r="8"
                  fill="#667eea"
                />
              </motion.g>
            </WheelSVG>
          </WheelWrapper>

          <ControlArea>
            <SpinButton
              onClick={spinWheel}
              disabled={!canSpin}
              whileHover={{ scale: canSpin ? 1.05 : 1 }}
              whileTap={{ scale: canSpin ? 0.95 : 1 }}
            >
              {isSpinning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RotateCw size={20} />
                  </motion.div>
                  Girando...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Gira la Ruota!
                </>
              )}
            </SpinButton>

            {(winner || rotation > 0) && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={resetWheel}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '0.5rem 1rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Reset Ruota
              </button>
            )}
          </ControlArea>
        </WheelContainer>
      </MainContent>

      {/* Modal Risultato */}
      <AnimatePresence>
        {showResult && (
          <ResultModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultContent
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: 2,
                  delay: 0.2
                }}
              >
                <Crown size={60} color="#ffd700" />
              </motion.div>
              
              <h1 style={{ fontSize: '1.5rem', margin: '1rem 0 0.5rem' }}>
                🎉 VINCITORE! 🎉
              </h1>
              
              <WinnerName>{winner}</WinnerName>
              
              <p style={{ 
                fontSize: '1.1rem', 
                opacity: 0.9,
                margin: '1rem 0' 
              }}>
                La fortuna ha scelto! Adesso iè cassi toi! 🏆
              </p>
              
              <CloseButton onClick={() => setShowResult(false)}>
                Chiudi
              </CloseButton>
            </ResultContent>
          </ResultModal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default RandomPlayerWheel;