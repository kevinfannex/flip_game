import React, { useState, useEffect } from 'react';
import { Timer, Bomb } from 'lucide-react';

// Card data with Money Heist characters
const cardData = [
  { id: 1, name: 'Professor', character: true },
  { id: 2, name: 'Berlin', character: true },
  { id: 3, name: 'Tokyo', character: true },
  { id: 4, name: 'Nairobi', character: true },
  { id: 5, name: 'Rio', character: true },
  { id: 6, name: 'Denver', character: true },
  { id: 7, name: 'Helsinki', character: true },
  { id: 8, name: 'Oslo', character: true },
  { id: 9, name: 'Police Trap', character: false },
  { id: 10, name: 'Police Trap', character: false },
].flatMap(card => [
  { ...card, uniqueId: `${card.id}-1` },
  { ...card, uniqueId: `${card.id}-2` }
]);

function App() {
  const [cards, setCards] = useState(() => shuffleCards([...cardData]));
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [lastMatchedPair, setLastMatchedPair] = useState<string[]>([]);
  const [showPoliceEffect, setShowPoliceEffect] = useState(false);
  // URL for redirection - you'll need to replace this with your actual URL
  const redirectUrl = "YOUR_REDIRECT_URL_HERE"; 

  useEffect(() => {
    let interval: number;
    if (gameStarted && matchedPairs.length < cardData.length) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, matchedPairs.length]);

  const handleCardClick = (uniqueId: string) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (
      flippedCards.length === 2 ||
      flippedCards.includes(uniqueId) ||
      matchedPairs.includes(uniqueId)
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, uniqueId];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstCard, secondCard] = newFlippedCards.map(id => 
        cards.find(card => card.uniqueId === id)
      );

      if (firstCard?.id === secondCard?.id) {
        // Check if both are Police Trap cards
        if (!firstCard.character && firstCard.name === "Police Trap") {
          setTimeout(() => {
            // Show police trap effect
            setShowPoliceEffect(true);
            
            // If we have a previous match to undo
            if (lastMatchedPair.length === 2) {
              // Remove the last matched pair from matchedPairs
              setMatchedPairs(prev => 
                prev.filter(id => !lastMatchedPair.includes(id))
              );
              
              // Decrease the move counter
              setMoves(prev => Math.max(0, prev - 2)); // Subtract 2 moves (one for the match and one for the police trap)
              
              setTimeout(() => {
                // Add the police trap to matched pairs
                setMatchedPairs(prev => [...prev, firstCard.uniqueId, secondCard.uniqueId]);
                setFlippedCards([]);
                setShowPoliceEffect(false);
              }, 1500);
            } else {
              // Just match the police trap cards if there's no previous match to undo
              setMatchedPairs(prev => [...prev, firstCard.uniqueId, secondCard.uniqueId]);
              setFlippedCards([]);
              setShowPoliceEffect(false);
            }
          }, 1000);
        } else {
          // Regular match (not police trap)
          setTimeout(() => {
            setMatchedPairs(prev => [...prev, firstCard.uniqueId, secondCard.uniqueId]);
            // Store this match as the last successful match
            setLastMatchedPair([firstCard.uniqueId, secondCard.uniqueId]);
            setFlippedCards([]);
          }, 1000);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  function shuffleCards(array: typeof cardData) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Function to redirect to another webpage
  const handleRedirect = () => {
    window.location.href = redirectUrl;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to get character-specific styling
  const getCardStyle = (card) => {
    if (!card.character) {
      return "bg-gradient-to-br from-blue-800 to-blue-950 border-blue-700";
    }
    
    // Character-specific color schemes
    const characterStyles = {
      'Professor': "bg-gradient-to-br from-gray-800 to-gray-950 border-gray-600",
      'Berlin': "bg-gradient-to-br from-purple-800 to-purple-950 border-purple-700",
      'Tokyo': "bg-gradient-to-br from-pink-800 to-pink-950 border-pink-700",
      'Nairobi': "bg-gradient-to-br from-yellow-800 to-yellow-950 border-yellow-700",
      'Rio': "bg-gradient-to-br from-green-800 to-green-950 border-green-700",
      'Denver': "bg-gradient-to-br from-orange-800 to-orange-950 border-orange-700",
      'Helsinki': "bg-gradient-to-br from-blue-800 to-blue-950 border-blue-700",
      'Oslo': "bg-gradient-to-br from-indigo-800 to-indigo-950 border-indigo-700",
    };
    
    return characterStyles[card.name] || "bg-gradient-to-br from-red-800 to-red-950 border-red-700";
  };

  // Function to get character emoji
  const getCharacterEmoji = (name) => {
    const emojiMap = {
      'Professor': '🧠',
      'Berlin': '🎭',
      'Tokyo': '💣',
      'Nairobi': '💰',
      'Rio': '💻',
      'Denver': '😂',
      'Helsinki': '💪',
      'Oslo': '🔨',
      'Police Trap': '👮',
    };
    
    return emojiMap[name] || '❓';
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">La Casa de Papel: Memory Heist</h1>
          <p className="text-lg mb-4 text-red-400">Watch out for police traps! Complete the heist by matching the crew. 💰</p>
          <p className="text-sm mb-6 text-blue-400">Finding two Police Traps will undo your last match and save you a move!</p>
          <div className="flex justify-center gap-8 mb-6">
            <div className="flex items-center gap-2 bg-red-900/30 px-4 py-2 rounded-lg border border-red-800">
              <Timer className="w-6 h-6 text-red-500" />
              <span className="text-xl">{formatTime(timer)}</span>
            </div>
            <div className="flex items-center gap-2 bg-red-900/30 px-4 py-2 rounded-lg border border-red-800">
              <Bomb className="w-6 h-6 text-red-500" />
              <span className="text-xl">Moves: {moves}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {cards.map(card => {
            const isFlipped = flippedCards.includes(card.uniqueId);
            const isMatched = matchedPairs.includes(card.uniqueId);
            const wasUndone = lastMatchedPair.includes(card.uniqueId) && !matchedPairs.includes(card.uniqueId) && showPoliceEffect;
            
            return (
              <div
                key={card.uniqueId}
                className="aspect-square cursor-pointer"
                onClick={() => !isMatched && handleCardClick(card.uniqueId)}
              >
                <div 
                  className={`relative w-full h-full transition-transform duration-500 ${isFlipped || isMatched ? 'rotate-y-180' : ''} ${wasUndone ? 'animate-pulse' : ''}`} 
                  style={{transformStyle: 'preserve-3d'}}
                >
                  {/* Card Back */}
                  <div 
                    className={`absolute w-full h-full backface-hidden ${isFlipped || isMatched ? 'hidden' : 'block'}`}
                    style={{backfaceVisibility: 'hidden'}}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-red-800 to-red-950 rounded-lg flex items-center justify-center border-2 border-red-700 shadow-lg">
                      <span className="text-4xl">💶</span>
                    </div>
                  </div>
                  
                  {/* Card Front */}
                  <div 
                    className={`absolute w-full h-full backface-hidden ${isFlipped || isMatched ? 'block' : 'hidden'}`}
                    style={{transform: 'rotateY(180deg)', backfaceVisibility: 'hidden'}}
                  >
                    {card.character ? (
                      <div className={`w-full h-full rounded-lg border-2 shadow-lg ${getCardStyle(card)}`}>
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className="text-5xl mb-2">{getCharacterEmoji(card.name)}</span>
                          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mb-2 border-2 border-red-400">
                            <span className="text-3xl">{card.name.charAt(0)}</span>
                          </div>
                          <p className="text-center text-sm font-mono bg-black bg-opacity-50 px-2 py-1 rounded mt-2">{card.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-950 rounded-lg flex items-center justify-center border-2 border-blue-700">
                        <div className="flex flex-col items-center">
                          <span className="text-4xl mb-2">👮</span>
                          <div className="bg-blue-700 px-3 py-1 rounded-full">
                            <span className="text-xs font-bold">TRAP</span>
                          </div>
                          <p className="text-center text-sm font-mono bg-black bg-opacity-50 px-2 py-1 rounded mt-2">{card.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Police Trap Effect Overlay */}
        {showPoliceEffect && (
          <div className="fixed inset-0 bg-blue-900 bg-opacity-30 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-8 rounded-lg text-center shadow-2xl border-2 border-blue-700 animate-pulse">
              <h2 className="text-3xl font-bold text-blue-400 mb-4">POLICE TRAP!</h2>
              <p className="text-xl">Your last match has been undone!</p>
              <p className="text-lg mt-2">A move has been saved!</p>
            </div>
          </div>
        )}

        {matchedPairs.length === cardData.length && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-gradient-to-br from-red-900 to-red-950 p-8 rounded-lg text-center shadow-2xl border-2 border-red-700">
              <h2 className="text-3xl font-bold text-red-500 mb-4">¡Victoria! Heist Complete!</h2>
              <p className="text-xl mb-4">You've successfully matched all crew members!</p>
              <p className="text-2xl mb-4">Time: {formatTime(timer)} | Moves: {moves}</p>
              <button
                onClick={handleRedirect}
                className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg transition-colors text-lg font-semibold"
              >
                Continue to Next Challenge
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;