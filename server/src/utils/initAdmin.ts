import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient();

 export  async function crearAdminPorDefecto() {
  const email = 'estacionamientomartinez42@gmail.com';

  const adminExistente = await prisma.usuarios.findUnique({
    where: { email },
  });

  if (!adminExistente) {
    console.log('🛠️ Creando administrador por defecto...');

    await prisma.usuarios.create({
      data: {
        email,
        password: await bcrypt.hash('adminMartinez5490', 10), // ⚠️ Cambiá esto por algo más seguro en producción
        nombre: 'Admin',
        apellido_paterno: 'Martínez',
        apellido_materno: null,
        rol: 'admin',
        fecha_creacion: new Date(),
      },
    });

    console.log('✅ Administrador creado exitosamente!');
  } else {
    console.log('ℹ️ Admin ya existente, no se creó uno nuevo.');
  }
}