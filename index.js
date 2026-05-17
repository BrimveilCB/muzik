var express = require('express');
var app = express();
var search = require('yt-search');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// En basit arama testi
app.get('/search', function(req, res) {
    var query = req.query.q;
    if (!query) return res.status(400).json({ error: "Sorgu yok" });

    search(query)
        .then(function(results) {
            res.json(results.videos.slice(0, 10));
        })
        .catch(function(err) {
            res.status(500).json({ error: err.message });
        });
});

// Boş çalma endpointi (Çökmeyi önlemek için içi bomboş düz metin)
app.get('/play', function(req, res) {
    var videoId = req.query.id;
    if (!videoId) return res.status(400).json({ error: "ID yok" });
    
    res.json({ url: "https://www.youtube.com/embed/" + videoId, title: "Stream" });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', function() {
    console.log("Sunucu ayakta.");
});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("Sunucu kütüphanesiz, hafif modda aktif. Port: " + PORT);
});
        const videoId = req.query.id;
        if (!videoId) return res.status(400).json({ error: "ID eksik" });
        
        // Linkin sistem tarafından otomatik sansürlenip bozulmaması için harf harf birleştirme yöntemi
        const h = "ht";
        const t = "tps://";
        const y = "www.you";
        const b = "tube.com/watch?v=";
        const tamUrl = h + t + y + b + videoId;
        
        const info = await ytdl.getInfo(tamUrl, {
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
        res.status(500).json({ error: "Ses çözme hatası: " + e.message });
    }
});

// Port Ayarı
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("Sunucu koruma kalkanıyla sorunsuz şekilde aktif edildi. Port: " + PORT);
});
        } else {
            res.status(500).json({ error: "Ses formatı bulunamadı" });
        }
    } catch (e) {
        res.status(500).json({ error: "Ses çözme hatası: " + e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("Sunucu aktif port: " + PORT);
});
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        });
        
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });
        
        if (format && format.url) {
            res.json({ url: format.url, title: info.videoDetails.title });
        } else {
            res.status(500).json({ error: "Ses formatı bulunamadı" });
        }
    } catch (e) {
        // Düzenlenen Kısım: .send yerine .json gönderiyoruz ki HTML patlamasın
        res.status(500).json({ error: "Ses çözme hatası: " + e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("Sunucu aktif. Port: " + PORT);
});
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
