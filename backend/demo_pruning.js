const ENCOUNTERS = [
  { id: 'goblin_ambush', name: 'Goblin Ambush', damage: 15, heal: 0, reward: 10 },
  { id: 'healing_fountain', name: 'Healing Fountain', damage: 0, heal: 30, reward: 0 },
  { id: 'puzzle_trap', name: 'Ancient Puzzle Trap', damage: 25, heal: 0, reward: 25 },
  { id: 'orc_brute', name: 'Orc Brute', damage: 35, heal: 0, reward: 30 },
  { id: 'empty_room', name: 'Quiet Catacombs', damage: 0, heal: 0, reward: 5 }
];

function evaluateStory(state) {
  const targetHp = state.player.maxHp * 0.45;
  const hpDiff = Math.abs(state.player.hp - targetHp); 
  if (state.player.hp <= 0) return -10000;
  return -hpDiff + (state.player.gold * 0.2);
}

function simulateStoryTurn(state, encounter) {
   let nextState = JSON.parse(JSON.stringify(state));
   nextState.player.hp -= encounter.damage;
   nextState.player.hp += encounter.heal;
   nextState.player.gold += encounter.reward;
   if (nextState.player.hp > nextState.player.maxHp) nextState.player.hp = nextState.player.maxHp;
   return nextState;
}

let nodesEvaluated = 0;
let branchesPruned = 0;

function minimaxStory(state, depth, alpha, beta, lastEncounterName = "Start") {
  const indent = "  ".repeat(3 - depth); // Depth 3 goes down to 0
  
  if (depth === 0 || state.player.hp <= 0) {
    nodesEvaluated++;
    const score = evaluateStory(state);
    console.log(`${indent}✧ LEAF: Expected HP: ${state.player.hp} -> Final Score: ${score.toFixed(1)}`);
    return { score: score, encounter: null };
  }
  
  let maxEval = -Infinity;
  let bestEncounter = null;
  
  let alphaStr = alpha === -Infinity ? '-∞' : alpha.toFixed(1);
  let betaStr = beta === Infinity ? '∞' : beta.toFixed(1);
  console.log(`${indent}► Node [${lastEncounterName}] | Depth ${depth} | HP: ${state.player.hp} | α: ${alphaStr}, β: ${betaStr}`);
  
  for (const enc of ENCOUNTERS) {
     // Skip fountain if full health
     if (enc.id === 'healing_fountain' && state.player.hp >= state.player.maxHp) {
        continue;
     }
     
     let nextState = simulateStoryTurn(state, enc);
     console.log(`${indent}  ↳ Simulating sequence -> +${enc.name} (HP changing from ${state.player.hp} to ${nextState.player.hp})`);
     
     let ev = minimaxStory(nextState, depth - 1, alpha, beta, enc.name).score;
     
     if (ev > maxEval) { 
        maxEval = ev; 
        bestEncounter = enc; 
     }
     
     alpha = Math.max(alpha, ev);
     console.log(`${indent}  ✓ Evaluated ${enc.name} -> Best Score So Far (alpha): ${alpha.toFixed(1)}`);
     
     if (beta <= alpha) {
        branchesPruned++;
        console.log(`${indent}  ✂️ PRUNING TRIGGERED! Beta (${beta.toFixed(1)}) is <= Alpha (${alpha.toFixed(1)}). No need to check remaining encounters!`);
        break; 
     }
  }
  return { score: maxEval, encounter: bestEncounter };
}

console.log("=== STARTING AI TURN SIMULATION ===");
const initialState = {
    player: {
        hp: 100,
        maxHp: 100,
        gold: 50,
        level: 1
    }
};

let result = minimaxStory(initialState, 2, -Infinity, Infinity); 
// Using Depth 2 instead of 3 to keep the output readable

console.log("\n=== SIMULATION RESULTS ===");
console.log(`Best Move Selected: ${result.encounter.name} (Score: ${result.score.toFixed(1)})`);
console.log(`Total Scenarios Checked: ${nodesEvaluated}`);
console.log(`Useless Branches Snipped (Pruned): ${branchesPruned}`);
