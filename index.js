const express = require('express');
const app = express();
const search = require('yt-search');
const ytdl = require('ytdl-core');

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
        
        // ytdl-core ile YouTube'dan video bilgilerini çekiyoruz
        const info = await ytdl.getInfo(videoUrl, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                }
            }
        });
        
        // Sadece ses içeren en yüksek kaliteli formatı seçiyoruz
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });
        
        if (format && format.url) {
            // HTML tarafında audio etiketinin doğrudan oynatabilmesi için saf URL dönüyoruz
            res.json({ url: format.url, title: info.videoDetails.title });
        } else {
            res.status(404).json({ error: "Uygun ses formatı bulunamadı" });
        }
    } catch (e) {
        // Hata durumunda HTML'i kilitlememek için düzgünce JSON dönüyoruz
        res.status(500).json({ error: "Ses çözme hatası: " + e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("Orijinal ytdl sunucusu aktif. Port: " + PORT);
});
