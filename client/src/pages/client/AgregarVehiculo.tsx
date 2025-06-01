import {  XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from '../../components/common/ThemeContext'; // ajuste según tu estructura


const AgregarVehiculo = () => {
  
    const API_URL = import.meta.env.VITE_API_URL;

  const [vehiculo, setVehiculo] = useState({
    marca: "",
    modelo: "",
    anio: "",
    placa: "",
    color: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  ///marcar aceptadas
  const marcas = ["Toyota", "Honda", "Ford", "Nissan", "BMW", "Volkswagen"];

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;
  const url = `${API_URL}/client/${userId}/vehicle`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVehiculo({
      ...vehiculo,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (
      !vehiculo.marca ||
      !vehiculo.modelo ||
      !vehiculo.anio ||
      !vehiculo.placa ||
      !vehiculo.color
    ) {
      toast.error("Por favor, completa todos los campos.");
      return false;
    }

    if (vehiculo.anio.length !== 4 || isNaN(Number(vehiculo.anio))) {
      /// como estamos en el 2025  no debe ser menor a 4 y no creo que el sistema funcionne en el 10000 para ponerlo mayor que 4
      toast.error("Ingrese un año verdadero.");
      return false;
    }

    return true;
  };

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowModal(true);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehiculo),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del servidor:", response.status, errorText);
        toast.error("No se pudo registrar el vehículo. Intenta más tarde.");
        setShowModal(false);
        return;
      }

      const data = await response.json();
      toast.success("Vehículo registrado correctamente");
      setVehiculo({
        marca: "",
        modelo: "",
        anio: "",
        placa: "",
        color: "",
      });
      console.log("Vehículo agregado:", data.vehicle);
      setShowModal(false);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Hubo un error al registrar el vehículo.");
    } finally {
      setIsSubmitting(false);
    }
  };
        const { darkMode } = useTheme();


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 ">
<ToastContainer
  position="top-right"
  autoClose={1500}
  theme={darkMode ? 'dark' : 'light'}
  toastClassName="rounded-md shadow-lg"
/>
  <div className="max-w-2xl mx-auto ">
    {/* Encabezado */}
    <div className="text-center mb-8">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200">Registrar Nuevo Vehículo</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Complete todos los campos requeridos</p>
    </div>

    {/* Tarjeta del formulario */}
    <div className="bg-white shadow-xl rounded-xl overflow-hidden dark:bg-gray-800">
      <div className="p-6 sm:p-8">
        <form onSubmit={handleOpenModal} className="space-y-6">
          {/* Campo Marca */}
          <div className="space-y-2">
            <label htmlFor="marca" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Marca del vehículo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="marca"
                name="marca"
                value={vehiculo.marca}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2
                 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition dark:bg-gray-700 dark:border-gray-700"
                required
              >
                <option value="">Seleccione una marca</option>
                {marcas.map((marca) => (
                  <option key={marca} value={marca.toLowerCase()}>
                    {marca}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              </div>
            </div>
          </div>

          {/* Campo Modelo */}
          <div className="space-y-2">
            <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Modelo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={vehiculo.modelo}
              onChange={handleChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition
              dark:bg-gray-700 dark:border-gray-700"
              placeholder="Ej. Corolla, Civic, etc."
              required
            />
          </div>

          {/* Grupo Año y Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo Año */}
            <div className="space-y-2">
              <label htmlFor="anio" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Año <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="anio"
                name="anio"
                value={vehiculo.anio}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition
                dark:bg-gray-700 dark:border-gray-700"
                required
                              placeholder="2025"

              />
            </div>

            {/* Campo Color */}
            <div className="space-y-2">
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Color <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={vehiculo.color}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition
                dark:bg-gray-700 dark:border-gray-700"
                placeholder="Ej. Rojo, Azul, etc."
                required
              />
            </div>
          </div>

          {/* Campo Placa */}
          <div className="space-y-2">
            <label htmlFor="placa" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Placa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="placa"
              name="placa"
              value={vehiculo.placa}
              onChange={handleChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition uppercase
              dark:bg-gray-700 dark:border-gray-700"
              placeholder="Ej. ABC-123"
              required
            />
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row-reverse justify-between gap-4 pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              Registrar Vehículo
            </button>
            <Link
              to="/client/perfil"
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm text-center 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition dark:bg-gray-500 dark:border-gray-700 dark:hover:bg-gray-600
              dark:text-gray-200 "
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  </div>

  {/* Modal de Confirmación */}
  {showModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 " >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-al dark:bg-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Confirmar Registro</h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Por favor verifique que los datos del vehículo sean correctos:
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-800">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Marca</p>
                  <p className="font-medium">{vehiculo.marca}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Modelo</p>
                  <p className="font-medium">{vehiculo.modelo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Año</p>
                  <p className="font-medium">{vehiculo.anio}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="font-medium">{vehiculo.color}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Placa</p>
                  <p className="font-medium uppercase">{vehiculo.placa}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              Corregir
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition flex items-center"
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting ? "Registrando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
  );
};

export default AgregarVehiculo;
