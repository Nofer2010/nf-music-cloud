const ytdl = require('ytdl-core');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405.1).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;

    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Link YouTube tidak valid' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.setHeader('Content-Type', 'audio/mpeg');

        ytdl(url, {
            quality: 'highestaudio',
            filter: 'audioonly',
        }).pipe(res);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Gagal memproses audio dari server' });
    }
}
