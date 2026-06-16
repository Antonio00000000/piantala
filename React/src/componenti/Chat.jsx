import { useState, useRef } from "react";
import "./Chat.css";

export default function Chat() {
    // ============================================
    // CONFIGURAZIONE CHAT 
    // ============================================
    const BACKEND_ENDPOINT = "http://localhost:3000/api/chat";

    // ============================================
    // STATI 
    // ============================================
    // Lista di tutti i messaggi mostrati a schermo
    const [messages, setMessages] = useState([]);

    // Testo scritto dall'utente nell'input
    const [inputValue, setInputValue] = useState("");

    // True quando stiamo aspettando la risposta dell'IA
    const [isLoading, setIsLoading] = useState(false);

    // ============================================
    // Gestione Invio del Form
    // ============================================
    function handleSubmit(e) {
        e.preventDefault();
        handleTextChat();
    }

    // ============================================
    // Invio del messaggio
    // ============================================
    async function handleTextChat() {
        const text = inputValue.trim();

        // Se l'utente non ha scritto niente, non facciamo nulla
        if (!text) return;

        // Aggiungo il messaggio dell'utente usando la proprietà 'role'
        const userMessage = { role: "user", text: text };
        setMessages((prev) => [...prev, userMessage]);

        // Svuoto la casella di testo
        setInputValue("");

        // Chiedo la risposta a Gemini
        getAnswerFromGemini(text);
    }

    // ============================================
    // Chiamata all'IA via Backend Proxy
    // ============================================
    async function getAnswerFromGemini(text) {
        setIsLoading(true);

        try {
            const response = await fetch(BACKEND_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            // Estraiamo la risposta controllando la struttura nativa di Google
            if (
                data &&
                data.candidates &&
                data.candidates[0] &&
                data.candidates[0].content &&
                data.candidates[0].content.parts[0].text
            ) {
                const botAnswer = data.candidates[0].content.parts[0].text;
                setMessages((prev) => [...prev, { role: "bot", text: botAnswer }]);
            } else {
                setMessages((prev) => [...prev, { role: "bot", text: "❗ Non ho capito. Puoi riprovare?" }]);
            }

        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { role: "bot", text: "Errore di connessione con il server." }]);
        } finally {
            setIsLoading(false);
        }
    }

    // ============================================
    //  RENDER 
    // ============================================
    return (
        <div className="chat-container" id="chat-ia">
            <div className="chat-header">🌿 Il Medico delle Piante</div>

            <div className="messages-area">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        /* CORRETTO: Adesso legge msg.role anziché msg.sender */
                        className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}
                        style={{ whiteSpace: 'pre-wrap' }}
                    >
                        {msg.text}
                    </div>
                ))}
                
                {/* Indicatore visivo di caricamento */}
                {isLoading && (
                    <div className="message bot" style={{ fontStyle: 'italic', color: '#888' }}>
                        Sta scrivendo...
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Chiedi qualcosa sulle tue piante..."
                    className="chat-input"
                    disabled={isLoading}
                />
                <button type="submit" className="chat-submit-btn" disabled={isLoading}>
                    Invia
                </button>
            </form>
        </div>
    );
}