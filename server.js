const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678", // Reemplaza con tu contraseña
  database: "crud_db",
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
