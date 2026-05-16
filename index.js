const express = require('express');
const app = express();
const search = require('yt-search');
const ytdl = require('ytdl-core');

// WebView (CORS) engellerini kaldırmak için güvenlik başlıkları
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Arama yapma bölümü
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).send("Arama sorgusu eksik");
        const results = await search(query);
        res.json(results.videos.slice(0, 10)); // İlk 10 sonucu gönderir
    } catch (e) {
        res.status(500).send("Arama hatası: " + e.message);
    }
});

// Şarkıyı çalma (Ses linkini çözme) bölümü
app.get('/play', async (req, res) => {
    const videoId = req.query.id;
    if (!videoId) return res.status(400).send("ID eksik");
    
    // ✅ DÜZELTİLEN YER: Gerçek YouTube link formatı tanımlandı
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    try {
        const info = await ytdl.getInfo(url);
        // Sadece ses barındıran en yüksek kaliteli formatı seçer
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });
        res.json({ url: format.url, title: info.videoDetails.title });
    } catch (e) {
        res.status(500).send("Ses çözme hatası: " + e.message);
    }
});

// Render sunucusunun dış dünyaya açılmasını sağlayan port ayarı
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu ${PORT} portunda sorunsuz çalışıyor.`);
});
});

// Render sunucusunun dış dünyaya açılmasını sağlayan port ayarı
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu ${PORT} portunda sorunsuz çalışıyor.`);
});

app.listen(process.env.PORT || 3000);
