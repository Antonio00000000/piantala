<<<<<<< HEAD
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Importiamo il modello RefreshToken
const RefreshToken = require('../models/refreshToken');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "username obbligatorio"]
    },
    password: {
        type: String,
        required: [true, "password obbligatoria"]
    }
});

userSchema.pre("save", async function () {
    const user = this;

    // Se la password non è modificata, interrompiamo l'esecuzione del middleware
    if (!user.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    } catch (err) {
        throw err;
    }
});

userSchema.methods.passwordComparison = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports.User = User;

// ============================================================
// CONFIGURAZIONE PASSPORT
// ============================================================

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            const user = await User.findOne({ username });

            // Se l'utente non esiste, autenticazione fallita
            if (!user) {
                return done(null, false, { message: 'Utente non trovato' });
            }

            // Confrontiamo la password fornita con quella hashata nel DB
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Password errata' });
            }

            // Autenticazione riuscita: passiamo l'utente a done()
            return done(null, user);

        } catch (err) {
            return done(err);
        }
    }
));

// ============================================================
// SERIALIZZAZIONE / DESERIALIZZAZIONE UTENTE
// ============================================================

passport.serializeUser(function (user, done) {
    done(null, { id: user._id, username: user.username });
});

passport.deserializeUser(function (userSessionData, done) {
    done(null, userSessionData);
});

// ============================================================
// Access Token JWT
// ============================================================

function generaAccessToken(user) {
    return jwt.sign(
        {
            _id: user._id,
            username: user.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
}

// Creo la rotta per creare nuovi utenti
router.post("/registrazione", async (req, res) => {
    try {
        const nuovoUser = new User(req.body);
        const salvoUser = await nuovoUser.save();

        res.status(201).json({
            messaggio: "sei stato registrato correttamente",
            dati: { username: salvoUser.username } // Nota: rimosso ruolo se non presente nello schema
        });
    } catch (error) {
        res.status(400).json({
            messaggio: "errore durante la registrazione",
            errore: error.message
        });
    }
});

router.post("/accesso", async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Errore interno durante il login");
        }

        if (!user) {
            return res.status(401).send(info?.message || "Credenziali non valide");
        }

        // --- AUTENTICAZIONE RIUSCITA ---
        req.logIn(user, async (err) => {
            if (err) return next(err);

            try {
                const accessToken = generaAccessToken(user);
                const refreshTokenValue = crypto.randomBytes(64).toString('hex');

                const nuovoRefreshToken = new RefreshToken({
                    value: refreshTokenValue,
                    user: user._id
                });
                await nuovoRefreshToken.save();

                res.cookie('refreshToken', refreshTokenValue, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });

                return res.status(200).json({
                    message: "Login effettuato con successo!",
                    accessToken
                });

            } catch (err) {
                console.error(err);
                return res.status(500).send("Errore nella generazione dei token");
            }
        });

    })(req, res, next);
});

// ============================================================
// ROTTA: POST /api/utenti/refresh
// ============================================================

router.post('/refresh', async (req, res) => {
    try {
        const cookies = req.cookies;

        if (!cookies?.refreshToken) {
            return res.status(401).send("Refresh token non presente");
        }

        const refreshTokenValue = cookies.refreshToken;
        const refreshObj = await RefreshToken.findOne({ value: refreshTokenValue });

        if (!refreshObj) {
            return res.status(403).send("Refresh token non valido o revocato");
        }

        const user = await User.findById(refreshObj.user);

        if (!user) {
            return res.status(403).send("Utente associato non trovato");
        }

        const nuovoAccessToken = generaAccessToken(user);

        return res.status(200).json({
            message: "Access token rigenerato con successo",
            accessToken: nuovoAccessToken
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Errore durante il refresh del token");
    }
});

// ============================================================
// MIDDLEWARE: verifyJWT
// ============================================================

function verifyJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send("Token non fornito");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send("Token non valido o scaduto");
        }

        req.userId = decoded._id;
        next();
    });
}

