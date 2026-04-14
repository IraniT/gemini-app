import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowRight, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const quizData = [
  { 
    q: "Quale fase del server viene definita 'Apertura Passiva'?", 
    a: ["socket() & bind()", "sendto()", "close()"], 
    c: 0 
  },
  { 
    q: "Esiste la primitiva T-CONNECT in UDP?", 
    a: ["Sì, per stabilire il canale", "No, si passa direttamente all'invio", "Sì, ma è opzionale"], 
    c: 1 
  },
  { 
    q: "Quale primitiva del client avvia il trasferimento senza conferma?", 
    a: ["RECEIVE DATA", "SEND DATA.request", "T-CONNECT"], 
    c: 1 
  },
  { 
    q: "Cosa succede quando arriva un datagramma sul server?", 
    a: ["Viene generato un ACK", "Si attiva RECEIVE DATA.indication", "Il server chiude il socket"], 
    c: 1 
  },
  { 
    q: "Cosa legge il server per sapere a chi rispondere?", 
    a: ["La password di rete", "L'indirizzo IP e la porta del mittente", "Il checksum"], 
    c: 1 
  }
];

export default function Quiz() {
  const [state, setState] = useState<'start' | 'active' | 'result'>('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleStart = () => {
    setState('active');
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
  };

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === quizData[currentIndex].c) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < quizData.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setState('result');
      }
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {state === 'start' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-white rounded-3xl p-12 text-center shadow-xl border border-slate-100"
          >
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Verifica Competenze UDP</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Metti alla prova la tua conoscenza sulle primitive di trasporto e sul funzionamento del protocollo UDP.
            </p>
            <button 
              onClick={handleStart}
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Inizia il Quiz
            </button>
          </motion.div>
        )}

        {state === 'active' && (
          <motion.div 
            key="active"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                Domanda {currentIndex + 1} di {quizData.length}
              </span>
              <div className="flex gap-1">
                {quizData.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-8 h-1.5 rounded-full transition-all duration-500",
                      i < currentIndex ? "bg-blue-600" : i === currentIndex ? "bg-blue-200" : "bg-slate-100"
                    )} 
                  />
                ))}
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-8 leading-tight">
              {quizData[currentIndex].q}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {quizData[currentIndex].a.map((opt, i) => {
                const isCorrect = i === quizData[currentIndex].c;
                const isSelected = selectedOption === i;
                
                return (
                  <button
                    key={i}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelect(i)}
                    className={cn(
                      "group relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between",
                      selectedOption === null 
                        ? "border-slate-100 hover:border-blue-500 hover:bg-blue-50/50" 
                        : isSelected
                          ? isCorrect ? "border-emerald-500 bg-emerald-50" : "border-red-500 bg-red-50"
                          : isCorrect && selectedOption !== null ? "border-emerald-200 bg-emerald-50/30" : "border-slate-50 opacity-50"
                    )}
                  >
                    <span className={cn(
                      "font-medium",
                      selectedOption !== null && isSelected ? isCorrect ? "text-emerald-700" : "text-red-700" : "text-slate-700"
                    )}>
                      {opt}
                    </span>
                    
                    {selectedOption !== null && isSelected && (
                      isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {state === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-12 text-center shadow-xl border border-slate-100"
          >
            <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Risultato Finale</h2>
            <div className="text-6xl font-black text-blue-600 mb-8">
              {score}<span className="text-slate-300 text-3xl mx-2">/</span>{quizData.length}
            </div>
            
            <p className="text-slate-600 mb-10">
              {score === quizData.length 
                ? "Incredibile! Hai una padronanza perfetta dello strato di trasporto." 
                : score >= 3 
                  ? "Ottimo lavoro! Hai una buona comprensione dei concetti base." 
                  : "Puoi fare di meglio. Ti consigliamo di rivedere la sezione teoria."}
            </p>

            <button 
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              Riprova il Quiz
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
