import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCw, Sparkles, Crown, Dice6 } from 'lucide-react';
import mascotteImg from '../assets/mascotte.png';


const Container = styled.div`
  min-height: calc(100vh - 140px);
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  isolation: isolate;
`;

const FaceBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
`;

const FaceCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background-image: url(${mascotteImg});
  background-size: cover;
  background-position: center;
  opacity: ${props => props.$opacity};
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  top: ${props => props.$top}%;
  left: ${props => props.$left}%;
  ${props => props.$spinning && `
    animation: twinkle 1.4s ease-in-out infinite;
    animation-delay: ${props.$delay}s;
  `}

  /* brightness() e' relativo: illumina ogni cerchio partendo dalla sua opacita'
     di base senza bisogno di un keyframe diverso per ciascuno */
  @keyframes twinkle {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(2.2); }
  }
`;

const FACE_CIRCLES = [
  { size: 90, top: 4, left: 6, opacity: 0.4 },
  { size: 140, top: 2, left: 22, opacity: 0.3 },
  { size: 60, top: 12, left: 40, opacity: 0.36 },
  { size: 110, top: 6, left: 62, opacity: 0.33 },
  { size: 75, top: 3, left: 82, opacity: 0.42 },
  { size: 130, top: 20, left: 88, opacity: 0.28 },
  { size: 55, top: 30, left: 4, opacity: 0.36 },
  { size: 95, top: 38, left: 16, opacity: 0.31 },
  { size: 45, top: 46, left: 92, opacity: 0.4 },
  { size: 160, top: 55, left: 2, opacity: 0.26 },
  { size: 70, top: 62, left: 20, opacity: 0.36 },
  { size: 100, top: 70, left: 84, opacity: 0.3 },
  { size: 50, top: 78, left: 8, opacity: 0.4 },
  { size: 120, top: 74, left: 62, opacity: 0.28 },
  { size: 65, top: 88, left: 30, opacity: 0.36 },
  { size: 85, top: 86, left: 48, opacity: 0.33 },
  { size: 55, top: 90, left: 70, opacity: 0.36 },
  { size: 105, top: 84, left: 90, opacity: 0.3 },
];

const BackgroundDecorations = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    top: -150px;
    left: -150px;
    animation: float 6s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    bottom: -100px;
    right: -100px;
    animation: float 8s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
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
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.15) 100%);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.3);
  margin-bottom: 0.5rem;
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
  border-top: 20px solid #EF4444;
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
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
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
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
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
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  border-radius: 20px;
  padding: 2.5rem;
  color: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.2);
  max-width: 800px;
  width: 90%;
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    padding: 2rem;
  }
`;

const ResultTextCol = styled.div`
  flex: 1;
  text-align: center;
  min-width: 0;
`;

const ResultImageCol = styled.div`
  flex-shrink: 0;
  width: 260px;
  height: 260px;
  border-radius: 16px;
  background-image: url(${mascotteImg});
  background-size: cover;
  background-position: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 640px) {
    width: 100%;
    max-width: 260px;
    height: 200px;
  }
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
  color: #FBBF24;
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
  const wheelRef = useRef(null);

  const colors = ['#6366F1', '#4F46E5'];

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
      <FaceBackground>
        {FACE_CIRCLES.map((c, i) => (
          <FaceCircle
            key={i}
            $size={c.size}
            $top={c.top}
            $left={c.left}
            $opacity={c.opacity}
            $spinning={isSpinning}
            $delay={(i % 7) * 0.2}
          />
        ))}
      </FaceBackground>
      <BackgroundDecorations />
      
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
                  fill="#6366F1"
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
              </motion.button>
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
              <ResultTextCol>
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
                  <Crown size={60} color="#FBBF24" />
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
              </ResultTextCol>

              <ResultImageCol />
            </ResultContent>
          </ResultModal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default RandomPlayerWheel;