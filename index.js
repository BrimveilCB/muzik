const express = require('express');
const app = express();
const search = require('yt-search');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Arama Kısmı
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

// Gerçek MP3 / MP4 Linki Çözen Kısım
app.get('/play', async (req, res) => {
    try {
        const videoId = req.query.id;
        if (!videoId) return res.status(400).json({ error: "ID eksik" });

        // Engellere takılmayan harici indirme/stream API'si
        const apiUrl = `https://api.vevioz.com/api/button/mp3/${videoId}`;
        
        // HTML doğrudan bu linke gidebilsin veya indirebilsin diye adresi paslıyoruz
        res.json({ 
            url: apiUrl, 
            mp4: `https://api.vevioz.com/api/button/videos/${videoId}`,
            title: "Uzantı Hazır" 
        });
    } catch (e) {
        res.status(500).json({ error: "Çözme hatası: " + e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("Müzik indirme ve dinleme sunucusu aktif port: " + PORT);
});
