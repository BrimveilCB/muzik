const express = require('express');
const app = express();
const search = require('yt-search');
const ytdl = require('@distube/ytdl-core'); // Güncel paket çağrıldı

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
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

// Çalma ve Gerçek Ses Linki Çözme Endpoint'i
app.get('/play', async (req, res) => {
    try {
        const videoId = req.query.id;
        if (!videoId) return res.status(400).json({ error: "ID eksik" });
        
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        // Güncel distube paketi ile veriyi söküyoruz
        const info = await ytdl.getInfo(videoUrl, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
                }
            }
        });
        
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });
        
        if (format && format.url) {
            res.json({ url: format.url, title: info.videoDetails.title });
        } else {
            res.status(404).json({ error: "Uygun ses formatı bulunamadı" });
        }
    } catch (e) {
        res.status(500).json({ error: "Ses çözme hatası: " + e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("Güncel DisTube ytdl sunucusu aktif. Port: " + PORT);
});
