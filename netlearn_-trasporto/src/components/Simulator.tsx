import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, ChevronRight, Laptop, Server, Mail, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';
import AIAssistant from './AIAssistant';

interface Step {
  title: string;
  desc: string;
  btnText: string;
  action: () => void;
}

interface SimulatorProps {
  logs: string[];
  onLogsChange: (logs: string[]) => void;
}

export default function Simulator({ logs, onLogsChange }: SimulatorProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [message, setMessage] = useState("Hello UDP!");
  const [packetPos, setPacketPos] = useState(15); // percentage
  const [packetVisible, setPacketVisible] = useState(false);
  const [clientPrim, setClientPrim] = useState("");
  const [serverPrim, setServerPrim] = useState("");
  const [highlighted, setHighlighted] = useState<"client" | "server" | null>(null);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (msg: string) => {
    onLogsChange([...logs, msg]);
  };

  const steps: Step[] = [
    {
      title: "1. Preparazione Server",
      desc: "Apertura Passiva: Il server crea il socket e si mette in attesa sulla porta 53 (Well-known port).",
      btnText: "2. Invio dal Client",
      action: () => {
        setHighlighted('server');
        setServerPrim('BIND / LISTEN');
        addLog("SERVER: socket() -> Crea endpoint <IP:Porta>");
        addLog("SERVER: bind(53) -> Legame alla porta nota.");
        addLog("SERVER: Stato -> In attesa di datagrammi.");
      }
    },
    {
      title: "2. Fase di Invio dal Client",
      desc: "SEND DATA.request: Il client passa direttamente all'invio specificando IP e porta. Non c'è T-CONNECT.",
      btnText: "3. Ricezione sul Server",
      action: () => {
        setHighlighted('client');
        setClientPrim('SEND DATA.req');
        setPacketVisible(true);
        setPacketPos(80);
        addLog("CLIENT: socket() -> Crea socket datagram.");
        addLog("CLIENT: sendto() -> Invia direttamente a 130.130.12.17:53.");
        addLog("CLIENT: Nessun handshake richiesto.");
      }
    },
    {
      title: "3. Ricezione sul Server",
      desc: "RECEIVE DATA.indication: Il server viene avvisato dell'evento. Legge IP/Porta del mittente ed estrae il messaggio.",
      btnText: "4. Risposta (Sincrona)",
      action: () => {
        setHighlighted('server');
        setServerPrim('RECV DATA.ind');
        addLog(`SERVER: Evento di ricezione attivato!`);
        addLog(`SERVER: Estratto messaggio: "${message}"`);
        addLog("SERVER: Mittente identificato: 137.200.70.14:54321");
      }
    },
    {
      title: "4. Risposta del Server",
      desc: "Il server usa i parametri ottenuti per inviare una risposta al mittente.",
      btnText: "5. Chiusura",
      action: () => {
        setServerPrim('SEND DATA.req');
        setPacketPos(15);
        addLog("SERVER: sendto() -> Risposta inviata al client.");
      }
    },
    {
      title: "5. Terminazione (close)",
      desc: "Chiusura locale degli endpoint. Le risorse vengono liberate.",
      btnText: "Fine / Riavvia",
      action: () => {
        setClientPrim('CLOSE');
        setServerPrim('CLOSE');
        setPacketVisible(false);
        addLog("CLIENT: close() -> Socket rimosso.");
        addLog("SERVER: close() -> Socket rimosso.");
      }
    }
  ];

  const handleNext = () => {
    const nextIdx = currentStep + 1;
    if (nextIdx >= steps.length) {
      reset();
      return;
    }
    setCurrentStep(nextIdx);
    steps[nextIdx].action();
  };

  const reset = () => {
    setCurrentStep(-1);
    onLogsChange([]);
    setPacketPos(15);
    setPacketVisible(false);
    setClientPrim("");
    setServerPrim("");
    setHighlighted(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Simulatore UDP: Flusso delle Primitive</h2>
            <p className="text-slate-600 text-sm">Apertura passiva, Invio diretto e Notifica di ricezione.</p>
          </div>
          <button 
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Visual Stage - The Hero */}
          <div className="relative h-[300px] md:h-[400px] bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden flex items-center justify-around shadow-inner">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            {/* Network Line */}
            <div className="absolute top-1/2 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <div className="absolute top-1/2 left-[20%] right-[20%] h-px bg-blue-500/20 blur-sm" />

            {/* Client Node */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <AnimatePresence>
                {clientPrim && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute -top-12 px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-lg shadow-lg uppercase tracking-tighter whitespace-nowrap"
                  >
                    {clientPrim}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className={cn(
                "w-24 h-24 md:w-32 md:h-32 rounded-[2rem] flex flex-col items-center justify-center text-white transition-all duration-500 border-4",
                highlighted === 'client' ? "bg-blue-600 border-blue-400 scale-110 shadow-[0_0_40px_rgba(37,99,235,0.3)]" : "bg-slate-900 border-slate-800 opacity-40 grayscale"
              )}>
                <Laptop className="w-10 h-10 md:w-12 md:h-12 mb-2" />
                <span className="text-[10px] font-black tracking-widest opacity-80">CLIENT</span>
              </div>
              <div className="px-3 py-1 bg-slate-900/80 border border-blue-500/30 rounded-full font-mono text-[9px] md:text-[10px] text-blue-400 backdrop-blur-sm">
                137.200.70.14:54321
              </div>
            </div>

            {/* Packet Animation */}
            <motion.div 
              animate={{ 
                left: `${packetPos}%`,
                opacity: packetVisible ? 1 : 0,
                scale: packetVisible ? 1 : 0.5,
                rotate: packetPos > 50 ? 0 : 0 // Could add rotation based on direction
              }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="absolute top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(239,68,68,0.5)] z-20 border-2 border-red-400"
            >
              <Mail className="w-5 h-5 md:w-7 md:h-7" />
              <div className="absolute -bottom-6 text-[8px] font-bold text-red-400 uppercase tracking-widest">UDP_SEG</div>
            </motion.div>

            {/* Server Node */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <AnimatePresence>
                {serverPrim && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute -top-12 px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-lg shadow-lg uppercase tracking-tighter whitespace-nowrap"
                  >
                    {serverPrim}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className={cn(
                "w-24 h-24 md:w-32 md:h-32 rounded-[2rem] flex flex-col items-center justify-center text-white transition-all duration-500 border-4",
                highlighted === 'server' ? "bg-emerald-600 border-emerald-400 scale-110 shadow-[0_0_40px_rgba(16,185,129,0.3)]" : "bg-slate-900 border-slate-800 opacity-40 grayscale"
              )}>
                <Server className="w-10 h-10 md:w-12 md:h-12 mb-2" />
                <span className="text-[10px] font-black tracking-widest opacity-80">SERVER</span>
              </div>
              <div className="px-3 py-1 bg-slate-900/80 border border-emerald-500/30 rounded-full font-mono text-[9px] md:text-[10px] text-emerald-400 backdrop-blur-sm">
                130.130.12.17:53
              </div>
            </div>
          </div>

          {/* Controls and Logs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Controllo Sequenza</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {currentStep === -1 ? "Pronto per iniziare" : steps[currentStep].title}
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {currentStep === -1 ? "Inizia preparando il server per l'apertura passiva." : steps[currentStep].desc}
                </p>

                {currentStep === -1 && (
                  <div className="mb-6 group">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Payload Messaggio</label>
                    <div className="relative">
                      <input 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                        placeholder="Inserisci testo..."
                      />
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleNext}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group active:scale-[0.98]"
              >
                <span className="text-sm uppercase tracking-widest">
                  {currentStep === -1 ? "1. Apertura Passiva" : steps[currentStep].btnText}
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Log Terminal */}
            <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                  </div>
                  <span className="ml-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">UDP_DEBUG_CONSOLE</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-slate-900 text-[9px] font-mono text-slate-500">v1.0.4-stable</div>
              </div>
              <div className="font-mono text-[11px] h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-800 pr-2">
                {logs.length === 0 ? (
                  <div className="text-slate-700 italic flex items-center gap-2">
                    <span className="animate-pulse">_</span>
                    In attesa di eventi di rete...
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3 items-start"
                    >
                      <span className="text-slate-700 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                      <span className="text-blue-400/90 leading-relaxed">{log}</span>
                    </motion.div>
                  ))
                )}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
