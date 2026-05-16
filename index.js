const express = require('express');
const app = express();
const search = require('yt-search');
const ytdl = require('ytdl-core');

// Sketchware'den gelen arama isteğini işler
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).send("Arama sorgusu eksik");
        const results = await search(query);
        res.json(results.videos.slice(0, 10)); // İlk 10 video sonucunu döndürür
    } catch (e) {
        res.status(500).send("Arama hatası: " + e.message);
    }
});

// Video ID'sini alıp reklamsız ham ses linkine çevirir
app.get('/play', async (req, res) => {
    const videoId = req.query.id;
    if (!videoId) return res.status(400).send("ID eksik");
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });
        res.json({ url: format.url, title: info.videoDetails.title });
    } catch (e) {
        res.status(500).send("Ses çözme hatası: " + e.message);
    }
});

app.listen(process.env.PORT || 3000);
