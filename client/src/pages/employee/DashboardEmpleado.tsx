import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/admin/Dashboard.css"; // Puedes reutilizar estilos

const DashboardEmpleado = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingTasks: 0,
  });

  type Tarea = {
    id_tarea: number;
    titulo: string;
    fecha_limite?: string;
  };

  const [pendingTasksList, setPendingTasksList] = useState<Tarea[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/empleado/dashboard`);
        if (!res.ok) throw new Error("Error al cargar estadísticas");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchPendingTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/tareas?estado=pendiente`);
        if (!res.ok) throw new Error("Error al cargar tareas");
        const tareas = await res.json();
        setPendingTasksList(tareas);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPendingTasks();
  }, []);

  return (
    <div className="admin-content">
      <div className="mb-8">
        <h1 className="content-title">Bienvenido, Empleado</h1>
        <p className="content-subtitle">
          Tu resumen operativo - {new Date().toLocaleDateString()}
        </p>
      </div>

      {loading ? (
        <div className="dashboard-widgets">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="widget animate-pulse h-32"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="dashboard-widgets">
            <div className="widget widget-primary">
              <div className="widget-icon">📋</div>
              <div>
                <h3>Órdenes hoy</h3>
                <p className="widget-value">{stats.todayOrders}</p>
                <Link to="/empleado/ordenes" className="widget-link">
                  Ver órdenes →
                </Link>
              </div>
            </div>

            <div className="widget widget-accent">
              <div className="widget-icon">⏳</div>
              <div>
                <h3>Tareas pendientes</h3>
                <p className="widget-value">{stats.pendingTasks}</p>
                <Link to="/empleado/tareas" className="widget-link">
                  Ver tareas →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="section-title">Recordatorios</h2>
            <div className="reminders-list">
              {pendingTasksList.length === 0 ? (
                <p>No tienes tareas pendientes 🎉</p>
              ) : (
                pendingTasksList.map((tarea) => (
                  <div key={tarea.id_tarea} className="reminder-item">
                    <div className="reminder-badge">!</div>
                    <div>
                      <p>{tarea.titulo}</p>
                      <small className="reminder-date">
                        {tarea.fecha_limite
                          ? `Vence el ${new Date(
                              tarea.fecha_limite
                            ).toLocaleDateString()}`
                          : "Sin fecha límite"}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardEmpleado;
