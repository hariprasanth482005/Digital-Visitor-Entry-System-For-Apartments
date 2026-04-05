const express = require('express');
const app = express();
app.get('/api/health', (req, res) => {
    console.log('Health check request received');
    res.json({ status: 'ok', time: new Date().toISOString() });
});
app.listen(5000, '0.0.0.0', () => {
    console.log('Minimal server running on port 5000');
});
