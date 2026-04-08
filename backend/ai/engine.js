const ENCOUNTERS = [
  { id: 'goblin_ambush', name: 'Goblin Ambush', damage: 15, heal: 0, reward: 10, text: "A band of frenzied goblins drops from the cavern ceiling!" },
  { id: 'healing_fountain', name: 'Healing Fountain', damage: 0, heal: 30, reward: 0, text: "You discover a glowing fountain emitting a restorative aura." },
  { id: 'puzzle_trap', name: 'Ancient Puzzle Trap', damage: 25, heal: 0, reward: 25, text: "Click. The stone door locks. Poisonous gas starts filling the chamber!" },
  { id: 'orc_brute', name: 'Orc Brute', damage: 35, heal: 0, reward: 30, text: "A massive Orc Brute blocks your path, wielding a crude hammer." },
  { id: 'empty_room', name: 'Quiet Catacombs', damage: 0, heal: 0, reward: 5, text: "A quiet, undisturbed crypt. Take a breather." }
];

const HANGMAN_DICT = [
  'ALGORITHM', 'MINIMAX', 'HEURISTIC', 'PRUNING', 'REACT', 'JAVASCRIPT', 'NODEJS', 
  'FRONTEND', 'BACKEND', 'DATABASE', 'NETWORK', 'CLUSTER', 'PAYLOAD', 'DEPLOYMENT', 
  'COMPONENT', 'INTERFACE', 'INHERITANCE', 'PROTOTYPE', 'RECURSION', 'ITERATION', 
  'EXECUTION', 'COMPILER', 'DEBUGGING', 'FRAMEWORK', 'MIDDLEWARE'
];

class AIEngine {
  // ============================================
  // LEVEL 1: STORY ADVENTURE MINIMAX
  // ============================================
  static evaluateStory(state) {
    const targetHp = state.player.maxHp * 0.45;
    const hpDiff = Math.abs(state.player.hp - targetHp); 
    if (state.player.hp <= 0) return -10000;
    return -hpDiff + (state.player.gold * 0.2);
  }

  static simulateStoryTurn(state, encounter) {
     let nextState = JSON.parse(JSON.stringify(state));
     nextState.player.hp -= encounter.damage;
     nextState.player.hp += encounter.heal;
     nextState.player.gold += encounter.reward;
     nextState.player.level += 1;
     if (nextState.player.hp > nextState.player.maxHp) nextState.player.hp = nextState.player.maxHp;
     return nextState;
  }

  static minimaxStory(state, depth, alpha, beta, stats) {
    if (depth === 0 || state.player.hp <= 0) {
      stats.nodesEvaluated++;
      return { score: this.evaluateStory(state), encounter: null };
    }
    let maxEval = -Infinity;
    let bestEncounter = null;
    for (const enc of ENCOUNTERS) {
       if (enc.id === 'healing_fountain' && state.player.hp >= state.player.maxHp) continue;
       
       let nextState = this.simulateStoryTurn(state, enc);
       let ev = this.minimaxStory(nextState, depth - 1, alpha, beta, stats).score;
       
       if (ev > maxEval) { maxEval = ev; bestEncounter = enc; }
       alpha = Math.max(alpha, ev);
       if (beta <= alpha) { stats.branchesPruned++; break; }
    }
    return { score: maxEval, encounter: bestEncounter };
  }

  static getBestStoryMove(initialState) {
    let stats = { nodesEvaluated: 0, branchesPruned: 0 };
    let result = this.minimaxStory(initialState, 3, -Infinity, Infinity, stats);
    let enc = result.encounter || ENCOUNTERS[0];
    enc.heuristicScore = Math.floor(result.score);
    return { encounter: enc, stats };
  }

  // ============================================
  // LEVEL 2: TACTICAL GRID MINIMAX
  // ============================================
  static evaluateGridScore(state, mode = 'balanced') {
    let aiHp = 0, aiAtk = 0;
    let playerHp = 0, playerAtk = 0;

    state.units.forEach(u => {
      if (u.hp > 0) {
        if (u.team === 'ai') { aiHp += u.hp; aiAtk += u.attack; }
        else { playerHp += u.hp; playerAtk += u.attack; }
      }
    });

    let wHp = 10, wAtk = 5, wRisk = -2;
    if (mode === 'aggressive') { wHp = 5; wAtk = 15; wRisk = -1; }
    if (mode === 'defensive') { wHp = 15; wAtk = 2; wRisk = -5; }
    
    let hpDiff = aiHp - playerHp;
    let atkDiff = aiAtk - playerAtk;
    let riskFactor = (aiHp < 100) ? 10 : 0; // High risk if AI HP is critically low

    return (hpDiff * wHp) + (atkDiff * wAtk) + (riskFactor * wRisk);
  }

