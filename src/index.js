import express from 'express';
import workersRoutes from "./routes/workers.routes.js";
import requestRoutes from "./routes/requests.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Rutas
app.use(authRoutes);
app.use(workersRoutes);
app.use(requestRoutes);

app.listen(3000);
console.log('Server started on port', 3000);