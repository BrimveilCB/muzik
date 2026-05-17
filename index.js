const express = require('express');
const app = express();
const search = require('yt-search');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Temel test endpoint'i (Sunucu açıldı mı diye bakmak için)
app.get('/', (req, res) => {
    res.send("Sunucu canavar gibi ayakta!");
});

// Arama Endpoint'i
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: "Arama sorgusu eksik" });
        const results = await search(query);
        res.json(results.videos.slice(0, 10));
    } catch (e) {
        res.status(500).json({ error: "Arama hatası: " + e.message });
    }
});

// Çalma Endpoint'i (ytdl-core tamamen kaldırıldı, düz embed linki dönüyor)
app.get('/play', (req, res) => {
    try {
        const videoId = req.query.id;
        if (!videoId) return res.status(400).json({ error: "ID eksik" });
        
        const streamUrl = "https://www.youtube.com/embed/" + videoId;
        res.json({ url: streamUrl, title: "YouTube Stream" });
    } catch (e) {
        res.status(500).json({ error: "Hata: " + e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("Sunucu hatasız sekilde aktif edildi. Port: " + PORT);
});

