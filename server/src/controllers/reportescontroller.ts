import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Resumen total: órdenes, ingresos, clientes nuevos, servicio popular
// Resumen total: órdenes, ingresos, clientes nuevos, servicio popular
export const resumen = async (req: Request, res: Response) => {
  try {
    const range = (req.query.range as string) || "week";

    const fechaInicio = (() => {
      const now = new Date();
      if (range === "month") return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      if (range === "year") return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // default week
    })();

    // Total órdenes en rango (solo las que no están canceladas)
    const totalOrdenes = await prisma.ordenes.count({
      where: {
        fecha_inicio: { gte: fechaInicio },
        estado: { not: "cancelado" },
      },
    });

    // Total ingresos en rango (solo de pagos que pertenecen a órdenes no canceladas)
    const ingresosAgg = await prisma.pagos.aggregate({
      _sum: { monto: true },
      where: {
        fecha_pago: { gte: fechaInicio },
        ordenes: {
          estado: { not: "cancelado" },
        },
      },
    });

    const totalIngresos = ingresosAgg._sum?.monto || 0;

    // Clientes nuevos en rango (vehículos con órdenes válidas en rango)
    const clientesNuevos = await prisma.vehiculos.count({
      where: {
        ordenes: {
          some: {
            fecha_inicio: { gte: fechaInicio },
            estado: { not: "cancelado" },
          },
        },
      },
    });

    // Servicio más popular (considerando solo órdenes no canceladas)
    const popular = await prisma.ordenes_servicios.groupBy({
      by: ["id_servicio"],
      where: {
        ordenes: {
          fecha_inicio: { gte: fechaInicio },
          estado: { not: "cancelado" },
        },
      },
      _count: {
        id_servicio: true,
      },
      orderBy: {
        _count: {
          id_servicio: "desc",
        },
      },
      take: 1,
    });

    let servicioPopular = { nombre: "Ninguno", porcentaje: 0 };
    if (popular.length > 0) {
      const servicio = await prisma.servicios.findUnique({
        where: { id_servicio: popular[0].id_servicio },
      });

      servicioPopular = {
        nombre: servicio?.nombre?.trim() || "Desconocido",
        porcentaje: (popular[0]._count.id_servicio / (totalOrdenes || 1)) * 100,
      };
    }

    res.json({
      totalOrdenes,
      totalIngresos,
      clientesNuevos,
      servicioPopular,
    });
  } catch (error: any) {
    console.error("[ERROR] resumen:", error);
    res.status(500).json({ message: "Error al obtener resumen", error: String(error) });
  }
};



// Ingresos agrupados por día, semana o mes según parámetro
export const ingresos = async (req: Request, res: Response) => {
  try {
    const { range = "week" } = req.query;
    const now = new Date();
    let from: Date;

    switch (range) {
      case "month":
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        from = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        from = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    }

    const pagos = await prisma.pagos.findMany({
      where: { fecha_pago: { gte: from } },
      select: { fecha_pago: true, monto: true },
    });

    const agrupado = pagos.reduce((acc:any, pago:any) => {
      const fecha = new Date(pago.fecha_pago!).toLocaleDateString("es-MX", {
        weekday: range === "week" ? "short" : undefined,
        month: range === "month" || range === "year" ? "short" : undefined,
        day: range === "month" ? "numeric" : undefined,
        year: range === "year" ? "numeric" : undefined,
      });
      acc[fecha] = (acc[fecha] || 0) + Number(pago.monto);
      return acc;
    }, {} as Record<string, number>);

    const resultado = Object.entries(agrupado).map(([name, ingresos]) => ({ name, ingresos }));

    res.json(resultado);
  } catch (error:any) {
    console.error("[ERROR] ingresos:", error.code);
    res.status(500).json({ message: "Error al obtener ingresos" });
  }
};


// Distribución de uso por servicio
export const serviciosDistribucion = async (req: Request, res: Response) => {
  try {
    // Agrupamos en ordenes_servicios por id_servicio y contamos
    const servicios = await prisma.ordenes_servicios.groupBy({
      by: ["id_servicio"],
      _count: {
        id_servicio: true,
      },
    });

    // Traemos los nombres para esos id_servicio
    const nombres = await prisma.servicios.findMany({
      where: {
        id_servicio: { in: servicios.map((s: any) => s.id_servicio) },
      },
    });

    // Formateamos resultado para gráfica u otro uso
    const data = servicios.map((s: any) => {
      const nombre = nombres.find((n: any) => n.id_servicio === s.id_servicio)?.nombre || "Desconocido";
      return { name: nombre, value: s._count.id_servicio };
    });

    res.json(data);
  } catch (error: any) {
    console.error("[ERROR] serviciosDistribucion:", error);
    res.status(500).json({ message: "Error al obtener distribución de servicios" });
  }
};

// Tipo de clientes registrados vs ocasionales
export const clientesTipo = async (req: Request, res: Response) => {
  try {
    const vehiculos = await prisma.ordenes.groupBy({
      by: ["id_vehiculo"],
      _count: true,
    });

    let registrados = 0;
    let ocasionales = 0;

    vehiculos.forEach((v: any) => {
      if (v._count > 1) registrados++;
      else ocasionales++;
    });

    res.json([
      { name: "Registrados", value: registrados },
      { name: "Ocasionales", value: ocasionales },
    ]);
  } catch (error:any) {
    console.error("[ERROR] clientesTipo:", error.code);
    res.status(500).json({ message: "Error al obtener tipos de clientes" });
  }
};
///Últimas órdenes 
export const getUltimasOrdenes = async (req: Request, res: Response) => {
  try {
    const ordenes = await prisma.ordenes.findMany({
      orderBy: { fecha_inicio: "desc" },
      take: 5,
      include: {
        vehiculos: {
          include: {
            usuarios: true,
          },
        },
        pagos: {
          where: { estado: "completado" },
          orderBy: { fecha_pago: "desc" },
          take: 1,
        },
        // Aquí NO incluimos servicios porque no existe relación directa
      },
    });

    // Para cada orden, buscamos los servicios relacionados
    const ordenesConServicios = await Promise.all(
      ordenes.map(async (orden) => {
        const serviciosRelacionados = await prisma.ordenes_servicios.findMany({
          where: { id_orden: orden.id_orden },
          include: { servicios: true },
        });

        return {
          ...orden,
          servicios: serviciosRelacionados.map((os) => os.servicios),
        };
      })
    );

    // Mapear para frontend
    const data = ordenesConServicios.map((orden) => {
      const pago = orden.pagos[0];
      const serviciosNombres = orden.servicios
        .map(
          (s: any) =>
            `${s.nombre} - ${s.duracion_estimada ?? "?"}min`
        )
        .join(", ");

      const clienteNombre = `${orden.vehiculos.usuarios.nombre ?? ""} ${
        orden.vehiculos.usuarios.apellido_paterno ?? ""
      } ${orden.vehiculos.usuarios.apellido_materno ?? ""}`.trim();

      return {
        id: orden.id_orden,
        cliente: clienteNombre || "Cliente sin nombre",
        servicio: serviciosNombres || "Servicio desconocido",
        fecha: orden.fecha_inicio.toISOString(),
        monto: pago ? Number(pago.monto) : 0,
        estado: orden.estado,
      };
    });

    res.json({ data });
  } catch (error: any) {
    console.error("[ERROR] getUltimasOrdenes:", error);
    res.status(500).json({ message: "Error al obtener las últimas órdenes" });
  }
};


