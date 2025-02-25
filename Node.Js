// Algoritmo para el sistema de gestión de inventario
// 1. Inicializar servidor con Express.js
// 2. Definir una lista para almacenar productos
// 3. Implementar rutas para agregar, obtener, actualizar y eliminar productos
// 4. Permitir filtrado por categoría y generación de reportes
// 5. Ejecutar servidor en un puerto específico

// Código en Node.js con Express.js
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

let inventory = [];

// Agregar producto
app.post('/api/productos', (req, res) => {
    const producto = req.body;
    inventory.push(producto);
    res.status(201).json({ mensaje: 'Producto agregado', producto });
});

// Obtener productos
app.get('/api/productos', (req, res) => {
    res.json(inventory);
});

// Filtrar productos por categoría
app.get('/api/productos/categoria/:categoria', (req, res) => {
    const { categoria } = req.params;
    const filtrados = inventory.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
    res.json(filtrados);
});

// Generar reporte de inventario
app.get('/api/productos/reporte', (req, res) => {
    const reporte = inventory.map(p => ({ nombre: p.nombre, cantidad: p.cantidad }));
    res.json(reporte);
});

// Actualizar producto
app.put('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const index = inventory.findIndex(p => p.id == id);
    if (index !== -1) {
        inventory[index] = req.body;
        res.json({ mensaje: 'Producto actualizado', producto: req.body });
    } else {
        res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
});

// Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    inventory = inventory.filter(p => p.id != id);
    res.json({ mensaje: 'Producto eliminado' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Código en HTML5 con formularios para agregar y filtrar productos
const frontend = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventario</title>
</head>
<body>
    <h1>Gestión de Inventario</h1>
    <form id="productForm">
        <input type="text" id="id" placeholder="ID" required>
        <input type="text" id="nombre" placeholder="Nombre" required>
        <input type="number" id="cantidad" placeholder="Cantidad" required>
        <input type="text" id="categoria" placeholder="Categoría" required>
        <button type="submit">Agregar Producto</button>
    </form>
    
    <h2>Filtrar por categoría</h2>
    <input type="text" id="filtroCategoria" placeholder="Categoría">
    <button onclick="filtrarCategoria()">Filtrar</button>
    
    <h2>Reporte de Inventario</h2>
    <button onclick="generarReporte()">Generar Reporte</button>
    
    <ul id="productos"></ul>
    <script>
        document.getElementById('productForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const producto = {
                id: document.getElementById('id').value,
                nombre: document.getElementById('nombre').value,
                cantidad: document.getElementById('cantidad').value,
                categoria: document.getElementById('categoria').value
            };
            await fetch('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto)
            });
            location.reload();
        });

        async function filtrarCategoria() {
            const categoria = document.getElementById('filtroCategoria').value;
            const response = await fetch(`/api/productos/categoria/${categoria}`);
            const productos = await response.json();
            document.getElementById('productos').innerHTML = productos.map(p => `<li>${p.nombre} - ${p.cantidad}</li>`).join('');
        }

        async function generarReporte() {
            const response = await fetch('/api/productos/reporte');
            const reporte = await response.json();
            alert(JSON.stringify(reporte, null, 2));
        }
    </script>
</body>
</html>
`;

console.log(frontend);
