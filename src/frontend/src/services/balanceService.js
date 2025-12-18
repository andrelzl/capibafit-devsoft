import api from './api'; // Importa nossa conexão inteligente com a Nuvem

/**
 * Função auxiliar para pegar o ID do usuário logado com segurança.
 * Lê direto do LocalStorage para evitar IDs "presos" em memória.
 */
const getSafeUserId = () => {
    try {
        const stored = localStorage.getItem('capiba_user');
        if (!stored) return null;
        
        const user = JSON.parse(stored);
        return user.user_id || user.id;
    } catch (e) {
        console.error("Erro ao ler usuário do cache:", e);
        return null;
    }
};

/**
 * Busca o saldo total consolidado do usuário.
 */
export async function getUserBalance() {
    const userId = getSafeUserId();
    
    // Se não tiver usuário logado, o saldo é 0 (segurança)
    if (!userId) return 0; 

    try {
        const response = await api.get(`/users/${userId}/balance`);
        
        // O Backend retorna: { balance: 500 }
        // Se vier null ou undefined, assume 0.
        return response.data.balance ?? 0;

    } catch (error) {
        console.error("Erro ao buscar saldo:", error);
        // Em caso de erro (ex: internet caiu), retorna 0.
        // NUNCA retorne valor fixo (tipo 100) aqui.
        return 0; 
    }
}

/**
 * Busca a lista de transações (para o extrato).
 */
export async function getUserTransactions() {
    const userId = getSafeUserId();
    if (!userId) return [];

    try {
        const response = await api.get(`/users/${userId}/transactions`);
        
        // CORREÇÃO CRÍTICA:
        // O seu Backend envia um Array puro: [ {...}, {...} ]
        // O código antigo esperava: { transactions: [...] } -> Isso dava erro.
        
        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            // Caso o backend mude no futuro e mande objeto, tentamos achar a lista
            return response.data.transactions || [];
        }

    } catch (error) {
        console.error("Erro ao buscar extrato:", error);
        return []; // Retorna lista vazia para não quebrar a tela
    }
}
