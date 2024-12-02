require("dotenv").config(); // Cargar variables desde .env
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000; // Usa el puerto definido en .env

// Middleware
app.use(cors({
  origin: 'https://Senaprendiz.free.nf', // Reemplaza con tu dominio real
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// Configuración de la conexión a la base de datos usando variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conexión a la base de datos exitosa.");
});

// Rutas CRUD

// Leer todos los elementos
app.get("/api/items", (req, res) => {
  const sql = "SELECT * FROM items";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener los elementos" });
    } else {
      res.json(results);
    }
  });
});

// Crear un elemento
app.post("/api/items", (req, res) => {
  const { name } = req.body;
  const sql = "INSERT INTO items (name) VALUES (?)";
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear el elemento" });
    } else {
      res.json({ id: result.insertId, name });
    }
  });
});

// Actualizar un elemento
app.put("/api/items/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const sql = "UPDATE items SET name = ? WHERE id = ?";
  db.query(sql, [name, id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al actualizar el elemento" });
    } else {
      res.json({ id, name });
    }
  });
});

// Eliminar un elemento
app.delete("/api/items/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM items WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al eliminar el elemento" });
    } else {
      res.json({ id });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
