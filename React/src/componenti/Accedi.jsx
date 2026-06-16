import { useState } from "react";
import "./Accedi.css";

export default function Accedi({ azione, setAzione, setRuolo }) {

    function renderizzaContenuto(azioneCurrent) {
        if (azioneCurrent === 0) return accedi();
        else if (azioneCurrent === 1) return registrati();
        else return loginEffettuato();
    }

    async function gestisciRegistrazione(e) {
        e.preventDefault(); // blocca il refresh della pagina

        const formData = new FormData(e.target);
        const datiForm = Object.fromEntries(formData);

        try {
            const response = await fetch("http://localhost:3000/api/user/registrazione", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datiForm)
            });

            const risultato = await response.json();

            if (response.ok) {
                setAzione(0); // Torna alla schermata di login (0)
            } else {
                alert(`Errore: ${risultato.errore || risultato.messaggio}`);
            }
        } catch (error) {
            console.error("Errore di rete:", error);
            alert("Impossibile connettersi al server.");
        }
    }

    async function gestisciAccesso(e) {
        e.preventDefault(); // blocca il refresh della pagina della sottomissione del form

        const formData = new FormData(e.target);
        const datiForm = Object.fromEntries(formData); 

        try {
            const response = await fetch("http://localhost:3000/api/user/accesso", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datiForm) // Invia username e password 
            });

            const risultato = await response.json();

            if (response.ok) {
                console.log("Risposta del server al login:", risultato);

                if (risultato.accessToken) {
                    // Salviamo il token nel localStorage così gli altri componenti possono leggerlo
                    localStorage.setItem("token", risultato.accessToken);
                    console.log("Token JWT salvato con successo nel localStorage!");
                } else {
                    // Se non troviamo il token, avvisiamo nello sviluppo
                    console.warn("Attenzione: Il server non ha restituito il campo 'accessToken'.");
                }

                // Cambia lo stato per mostrare la schermata di successo o reindirizzare alla dashboard
                setAzione(2);
            } else {
                alert(`Errore di accesso: ${risultato.errore || risultato.messaggio || "Credenziali non valide"}`);
            }
        } catch (error) {
            console.error("Errore durante la richiesta di login:", error);
            alert("Impossibile connettersi al server del backend.");
        }
    }

    function accedi() {
        return (
            <div className="accedi">
                <h1>Accedi</h1>
                <i className="bi bi-person-bounding-box" />

                <form method="post" onSubmit={gestisciAccesso}>
                    <input type="text" name="username" placeholder="inserisci username" required />
                    <input type="password" name="password" placeholder="inserisci password" required />
                    <input type="submit" className="btnAccedi" value="Accedi" />
                </form>
                <button onClick={() => setAzione(1)}>vai alla registrazione</button>
            </div>
        );
    }

    function registrati() {
        return (
            <div className="registrati">
                <h1>Registrati</h1>
                <i className="bi bi-person-bounding-box" />

                <form method="post" onSubmit={gestisciRegistrazione}>
                    <input type="text" name="username" placeholder="inserisci username" required />
                    <input type="password" name="password" placeholder="inserisci password" required />
                    <input type="submit" className="btnRegistra" value="Registrati" />
                </form>

                <button onClick={() => setAzione(0)}>fai l'accesso</button>
            </div>
        );
    }

    function loginEffettuato() {
        return (
            <div className="successo">
                <p>💚Accesso effettuato con successo💚</p>
                <p>Ora puoi esplorare il contenitore dei prodotti!</p>
                <button onClick={() => setAzione(0)}>Logout</button>
            </div>
        );
    }

    return <div id="accedi">
        {renderizzaContenuto(azione)}
    </div>;
}