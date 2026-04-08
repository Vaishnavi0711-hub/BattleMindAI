const express = require('express');
const cors = require('cors');
const AIEngine = require('./ai/engine');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: "🟢 Algorithmic Realms Master API Online", version: "1.0", algorithm: "Minimax + Alpha-Beta Pruning" });
});

app.post('/api/ai/story', (req, res) => {
    const { gameState } = req.body;
    const startTime = Date.now();
    try {
        const result = AIEngine.getBestStoryMove(gameState);
        res.json({
            success: true,
            nextState: result.encounter,
            metrics: {
                timeTakenMs: Date.now() - startTime,
                algorithm: "Minimax + Alpha-Beta Pruning (Tension Score)",
                nodesEvaluated: result.stats.nodesEvaluated,
                branchesPruned: result.stats.branchesPruned
            }
        });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/ai/grid', (req, res) => {
    const { gameState, config } = req.body;
    const startTime = Date.now();
    try {
        const aiConfig = config || { depth: 4, mode: 'balanced', usePruning: true };
        const result = AIEngine.getBestGridMove(gameState, aiConfig);
        res.json({
            success: true,
            nextState: result.nextState,
            explanation: result.explanation,
            metrics: {
                timeTakenMs: Date.now() - startTime,
                algorithm: aiConfig.usePruning ? "Minimax + Alpha-Beta Pruning" : "Minimax Only",
                nodesEvaluated: result.stats.nodesEvaluated,
                branchesPruned: result.stats.branchesPruned
            }
        });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/ai/hangman', (req, res) => {
    const { gameState } = req.body;
    const startTime = Date.now();
    try {
        const result = AIEngine.getHangmanMove(gameState);
        res.json({
            success: true,
            nextPattern: result.nextPattern,
            nextDictionary: result.nextDictionary,
            isCorrect: result.isCorrect,
            metrics: {
                timeTakenMs: Date.now() - startTime,
                algorithm: "Adversarial Minimax Partitioning",
                nodesEvaluated: result.stats.nodesEvaluated,
                branchesPruned: result.stats.branchesPruned
            }
        });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Master Campaign Backend (Story + Tactics + Hangman) running on port ${PORT}`);
});
