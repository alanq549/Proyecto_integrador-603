import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useTheme } from '../../components/common/ThemeContext'; // ajuste según tu estructura

export default function HistorialOrdenes() {
  const API_URL = import.meta.env.VITE_API_URL;
  console.log("Componente HistorialOrdenes renderizado"); // Log 1 - Renderizado inicial

  interface Orden {
    id: number;
    cliente: string;
    vehiculo: string;
    servicio: string;
    hora_inicio: string | Date;
    estado: string;
    alertaProximaFinalizacion?: boolean;
  }

  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState<string>("");

  useEffect(() => {
    console.log("useEffect ejecutado, estadoFiltro:", estadoFiltro); // Log 2 - Efecto disparado

    const url = new URL(`${API_URL}/ordenes/historial`);
    console.log("URL construida:", url.toString()); // Log 3 - URL de la API


    if (estadoFiltro) {
      url.searchParams.append("estado", estadoFiltro);
    }


    setLoading(true);
    console.log("Iniciando carga de datos..."); // Log 4 - Inicio de carga

    fetch(url.toString())
      .then((res) => {
        console.log("Respuesta recibida, status:", res.status); // Log 5 - Respuesta HTTP
        return res.json();
      })
      .then((data) => {
        console.log("Datos recibidos:", data); // Log 6 - Datos crudos de la API
        toast.success("Historial cargado correctamente");

        if (!data || !data.data) {
          console.error("Estructura de datos inesperada:", data);
          throw new Error("Estructura de datos inesperada");
        }

        console.log("Datos formateados:", data.data); // Log 7 - Datos formateados
        setOrdenes(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error en la carga:", err); // Log 8 - Error
        toast.error("Error al cargar las órdenes");
        setLoading(false);
      });
  }, [estadoFiltro]);

  const formatHora = (hora: string | Date) => {
    console.log("Formateando hora:", hora); // Log 9 - Formateo de hora

    if (!hora) return "--:--";

    try {
      if (typeof hora === "string") {
        return hora;
      }
      return hora.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formateando hora:", error, "Hora original:", hora); // Log 10 - Error de formato
      return "--:--";
    }
  };

        const { darkMode } = useTheme();

  console.log("Estado actual - ordenes:", ordenes, "loading:", loading); // Log 11 - Estado antes de render

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6 dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4">Historial de Órdenes</h2>
<ToastContainer
  position="top-right"
  autoClose={1500}
  theme={darkMode ? 'dark' : 'light'}
  toastClassName="rounded-md shadow-lg"
/>
      {/* Filtro por estado con botones */}
      <div>
        <label className="block text-sm font-medium mb-1">Estado</label>
        <div className="flex gap-2 flex-wrap">
          {["", "pendiente", "completado", "cancelado"].map((estado) => {
            const labelMap: Record<string, string> = {
              "": "Todos",
              pendiente: "En Proceso",
              completado: "Completadas",
              cancelado: "Canceladas",
            };
            const isActive = estadoFiltro === estado;
            return (
              <button
                key={estado}
                onClick={() => {
                  console.log("Botón clickeado, estado:", estado); // Log 12 - Click en botón
                  setEstadoFiltro(estado);
                }}
                className={`px-3 py-1 rounded-md text-sm ${
                  isActive
                    ? "bg-blue-600 text-white dark:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-500 dark:text-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {labelMap[estado]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto mt-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {[...Array(6)].map((_, i) => (
                    <th
                      key={`th-${i}`}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                    >
                      <div className="h-4 bg-gray-200 rounded dark:bg-gray-600 w-3/4"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={`row-${rowIndex}`} className="animate-pulse">
                    {[...Array(6)].map((_, cellIndex) => (
                      <td
                        key={`cell-${rowIndex}-${cellIndex}`}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        <div
                          className={`h-5 bg-gray-200 rounded dark:bg-gray-700 ${
                            cellIndex === 5
                              ? "w-20"
                              : cellIndex === 0
                              ? "w-16"
                              : cellIndex === 3
                              ? "w-40"
                              : "w-32"
                          }`}
                        ></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Hora Inicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {ordenes.length > 0 ? (
                  ordenes.map((orden) => (
                    <tr
                      key={orden.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        ORD{orden.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {orden.cliente || "Cliente no disponible"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {orden.vehiculo || "Vehículo no disponible"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex flex-col space-y-1">
                          {orden.servicio
                            ? orden.servicio
                                .split(", ")
                                .map((servicio, index) => (
                                  <div key={index}>{servicio.trim()}</div>
                                ))
                            : "Servicio no disponible"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {formatHora(orden.hora_inicio)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            orden.estado === "completado"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              : orden.estado === "cancelado"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                        >
                          {orden.estado || "desconocido"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No se encontraron órdenes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
