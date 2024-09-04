const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const leerDatos = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return (JSON.parse(data));
    } catch (error) {
        console.log(error)
    }
}
const escribirDatos = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error)
    }
}

// endpoints 

app.get("/libros", (req, res) => {
    const data = leerDatos();
    if (data.libros) {
        res.json(data.libros);
    } else {
        res.status(404).json({ message: "No se encontraron libros" });
    }
});

app.get("/libros/:id", (req, res) => {
    const data = leerDatos();
    const id = parseInt(req.params.id);
    const libro = data.libros.find((libro) => libro.id === id);
    res.json(libro);
});

app.post("/libros", (req, res) => {
    const data = leerDatos();
    const body = req.body;
    const nuevoLibro = {
        id: data.libros.length + 1,
        ...body
    }

    data.libros.push(nuevoLibro);
    escribirDatos(data);
    res.json(nuevoLibro);
});

app.put("/libros/:id", (req, res) => {
    const data = leerDatos();
    const body = req.body;
    const id = parseInt(req.params.id);
    const libroIndex = data.libros.findIndex((libro) => libro.id === id);
    data.libros[libroIndex] = {
        ...data.libros[libroIndex],
        ...body,
    };
    escribirDatos(data);
    res.json({ message: "Libro actualizado correctamente!" })
});

app.delete("/libros/:id", (req, res) => {
    const data = leerDatos();
    const id = parseInt(req.params.id);
    const libroIndex = data.libros.findIndex((libro) => libro.id === id);

    if (libroIndex !== -1) {
        data.libros.splice(libroIndex, 1);
        escribirDatos(data);
        res.json({ message: "Libro eliminado correctamente!" });
    } else {
        res.status(404).json({ message: "Libro no encontrado" });
    }
    data.libros.splice(libroIndex, 1);
});

app.listen(3300, () => {
    console.log('Iniciado en el puerto: 3300')
});
