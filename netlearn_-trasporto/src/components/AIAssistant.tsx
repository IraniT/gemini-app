import { useState } from 'react';
import { Sparkles, Brain, Lightbulb, Loader2 } from 'lucide-react';
import { askGemini } from '../services/geminiService';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantProps {
  context?: string;
  protocol?: 'UDP' | 'TCP';
}

export default function AIAssistant({ context, protocol = 'UDP' }: AIAssistantProps) {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateScenario = async () => {
    setIsLoading(true);
    const prompt = `Genera un breve caso di studio reale (max 100 parole) in cui viene usato il protocollo ${protocol}. Spiega perché si usa ${protocol} invece dell'altro protocollo principale in quel contesto e quali primitive del livello trasporto sono coinvolte.`;
    const res = await askGemini(prompt, "Sei un esperto di reti informatiche. Rispondi in italiano in modo chiaro e didattico.");
    setResponse(res);
    setIsLoading(false);
  };

  const explainContext = async () => {
    if (!context) return;
    setIsLoading(true);
    const prompt = `Analizza questo contesto di una simulazione ${protocol} e spiega cosa sta succedendo tecnicamente: \n\n ${context}`;
    const res = await askGemini(prompt, `Sei un tutor universitario esperto di reti. Spiega i passaggi della simulazione ${protocol} citando le primitive di trasporto e i concetti chiave del protocollo.`);
    setResponse(res);
    setIsLoading(false);
  };

  const isContextEmpty = !context || context.trim() === "";

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Assistente AI Gemini</h2>
          <p className="text-sm text-slate-500">Chiedi una spiegazione personalizzata o genera scenari reali</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={generateScenario}
          disabled={isLoading}
          className="flex items-center justify-between p-5 bg-purple-50 rounded-2xl border-2 border-purple-100 hover:bg-purple-100 hover:border-purple-200 transition-all group disabled:opacity-50 text-left"
        >
          <div className="pr-4">
            <div className="font-bold text-purple-900 mb-1">Crea Scenario Reale</div>
            <p className="text-xs text-purple-700 leading-relaxed">Genera un caso d'uso specifico per {protocol}</p>
          </div>
          <Lightbulb className="w-6 h-6 text-purple-400 group-hover:text-purple-600 transition-all" />
        </button>

        <button 
          onClick={explainContext}
          disabled={isLoading || isContextEmpty}
          className={cn(
            "flex items-center justify-between p-5 rounded-2xl transition-all group border-2 text-left",
            !isContextEmpty 
              ? "bg-blue-50 border-blue-100 hover:bg-blue-100 hover:border-blue-200 cursor-pointer" 
              : "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"
          )}
        >
          <div className="pr-4">
            <div className="font-bold text-slate-800 mb-1">Spiega Simulazione</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isContextEmpty 
                ? "Avvia prima una simulazione per attivare questa funzione." 
                : `Analizza i log della simulazione ${protocol} corrente.`}
            </p>
          </div>
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
            !isContextEmpty ? "bg-blue-600 text-white group-hover:scale-110" : "bg-slate-200 text-slate-400"
          )}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center justify-center gap-2 text-purple-600 py-4"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Gemini sta elaborando...</span>
          </motion.div>
        )}

        {response && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-slate-50 rounded-xl text-sm border-l-4 border-purple-500 leading-relaxed text-slate-700 overflow-hidden"
          >
            <div className="prose prose-sm max-w-none">
              {response.split('\n').map((line, i) => (
                <p key={i} className={cn(i > 0 && "mt-2")}>{line}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
