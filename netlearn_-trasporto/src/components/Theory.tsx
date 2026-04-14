import { Terminal, Shuffle, Users, Shield, Box, CheckCircle2 } from 'lucide-react';
import AIAssistant from './AIAssistant';

const cards = [
  {
    title: "Le Primitive di Servizio",
    icon: Terminal,
    color: "text-blue-500",
    border: "border-blue-500",
    desc: "Le primitive sono le operazioni astratte fornite dal livello di trasporto per permettere alle applicazioni di comunicare. Rappresentano l'interfaccia tra l'utente e il protocollo di trasporto.",
    list: [
      { label: "LISTEN", desc: "Attesa passiva di connessioni." },
      { label: "T-CONNECT", desc: "Richiesta attiva di connessione." },
      { label: "SEND-DATA", desc: "Trasferimento del payload." },
      { label: "T-DISCONNECT", desc: "Chiusura del canale logico." }
    ]
  },
  {
    title: "Multiplazione e Socket",
    icon: Shuffle,
    color: "text-purple-500",
    border: "border-purple-500",
    desc: "Il trasporto gestisce più flussi contemporaneamente. Il Multiplexing raccoglie i dati da diversi socket e li incapsula. Il Demultiplexing li consegna al processo corretto usando il Numero di Porta.",
    extra: "Socket = IP + Port Number"
  },
  {
    title: "Host vs Processo",
    icon: Users,
    color: "text-emerald-500",
    border: "border-emerald-500",
    desc: "Mentre lo strato di Rete garantisce la consegna tra Host (indirizzamento IP), lo strato di Trasporto garantisce la comunicazione logica tra Processi. È l'ultimo miglio che collega le entità applicative finali.",
    quote: "L'IP porta il pacchetto alla porta di casa, il Trasporto lo consegna alla persona giusta dentro casa."
  },
  {
    title: "Trasferimento Affidabile",
    icon: Shield,
    color: "text-orange-500",
    border: "border-orange-500",
    desc: "Il livello di trasporto può implementare meccanismi per trasformare un canale IP inaffidabile in un canale sicuro. Questo include la gestione dei pacchetti persi, duplicati o arrivati fuori ordine.",
    badges: ["TCP: Affidabile", "UDP: Non Affidabile"]
  },
  {
    title: "Anatomia UDP",
    icon: Box,
    color: "text-red-500",
    border: "border-red-500",
    desc: "UDP è ridotto all'osso. Il suo header occupa solo 8 byte suddivisi in 4 campi: Porte (Sorgente/Dest), Lunghezza e Checksum. Non c'è controllo di flusso né instaurazione della connessione.",
    points: ["Minimo Overhead: Massima velocità.", "Connectionless: Invio immediato."]
  },
  {
    title: "Rilevazione Errori",
    icon: CheckCircle2,
    color: "text-cyan-500",
    border: "border-cyan-500",
    desc: "UDP utilizza il Checksum per rilevare alterazioni dei bit. Il mittente calcola un valore basato sui byte del segmento; se il destinatario calcola un valore diverso, il pacchetto viene scartato senza preavviso.",
    code: "Pseudo-header IP + Header UDP + Dati = Somma di complemento a 1."
  }
];

export default function Theory() {
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
              <div className="mt-4 p-3 bg-purple-50 rounded text-xs font-mono text-center">
                <span className="font-bold text-purple-700 underline">{card.extra}</span>
              </div>
            )}

            {card.quote && (
              <p className="mt-4 text-xs italic text-emerald-700 font-semibold">
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
