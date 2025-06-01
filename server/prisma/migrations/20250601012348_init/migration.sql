-- CreateEnum
CREATE TYPE "servicios_tipo" AS ENUM ('lavado', 'estacionamiento');

-- CreateEnum
CREATE TYPE "pagos_metodo" AS ENUM ('efectivo', 'tarjeta', 'transferencia');

-- CreateEnum
CREATE TYPE "pagos_estado" AS ENUM ('pendiente', 'completado', 'reembolsado', 'fallido');

-- CreateEnum
CREATE TYPE "tareas_estado" AS ENUM ('pendiente', 'en_progreso', 'completado');

-- CreateEnum
CREATE TYPE "ordenes_estado" AS ENUM ('pendiente', 'confirmado', 'en_progreso', 'completado', 'cancelado');

-- CreateEnum
CREATE TYPE "tareas_prioridad" AS ENUM ('baja', 'media', 'alta');

-- CreateEnum
CREATE TYPE "usuarios_rol" AS ENUM ('cliente', 'admin');

-- CreateTable
CREATE TABLE "cajones" (
    "id_cajon" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT,
    "capacidad" TEXT,

    CONSTRAINT "cajones_pkey" PRIMARY KEY ("id_cajon")
);

-- CreateTable
CREATE TABLE "ordenes_servicios" (
    "id_orden" INTEGER NOT NULL,
    "id_servicio" INTEGER NOT NULL,

    CONSTRAINT "ordenes_servicios_pkey" PRIMARY KEY ("id_orden","id_servicio")
);

-- CreateTable
CREATE TABLE "ordenes" (
    "id_orden" SERIAL NOT NULL,
    "id_vehiculo" INTEGER NOT NULL,
    "id_cajon" INTEGER,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "estado" "ordenes_estado" DEFAULT 'pendiente',
    "notas" TEXT,

    CONSTRAINT "ordenes_pkey" PRIMARY KEY ("id_orden")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id_pago" SERIAL NOT NULL,
    "id_orden" INTEGER NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "metodo" "pagos_metodo",
    "estado" "pagos_estado" DEFAULT 'pendiente',
    "fecha_pago" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id_servicio" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "servicios_tipo" NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(65,30) NOT NULL,
    "duracion_estimada" INTEGER,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id_servicio")
);

-- CreateTable
CREATE TABLE "tareas" (
    "id_tarea" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "id_asignado" INTEGER NOT NULL,
    "fecha_limite" TIMESTAMP(3),
    "estado" "tareas_estado" DEFAULT 'pendiente',
    "prioridad" "tareas_prioridad" DEFAULT 'media',

    CONSTRAINT "tareas_pkey" PRIMARY KEY ("id_tarea")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "nombre" TEXT,
    "apellido_paterno" TEXT,
    "apellido_materno" TEXT,
    "rol" "usuarios_rol" DEFAULT 'cliente',
    "fecha_creacion" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "vehiculos" (
    "id_vehiculo" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER,
    "placa" TEXT,
    "color" TEXT,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id_vehiculo")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "newEmail" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN DEFAULT false,

    CONSTRAINT "verificationtokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ordenes_id_cajon_idx" ON "ordenes"("id_cajon");

-- CreateIndex
CREATE INDEX "ordenes_id_vehiculo_idx" ON "ordenes"("id_vehiculo");

-- CreateIndex
CREATE INDEX "pagos_id_orden_idx" ON "pagos"("id_orden");

-- CreateIndex
CREATE INDEX "tareas_id_asignado_idx" ON "tareas"("id_asignado");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_placa_key" ON "vehiculos"("placa");

-- CreateIndex
CREATE INDEX "vehiculos_id_usuario_idx" ON "vehiculos"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "verificationtokens"("token");

-- CreateIndex
CREATE INDEX "verificationtokens_userId_idx" ON "verificationtokens"("userId");

-- AddForeignKey
ALTER TABLE "ordenes_servicios" ADD CONSTRAINT "ordenes_servicios_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "ordenes"("id_orden") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_servicios" ADD CONSTRAINT "ordenes_servicios_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicios"("id_servicio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes" ADD CONSTRAINT "ordenes_id_vehiculo_fkey" FOREIGN KEY ("id_vehiculo") REFERENCES "vehiculos"("id_vehiculo") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ordenes" ADD CONSTRAINT "ordenes_id_cajon_fkey" FOREIGN KEY ("id_cajon") REFERENCES "cajones"("id_cajon") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "ordenes"("id_orden") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "tareas" ADD CONSTRAINT "tareas_id_asignado_fkey" FOREIGN KEY ("id_asignado") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "verificationtokens" ADD CONSTRAINT "verificationtokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE RESTRICT;