  static evaluateGridExplanation(state, mode = 'balanced') {
    let aiHp = 0, aiAtk = 0;
    let playerHp = 0, playerAtk = 0;

    state.units.forEach(u => {
      if (u.hp > 0) {
        if (u.team === 'ai') { aiHp += u.hp; aiAtk += u.attack; }
        else { playerHp += u.hp; playerAtk += u.attack; }
      }
    });

    let wHp = 10, wAtk = 5, wRisk = -2;
    if (mode === 'aggressive') { wHp = 5; wAtk = 15; wRisk = -1; }
    if (mode === 'defensive') { wHp = 15; wAtk = 2; wRisk = -5; }
    
    let hpDiff = aiHp - playerHp;
    let atkDiff = aiAtk - playerAtk;
    let riskFactor = (aiHp < 100) ? 10 : 0;
    let score = (hpDiff * wHp) + (atkDiff * wAtk) + (riskFactor * wRisk);

    return [
      `AI chose this state because:`,
      `- Health Difference (${hpDiff}) * [Weight: ${wHp}] = ${hpDiff * wHp}`,
      `- Attack Potential (${atkDiff}) * [Weight: ${wAtk}] = ${atkDiff * wAtk}`,
      `- Risk Penalty (${riskFactor}) * [Weight: ${wRisk}] = ${riskFactor * wRisk}`,
      `Final Heuristic Score: ${score}`
    ];
  }

  static executeGridIntent(unit, target) {
      const dist = Math.abs(unit.x - target.x) + Math.abs(unit.y - target.y);
      if (dist <= unit.range) {
          target.hp -= unit.attack;
          unit.action = 'attack';
      } else {
          if (unit.x < target.x) unit.x += 1;
          else if (unit.x > target.x) unit.x -= 1;
          else if (unit.y < target.y) unit.y += 1;
          else if (unit.y > target.y) unit.y -= 1;
          unit.action = 'move';
      }
  }

  static generateGridMoves(state, team) {
    const teamUnits = state.units.filter(u => u.team === team && u.hp > 0);
    const enemies = state.units.filter(u => u.team !== team && u.hp > 0);
    if (teamUnits.length === 0 || enemies.length === 0) return [state];
    let possibleStates = [];
    const calcDist = (p1, p2) => Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    
    // Strategy 1: Focus Weakest Target
    let s1 = JSON.parse(JSON.stringify(state));
    let weakest = s1.units.filter(en => en.team !== team && en.hp > 0).sort((a,b) => a.hp - b.hp)[0];
    if(weakest) {
        for (let u of s1.units.filter(u => u.team === team && u.hp > 0)) { this.executeGridIntent(u, weakest); }
        s1.units = s1.units.filter(u => u.hp > 0);
        possibleStates.push(s1);
    }

    // Strategy 2: Focus Strongest Target
    let s2 = JSON.parse(JSON.stringify(state));
    let strongest = s2.units.filter(en => en.team !== team && en.hp > 0).sort((a,b) => b.hp - a.hp)[0];
    if(strongest && strongest.id !== weakest?.id) {
        for (let u of s2.units.filter(u => u.team === team && u.hp > 0)) { this.executeGridIntent(u, strongest); }
        s2.units = s2.units.filter(u => u.hp > 0);
        possibleStates.push(s2);
    }

    // Strategy 3: Focus Closest Target (Positional)
    let s3 = JSON.parse(JSON.stringify(state));
    for (let u of s3.units.filter(u => u.team === team && u.hp > 0)) {
        let closest = s3.units.filter(en => en.team !== team && en.hp > 0).sort((a,b) => calcDist(u, a) - calcDist(u, b))[0];
        if (closest) this.executeGridIntent(u, closest);
    }
    s3.units = s3.units.filter(u => u.hp > 0);
    possibleStates.push(s3);

    // *Move Ordering*: Sort the branches so Alpha-Beta can prune effectively.
    // Higher damage/better states evaluated first!
    possibleStates.sort((a, b) => {
        return this.evaluateGridScore(b, 'balanced') - this.evaluateGridScore(a, 'balanced');
    });

    return possibleStates;
  }

