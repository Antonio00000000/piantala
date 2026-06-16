<<<<<<< HEAD
const path = require('path');
// Carica le variabili d'ambiente usando il percorso assoluto sicuro
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ============================================================
// IMPORTAZIONE 
// ============================================================

const expressSession = require('express-session');
const passport = require('passport');

const app = express(); const cookieParser = require('cookie-parser');

app.use(cors());
// Permette a Express di leggere i dati JSON inviati nei form
app.use(express.json());
// Permette di leggere i cookie dalla richiesta 
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connessione con successo a Mongo"))
    .catch((err) => console.log("Errore di connessione: ", err));

// ============================================================
// CONFIGURAZIONE SESSIONE
// ============================================================

app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'polisync_secret',
    resave: false,              // non riscrive la sessione se non cambia
    saveUninitialized: false,   // non crea sessioni vuote
    cookie: {
        httpOnly: true,         // cookie non accessibile da JavaScript
        maxAge: 24 * 60 * 60 * 1000   // sessione valida 24 ore
    }
}));

// ============================================================
//  PASSPORT
// ============================================================

app.use(passport.initialize());
app.use(passport.session());

// ============================================================
// CHIAMATA PER GEMINI 
// ============================================================
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Il messaggio è vuoto" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const SYSTEM_PROMPT = "Tu sei un esperto botanico e medico delle piante. Quando un utente ti chiede un consiglio o una diagnosi, non scrivere paragrafi enormi. Usa elenchi puntati puliti, vai a capo spesso per far respirare il testo. Sii accogliente e usa qualche emoji a tema vegetale 🌿.";

        // Chiamata con i contesti strutturati
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: `ISTRUZIONI DI SISTEMA: ${SYSTEM_PROMPT} Rispondi alla seguente domanda dell'utente tenendo conto di queste istruzioni.` }]
                },
                {
                    role: "model",
                    parts: [{ text: "Certamente! Ho compreso il mio ruolo. Sono pronto ad aiutare l'utente come esperto medico delle piante." }]
                },
                {
                    role: "user",
                    parts: [{ text: message }]
                }
            ]
        });

        const responseText = result.response.text();

        // Manteniamo la struttura ad oggetti attesa da Chat
        const mockDataForReact = {
            candidates: [
                {
                    content: {
                        parts: [
                            { text: responseText }
                        ]
                    }
                }
            ]
        };

        res.json(mockDataForReact);

    } catch (error) {
        console.error("Errore restituito da Google Gemini SDK:", error);
        res.status(500).json({ error: "Errore interno del server durante la chiamata all'IA" });
    }
});

// ============================================================
// COLLEGAMENTO DEI ROUTER
// ============================================================

// Importo i router esterni dalle loro cartelle
const userRouter = require('./routes/user');
const prodottiRouter = require('./routes/prodotti');

// Rotte NON protette (accessibili senza token)
app.use('/api/user', userRouter);

// Da qui in poi tutte le rotte richiedono un access token valido
app.use(userRouter.verifyJWT);

// Rotte PROTETTE (richiedono access token nell'header Authorization)
app.use('/api/prodotti', prodottiRouter);

// ============================================================
// AVVIO DEL SERVER
// ============================================================

const PORT = process.env.PORT || 3000;
=======
const path = require('path');
// Carica le variabili d'ambiente usando il percorso assoluto sicuro
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ============================================================
// IMPORTAZIONE 
// ============================================================

const expressSession = require('express-session');
const passport = require('passport');

const app = express(); const cookieParser = require('cookie-parser');

app.use(cors());
// Permette a Express di leggere i dati JSON inviati nei form
app.use(express.json());
// Permette di leggere i cookie dalla richiesta 
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connessione con successo a Mongo"))
    .catch((err) => console.log("Errore di connessione: ", err));

// ============================================================
// CONFIGURAZIONE SESSIONE
// ============================================================

app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'polisync_secret',
    resave: false,              // non riscrive la sessione se non cambia
    saveUninitialized: false,   // non crea sessioni vuote
    cookie: {
        httpOnly: true,         // cookie non accessibile da JavaScript
        maxAge: 24 * 60 * 60 * 1000   // sessione valida 24 ore
    }
}));

// ============================================================
//  PASSPORT
// ============================================================

app.use(passport.initialize());
app.use(passport.session());

// ============================================================
// CHIAMATA PER GEMINI 
// ============================================================
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Il messaggio è vuoto" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const SYSTEM_PROMPT = "Tu sei un esperto botanico e medico delle piante. Quando un utente ti chiede un consiglio o una diagnosi, non scrivere paragrafi enormi. Usa elenchi puntati puliti, vai a capo spesso per far respirare il testo. Sii accogliente e usa qualche emoji a tema vegetale 🌿.";

        // Chiamata con i contesti strutturati
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: `ISTRUZIONI DI SISTEMA: ${SYSTEM_PROMPT} Rispondi alla seguente domanda dell'utente tenendo conto di queste istruzioni.` }]
                },
                {
                    role: "model",
                    parts: [{ text: "Certamente! Ho compreso il mio ruolo. Sono pronto ad aiutare l'utente come esperto medico delle piante." }]
                },
                {
                    role: "user",
                    parts: [{ text: message }]
                }
            ]
        });

        const responseText = result.response.text();

        // Manteniamo la struttura ad oggetti attesa da Chat
        const mockDataForReact = {
            candidates: [
                {
                    content: {
                        parts: [
                            { text: responseText }
                        ]
                    }
                }
            ]
        };

        res.json(mockDataForReact);

    } catch (error) {
        console.error("Errore restituito da Google Gemini SDK:", error);
        res.status(500).json({ error: "Errore interno del server durante la chiamata all'IA" });
    }
});

// ============================================================
// COLLEGAMENTO DEI ROUTER
// ============================================================

// Importo i router esterni dalle loro cartelle
const userRouter = require('./routes/user');
const prodottiRouter = require('./routes/prodotti');

// Rotte NON protette (accessibili senza token)
app.use('/api/user', userRouter);

// Da qui in poi tutte le rotte richiedono un access token valido
app.use(userRouter.verifyJWT);

// Rotte PROTETTE (richiedono access token nell'header Authorization)
app.use('/api/prodotti', prodottiRouter);

// ============================================================
// AVVIO DEL SERVER
// ============================================================

const PORT = process.env.PORT || 3000;
>>>>>>> 6af84f2084c9ab94edfefa9c680c19e73fd52ec0
app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));