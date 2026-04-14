/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, BookOpen, Play, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from './lib/utils';
import Theory from './components/Theory';
import Simulator from './components/Simulator';
import Quiz from './components/Quiz';
import TCPTheory from './components/TCPTheory';
import TCPSimulator from './components/TCPSimulator';
import TCPQuiz from './components/TCPQuiz';
import AIAssistant from './components/AIAssistant';

export default function App() {
  const [protocol, setProtocol] = useState<'UDP' | 'TCP'>('UDP');
  const [activeTab, setActiveTab] = useState<'teoria' | 'simulatore' | 'quiz'>('teoria');
  
  // Simulation logs state lifted to App level for persistence
  const [udpLogs, setUdpLogs] = useState<string[]>([]);
  const [tcpLogs, setTcpLogs] = useState<string[]>([]);

  const currentLogs = protocol === 'UDP' ? udpLogs : tcpLogs;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center max-w-6xl">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="p-2 bg-white/10 rounded-lg">
              <Network className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">NetLearn: Trasporto</h1>
              <p className="text-xs opacity-80 italic">"Teaching is care." — OSI Layer 4</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            {/* Protocol Selector */}
            <div className="flex p-1 bg-blue-900/50 rounded-xl">
              {['UDP', 'TCP'].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setProtocol(p as any);
                    // We don't reset tab anymore to allow comparing
                  }}
                  className={cn(
                    "px-6 py-1.5 rounded-lg text-xs font-black transition-all",
                    protocol === p 
                      ? "bg-white text-blue-700 shadow-sm" 
                      : "text-blue-100 hover:bg-white/10"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Tab Selector */}
            <nav className="flex gap-2 p-1 bg-blue-800/50 rounded-xl">
              {[
                { id: 'teoria', label: 'Teoria', icon: BookOpen },
                { id: 'simulatore', label: 'Simulatore', icon: Play },
                { id: 'quiz', label: 'Quiz', icon: CheckCircle2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab.id 
                      ? "bg-white/20 text-white shadow-sm ring-1 ring-white/30" 
                      : "text-blue-100 hover:bg-white/10"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
        <div className="mb-8 flex items-center gap-4">
          <div className={cn(
            "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
            protocol === 'TCP' ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
          )}>
            Protocollo {protocol}
          </div>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${protocol}-${activeTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {protocol === 'UDP' ? (
              <>
                {activeTab === 'teoria' && <Theory />}
                {activeTab === 'simulatore' && (
                  <Simulator 
                    logs={udpLogs} 
                    onLogsChange={setUdpLogs} 
                  />
                )}
                {activeTab === 'quiz' && <Quiz />}
              </>
            ) : (
              <>
                {activeTab === 'teoria' && <TCPTheory />}
                {activeTab === 'simulatore' && (
                  <TCPSimulator 
                    logs={tcpLogs} 
                    onLogsChange={setTcpLogs} 
                  />
                )}
                {activeTab === 'quiz' && <TCPQuiz />}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Global AI Assistant */}
        <div className="mt-12">
          <AIAssistant 
            context={currentLogs.length > 0 ? currentLogs.join('\n') : undefined} 
            protocol={protocol}
          />
        </div>
      </main>



      <footer className="py-8 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 NetLearn Education • Progettato per la didattica digitale</p>
        </div>
      </footer>
    </div>
  );
}

