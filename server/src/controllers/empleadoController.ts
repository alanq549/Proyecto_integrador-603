

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getEmpleadoDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await prisma.ordenes.count({
      where: {
        fecha_inicio: { gte: today },
      },
    });

    const pendingTasks = await prisma.tareas.count({
      where: {
        estado: "pendiente",
      },
    });

    return res.json({
      todayOrders,
      pendingTasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};
