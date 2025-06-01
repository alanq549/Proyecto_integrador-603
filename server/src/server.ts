// src/server.ts
import app from './app';
// 👇 Importa el job para que se inicie al levantar el server
import './jobs/ordenesJob';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
