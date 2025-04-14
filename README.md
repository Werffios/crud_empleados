# CRUD API para Empleados

Una API RESTful para gestionar registros de empleados con autenticación, construida con Node.js, Express y PostgreSQL.

---

## **Características**
- Operaciones CRUD completas para registros de empleados.
- Autenticación con JWT para proteger los endpoints de la API.
- Integración con base de datos PostgreSQL.
- Arquitectura organizada basada en rutas.
- Suite de pruebas completa con Jest

---

## **Tecnologías**
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **JWT** para autenticación.
- **bcrypt** para el hash de contraseñas.
- **Jest** para pruebas.

---

## **Estructura de la Base de Datos**
La aplicación utiliza tres tablas principales:

### **empleado (empleados):**
- `id`: SERIAL PRIMARY KEY
- `fecha_ingreso`: DATE
- `nombre`: VARCHAR(50)
- `salario`: NUMERIC(10,2)

### **solicitud (solicitudes):**
- `id`: SERIAL PRIMARY KEY
- `codigo`: VARCHAR(50)
- `descripcion`: VARCHAR(50)
- `resumen`: VARCHAR(50)
- `id_empleado`: INT (Foreign key a empleado)

### **usuarios (usuarios):**
- `id`: SERIAL PRIMARY KEY
- `username`: VARCHAR(50) UNIQUE NOT NULL
- `password`: VARCHAR(100) NOT NULL
- `created_at`: TIMESTAMP (por defecto: CURRENT_TIMESTAMP)

---

## **Instalación**
1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configurar la base de datos PostgreSQL:
Configura la base de datos PostgreSQL usando el archivo SQL en `src/database/query.sql`.

---

### **Uso**

#### **Ejecutar la aplicación**
    
```bash
    npm run dev
```

#### **Ejecutar pruebas**

```bash
    npm test
```

<hr/>

### **Endpoints de la API**

#### **Autenticación**
Las rutas protegidas requieren un token JWT válido en el encabezado `Authorization`.
- **POST** `/login` - Autenticación de usuario. Devuelve un token JWT.
- **POST** `/register` - Registro de nuevo usuario.

#### **Empleados**
- **GET** `/workers` - Obtener todos los empleados.
- **GET** `/workers/:id` - Obtener un empleado por ID.
- **POST** `/workers` - Crear un nuevo empleado.
- **PUT** `/workers/:id` - Actualizar un empleado.
- **DELETE** `/workers/:id` - Eliminar un empleado.

#### **Solicitudes**
- **GET** `/requests` - Obtener todas las solicitudes.
- **GET** `/requests/:id` - Obtener una solicitud por ID.
- **POST** `/requests` - Crear una nueva solicitud.
- **PUT** `/requests/:id` - Actualizar una solicitud.
- **DELETE** `/requests/:id` - Eliminar una solicitud.

<hr/>

### **Formato de Solicitud**

#### **Objeto de empleado:**
```json
{
  "id": 1,
  "fecha_ingreso": "2025-04-12T05:00:00.000Z",
  "nombre": "Nicolas Suarez",
  "salario": "1000.00"
}
```
#### **Objeto de solicitud:**
```json
{
  "id": 1,
  "codigo": "123456",
  "descripcion": "Solicitud de vacaciones",
  "resumen": "Vacaciones del 1 al 15 de diciembre",
  "id_empleado": 1
}
```

## **Guía de Pruebas para la API CRUD de Empleados**

Esta sección explica cómo se implementan las pruebas en la aplicación.

### **Framework de Pruebas**
- **Jest**: Utilizado como el framework principal de pruebas.
- **Soporte para Módulos ES**: Configurado para importaciones/exportaciones de módulos ES.
- **Entorno Node**: Las pruebas se ejecutan en un entorno Node.js.

### **Estrategia de Mocking**
La aplicación utiliza las capacidades de mocking de Jest para aislar componentes durante las pruebas:

#### **Dependencias Externas**
- Mockea dependencias externas para garantizar que las pruebas estén aisladas de bibliotecas de terceros.

#### **Ejemplo de Mocking con jsonwebtoken**
```javascript
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: jest.fn(),
    sign: jest.fn()
  }
}));
```
### **Conexión a la Base de Datos**
Se utiliza una implementación mock para reemplazar la conexión real a la base de datos:
```javascript
// src/__mocks__/database.js
export const pool = {
  query: jest.fn()
};
```
### **Estructura de las Pruebas**

Las pruebas siguen el patrón **Arrange-Act-Assert**:

### **Estructura de las Pruebas**

Las pruebas siguen el patrón **Arrange-Act-Assert**:

- **Preparación**: Crear objetos mock para las funciones de solicitud, respuesta y middleware.
- **Ejecución**: Llamar a la función que se está probando.
- **Verificación**: Asegurar el comportamiento esperado utilizando los matchers de Jest.

### **Pruebas del Middleware de Autenticación**

Las pruebas verifican tres escenarios clave:


- **Token faltante**: Devuelve un código 401 cuando no se proporciona un token.
- **Token válido**: Llama a `next()` y adjunta los datos del usuario a la solicitud.
- **Token inválido**: Devuelve un código 401 con un mensaje de error apropiado.
- **Ejemplo**:

test('debería devolver 401 si no se proporciona un token', () => {
  req.header.mockReturnValue(undefined);
  verifyToken(req, res, next);
  expect(res.status).toHaveBeenCalledWith(401);
  expect(next).not.toHaveBeenCalled();
});