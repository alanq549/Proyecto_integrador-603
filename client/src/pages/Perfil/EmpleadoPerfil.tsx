import { useEffect, useState } from "react";
import PerfilBase from "./PerfilBase";
import { toast } from "react-toastify";

interface UsuarioAPI {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  imagenPerfil?: string;
  acercaDe?: string;
  isAdmin?: boolean;
}

const EmpleadoPerfil = () => {
  const [usuario, setUsuario] = useState<UsuarioAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
const fetchUsuario = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData?.id;

    if (!userId) {
      setError("No se encontró el ID del usuario.");
      setLoading(false);
      return;
    }

    const response = await fetch(`${API_URL}/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos del empleado");
    }

    const data = await response.json();

    setUsuario({
      id: data.id_usuario,
      nombre: data.nombre,
      email: data.email,
      rol: data.rol,
      apellido_paterno: data.apellido_paterno,
      apellido_materno: data.apellido_materno,
      imagenPerfil: data.imagenPerfil,
      acercaDe: data.acercaDe,
      isAdmin: false,
    });
  } catch (err) {
    console.error("Error al cargar el perfil:", err);
    toast.error("No se pudo cargar el perfil del empleado");
    setError("Error al cargar el perfil");
  } finally {
    setLoading(false);
  }
};

    fetchUsuario();
  }, []);

  if (loading) return <div className="p-4">Cargando perfil...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!usuario) return <div className="p-4">No se encontró el usuario</div>;

  return (
    <PerfilBase
      id={usuario.id}
      nombre={usuario.nombre}
      correo={usuario.email}
      rol={usuario.rol}
      apellido_paterno={usuario.apellido_paterno}
      apellido_materno={usuario.apellido_materno}
      imagenPerfil={usuario.imagenPerfil}
      acercaDe={usuario.acercaDe}
      isAdmin={false}
    />
  );
};

export default EmpleadoPerfil;
