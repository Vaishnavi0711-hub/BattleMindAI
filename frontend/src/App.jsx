import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, FileText, Settings, Shield, Swords, Compass, Activity, Server, Target, Cpu, CheckCircle, Heart, Coins, Zap, Skull, Map } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function App() {
  const [view, setView] = useState('landing'); 
  const [globalPlayer, setGlobalPlayer] = useState({ hp: 100, maxHp: 100, gold: 10, level: 1 });

  return (
    <div className="app-canvas">
      <div className="wave-container">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>
      
      <nav className="navbar">
         <div className="nav-brand"><Server size={20} className="mr-2"/> TEAM TRIO</div>
         <div className="nav-links">
            <button className={`nav-btn ${view==='landing'?'active':''}`} onClick={()=>setView('landing')}>Home</button>
            <button className={`nav-btn ${view==='about'?'active':''}`} onClick={()=>setView('about')}>Architecture</button>
            <button className={`nav-btn ${view==='lvl1'?'active':''}`} onClick={()=>setView('lvl1')}>Lvl 1: Story</button>
            <button className={`nav-btn ${view==='lvl2'?'active':''}`} onClick={()=>setView('lvl2')}>Lvl 2: Combat</button>
            <button className={`nav-btn accent`} onClick={()=>setView('lvl3')}>Lvl 3: Executioner</button>
         </div>
      </nav>

      {view === 'landing' && <LandingPage setView={setView} />}
      {view === 'about' && <AboutPage />}
      {view === 'lvl1' && <LevelOneStory setView={setView} player={globalPlayer} setPlayer={setGlobalPlayer} />}
      {view === 'lvl2' && <LevelTwoGrid setView={setView} player={globalPlayer} />}
      {view === 'lvl3' && <LevelThreeHangman setView={setView} />}
    </div>
  );
}

