const db = require('../../backend/db'); // Path relatif ke db.js

const movieController = {
    // Tambah film ke daftar favorit
    addFavoriteMovie: async (req, res) => {
        const { omdb_id, title, year, poster } = req.body;
        if (!omdb_id || !title) {
            return res.status(400).json({ message: 'OMDB ID and Title are required.' });
        }

        try {
            // Cek apakah film sudah ada di favorit
            const [existing] = await db.query('SELECT id FROM favorite_movies WHERE omdb_id = ?', [omdb_id]);
            if (existing.length > 0) {
                return res.status(409).json({ message: 'Film ini sudah ada di daftar favorit Anda.' });
            }

            const [result] = await db.query(
                'INSERT INTO favorite_movies (omdb_id, title, year, poster) VALUES (?, ?, ?, ?)',
                [omdb_id, title, year, poster]
            );
            res.status(201).json({ message: 'Film berhasil ditambahkan ke favorit!', id: result.insertId });
        } catch (error) {
            console.error('Error adding favorite movie:', error);
            res.status(500).json({ message: 'Internal server error saat menambahkan film favorit.' });
        }
    },

    // Dapatkan semua film favorit
    getFavoriteMovies: async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM favorite_movies ORDER BY added_at DESC');
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching favorite movies:', error);
            res.status(500).json({ message: 'Internal server error saat mengambil daftar film favorit.' });
        }
    },

    // Hapus film dari daftar favorit
    deleteFavoriteMovie: async (req, res) => {
        const { id } = req.params; // Ini adalah ID dari database kita, bukan OMDB ID
        try {
            const [result] = await db.query('DELETE FROM favorite_movies WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Film favorit tidak ditemukan.' });
            }
            res.status(200).json({ message: 'Film berhasil dihapus dari favorit.' });
        } catch (error) {
            console.error('Error deleting favorite movie:', error);
            res.status(500).json({ message: 'Internal server error saat menghapus film favorit.' });
        }
    }
};

module.exports = movieController;