const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const prodottoSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },

    prezzo: {
        type: Number,
        required: true
    },

    quantita: {
        type: Number,
        required: true
    },

    categoria: {
        type: String,
        required: true,
        enum: ['casa', 'grasse', 'semi', 'balcone'] // "enum" e non "value": indica i valori permessi
    },

    dataInvio: {
        type: Date,
        default: Date.now
    }
})

//creo il modello legandolo allo schema appena creato
const Prodotto = mongoose.model("Prodotto", prodottoSchema)

//creo la rotta per salvare una nuova pianta
router.post("/aggiungi", async (req, res) => {
    try {
        const nuovoProdotto = new Prodotto(req.body);
        const salvoProdotto = await nuovoProdotto.save();
        res.status(201).json({
            messaggio: "prodotto salvato correttamente",
            dati: salvoProdotto
        });
    } catch (error) {
        res.status(400).json({
            messaggio: "errore durante il salvataggio del prodotto",
            errore: error.message
        });
    }
})

router.get("/", async (req, res) => {
    try {
        const prodottiDisponibili = await Prodotto.find();
        res.status(200).json({
            messaggio: "piante caricate con successo",
            dati: prodottiDisponibili
        })
    } catch (error) {
        res.status(500).json({
            messaggio: "errore nel caricamento dei prodotti",
            errore: error.message
        })
    }
})

// rotta get per restituire in base alla categoria
// Esempio chiamata: GET http://localhost:3000/api/prodotti/categoria/grasse
router.get("/categoria/:categoria", async (req, res) => {
    try {
        // prende il valore scritto nell'URL
        const prodottiCategoria = await Prodotto.find({ categoria: req.params.categoria });

        res.status(200).json({
            messaggio: "Piante della categoria caricate con successo",
            dati: prodottiCategoria
        })
    } catch (error) {
        res.status(500).json({
            messaggio: "Errore nel caricamento dei prodotti per categoria",
            errore: error.message
        })
    }
})

// rotta per "comprare" una pianta: riduce la quantità di 1
// Esempio chiamata: PATCH http://localhost:3000/api/prodotti/compra/<id della pianta>
router.patch("/compra/:id", async (req, res) => {
    try {
        // cerco il prodotto tramite il suo id
        const prodotto = await Prodotto.findById(req.params.id);
 
        if (!prodotto) {
            return res.status(404).json({ messaggio: "Prodotto non trovato" });
        }
 
        // controllo che ci sia ancora disponibilità
        if (prodotto.quantita <= 0) {
            return res.status(400).json({ messaggio: "Prodotto esaurito" });
        }
 
        // riduco la quantità di 1 e salvo
        prodotto.quantita = prodotto.quantita - 1;
        const prodottoAggiornato = await prodotto.save();
 
        res.status(200).json({
            messaggio: "Acquisto effettuato",
            dati: prodottoAggiornato
        })
    } catch (error) {
        res.status(500).json({
            messaggio: "Errore durante l'acquisto",
            errore: error.message
        })
    }
})

module.exports = router;