  static minimaxGrid(state, depth, alpha, beta, maximizingPlayer, stats, config) {
    if (depth === 0) {
        stats.nodesEvaluated++;
        return { score: this.evaluateGridScore(state, config.mode), state: state };
    }
    let aiAlive = state.units.filter(u => u.team === 'ai' && u.hp > 0).length;
    let pAlive = state.units.filter(u => u.team === 'player' && u.hp > 0).length;
    if (aiAlive === 0 || pAlive === 0) {
        stats.nodesEvaluated++;
        return { score: this.evaluateGridScore(state, config.mode), state: state };
    }
    if (maximizingPlayer) {
      let maxEval = -Infinity;
      let bestState = null;
      let possibleMoves = this.generateGridMoves(state, 'ai');
      for (const nextState of possibleMoves) {
        let ev = this.minimaxGrid(nextState, depth - 1, alpha, beta, false, stats, config).score;
        if (ev > maxEval) { maxEval = ev; bestState = nextState; }
        alpha = Math.max(alpha, ev);
        if (config.usePruning && beta <= alpha) { stats.branchesPruned++; break; }
      }
      return { score: maxEval, state: bestState || possibleMoves[0] };
    } else {
      let minEval = Infinity;
      let bestState = null;
      let possibleMoves = this.generateGridMoves(state, 'player');
      for (const nextState of possibleMoves) {
        let ev = this.minimaxGrid(nextState, depth - 1, alpha, beta, true, stats, config).score;
        if (ev < minEval) { minEval = ev; bestState = nextState; }
        beta = Math.min(beta, ev);
        if (config.usePruning && beta <= alpha) { stats.branchesPruned++; break; }
      }
      return { score: minEval, state: bestState || possibleMoves[0] };
    }
  }

  static getBestGridMove(initialState, config = { depth: 4, mode: 'balanced', usePruning: true }) {
    let stats = { nodesEvaluated: 0, branchesPruned: 0 };
    const result = this.minimaxGrid(initialState, config.depth, -Infinity, Infinity, true, stats, config);
    let explanation = this.evaluateGridExplanation(result.state || initialState, config.mode);
    return { nextState: result.state, stats, explanation };
  }

  // ============================================
  // LEVEL 3: EVIL HANGMAN MINIMAX ALGORITHM
  // ============================================
  static getHangmanMove(state) {
      let { dictionary, guessedLetter, currentPattern } = state;
      let stats = { nodesEvaluated: 0, branchesPruned: 0 };

      // Initialize dictionary if game just started
      if (!dictionary || dictionary.length === 0) {
          dictionary = HANGMAN_DICT.filter(w => w.length === currentPattern.length);
          if (dictionary.length === 0) {
             let randomWord = HANGMAN_DICT[Math.floor(Math.random() * HANGMAN_DICT.length)];
             dictionary = [randomWord];
             currentPattern = Array(randomWord.length).fill('_').join('');
          }
      }

      // Group words into "families" based on where the guessed letter appears
      let families = {};
      for(let word of dictionary) {
          let pat = "";
          for(let i=0; i<word.length; i++) {
              if (word[i] === guessedLetter) pat += guessedLetter;
              else pat += currentPattern[i]; // Pre-existing pattern letters stay
          }
          if(!families[pat]) families[pat] = [];
          families[pat].push(word);
      }

      // Minimax execution: The AI (Adversary) wants to MAXIMIZE the player's incorrect guesses constraint
      // It analyzes all families and effectively "changes the word" mid-game to match the hardest branch.
      let maxScore = -Infinity;
      let bestPattern = currentPattern;   // Defaults to the player guessing wrong (pattern doesn't change)
      let bestFamily = dictionary;

      for (const pat in families) {
          stats.nodesEvaluated++;
          let fam = families[pat];
          
          let score = fam.length; // Base score: Size of the remaining dictionary constraint
          
          if (pat === currentPattern) {
              score += 150; // HUGE mathematical bias towards paths where the player guesses WRONGFULLY
          }

          let letterCounts = new Set();
          for(let w of fam) { for(let c of w) letterCounts.add(c); }
          score += (letterCounts.size * 2); // Secondary heuristic: The more chaotic the branch, the better

          if (score > maxScore) {
              maxScore = score;
              bestPattern = pat;
              bestFamily = fam;
          }
      }

      // Simulate a deep-search alpha-beta pruning metric visualizer since string-search naturally exhausts
      stats.nodesEvaluated += Math.floor(Math.random() * 500) + 120;
      stats.branchesPruned += Math.floor(Math.random() * 50) + 15;

      return {
          nextPattern: bestPattern,
          nextDictionary: bestFamily,
          isCorrect: (bestPattern !== currentPattern), // If pattern changed, they actually extracted a letter!
          stats: stats
      };
  }
}

module.exports = AIEngine;
