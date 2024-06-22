const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

// Middleware untuk parsing request body
app.use(bodyParser.json());

// Koneksi ke DB
const database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "data_mahasiswa",
});


// Pengecekan koneksi DB
database.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Database connected");
});



// a. Mendapatkan daftar seluruh mahasiswa (GET /mahasiswa)
app.get("/mahasiswa", (req, res) => {
    database.query("SELECT * FROM mahasiswa", (err, rows) => {
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).json({
                success: false,
                message: "Error getting users data",
                error: err.message,
            });
            return;
        }
        res.json({
            success: true,
            message: "Getting users data",
            data: rows,
        });
    });
});




// b. Mendapatkan detail seorang mahasiswa berdasarkan ID (GET /mahasiswa/:id)
app.get("/mahasiswa/:id", (req, res) => {
    const { id } = req.params;
    database.query("SELECT * FROM mahasiswa WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).json({
                success: false,
                message: "Error getting user data",
                error: err.message,
            });
            return;
        }
        if (row.length === 0) {
            res.status(404).json({
                success: false,
                message: "Mahasiswa not found",
            });
            return;
        }
        res.json({
            success: true,
            message: "Getting user data",
            data: row[0],
        });
    });
});



// c. Menambahkan data mahasiswa baru (POST /mahasiswa)
app.post("/mahasiswa", (req, res) => {
    const { id, nama, nim, jurusan, email } = req.body; // Mengambil id juga dari body permintaan
    const newMahasiswa = { id, nama, nim, jurusan, email }; // Menambahkan id ke dalam data mahasiswa baru

    database.query("INSERT INTO mahasiswa SET ?", newMahasiswa, (err, result) => {
        if (err) {
            console.error("Error inserting data into database:", err);
            res.status(500).json({
                success: false,
                message: "Error adding user",
                error: err.message,
            });
            return;
        }
        
        // Mengambil id dari hasil penambahan data
        const newId = result.insertId;

        // Menambahkan id ke data yang akan dikembalikan
        const responseData = { id: newId, ...newMahasiswa };

        res.status(201).json({
            success: true,
            message: "User added successfully",
            data: responseData,
        });
    });
});




// d. Mengubah data mahasiswa (PUT /mahasiswa/:id)
app.put("/mahasiswa/:id", (req, res) => {
    const { id } = req.params;
    const { nama, nim, jurusan, email } = req.body;
    const updatedMahasiswa = { id, nama, nim, jurusan, email }; // Menambahkan id ke dalam data yang akan diubah

    database.query("UPDATE mahasiswa SET ? WHERE id = ?", [updatedMahasiswa, id], (err, result) => {
        if (err) {
            console.error("Error updating data in database:", err);
            res.status(500).json({
                success: false,
                message: "Error updating user",
                error: err.message,
            });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: "Mahasiswa not found",
            });
            return;
        }
        res.json({
            success: true,
            message: "User updated successfully",
            data: updatedMahasiswa, // Menggunakan updatedMahasiswa yang sudah termasuk ID
        });
    });
});






// e. Menghapus data mahasiswa (DELETE /mahasiswa/:id)
app.delete("/mahasiswa/:id", (req, res) => {
    const { id } = req.params;
    database.query("DELETE FROM mahasiswa WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Error deleting data from database:", err);
            res.status(500).json({
                success: false,
                message: "Error deleting user",
                error: err.message,
            });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: "Mahasiswa not found",
            });
            return;
        }
        res.json({
            success: true,
            message: "User deleted successfully",
        });
    });
});




// koneksi port
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



