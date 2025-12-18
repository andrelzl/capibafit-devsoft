import React, { useState } from 'react';
import api from '../../services/api'; // <--- IMPORTANTE: Importando nosso centralizador

const ChallengeCard = ({ id, title, reward, current, target, type, claimed }) => {
  const [loading, setLoading] = useState(false);

  // Lógica da Barra de Progresso
  const progressPercent = Math.min((current / target) * 100, 100);
  const isCompleted = current >= target;
  
  // Regra: Só pode resgatar se completou (isCompleted) E ainda não resgatou (!claimed)
  const canClaim = isCompleted && !claimed;

  const handleResgatar = async () => {
    // Busca usuário no LocalStorage
    const storedUser = localStorage.getItem('capiba_user');
    
    if (!storedUser) {
        return alert("Erro: Usuário não identificado. Faça login novamente.");
    }
    
    const user = JSON.parse(storedUser);
    setLoading(true);

    try {
      // --- AQUI MUDOU ---
      // Usamos 'api.post' em vez de fetch. 
      // Não precisa digitar a URL inteira, ele pega do api.js
      const response = await api.post('/challenges/claim', {
        userId: user.user_id, 
        challengeId: id 
      });

      // O Axios já traz os dados prontos em response.data
      const data = response.data; 

      // Sucesso!
      alert(`🎉 Parabéns! +${data.reward || reward} Capibas na conta!`);
      window.location.reload(); // Recarrega para atualizar saldo e bloquear o botão

    } catch (error) {
      console.error("Erro no resgate:", error);
      
      // Tratamento de erro específico do Axios
      const errorMessage = error.response?.data?.error || "Erro de conexão com o servidor.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Define a aparência do botão
  let buttonStyle = styles.btnActive; // Padrão cinza
  let buttonText = "Em andamento";
  let isDisabled = true;

  if (claimed) {
    buttonStyle = styles.btnClaimed; // Verde claro (Travado)
    buttonText = "Resgatado ✅";
  } else if (canClaim) {
    buttonStyle = styles.btnCompleted; // Verde forte (Clicável)
    buttonText = loading ? "Processando..." : "Resgatar 💰";
    isDisabled = false;
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>{type === 'streak' ? '🔥' : '👟'}</span>
        <span style={styles.reward}>+{reward} 🪙</span>
      </div>
      
      <h4 style={styles.title}>{title}</h4>
      
      <div style={styles.progressContainer}>
        <div style={styles.progressBarBg}>
          <div 
            style={{
              ...styles.progressBarFill, 
              width: `${progressPercent}%`,
              backgroundColor: isCompleted ? '#4CAF50' : '#FF9800'
            }} 
          />
        </div>
        <p style={styles.progressText}>
          {current}/{target} {type === 'streak' ? 'dias' : 'km'}
        </p>
      </div>

      <button 
        style={buttonStyle} 
        onClick={!isDisabled ? handleResgatar : undefined}
        disabled={isDisabled || loading}
      >
        {buttonText}
      </button>
    </div>
  );
};

const styles = {
  card: {
    minWidth: '160px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '10px',
    border: '1px solid #f0f0f0'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px'
  },
  icon: {
    fontSize: '1.2rem',
    background: '#FFF0E6',
    padding: '5px',
    borderRadius: '8px'
  },
  reward: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#FF9800',
    background: '#FFF8E1',
    padding: '4px 8px',
    borderRadius: '12px'
  },
  title: {
    margin: '0',
    fontSize: '0.95rem',
    color: '#333',
    lineHeight: '1.3'
  },
  progressContainer: {
    width: '100%'
  },
  progressBarBg: {
    width: '100%',
    height: '6px',
    backgroundColor: '#E0E0E0',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '4px'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease'
  },
  progressText: {
    margin: 0,
    fontSize: '0.75rem',
    color: '#999',
    textAlign: 'right'
  },
  btnActive: {
    border: 'none',
    background: '#f5f5f5',
    color: '#aaa',
    padding: '8px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    cursor: 'not-allowed',
    fontWeight: 'bold'
  },
  btnCompleted: {
    border: 'none',
    background: '#4CAF50',
    color: '#fff',
    padding: '8px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 2px 5px rgba(76, 175, 80, 0.3)',
    transition: 'transform 0.1s'
  },
  btnClaimed: {
    border: '1px solid #E8F5E9',
    background: '#E8F5E9',
    color: '#2E7D32',
    padding: '8px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    cursor: 'default',
    fontWeight: 'bold'
  }
};

export default ChallengeCard;