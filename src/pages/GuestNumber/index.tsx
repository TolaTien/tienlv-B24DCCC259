import React, { useState } from 'react';
import {GuestGame } from '../../models/GuestGame';

const GuestNumber: React.FC = () => {
  const { 
    attemptsLeft, 
    message, 
    isGameOver, 
    isVictory, 
    handleGuess, 
    resetGame 
  } = GuestGame();

  const [inputVal, setInputVal] = useState<string>('');

  const onSubmit = () => {
    const num = parseInt(inputVal);
    if (!isNaN(num)) {
      handleGuess(num);
      setInputVal(''); // Reset ô nhập sau khi đoán
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Trò chơi đoán số</h2>
      
      <div style={{ marginBottom: '15px', fontWeight: 'bold', color: isVictory ? 'green' : isGameOver ? 'red' : 'black' }}>
        {message}
      </div>

      <div style={{ marginBottom: '10px' }}>
        Số lượt còn lại: <strong>{attemptsLeft}</strong>
      </div>

      {!isGameOver ? (
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Nhập số dự đoán..."
            style={{ padding: '8px', flex: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          />
          <button onClick={onSubmit} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Đoán
          </button>
        </div>
      ) : (
        <button 
          onClick={resetGame} 
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Chơi lại
        </button>
      )}
    </div>
  );
};

export default GuestNumber;