router.verifyJWT = verifyJWT;
=======
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Importiamo il modello RefreshToken
const RefreshToken = require('../models/refreshToken');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "username obbligatorio"]
    },
    password: {
        type: String,
        required: [true, "password obbligatoria"]
    }
});

userSchema.pre("save", async function () {
    const user = this;

    // Se la password non è modificata, interrompiamo l'esecuzione del middleware
    if (!user.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    } catch (err) {
        throw err;
    }
});

userSchema.methods.passwordComparison = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports.User = User;

// ============================================================
// CONFIGURAZIONE PASSPORT
// ============================================================

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            const user = await User.findOne({ username });

            // Se l'utente non esiste, autenticazione fallita
            if (!user) {
                return done(null, false, { message: 'Utente non trovato' });
            }

            // Confrontiamo la password fornita con quella hashata nel DB
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Password errata' });
            }

            // Autenticazione riuscita: passiamo l'utente a done()
            return done(null, user);

        } catch (err) {
            return done(err);
        }
    }
));

// ============================================================
// SERIALIZZAZIONE / DESERIALIZZAZIONE UTENTE
// ============================================================

passport.serializeUser(function (user, done) {
    done(null, { id: user._id, username: user.username });
});

passport.deserializeUser(function (userSessionData, done) {
    done(null, userSessionData);
});

// ============================================================
// Access Token JWT
// ============================================================

function generaAccessToken(user) {
    return jwt.sign(
        {
            _id: user._id,
            username: user.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
}

// Creo la rotta per creare nuovi utenti
router.post("/registrazione", async (req, res) => {
    try {
        const nuovoUser = new User(req.body);
        const salvoUser = await nuovoUser.save();

        res.status(201).json({
            messaggio: "sei stato registrato correttamente",
            dati: { username: salvoUser.username } // Nota: rimosso ruolo se non presente nello schema
        });
    } catch (error) {
        res.status(400).json({
            messaggio: "errore durante la registrazione",
            errore: error.message
        });
    }
});

router.post("/accesso", async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Errore interno durante il login");
        }

        if (!user) {
            return res.status(401).send(info?.message || "Credenziali non valide");
        }

        // --- AUTENTICAZIONE RIUSCITA ---
        req.logIn(user, async (err) => {
            if (err) return next(err);

            try {
                const accessToken = generaAccessToken(user);
                const refreshTokenValue = crypto.randomBytes(64).toString('hex');

                const nuovoRefreshToken = new RefreshToken({
                    value: refreshTokenValue,
                    user: user._id
                });
                await nuovoRefreshToken.save();

                res.cookie('refreshToken', refreshTokenValue, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });

                return res.status(200).json({
                    message: "Login effettuato con successo!",
                    accessToken
                });

            } catch (err) {
                console.error(err);
                return res.status(500).send("Errore nella generazione dei token");
            }
        });

    })(req, res, next);
});

// ============================================================
// ROTTA: POST /api/utenti/refresh
// ============================================================

router.post('/refresh', async (req, res) => {
    try {
        const cookies = req.cookies;

        if (!cookies?.refreshToken) {
            return res.status(401).send("Refresh token non presente");
        }

        const refreshTokenValue = cookies.refreshToken;
        const refreshObj = await RefreshToken.findOne({ value: refreshTokenValue });

        if (!refreshObj) {
            return res.status(403).send("Refresh token non valido o revocato");
        }

        const user = await User.findById(refreshObj.user);

        if (!user) {
            return res.status(403).send("Utente associato non trovato");
        }

        const nuovoAccessToken = generaAccessToken(user);

        return res.status(200).json({
            message: "Access token rigenerato con successo",
            accessToken: nuovoAccessToken
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Errore durante il refresh del token");
    }
});

// ============================================================
// MIDDLEWARE: verifyJWT
// ============================================================

function verifyJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send("Token non fornito");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send("Token non valido o scaduto");
        }

        req.userId = decoded._id;
        next();
    });
}

router.verifyJWT = verifyJWT;
>>>>>>> 6af84f2084c9ab94edfefa9c680c19e73fd52ec0
module.exports = router;