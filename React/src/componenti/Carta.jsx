<<<<<<< HEAD
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import "./Carta.css"

// Questo componente riceve "pianta" come prop (dato da Contenitore)
export default function Carta({ pianta }) {

    // Stato locale per la quantità
    const [quantita, setQuantita] = useState(pianta.quantita)

    // Formatto la data:
    const dataFormattata = new Date(pianta.dataInvio).toLocaleDateString("it-IT");

    // Funzione chiamata quando l'utente clicca su "Compra"
    function compra() {
        if (quantita <= 0) return;

        const token = localStorage.getItem("token");
        if (!token) {
            console.log("Acquisto annullato: nessun token trovato.");
            return;
        }

        fetch(`http://localhost:3000/api/prodotti/compra/${pianta._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("Acquisto registrato:", data);
                setQuantita(prev => prev - 1);
            })
            .catch(err => console.log("errore durante l'acquisto: ", err));
    }

    return (
        <div className='carta' id={pianta.categoria}>
            <h3>{pianta.nome}</h3>
            <h4>{pianta.prezzo}€</h4>
            <h4>disponibilità in negozio: {quantita}</h4>
            <h5>arrivati in negozio il: {dataFormattata}</h5>

            {/* Se la quantità è 0, disabilitiamo il bottone */}
            <button className='btn-compra' onClick={compra} disabled={quantita <= 0}>
                {quantita > 0 ? "Compra" : "Esaurito"}
            </button>
        </div>
    )
=======
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import "./Carta.css"

// Questo componente riceve "pianta" come prop (dato da Contenitore)
export default function Carta({ pianta }) {

    // Stato locale per la quantità
    const [quantita, setQuantita] = useState(pianta.quantita)

    // Formatto la data:
    const dataFormattata = new Date(pianta.dataInvio).toLocaleDateString("it-IT");

    // Funzione chiamata quando l'utente clicca su "Compra"
    function compra() {
        if (quantita <= 0) return;

        const token = localStorage.getItem("token");
        if (!token) {
            console.log("Acquisto annullato: nessun token trovato.");
            return;
        }

        fetch(`http://localhost:3000/api/prodotti/compra/${pianta._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("Acquisto registrato:", data);
                setQuantita(prev => prev - 1);
            })
            .catch(err => console.log("errore durante l'acquisto: ", err));
    }

    return (
        <div className='carta' id={pianta.categoria}>
            <h3>{pianta.nome}</h3>
            <h4>{pianta.prezzo}€</h4>
            <h4>disponibilità in negozio: {quantita}</h4>
            <h5>arrivati in negozio il: {dataFormattata}</h5>

            {/* Se la quantità è 0, disabilitiamo il bottone */}
            <button className='btn-compra' onClick={compra} disabled={quantita <= 0}>
                {quantita > 0 ? "Compra" : "Esaurito"}
            </button>
        </div>
    )
>>>>>>> 6af84f2084c9ab94edfefa9c680c19e73fd52ec0
}