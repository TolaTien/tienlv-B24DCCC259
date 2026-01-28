import { useState, useEffect } from 'react';

export const GuestGame = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(10);
  const [message, setMessage] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // sinh số ngẫu nhiên từ 1 đến 100
  const generateNumber = () => Math.floor(Math.random() * 100) + 1;
  
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setTargetNumber(generateNumber());
    setAttemptsLeft(10);
    setMessage('Hãy nhập một số từ 1 đến 100 để bắt đầu!');
    setIsGameOver(false);
    setIsVictory(false);
  };

  const handleGuess = (guess: number) => {
    if (isGameOver) return;

    if (guess === targetNumber) {
      setMessage('Chúc mừng! Bạn đã đoán đúng!');
      setIsVictory(true);
      setIsGameOver(true);
      return;
    }

    const newAttempts = attemptsLeft - 1;
    setAttemptsLeft(newAttempts);

    if (newAttempts === 0) {
      setMessage(`Bạn đã hết lượt! Số đúng là ${targetNumber}.`);
      setIsGameOver(true);
    } else {
      if (guess < targetNumber) {
        setMessage('Bạn đoán quá thấp!');
      } else {
        setMessage('Bạn đoán quá cao!');
      }
    }
  };

  return {
    attemptsLeft,
    message,
    isGameOver,
    isVictory,
    handleGuess,
    resetGame,
  };
};