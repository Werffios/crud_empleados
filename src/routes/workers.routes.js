import { Router } from 'express';
import { pool } from '../database/connection.js'

const router = Router();

// Example of a worker object
/*
{
    "id": 1,
    "fecha_ingreso": "2025-04-12T05:00:00.000Z",
    "nombre": "Nicolas Suarez",
    "salario": "1000.00"
}
*/

router.get('/workers', async (req, res) => {
    pool.query('SELECT * FROM empleado').then((result) => {
        res.send(result.rows);
    })
})

router.get('/workers/:id', async (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM empleado WHERE id = $1', [id]).then((result) => {
        if (result.rows.length === 0) {
            return res.status(404).send('Worker not found');
        }
        res.json(result.rows);
    })
})

router.post('/workers', async (req, res) => {
    const { fecha_ingreso, nombre, salario } = req.body;
    pool.query('INSERT INTO empleado (fecha_ingreso, nombre, salario) VALUES ($1, $2, $3)', [fecha_ingreso, nombre, salario]).then((result) => {
        // send the created worker
        res.status(201).send({
            id: result.insertId,
            fecha_ingreso,
            nombre,
            salario
        })
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Error creating worker');
    })
})

router.put('/workers/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha_ingreso, nombre, salario } = req.body;

    pool.query('UPDATE empleado SET fecha_ingreso = $1, nombre = $2, salario = $3 WHERE id = $4', [fecha_ingreso, nombre, salario, id]).then((result) => {
        if (result.rowCount === 0) {
            return res.status(404).send('Worker not found');
        }
        res.status(200).send({
            id,
            fecha_ingreso,
            nombre,
            salario
        })
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Error updating worker');
    })
})

router.delete('/workers/:id', async (req, res) => {
    const { id } = req.params;

    pool.query('DELETE FROM empleado WHERE id = $1', [id]).then((result) => {
        if (result.rowCount === 0) {
            return res.status(404).send('Worker not found');
        }
        res.status(204).send();
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Error deleting worker');
    })
})

export default router;