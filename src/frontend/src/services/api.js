import axios from 'axios';

// AQUI É O SEGREDO:
// O Vite vai buscar a variável de ambiente que configuramos na Vercel.
// Se por acaso ela não existir, deixei um aviso no console para você saber.
const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  console.error("🚨 ERRO CRÍTICO: A URL da API (VITE_API_URL) não foi encontrada!");
  console.warn("Verifique as 'Environment Variables' no painel da Vercel.");
}

const api = axios.create({
  baseURL: apiUrl, // Usa EXCLUSIVAMENTE a URL da nuvem
});

export default api;