<<<<<<< HEAD
import { useState, useEffect } from 'react';
import Carta from "./Carta"
import "./Contenitore.css"

export default function Contenitore({ categoria, titolo }) {

    // "piante" conterrà l'elenco di tutte le piante prese dal database
    const [piante, setPiante] = useState([])

    useEffect(() => {
        // Recuperiamo il token JWT che abbiamo salvato nel localStorage dopo il login
        const token = localStorage.getItem("token");
        console.log("Tentativo di fetch. Token inviato:", token);

        // Se non c'è nessun token, l'utente non è loggato: non facciamo la richiesta
        if (!token) {
            console.log("Chiamata annullata: nessun token trovato nel localStorage.");
            return;
        }

        fetch("http://localhost:3000/api/prodotti", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error(`Errore HTTP! Stato: ${res.status}`);
            return res.json();
        })
        .then(data => setPiante(data.dati || data))
        .catch(err => console.log("errore nel recupero dei prodotti: ", err));

    // Le parentesi quadre vuote [] significano: esegui questo effetto solo una volta, quando il componente appare per la prima volta nella pagina
    }, []);

    // prendo solo le piante che hanno la categoria uguale a quella ricevuta
    const pianteCategoria = piante.filter(pianta => pianta.categoria === categoria);

    return <div className="scheda-pianta" id={categoria}>
        <h1>{titolo}</h1>
        <div className="vetrina-carte">
            {pianteCategoria.map(pianta => (
                <Carta key={pianta._id} pianta={pianta} />
            ))}
        </div>
    </div>
=======
import { useState, useEffect } from 'react';
import Carta from "./Carta"
import "./Contenitore.css"

export default function Contenitore({ categoria, titolo }) {

    // "piante" conterrà l'elenco di tutte le piante prese dal database
    const [piante, setPiante] = useState([])

    useEffect(() => {
        // Recuperiamo il token JWT che abbiamo salvato nel localStorage dopo il login
        const token = localStorage.getItem("token");
        console.log("Tentativo di fetch. Token inviato:", token);

        // Se non c'è nessun token, l'utente non è loggato: non facciamo la richiesta
        if (!token) {
            console.log("Chiamata annullata: nessun token trovato nel localStorage.");
            return;
        }

        fetch("http://localhost:3000/api/prodotti", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error(`Errore HTTP! Stato: ${res.status}`);
            return res.json();
        })
        .then(data => setPiante(data.dati || data))
        .catch(err => console.log("errore nel recupero dei prodotti: ", err));

    // Le parentesi quadre vuote [] significano: esegui questo effetto solo una volta, quando il componente appare per la prima volta nella pagina
    }, []);

    // prendo solo le piante che hanno la categoria uguale a quella ricevuta
    const pianteCategoria = piante.filter(pianta => pianta.categoria === categoria);

    return <div className="scheda-pianta" id={categoria}>
        <h1>{titolo}</h1>
        <div className="vetrina-carte">
            {pianteCategoria.map(pianta => (
                <Carta key={pianta._id} pianta={pianta} />
            ))}
        </div>
    </div>
>>>>>>> 6af84f2084c9ab94edfefa9c680c19e73fd52ec0
}