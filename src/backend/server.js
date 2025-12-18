// 1. O import do dotenv DEVE ser a primeiríssima linha.
// Isso garante que as variáveis existam antes que o 'db_connection.js' tente usá-las.
import 'dotenv/config'; 

import express from 'express';
import cors from 'cors';
import apiRouter from './api/routes.js';
import { pool } from './database/db_connection.js';
import iniciarCronJobs from './jobs/dailyReset.js';

const app = express();

// IMPORTANTE: No Render, a porta é fornecida automaticamente pelo sistema
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: '*' })); // Permite acesso de qualquer lugar (Front na Vercel)
app.use(express.json({ limit: '10mb' }));

// Rotas
// Isso define que tudo começa com /api (Ex: /api/leaderboard)
app.use('/api', apiRouter);

// Rota de Teste Simples (para saber se o server está vivo no navegador)
app.get('/', (req, res) => {
    res.send('✅ Backend CapibaFit está online! Acesse /api para usar.');
});

// Inicialização
app.listen(PORT, async () => {
    console.log(`🚀 Backend rodando na porta ${PORT}`);
    
    // Teste de Conexão com o Banco
    try {
        // Agora o pool já terá a senha carregada corretamente
        await pool.query('SELECT 1');
        console.log('✅ Banco de dados conectado com sucesso!');
    } catch (err) {
        console.error('❌ CRÍTICO: Falha na conexão com o banco:', err.message);
    }

    // Iniciar Cron Jobs (Verificação diária de Streaks)
    if (typeof iniciarCronJobs === 'function') {
        iniciarCronJobs();
        console.log('⏰ Cron Jobs iniciados.');
    } else {
        console.warn('⚠️ Atenção: iniciarCronJobs não foi carregado corretamente.');
    }
});