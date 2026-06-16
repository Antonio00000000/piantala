<<<<<<< HEAD
import "./NavBar.css";
// importo l'immagine in alto assegnandole un nome
import logo from "../assets/piantala.png";
import { useState } from "react";


/*il return deve ritornare un solo elemento per questo si usano i frammenti <> </> */
export default function NavBar({ruolo}) {
    const [nuova, setNuova] = useState(false)

    // Stato che contiene i dati scritti dall'utente nel form.
    const [datiForm, setDatiForm] = useState({
        nome: "",
        prezzo: "",
        quantita: "",
        categoria: ""
    })

    function gestisciCambiamento(e) {
        const { name, value } = e.target; 
        setDatiForm({
            ...datiForm, // copio tutti i dati già presenti
            [name]: value // sovrascrivo solo il campo modificato
        })
    }

    async function Invio(e) {
        e.preventDefault(); 

        const datiDaInviare = {
            ...datiForm,
            prezzo: Number(datiForm.prezzo),
            quantita: Number(datiForm.quantita)
        }

        fetch("http://localhost:3000/api/prodotti/aggiungi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datiDaInviare)
        })
            .then(res => res.json())
            .then(data => {
                console.log("Prodotto categorizzato e salvato:", data);

                // Svuoto il form dopo l'invio, così è pronto per un nuovo inserimento
                setDatiForm({ nome: "", prezzo: "", quantita: "", categoria: "" })

                // Chiudo il pop-up dopo il salvataggio
                setNuova(false)
            })
            .catch(err => console.log("errore durante il salvataggio: ", err));
    }

    function nuovaPianta() {
        return <div className="nuovaCarta">
            <i className="bi bi-plus-circle-fill" />

            <form onSubmit={Invio}>

                <input type="text" name="nome" placeholder="inserisci nome della pianta" value={datiForm.nome} onChange={gestisciCambiamento}/>

                <input type="number" name="prezzo" placeholder="inserisci il prezzo" value={datiForm.prezzo} onChange={gestisciCambiamento}/>

                <input type="number" name="quantita" placeholder="inserisci la quantità disponibile" value={datiForm.quantita} onChange={gestisciCambiamento}/>

                <select name="categoria" value={datiForm.categoria} onChange={gestisciCambiamento}>
                    <option value="" disabled>Tipo di pianta</option>
                    <option value="casa">per la casa</option>
                    <option value="grasse">pianta grassa</option>
                    <option value="balcone">per il balcone</option>
                    <option value="semi">semi</option>
                </select>

                <input type="submit" className="btnInvia" value="Aggiungi" />
            </form>
        </div>
    }

    return <><div className="barra">
        {ruolo === "Ant" ?  <button onClick={() => setNuova(!nuova)}><img src={logo} alt="Logo" /></button> : <img src={logo} alt="Logo" />}
        <a href="#accedi">Logout</a>
        <a href="#chat-ia">Chat</a>
        <a href="#piante">Negozio Online</a>

    </div>
        {/* Racchiudiamo il pop-up dentro un contenitore dedicato */}
        {nuova && (
            <div className="overlay-nuova-pianta">
                <button className="btn-chiudi" onClick={() => setNuova(false)}>✕</button>
                {nuovaPianta()}
            </div>
        )}
    </>
=======
import "./NavBar.css";
// importo l'immagine in alto assegnandole un nome
import logo from "../assets/piantala.png";
import { useState } from "react";


/*il return deve ritornare un solo elemento per questo si usano i frammenti <> </> */
export default function NavBar({ruolo}) {
    const [nuova, setNuova] = useState(false)

    // Stato che contiene i dati scritti dall'utente nel form.
    const [datiForm, setDatiForm] = useState({
        nome: "",
        prezzo: "",
        quantita: "",
        categoria: ""
    })

    function gestisciCambiamento(e) {
        const { name, value } = e.target; 
        setDatiForm({
            ...datiForm, // copio tutti i dati già presenti
            [name]: value // sovrascrivo solo il campo modificato
        })
    }

    async function Invio(e) {
        e.preventDefault(); 

        const datiDaInviare = {
            ...datiForm,
            prezzo: Number(datiForm.prezzo),
            quantita: Number(datiForm.quantita)
        }

        fetch("http://localhost:3000/api/prodotti/aggiungi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datiDaInviare)
        })
            .then(res => res.json())
            .then(data => {
                console.log("Prodotto categorizzato e salvato:", data);

                // Svuoto il form dopo l'invio, così è pronto per un nuovo inserimento
                setDatiForm({ nome: "", prezzo: "", quantita: "", categoria: "" })

                // Chiudo il pop-up dopo il salvataggio
                setNuova(false)
            })
            .catch(err => console.log("errore durante il salvataggio: ", err));
    }

    function nuovaPianta() {
        return <div className="nuovaCarta">
            <i className="bi bi-plus-circle-fill" />

            <form onSubmit={Invio}>

                <input type="text" name="nome" placeholder="inserisci nome della pianta" value={datiForm.nome} onChange={gestisciCambiamento}/>

                <input type="number" name="prezzo" placeholder="inserisci il prezzo" value={datiForm.prezzo} onChange={gestisciCambiamento}/>

                <input type="number" name="quantita" placeholder="inserisci la quantità disponibile" value={datiForm.quantita} onChange={gestisciCambiamento}/>

                <select name="categoria" value={datiForm.categoria} onChange={gestisciCambiamento}>
                    <option value="" disabled>Tipo di pianta</option>
                    <option value="casa">per la casa</option>
                    <option value="grasse">pianta grassa</option>
                    <option value="balcone">per il balcone</option>
                    <option value="semi">semi</option>
                </select>

                <input type="submit" className="btnInvia" value="Aggiungi" />
            </form>
        </div>
    }

    return <><div className="barra">
        {ruolo === "Ant" ?  <button onClick={() => setNuova(!nuova)}><img src={logo} alt="Logo" /></button> : <img src={logo} alt="Logo" />}
        <a href="#accedi">Logout</a>
        <a href="#chat-ia">Chat</a>
        <a href="#piante">Negozio Online</a>

    </div>
        {/* Racchiudiamo il pop-up dentro un contenitore dedicato */}
        {nuova && (
            <div className="overlay-nuova-pianta">
                <button className="btn-chiudi" onClick={() => setNuova(false)}>✕</button>
                {nuovaPianta()}
            </div>
        )}
    </>
>>>>>>> 6af84f2084c9ab94edfefa9c680c19e73fd52ec0
}