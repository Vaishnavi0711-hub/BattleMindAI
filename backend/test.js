const AIEngine = require('./ai/engine');
try {
  const state = { timeTick: 0, lights: 'NS', cars: [] };
  const res = AIEngine.getBestMove(state);
  console.log("SUCCESS", res);
} catch (e) {
  console.log("ERROR", e.stack);
}
