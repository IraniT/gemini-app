import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, ChevronRight, Laptop, Server, Mail, Terminal, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import AIAssistant from './AIAssistant';

interface Step {
  title: string;
  desc: string;
  btnText: string;
  action: () => void;
}

interface TCPSimulatorProps {
  logs: string[];
  onLogsChange: (logs: string[]) => void;
}

export default function TCPSimulator({ logs, onLogsChange }: TCPSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [packetPos, setPacketPos] = useState(15);
  const [packetVisible, setPacketVisible] = useState(false);
  const [packetType, setPacketType] = useState<"SYN" | "ACK" | "DATA" | "SYN-ACK">("SYN");
  const [clientState, setClientState] = useState("CLOSED");
  const [serverState, setServerState] = useState("LISTEN");
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
      title: "1. Handshake: SYN",
      desc: "Il Client invia un segmento SYN (Synchronize) per richiedere l'apertura di una connessione.",
      btnText: "2. Ricevi SYN & Invia SYN-ACK",
      action: () => {
        setHighlighted('client');
        setClientState('SYN_SENT');
        setPacketType('SYN');
        setPacketVisible(true);
        setPacketPos(80);
        addLog("CLIENT: socket() -> connect()");
        addLog("CLIENT -> [SYN, Seq=100] -> SERVER");
      }
    },
    {
      title: "2. Handshake: SYN-ACK",
      desc: "Il Server riceve il SYN, passa in stato SYN_RCVD e risponde con SYN-ACK (conferma il SYN del client e invia il proprio).",
      btnText: "3. Ricevi SYN-ACK & Invia ACK",
      action: () => {
        setHighlighted('server');
        setServerState('SYN_RCVD');
        setPacketType('SYN-ACK');
        setPacketPos(15);
        addLog("SERVER: Ricevuto SYN");
        addLog("SERVER -> [SYN-ACK, Seq=500, Ack=101] -> CLIENT");
      }
    },
    {
      title: "3. Handshake: ACK Finale",
      desc: "Il Client riceve il SYN-ACK, passa in ESTABLISHED e invia l'ACK finale. La connessione è ora attiva.",
      btnText: "4. Invia Dati",
      action: () => {
        setHighlighted('client');
        setClientState('ESTABLISHED');
        setPacketType('ACK');
        setPacketPos(80);
        addLog("CLIENT: Ricevuto SYN-ACK");
        addLog("CLIENT -> [ACK, Ack=501] -> SERVER");
        setTimeout(() => {
          setServerState('ESTABLISHED');
          addLog("SERVER: Connessione ESTABLISHED");
        }, 800);
      }
    },
    {
      title: "4. Trasferimento Dati",
      desc: "Il Client invia un segmento di dati. TCP garantisce che questo arrivi correttamente.",
      btnText: "5. Ricevi Dati & Invia ACK",
      action: () => {
        setHighlighted('client');
        setPacketType('DATA');
        setPacketPos(80);
        addLog("CLIENT -> [DATA, Seq=101, Len=20] -> SERVER");
      }
    },
    {
      title: "5. Acknowledgment Dati",
      desc: "Il Server riceve i dati e invia un ACK per confermare la ricezione corretta (Reliable Data Transfer).",
      btnText: "Fine / Riavvia",
      action: () => {
        setHighlighted('server');
        setPacketType('ACK');
        setPacketPos(15);
        addLog("SERVER: Ricevuti 20 byte");
        addLog("SERVER -> [ACK, Ack=121] -> CLIENT");
        addLog("CLIENT: Dati confermati con successo!");
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
    setClientState("CLOSED");
    setServerState("LISTEN");
    setHighlighted(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Simulatore TCP: Handshake & Affidabilità</h2>
            <p className="text-slate-600 text-sm">Sincronizzazione a 3 vie e conferma dei dati (ACK).</p>
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
            <div className="absolute top-1/2 left-[20%] right-[20%] h-px bg-orange-500/20 blur-sm" />

            {/* Client Node */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <AnimatePresence>
                <motion.div 
                  key={clientState}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "absolute -top-12 px-3 py-1 text-[10px] font-black rounded-lg shadow-lg uppercase tracking-tighter whitespace-nowrap",
                    clientState === 'ESTABLISHED' ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300"
                  )}
                >
                  {clientState}
                </motion.div>
              </AnimatePresence>
              <div className={cn(
                "w-24 h-24 md:w-32 md:h-32 rounded-[2rem] flex flex-col items-center justify-center text-white transition-all duration-500 border-4",
                highlighted === 'client' ? "bg-orange-600 border-orange-400 scale-110 shadow-[0_0_40px_rgba(234,88,12,0.3)]" : "bg-slate-900 border-slate-800 opacity-40 grayscale"
              )}>
                <Laptop className="w-10 h-10 md:w-12 md:h-12 mb-2" />
                <span className="text-[10px] font-black tracking-widest opacity-80">CLIENT</span>
              </div>
            </div>

            {/* Packet Animation */}
            <motion.div 
              animate={{ 
                left: `${packetPos}%`,
                opacity: packetVisible ? 1 : 0,
                scale: packetVisible ? 1 : 0.5
              }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 px-4 py-2 rounded-2xl flex items-center gap-2 text-white shadow-xl z-20 font-black text-[10px] md:text-xs border-2",
                packetType === 'SYN' ? "bg-blue-500 border-blue-400 shadow-blue-500/40" : 
                packetType === 'SYN-ACK' ? "bg-purple-500 border-purple-400 shadow-purple-500/40" :
                packetType === 'ACK' ? "bg-emerald-500 border-emerald-400 shadow-emerald-500/40" : "bg-orange-500 border-orange-400 shadow-orange-500/40"
              )}
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
              {packetType}
            </motion.div>

            {/* Server Node */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <AnimatePresence>
                <motion.div 
                  key={serverState}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "absolute -top-12 px-3 py-1 text-[10px] font-black rounded-lg shadow-lg uppercase tracking-tighter whitespace-nowrap",
                    serverState === 'ESTABLISHED' ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300"
                  )}
                >
                  {serverState}
                </motion.div>
              </AnimatePresence>
              <div className={cn(
                "w-24 h-24 md:w-32 md:h-32 rounded-[2rem] flex flex-col items-center justify-center text-white transition-all duration-500 border-4",
                highlighted === 'server' ? "bg-emerald-600 border-emerald-400 scale-110 shadow-[0_0_40px_rgba(16,185,129,0.3)]" : "bg-slate-900 border-slate-800 opacity-40 grayscale"
              )}>
                <Server className="w-10 h-10 md:w-12 md:h-12 mb-2" />
                <span className="text-[10px] font-black tracking-widest opacity-80">SERVER</span>
              </div>
            </div>
          </div>

          {/* Controls and Logs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TCP Handshake Manager</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {currentStep === -1 ? "Pronto per l'Handshake" : steps[currentStep].title}
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {currentStep === -1 ? "Inizia il processo di connessione orientata ai dati." : steps[currentStep].desc}
                </p>
              </div>

              <button 
                onClick={handleNext}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-xl shadow-orange-200 flex items-center justify-center gap-3 group active:scale-[0.98]"
              >
                <span className="text-sm uppercase tracking-widest">
                  {currentStep === -1 ? "1. Inizia Handshake" : steps[currentStep].btnText}
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
                  <span className="ml-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">TCP_SEGMENT_ANALYZER</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-slate-900 text-[9px] font-mono text-slate-500">v2.1.0-stable</div>
              </div>
              <div className="font-mono text-[11px] h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-800 pr-2">
                {logs.length === 0 ? (
                  <div className="text-slate-700 italic flex items-center gap-2">
                    <span className="animate-pulse">_</span>
                    In attesa di segmenti SYN...
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
                      <span className="text-orange-400/90 leading-relaxed">{log}</span>
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
