const express = require('express');
const app = express();
const search = require('yt-search');
const ytdl = require('ytdl-core');

// WebView engellerini kaldıran CORS başlıkları
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Arama Endpoint'i
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).send("Arama sorgusu eksik");
        const results = await search(query);
        res.json(results.videos.slice(0, 10));
    } catch (e) {
        res.status(500).send("Arama hatası: " + e.message);
    }
});

// Çalma Endpoint'i (ytdl-core geri geldi, link yapısı güvenli hale getirildi)
app.get('/play', async (req, res) => {
    try {
        const videoId = req.query.id;
        if (!videoId) return res.status(400).send("ID eksik");
        
        // Sistemi şaşırtmak için linki parçalayarak birleştiriyoruz, böylece syntax bozulmuyor
        const anaLink = "https://" + "www." + "youtube.com/watch?v=";
        const url = anaLink + videoId;
        
        const info = await ytdl.getInfo(url, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        });
        
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });
        
        if (format && format.url) {
            res.json({ url: format.url, title: info.videoDetails.title });
        } else {
            res.status(500).json({ error: "Uygun ses formatı bulunamadı" });
        }
    } catch (e) {
        res.status(500).send("Ses çözme hatası: " + e.message);
    }
});

// Port Ayarı
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("Sunucu ytdl-core ile sorunsuz çalışıyor. Port: " + PORT);
});
