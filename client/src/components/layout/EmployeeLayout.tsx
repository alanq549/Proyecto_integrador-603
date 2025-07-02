import { BaseLayout } from "./BaseLayout";
import {
  FaTachometerAlt,
  FaListAlt,
  FaTasks,
} from "react-icons/fa";

const EmployeeLayout = () => {
  const sidebarItems = [
    { path: "/empleado/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/empleado/ordenes", label: "Órdenes", icon: <FaListAlt /> },
    { path: "/empleado/tareas", label: "Tareas", icon: <FaTasks /> },
  ];

  return (
    <BaseLayout rol="empleado" sidebarItems={sidebarItems} />
  );
};

export default EmployeeLayout;