/* =========================================
   LANDING PAGE & ABOUT PAGE
========================================= */
function LandingPage({ setView }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page-view flex-center" style={{flexDirection: 'column', paddingTop: '40px'}}>
       <div className="hero-content">
          <h1 className="hero-title">BATTLE MIND AI</h1>
          <p className="hero-subtitle">Experience a dynamic tri-level campaign powered natively by Minimax and Alpha-Beta Cutoffs. Survive the Story, command physical grids, and try to execute the Evil Hangman.</p>
          <div className="hero-buttons mt-4 flex-center" style={{gap: '15px'}}>
             <button className="main-btn primary" onClick={() => setView('lvl1')}><Play size={18} className="mr-2"/> Start Campaign</button>
             <button className="main-btn secondary" onClick={() => scrollTo('about')}><FileText size={18} className="mr-2"/> About Us</button>
             <button className="main-btn secondary" onClick={() => scrollTo('features')}><Zap size={18} className="mr-2"/> Features</button>
          </div>
       </div>
       
       {/* Team Section */}
       <div id="about" style={{textAlign: 'center', marginTop: '60px', width: '100%', maxWidth: '1000px'}}>
           <h3 style={{color: 'rgba(255,255,255,0.4)', fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '40px'}}>Developed By</h3>
           <div style={{display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap'}}>
               <div style={{background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '25px 35px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', minWidth: '220px', transition: 'transform 0.3s'}}>
                   <div style={{width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '28px', boxShadow: '0 5px 15px rgba(59, 130, 246, 0.4)'}}>R</div>
                   <span style={{color: '#60a5fa', fontWeight: '800', fontSize: '1.3rem'}}>Rohan</span>
                   <p style={{fontSize: '0.9rem', color: '#94a3b8', margin: 0}}>Full-Stack Engineer</p>
               </div>
               <div style={{background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(236, 72, 153, 0.2)', padding: '25px 35px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', minWidth: '220px', transition: 'transform 0.3s'}}>
                   <div style={{width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899, #f472b6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '28px', boxShadow: '0 5px 15px rgba(236, 72, 153, 0.4)'}}>V</div>
                   <span style={{color: '#f472b6', fontWeight: '800', fontSize: '1.3rem'}}>Vaishnavi</span>
                   <p style={{fontSize: '0.9rem', color: '#94a3b8', margin: 0}}>Frontend Developer</p>
               </div>
               <div style={{background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '25px 35px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', minWidth: '220px', transition: 'transform 0.3s'}}>
                   <div style={{width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '28px', boxShadow: '0 5px 15px rgba(16, 185, 129, 0.4)'}}>K</div>
                   <span style={{color: '#34d399', fontWeight: '800', fontSize: '1.3rem'}}>Kaushik</span>
                   <p style={{fontSize: '0.9rem', color: '#94a3b8', margin: 0}}>System Architect</p>
               </div>
           </div>
       </div>

       {/* Features Section */}
       <div id="features" style={{marginTop: '100px', width: '100%', maxWidth: '1100px', paddingBottom: '80px'}}>
           <h2 className="doc-title" style={{textAlign: 'center', marginBottom: '50px'}}>Core System Features</h2>
           <div className="doc-grid">
              <div className="doc-card" style={{borderColor: 'rgba(16, 185, 129, 0.3)'}}>
                 <h3 style={{color: '#10b981'}}><Cpu size={20}/> High-Speed Minimax</h3>
                 <p>Our backend traverses game-states rapidly in sub-milliseconds, aggressively locating optimal counter-moves.</p>
              </div>
              <div className="doc-card" style={{borderColor: 'rgba(251, 191, 36, 0.3)'}}>
                 <h3 style={{color: '#fbbf24'}}><Activity size={20}/> Alpha-Beta Pruning</h3>
                 <p>Smart optimization algorithms naturally prune inefficient timelines by snipping branches to secure optimal memory limits.</p>
              </div>
              <div className="doc-card" style={{borderColor: 'rgba(139, 92, 246, 0.3)'}}>
                 <h3 style={{color: '#8b5cf6'}}><Zap size={20}/> React Animations</h3>
                 <p>Immersive layout designs powered heavily by Framer Motion intercept algorithmic physics and render them smoothly at 60 FPS.</p>
              </div>
           </div>
       </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="page-view doc-page" style={{paddingBottom: '80px'}}>
       <h2 className="doc-title">System Architecture</h2>
       <div className="doc-grid">
          <div className="doc-card">
             <h3><FileText size={20}/> Level 1: Narrative Minimax</h3>
             <p>The backend evaluates mathematical tension. The engine simulates 3 story-branches deep to locate an optimal path where the player's hitpoints dynamically hover exactly around 45%.</p>
          </div>
          <div className="doc-card">
             <h3><Target size={20}/> Level 2: Spatial Grid</h3>
             <p>The algorithm switches to a zero-sum spatial engine mapping physical distancing and line-of-sight to aggressively dismantle your positioning inside the grid.</p>
          </div>
          <div className="doc-card">
             <h3><Skull size={20}/> Level 3: Adversarial Executioner</h3>
             <p>A natively "Evil" version of Hangman. The AI algorithm does not pick a word. It systematically partitions the entire linguistic dictionary actively changing the un-guessed letters dynamically dodging your strikes.</p>
          </div>
       </div>

       <h2 className="doc-title" style={{marginTop: '70px'}}>Core Features</h2>
       <div className="doc-grid">
          <div className="doc-card" style={{borderColor: 'rgba(16, 185, 129, 0.3)'}}>
             <h3 style={{color: '#10b981'}}><Cpu size={20}/> High-Speed Minimax</h3>
             <p>Our backend traverses game-states rapidly in sub-milliseconds, aggressively locating optimal counter-moves.</p>
          </div>
          <div className="doc-card" style={{borderColor: 'rgba(251, 191, 36, 0.3)'}}>
             <h3 style={{color: '#fbbf24'}}><Activity size={20}/> Alpha-Beta Pruning</h3>
             <p>Smart optimization algorithms naturally prune inefficient timelines by snipping branches to secure optimal memory limits.</p>
          </div>
          <div className="doc-card" style={{borderColor: 'rgba(139, 92, 246, 0.3)'}}>
             <h3 style={{color: '#8b5cf6'}}><Zap size={20}/> React Animations</h3>
             <p>Immersive layout designs powered heavily by Framer Motion intercept algorithmic physics and render them smoothly at 60 FPS.</p>
          </div>
       </div>

       <h2 className="doc-title" style={{marginTop: '70px'}}>Development Team</h2>
       <div className="doc-grid">
          <div className="doc-card" style={{textAlign: 'center', borderColor: 'transparent', background: 'rgba(59, 130, 246, 0.05)'}}>
             <div style={{width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#fff', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)'}}>R</div>
             <h3 style={{justifyContent: 'center', margin: '0 0 5px 0', color: '#60a5fa'}}>Rohan</h3>
             <p style={{fontSize: '0.95rem', color: '#94a3b8'}}>Full-Stack Engineer</p>
          </div>
          <div className="doc-card" style={{textAlign: 'center', borderColor: 'transparent', background: 'rgba(236, 72, 153, 0.05)'}}>
             <div style={{width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899, #f472b6)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#fff', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.4)'}}>V</div>
             <h3 style={{justifyContent: 'center', margin: '0 0 5px 0', color: '#f472b6'}}>Vaishnavi</h3>
             <p style={{fontSize: '0.95rem', color: '#94a3b8'}}>Frontend Developer</p>
          </div>
          <div className="doc-card" style={{textAlign: 'center', borderColor: 'transparent', background: 'rgba(16, 185, 129, 0.05)'}}>
             <div style={{width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #34d399)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#fff', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)'}}>K</div>
             <h3 style={{justifyContent: 'center', margin: '0 0 5px 0', color: '#34d399'}}>Kaushik</h3>
             <p style={{fontSize: '0.95rem', color: '#94a3b8'}}>System Architect</p>
          </div>
       </div>
    </div>
  );
}

/* =========================================
   LEVEL 1 & 2 EXCLUDED DOMAIN LOGIC 
========================================= */
function LevelOneStory({ setView, player, setPlayer }) {
  const [history, setHistory] = useState([{ id: 0, text: "SURVIVE LEVEL 1: Navigate 3 encounters.", type: 'system' }]);
  const [activeEncounter, setActiveEncounter] = useState(null);
  const [encounterCount, setEncounterCount] = useState(0);

  const requestNextEncounter = async (pState) => {
    if (encounterCount >= 3) { setHistory(pr=>[...pr, {id:99, text:"CLEARED LEVEL 1! Entering the Boss Room.", type:'outcome'}]); setActiveEncounter({isEnd:true}); return; }
    try {
      const res = await axios.post(`${BACKEND_URL}/api/ai/story`, { gameState: { player: pState } });
      setActiveEncounter(res.data.nextState);
      setHistory(pr=>[...pr, {id: Date.now(), text: `> DM Spawns: ${res.data.nextState.text}`, type:'encounter'}]);
    } catch(err) { console.error(err); }
  };

  const handleAction = (aType) => {
    let nP = {...player}; let cE = activeEncounter;
    if(aType === 'fight') { nP.hp -= cE.damage; nP.gold += cE.reward; setHistory(p=>[...p, {id: Date.now(), text:`Fought! Took ${cE.damage} DMG, gained ${cE.reward} G.`, type:'outcome'}]); }
    else { nP.hp += cE.heal; if(cE.damage>0) nP.hp -= cE.damage; setHistory(p=>[...p, {id: Date.now(), text:`Interacted cleanly. Healed ${cE.heal} HP.`, type:'outcome'}]); }
    if(nP.hp > nP.maxHp) nP.hp = nP.maxHp;
    setPlayer(nP); setActiveEncounter(null); setEncounterCount(c=>c+1);
    setTimeout(() => requestNextEncounter(nP), 800);
  };

  return (
    <div className="page-view flex-row dungeon-bg">
       <div className="hud-panel dungeon-hud">
          <h3><Map size={20} className="mr-2" style={{display:'inline', verticalAlign:'text-bottom'}}/> The Catacombs</h3>
          <div className="hud-stats">
             <p><Heart size={18} color="#ef4444"/> HP: {player.hp}</p>
             <p><Coins size={18} color="#fbbf24"/> Gold: {player.gold}</p>
          </div>
       </div>
       <div className="main-console dungeon-console">
          <div className="story-log dungeon-log">{history.map(i=><div key={i.id} className={`story-entry dungeon-entry ${i.type}`}>{i.text}</div>)}</div>
          <div className="controls-bar dungeon-controls">
             {!activeEncounter && player.hp>0 && encounterCount===0 && <button className="main-btn dungeon-btn" onClick={()=>requestNextEncounter(player)}>Venture Deeper</button>}
             {activeEncounter && !activeEncounter.isEnd && <div className="action-row"><button className="main-btn dungeon-btn btn-atk" onClick={()=>handleAction('fight')}><Swords size={18} className="mr-2"/>Fight</button><button className="main-btn dungeon-btn btn-int" onClick={()=>handleAction('interact')}><Compass size={18} className="mr-2"/>Interact</button></div>}
             {activeEncounter?.isEnd && <button className="main-btn dungeon-btn victory" onClick={()=>setView('lvl2')}>Descend to Grid <Target size={18} className="mr-2" style={{marginLeft: '8px'}}/></button>}
             {player.hp <= 0 && <h3 style={{color: '#ff4444', fontFamily: 'Times New Roman'}}>YOU HAVE PERISHED.</h3>}
          </div>
       </div>
    </div>
  );
}

function LevelTwoGrid({ player, setView }) {
  const [gameState, setGameState] = useState({
    units: [
      { id: 'th', team: 'player', type: 'Town Hall', icon: '🏰', x: 0, y: 2, hp: player.hp + 200, maxHp: player.maxHp + 200, attack: 0, range: 0 },
      { id: 'p1', team: 'player', type: 'Barbarian', icon: '🗡️', x: 1, y: 2, hp: 100, maxHp: 100, attack: 25, range: 1 },
      { id: 'ai1', team: 'ai', type: 'Goblin', icon: '👺', x: 4, y: 1, hp: 80, maxHp: 80, attack: 30, range: 1 },
      { id: 'ai2', team: 'ai', type: 'Giant', icon: '👹', x: 4, y: 2, hp: 200, maxHp: 200, attack: 15, range: 1 },
      { id: 'ai3', team: 'ai', type: 'Archer', icon: '🏹', x: 4, y: 3, hp: 60, maxHp: 60, attack: 20, range: 2 }
    ]
  });
  const [metrics, setMetrics] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [combatLog, setCombatLog] = useState(["Waiting for Player Deployment..."]);
  const [isThinking, setIsThinking] = useState(false);
  const [pruningFlash, setPruningFlash] = useState(0);
  const [aiConfig, setAiConfig] = useState({ depth: 4, mode: 'balanced', usePruning: true });

  const endPlayerTurn = async () => {
    setIsThinking(true);
    setCombatLog(["INITIALIZING AI ENGINE...", `Mode: ${aiConfig.mode.toUpperCase()}`, `Depth: ${aiConfig.depth}`, `Pruning: ${aiConfig.usePruning?"ON":"OFF"}`]);
    
    try {
      const res = await axios.post(`${BACKEND_URL}/api/ai/grid`, { gameState, config: aiConfig });
      
      // Delay to visually emphasize the heavy "scanning" aesthetic of Minimax
      setTimeout(() => {
          setIsThinking(false);
          let newLog = [`System: Minimax depth ${aiConfig.depth} simulation complete.`];
          newLog.push(`Computed ${res.data.metrics.nodesEvaluated} structural futures.`);
          
          if(aiConfig.usePruning && res.data.metrics.branchesPruned > 0) {
              setPruningFlash(prev => prev + 1); // Triggers red glowing CSS animation
              newLog.push(`ALPHA-BETA ENGAGED! Snipped ${res.data.metrics.branchesPruned} timelines!`);
          }
          newLog.push(`Executing optimal trajectory raid.`);
          setCombatLog(newLog);

          setGameState(res.data.nextState || { units: [] });
          setMetrics(res.data.metrics);
          setExplanation(res.data.explanation);
      }, 1800);
      
    } catch (err) { 
        console.error(err);
        setIsThinking(false);
    }
  };

  return (
    <div className="page-view flex-row">
       <div className="hud-panel premium-hud" style={{minWidth: '320px'}}>
           <h3 style={{color: '#fbbf24', borderBottom: '1px solid rgba(251,191,36,0.2)', paddingBottom: '10px'}}>
              <Swords size={20} className="mr-2"/> Tactical Engine Center
           </h3>
           
           <div className="mt-4" style={{display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
               <p style={{fontSize: '0.8rem', color: '#fbbf24', fontWeight: 'bold'}}>AI Configuration (Dynamic Search)</p>
               
               <div style={{display: 'flex', gap: '5px'}}>
                   <button onClick={() => setAiConfig({...aiConfig, depth: 2})} style={{flex: 1, padding: '5px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid #1e293b', background: aiConfig.depth===2?'#fbbf24':'#1e293b', color: aiConfig.depth===2?'#000':'#fff'}}>Depth 2 (Easy)</button>
                   <button onClick={() => setAiConfig({...aiConfig, depth: 4})} style={{flex: 1, padding: '5px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid #1e293b', background: aiConfig.depth===4?'#fbbf24':'#1e293b', color: aiConfig.depth===4?'#000':'#fff'}}>Depth 4 (Med)</button>
                   <button onClick={() => setAiConfig({...aiConfig, depth: 6})} style={{flex: 1, padding: '5px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid #1e293b', background: aiConfig.depth===6?'#ef4444':'#1e293b', color: aiConfig.depth===6?'#fff':'#fff'}}>Depth 6 (Hard)</button>
               </div>
               
               <div style={{display: 'flex', gap: '5px'}}>
                   <button onClick={() => setAiConfig({...aiConfig, mode: 'aggressive'})} style={{flex: 1, padding: '5px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid #1e293b', background: aiConfig.mode==='aggressive'?'#fbbf24':'#1e293b', color: aiConfig.mode==='aggressive'?'#000':'#fff'}}>Aggressive</button>
                   <button onClick={() => setAiConfig({...aiConfig, mode: 'balanced'})} style={{flex: 1, padding: '5px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid #1e293b', background: aiConfig.mode==='balanced'?'#fbbf24':'#1e293b', color: aiConfig.mode==='balanced'?'#000':'#fff'}}>Balanced</button>
                   <button onClick={() => setAiConfig({...aiConfig, mode: 'defensive'})} style={{flex: 1, padding: '5px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid #1e293b', background: aiConfig.mode==='defensive'?'#fbbf24':'#1e293b', color: aiConfig.mode==='defensive'?'#000':'#fff'}}>Defensive</button>
               </div>

               <label style={{fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff', marginTop: '4px'}}>
                   <input type="checkbox" checked={aiConfig.usePruning} onChange={(e) => setAiConfig({...aiConfig, usePruning: e.target.checked})} style={{cursor: 'pointer', width: '16px', height: '16px', accentColor: '#ef4444'}} />
                   <b>Enable Alpha-Beta Optimization</b> 
               </label>
           </div>
           
           <button className="main-btn mt-4" style={{width: '100%', background: isThinking ? '#6b7280' : '#fbbf24', color: isThinking ? '#fff' : '#000', border: '2px solid transparent', boxShadow: isThinking ? 'none' : '0 0 20px rgba(251,191,36,0.3)', pointerEvents: isThinking ? 'none' : 'auto', transition: '0.4s'}} onClick={endPlayerTurn}>
              {isThinking ? <span className="thinking-text">CALCULATING MINIMAX...</span> : 'End Turn (Enemy Raid)'}
           </button>
           
           {metrics && (
                <div key={pruningFlash} className="pruning-tracker mt-4">
                   {pruningFlash > 0 && <div className="prune-flash"></div>}
                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                       <div>
                           <p style={{color: '#93c5fd', fontSize: '0.85rem', marginBottom: '8px'}}><Cpu size={14} className="mr-2"/>Nodes Evaluated: <b style={{color: '#fff'}}>{metrics.nodesEvaluated}</b></p>
                           <p style={{color: '#93c5fd', fontSize: '0.85rem'}}><Activity size={14} className="mr-2"/>AI Latency: <b style={{color: '#fff'}}>{metrics.timeTakenMs}ms</b></p>
                       </div>
                       <div style={{textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.4)', minWidth: '80px', opacity: aiConfig.usePruning ? 1 : 0.2}}>
                           <div className="prune-number">{metrics.branchesPruned}</div>
                           <p style={{color: '#ef4444', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px'}}>BRANCHES<br/>PRUNED</p>
                       </div>
                   </div>
                </div>
           )}

           {explanation && (
              <div className="mt-4" style={{background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '12px', borderRadius: '8px'}}>
                 <h4 style={{color: '#10b981', fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px'}}><FileText size={14} className="mr-1" style={{display:'inline'}}/> EXPLAINABLE AI REASONING</h4>
                 <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                     {explanation.map((line, idx) => (
                        <p key={idx} style={{fontFamily: 'monospace', fontSize: '0.7rem', color: idx === explanation.length - 1 ? '#fbbf24' : '#fff', fontWeight: idx === explanation.length - 1 ? 'bold' : 'normal'}}>{line}</p>
                     ))}
                 </div>
              </div>
           )}

           <div className="mt-4" style={{background: 'rgba(0,0,0,0.6)', border: '1px solid #78350f', padding: '15px', borderRadius: '12px', minHeight: '130px'}}>
              <h4 style={{color: '#fbbf24', fontSize: '0.75rem', marginBottom: '10px', letterSpacing: '1px'}}>AI COMMAND TERMINAL</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                  {combatLog.map((log, idx) => (
                      <motion.p 
                          key={log + idx} 
                          initial={{opacity: 0, x: -10}} 
                          animate={{opacity: 1, x: 0}} 
                          style={{fontFamily: 'monospace', fontSize: '0.75rem', color: log.includes('ALPHA-BETA') ? '#ef4444' : '#fbbf24', fontWeight: log.includes('ALPHA-BETA') ? 'bold' : 'normal'}}
                      >
                          &gt; {log}
                      </motion.p>
                  ))}
              </div>
           </div>

           <button className="main-btn secondary mt-4" style={{width: '100%', borderColor: 'rgba(255,255,255,0.1)'}} onClick={()=>setView('lvl3')}>Surrender to Minimax</button>
       </div>

       <div className="main-console flex-center" style={{flexDirection: 'column', background: 'radial-gradient(circle, rgba(15,23,42,1) 0%, rgba(0,0,0,1) 100%)', position: 'relative', overflow: 'hidden'}}>
          
          <div style={{position: 'relative', marginTop: '30px'}}>
              <div className={`coc-board ${isThinking ? 'simulating' : ''}`}>
                  {Array.from({length: 25}).map((_, i) => <div key={i} className="coc-cell"></div>)}
                  
                  <AnimatePresence>
                     {gameState.units?.filter(u => u.hp > 0).map((unit) => (
                        <motion.div
                            key={unit.id}
                            layout
                            initial={{ opacity: 0, scale: 0.2 }}
                            animate={{ opacity: 1, scale: 1, x: unit.x * 77, y: unit.y * 77 }}
                            exit={{ opacity: 0, scale: 0, filter: "brightness(5) blur(4px)" }}
                            transition={{ type: "spring", stiffness: 120, damping: 14 }}
                            style={{
                                position: 'absolute', top: '15px', left: '15px',
                                width: '75px', height: '75px',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                pointerEvents: 'none', zIndex: 10
                            }}
                        >
                             <div className="coc-hp-text">{unit.hp}</div>
                             <div className="coc-hp-container">
                                <div className="coc-hp-bar" style={{
                                   width: `${Math.max(0, (unit.hp/unit.maxHp)*100)}%`,
                                   background: unit.hp / unit.maxHp > 0.5 ? '#10b981' : (unit.hp / unit.maxHp > 0.2 ? '#fbbf24' : '#ef4444')
                                }}></div>
                             </div>
                             <span className="coc-unit">{unit.icon}</span>
                        </motion.div>
                     ))}
                  </AnimatePresence>
              </div>
              {isThinking && <div className="ai-scan-line"></div>}
          </div>

          <p className="mt-4 mb-4 text-center text-muted" style={{maxWidth: '450px', background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
             <b>Framer Motion Intercepts:</b> As the AI algorithm rewrites the grid coordinates in the background, React effortlessly animates the physics routing of the Goblins and Giants tracking you!
          </p>
       </div>
    </div>
  )
}

/* =========================================
   LEVEL 3: ADVERSARIAL EVIL HANGMAN
========================================= */
const HANGMAN_ASCII = [
  ``,  // 0 wrong
  `  \n  O \n `, // 1 wrong
  `  \n  O \n  | `, // 2 wrong
  `  \n  O \n /| `, // 3 wrong
  `  \n  O \n /|\\`, // 4 wrong
  `  \n  O \n /|\\\n /`, // 5 wrong
  `  \n  O \n /|\\\n / \\` // 6 wrong
];

function LevelThreeHangman() {
   const [pattern, setPattern] = useState('_________'); // 9 letters defaults to ALGORITHM
   const [dictionary, setDictionary] = useState([]);
   const [guessed, setGuessed] = useState([]);
   const [wrongCount, setWrongCount] = useState(0);
   const [metrics, setMetrics] = useState(null);
   const [gameStatus, setGameStatus] = useState('PLAYING'); // PLAYING, WON, LOST

   const guessLetter = async (char) => {
       if (guessed.includes(char) || gameStatus !== 'PLAYING') return;
       const newGuessed = [...guessed, char];
       setGuessed(newGuessed);

       try {
           const res = await axios.post(`${BACKEND_URL}/api/ai/hangman`, {
               gameState: { dictionary: dictionary, guessedLetter: char, currentPattern: pattern }
           });
           
           const { nextPattern, nextDictionary, isCorrect, metrics: m } = res.data;
           setPattern(nextPattern);
           setDictionary(nextDictionary);
           setMetrics(m);

           let newWrong = wrongCount;
           if (!isCorrect) {
               newWrong++;
               setWrongCount(newWrong);
           }

           if (!nextPattern.includes('_')) {
               setGameStatus('WON');
           } else if (newWrong >= 6) {
               setGameStatus('LOST');
           }
       } catch (err) { console.error("Hangman Server Error", err); }
   };

   return (
       <div className="page-view flex-row">
          <div className="hud-panel" style={{border: '1px solid #ef4444'}}>
             <h3 style={{color: '#ef4444'}}><Skull size={18}/> Level 3: Executioner</h3>
             <p className="text-muted mt-2">The AI does NOT pick a word. It evaluates your guesses and dynamically alters the dictionary bounds to force you down dead-end nodes.</p>
             
             <div className="mt-4" style={{background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
                <div style={{fontFamily: 'monospace', whiteSpace: 'pre', color: '#f87171', fontSize: '1.5rem', lineHeight: '1.2'}}>
                    {` +---+\n |   |\n${HANGMAN_ASCII[wrongCount] || ''}`}
                </div>
                <p className="mt-4 text-red">STRIKES: {wrongCount} / 6</p>
             </div>

             {metrics && (
                <div className="grid-metrics mt-4" style={{borderColor: 'rgba(239, 68, 68, 0.4)'}}>
                   <p><Cpu size={14}/> Node Deep-Search: {metrics.nodesEvaluated}</p>
                   <p><Zap size={14}/> Matrix Pruned: {metrics.branchesPruned}</p>
                   <p><Activity size={14}/> V8 Latency: {metrics.timeTakenMs}ms</p>
                </div>
             )}
          </div>

          <div className="main-console flex-center" style={{flexDirection: 'column'}}>
             <div style={{fontSize: '4rem', letterSpacing: '0.8rem', fontFamily: 'monospace', textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'}}>
                 {pattern}
             </div>
             
             {gameStatus === 'WON' && <h2 className="text-green mt-4" style={{fontSize: '2rem'}}>SYSTEM OVERRIDEN. YOU SURVIVED.</h2>}
             {gameStatus === 'LOST' && <h2 className="text-red mt-4" style={{fontSize: '2rem'}}>EXECUTION IMMINENT. GAME OVER.</h2>}

             <div className="keyboard mt-4">
                 {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => (
                    <button 
                       key={char} 
                       className={`key-btn ${guessed.includes(char) ? 'disabled' : ''}`}
                       onClick={() => guessLetter(char)}
                       disabled={guessed.includes(char) || gameStatus !== 'PLAYING'}
                    >
                       {char}
                    </button>
                 ))}
             </div>

             {gameStatus !== 'PLAYING' && (
                 <button className="main-btn primary mt-4" onClick={() => { setPattern('_________'); setDictionary([]); setGuessed([]); setWrongCount(0); setGameStatus('PLAYING'); setMetrics(null); }}>
                    Re-initialize Adversary
                 </button>
             )}
          </div>
       </div>
   )
}
