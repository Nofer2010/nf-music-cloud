import ytdl from 'ytdl-core';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;
    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Link YouTube tidak valid!' });
    }

    try {
        const info = await ytdl.getInfo(url);
        // Membersihkan karakter aneh pada judul agar tidak error saat disimpan
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, ''); 
        
        // 1. Perintahkan sistem (HP) untuk menjadikan ini sebagai lampiran file (Attachment)
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.setHeader('Content-Type', 'audio/mpeg');

        // 2. Mengalirkan (piping) data suara langsung menjadi file MP3
        ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
        
    } catch (error) {
        return res.status(500).json({ error: 'Gagal mengekstrak audio YouTube.' });
    }
}
