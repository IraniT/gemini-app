import { Terminal, Shuffle, Users, Shield, Box, CheckCircle2, RefreshCw } from 'lucide-react';
import AIAssistant from './AIAssistant';

const cards = [
  {
    title: "Handshake a 3 Vie",
    icon: Users,
    color: "text-blue-500",
    border: "border-blue-500",
    desc: "TCP è un protocollo orientato alla connessione. Prima di scambiare dati, mittente e destinatario devono sincronizzarsi tramite tre passaggi: SYN, SYN-ACK e ACK.",
    list: [
      { label: "SYN", desc: "Il client richiede la sincronizzazione." },
      { label: "SYN-ACK", desc: "Il server conferma e richiede a sua volta." },
      { label: "ACK", desc: "Il client conferma la ricezione finale." }
    ]
  },
  {
    title: "Consegna Affidabile",
    icon: Shield,
    color: "text-emerald-500",
    border: "border-emerald-500",
    desc: "TCP garantisce che ogni byte arrivi a destinazione. Se un pacchetto viene perso, viene rilevato tramite timeout o ACK duplicati e quindi ritrasmesso.",
    extra: "Acknowledgment (ACK) = Conferma di ricezione"
  },
  {
    title: "Numeri di Sequenza",
    icon: Terminal,
    color: "text-purple-500",
    border: "border-purple-500",
    desc: "Ogni byte inviato ha un numero di sequenza. Questo permette al destinatario di riordinare i segmenti se arrivano fuori ordine e di identificare i dati mancanti.",
    quote: "Senza numeri di sequenza, TCP sarebbe come un libro con le pagine rimescolate."
  },
  {
    title: "Controllo di Flusso",
    icon: Box,
    color: "text-orange-500",
    border: "border-orange-500",
    desc: "TCP usa una 'Finestra Scorrevole' (Sliding Window) per evitare di inondare il destinatario di dati. Il ricevitore comunica quanto spazio ha ancora nel buffer.",
    badges: ["Window Size", "Buffer Management"]
  },
  {
    title: "Controllo Congestione",
    icon: RefreshCw,
    color: "text-red-500",
    border: "border-red-500",
    desc: "TCP rileva se la rete è intasata. Se nota perdite di pacchetti, riduce drasticamente la velocità di invio per poi aumentarla gradualmente (Slow Start).",
    points: ["Slow Start", "Congestion Avoidance"]
  },
  {
    title: "Chiusura Connessione",
    icon: CheckCircle2,
    color: "text-cyan-500",
    border: "border-cyan-500",
    desc: "La chiusura è un processo a 4 vie (FIN, ACK, FIN, ACK). Entrambe le parti devono chiudere il proprio lato della comunicazione in modo indipendente.",
    code: "FIN -> ACK -> FIN -> ACK"
  }
];

export default function TCPTheory() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className={`bg-white rounded-2xl p-6 shadow-sm border-t-4 ${card.border} transition-transform hover:-translate-y-1 hover:shadow-md`}>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              {card.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {card.desc}
            </p>
            
            {card.list && (
              <ul className="mt-4 space-y-2 text-xs font-mono bg-slate-50 p-3 rounded-lg">
                {card.list.map((item, i) => (
                  <li key={i}><b className="text-blue-600">{item.label}:</b> {item.desc}</li>
                ))}
              </ul>
            )}

            {card.extra && (
              <div className="mt-4 p-3 bg-emerald-50 rounded text-xs font-mono text-center">
                <span className="font-bold text-emerald-700 underline">{card.extra}</span>
              </div>
            )}

            {card.quote && (
              <p className="mt-4 text-xs italic text-purple-700 font-semibold">
                "{card.quote}"
              </p>
            )}

            {card.badges && (
              <div className="mt-4 flex gap-2">
                {card.badges.map((b, i) => (
                  <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] rounded font-bold">{b}</span>
                ))}
              </div>
            )}

            {card.points && (
              <ul className="mt-3 text-xs space-y-1 text-slate-500">
                {card.points.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>
            )}

            {card.code && (
              <p className="mt-4 p-2 bg-cyan-50 border border-cyan-100 rounded text-[11px] font-mono text-cyan-800">
                {card.code}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
