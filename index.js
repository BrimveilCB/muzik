const express = require('express');
const app = express();
const search = require('yt-search');
const ytdl = require('ytdl-core');

// WebView engellerini kaldırmak için CORS başlıkları
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

// Çalma Endpoint'i (Hatalar düzeltildi)
app.get('/play', async (req, res) => {
    const videoId = req.query.id;
    if (!videoId) return res.status(400).send("ID eksik");
    
    // Doğru YouTube URL formatı
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    try {
        // YouTube kısıtlamalarını aşmak için ajan (user-agent) taklidi yapıyoruz
        const info = await ytdl.getInfo(url, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        });
        
        // Sadece ses olan en yüksek kaliteli formatı seç
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });
        
        if (format && format.url) {
            res.json({ url: format.url, title: info.videoDetails.title });
        } else {
            throw new Error("Uygun ses formatı bulunamadı");
        }
    } catch (e) {
        res.status(500).send("Ses çözme hatası: " + e.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu ${PORT} portunda aktif.`);
});
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
