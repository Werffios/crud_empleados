CREATE TABLE empleado (
                          id SERIAL PRIMARY KEY,
                          fecha_ingreso DATE,
                          nombre VARCHAR(50),
                          salario NUMERIC(10,2)
);

CREATE TABLE solicitud (
                           id SERIAL PRIMARY KEY,
                           codigo VARCHAR(50),
                           descripcion VARCHAR(50),
                           resumen VARCHAR(50),
                           id_empleado INT,
                           FOREIGN KEY (id_empleado) REFERENCES empleado(id)
);
CREATE TABLE usuarios (
                          id SERIAL PRIMARY KEY,
                          username VARCHAR(50) UNIQUE NOT NULL,
                          password VARCHAR(100) NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);