import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dice6, 
  RotateCw, 
  RotateCcw, 
  Crown, 
  Shuffle, 
  RefreshCw,
  Zap,
  Play
} from 'lucide-react';

// Mock data per demo - sostituisci con la tua API
const mockUsers = [
  { id: 1, username: "Marco" },
  { id: 2, username: "Luigi" },
  { id: 3, username: "Anna" },
  { id: 4, username: "Sofia" },
  { id: 5, username: "Alex" },
  { id: 6, username: "Emma" }
];

const DealerSelection = () => {
  const [users, setUsers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Simula caricamento API
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRandomSelection = async () => {
    if (users.length === 0) return;
    
    setIsRandomizing(true);
    setResult(null);
    
    // Animazione di randomizzazione
    for (let i = 0; i < 20; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomDirection = Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';
      
      setSelectedDealer(randomUser);
      setSelectedDirection(randomDirection);
      
      await new Promise(resolve => setTimeout(resolve, 100 + i * 10));
    }
    
    const finalDealer = users[Math.floor(Math.random() * users.length)];
    const finalDirection = Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';
    
    setSelectedDealer(finalDealer);
    setSelectedDirection(finalDirection);
    setIsRandomizing(false);
    
    setTimeout(() => {
      setResult({
        dealer: finalDealer,
        direction: finalDirection
      });
    }, 500);
  };

  const handleReset = () => {
    setSelectedDealer(null);
    setSelectedDirection(null);
    setResult(null);
  };

  // Calcola le posizioni dei giocatori attorno al tavolo
  const getPlayerPosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Inizia dal top
    const radiusX = 280; // Raggio orizzontale dell'ellisse
    const radiusY = 180; // Raggio verticale dell'ellisse
    const x = Math.cos(angle) * radiusX;
    const y = Math.sin(angle) * radiusY;
    return { x, y, angle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center">
        <div className="text-center text-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Dice6 size={48} />
          </motion.div>
          <p className="text-xl">Preparando il tavolo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h1 
          className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Dice6 size={36} className="text-yellow-400" />
          Tavolo da Poker
        </motion.h1>
        <p className="text-green-200 text-lg">Seleziona il dealer per la prossima mano</p>
      </div>

      {/* Tavolo da Poker */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="relative">
          {/* Tavolo principale */}
          <motion.div
            className="w-full h-96 bg-gradient-to-br from-green-700 to-green-600 rounded-full border-8 border-amber-600 shadow-2xl relative overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Texture del feltro */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent"></div>
            </div>

            {/* Logo centrale */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="text-center"
                animate={{ 
                  rotate: selectedDirection === 'clockwise' ? 360 : selectedDirection === 'counterclockwise' ? -360 : 0 
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <div className="bg-amber-500 rounded-full p-4 shadow-lg mb-2">
                  <Crown size={32} className="text-white" />
                </div>
                <p className="text-white font-bold text-sm">DEALER</p>
                
                {/* Freccia direzionale */}
                {selectedDirection && (
                  <motion.div
                    className="mt-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {selectedDirection === 'clockwise' ? (
                      <RotateCw size={24} className="text-yellow-400 mx-auto" />
                    ) : (
                      <RotateCcw size={24} className="text-yellow-400 mx-auto" />
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Posizioni dei giocatori */}
            <div className="absolute inset-0 flex items-center justify-center">
              {users.map((user, index) => {
                const position = getPlayerPosition(index, users.length);
                const isSelected = selectedDealer?.id === user.id;
                
                return (
                  <motion.div
                    key={user.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: `calc(50% + ${position.x}px)`,
                      top: `calc(50% + ${position.y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => setSelectedDealer(user)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                      scale: isRandomizing && isSelected ? [1, 1.3, 1] : 1,
                      rotate: isRandomizing && isSelected ? [0, 360] : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Posizione del giocatore */}
                    <div className={`
                      w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-sm
                      transition-all duration-300 shadow-lg
                      ${isSelected 
                        ? 'bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-300 text-amber-900 shadow-yellow-400/50' 
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-700 hover:border-yellow-400'
                      }
                    `}>
                      {user.username.charAt(0).toUpperCase()}
                      
                      {/* Corona per il dealer selezionato */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 border-2 border-white"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Crown size={12} className="text-amber-800" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Nome del giocatore */}
                    <div className={`
                      mt-2 px-2 py-1 rounded text-xs font-semibold text-center
                      ${isSelected 
                        ? 'bg-yellow-400 text-amber-900' 
                        : 'bg-white/90 text-gray-800'
                      }
                    `}>
                      {user.username}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Chip del dealer che si muove */}
            {selectedDealer && (
              <motion.div
                className="absolute w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                style={{
                  left: `calc(50% + ${getPlayerPosition(users.findIndex(u => u.id === selectedDealer.id), users.length).x}px)`,
                  top: `calc(50% + ${getPlayerPosition(users.findIndex(u => u.id === selectedDealer.id), users.length).y}px)`,
                  transform: 'translate(-50%, -120%)'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </motion.div>
            )}

            {/* Effetti particelle per la selezione finale */}
            <AnimatePresence>
              {result && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      style={{
                        left: `${50 + Math.random() * 20 - 10}%`,
                        top: `${50 + Math.random() * 20 - 10}%`,
                      }}
                      initial={{ scale: 0, y: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        y: [0, -50, -100],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Controlli direzione */}
      <div className="max-w-2xl mx-auto mb-8">
        <h3 className="text-white text-xl font-bold text-center mb-4">Direzione di Gioco</h3>
        <div className="flex gap-4 justify-center">
          <motion.button
            className={`
              px-6 py-4 rounded-lg font-semibold flex items-center gap-3 transition-all duration-300
              ${selectedDirection === 'clockwise'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }
            `}
            onClick={() => setSelectedDirection('clockwise')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCw size={24} />
            Senso Orario
          </motion.button>
          
          <motion.button
            className={`
              px-6 py-4 rounded-lg font-semibold flex items-center gap-3 transition-all duration-300
              ${selectedDirection === 'counterclockwise'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }
            `}
            onClick={() => setSelectedDirection('counterclockwise')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={24} />
            Senso Antiorario
          </motion.button>
        </div>
      </div>

      {/* Pulsanti azione */}
      <div className="flex gap-4 justify-center mb-8">
        <motion.button
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-3 shadow-lg disabled:opacity-50"
          onClick={handleRandomSelection}
          disabled={isRandomizing || users.length === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRandomizing ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Zap size={20} />
              </motion.div>
              Mescolando...
            </>
          ) : (
            <>
              <Shuffle size={20} />
              Selezione Casuale
            </>
          )}
        </motion.button>

        <motion.button
          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-3 shadow-lg"
          onClick={handleReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={20} />
          Reset
        </motion.button>
      </div>

      {/* Risultato finale */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="max-w-md mx-auto bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl p-6 text-center shadow-2xl"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="flex items-center justify-center gap-3 mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown size={32} className="text-amber-800" />
              <h3 className="text-2xl font-bold text-amber-900">Nuovo Dealer!</h3>
            </motion.div>
            <p className="text-lg text-amber-800 mb-2">
              <strong>{result.dealer.username}</strong> è il dealer
            </p>
            <p className="text-amber-700">
              Direzione: <strong>{result.direction === 'clockwise' ? 'Senso Orario' : 'Senso Antiorario'}</strong>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DealerSelection;