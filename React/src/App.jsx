import { useState } from 'react'
import './App.css'
import NavBar from "./componenti/NavBar.jsx" //do un nome e gli dico da dove prendere il componente
import Accedi from "./componenti/Accedi.jsx"
import Contenitore from "./componenti/Contenitore.jsx"
import Chat from './componenti/Chat.jsx'
import Footer from './componenti/Footer.jsx'

{/*non si può usare class come in html, ma className, perché class è una parola riservata in js*/ }

export default function App() {

  // 0 = accedi, 1 = registrati, 2 = login effettuato
  const [azione, setAzione] = useState(0);
  const [ruolo, setRuolo] = useState("");

  function gestioneAccesso(azione) {
    if (azione != 2)
      return <>
        <div className='intestazione'>
          <h1>Piantala</h1>
          <p>Cerchi delle 🪴 piante 🪴 nuove? Vuoi 💭 consigli 💭 per quelle che già hai?Vuoi 🆕 iniziare 🆕 da un seme?</p>
          <p>PIANTALA di lamentarti, perchè qui puoi trovare tutto ciò che ti serve😁</p>
        </div>

        <Accedi azione={azione} setAzione={setAzione} setRuolo={setRuolo} />
      </>
    else return <>
      <div className='intestazione'>
        <h1>Piantala</h1>
        <p>Cerchi delle 🪴 piante 🪴 nuove? Vuoi 💭 consigli 💭 per quelle che già hai?Vuoi 🆕 iniziare 🆕 da un seme?</p>
        <p>PIANTALA di lamentarti, perchè qui puoi trovare tutto ciò che ti serve😁</p>
      </div>
      <Accedi azione={azione} setAzione={setAzione} ruolo={ruolo} />

      <NavBar ruolo={ruolo} />
      <Chat />

      <div id='piante'>
        <Contenitore categoria={"casa"} titolo={"Piante per la Casa"} />

        <Contenitore categoria={"grasse"} titolo={"Piante Grasse"} />

        <Contenitore categoria={"balcone"} titolo={"Per il Balcone"} />

        <Contenitore categoria={"semi"} titolo={"Semi da piantare"} />

        <Footer />
      </div>
    </>
  }

  return gestioneAccesso(azione)
}

