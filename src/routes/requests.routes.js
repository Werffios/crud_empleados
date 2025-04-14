import { Router } from "express";
import { pool } from "../database/connection.js";

const router = Router();

// Example of a worker object
/*
{
    "id": 1,
    "codigo": "123456",
    "descripcion": "Solicitud de prueba",
    "resumen": "Esta es una solicitud de prueba",
    "id_empleado": 1,
}
*/

router.get("/requests", async (req, res) => {
    pool.query("SELECT * FROM solicitud").then((result) => {
        res.send(result.rows);
    })
})

router.get("/requests/:id", async (req, res) => {
    const { id } = req.params;
    pool.query("SELECT * FROM solicitud WHERE id = $1", [id]).then((result) => {
        if (result.rows.length === 0) {
            return res.status(404).send("Request not found");
        }
        res.json(result.rows);
    })
})

router.post("/requests", async (req, res) => {
    const { codigo, descripcion, resumen, id_empleado } = req.body;
    pool.query("INSERT INTO solicitud (codigo, descripcion, resumen, id_empleado) VALUES ($1, $2, $3, $4)", [codigo, descripcion, resumen, id_empleado]).then((result) => {
        // send the created request
        res.status(201).send({
            id: result.insertId,
            codigo,
            descripcion,
            resumen,
            id_empleado
        })
    }).catch((error) => {
        console.error(error);
        res.status(500).send("Error creating request");
    })
})

router.put("/requests/:id", async (req, res) => {
    const { id } = req.params;
    const { codigo, descripcion, resumen, id_empleado } = req.body;

    pool.query("UPDATE solicitud SET codigo = $1, descripcion = $2, resumen = $3, id_empleado = $4 WHERE id = $5", [codigo, descripcion, resumen, id_empleado, id]).then((result) => {
        if (result.rowCount === 0) {
            return res.status(404).send("Request not found");
        }
        res.status(200).send({
            id,
            codigo,
            descripcion,
            resumen,
            id_empleado
        })
    }).catch((error) => {
        console.error(error);
        res.status(500).send("Error updating request");
    })
})

router.delete("/requests/:id", async (req, res) => {
    const { id } = req.params;

    pool.query("DELETE FROM solicitud WHERE id = $1", [id]).then((result) => {
        if (result.rowCount === 0) {
            return res.status(404).send("Request not found");
        }
        res.status(200).send("Request deleted");
    }).catch((error) => {
        console.error(error);
        res.status(500).send("Error deleting request");
    })
})

export default router;