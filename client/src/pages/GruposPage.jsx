import { useState } from 'react';
import { Logo } from '../components/common/UIComponents';
import Navbar from '../components/common/Navbar';



//Datos de ejemplo (luego vendrán del servidor)
const gruposEjemplo = [
  { id: 1, nombre: 'Programación Web', carrera: 'Ingeniería de Sistemas', miembros: 24, unido: false, emoji: '💻' },
  { id: 2, nombre: 'Cálculo II', carrera: 'Ingeniería Industrial', miembros: 18, unido: true, emoji: '📐' },
  { id: 3, nombre: 'Storytelling', carrera: 'Comunicaciones', miembros: 12, unido: false, emoji: '🎨' },
 { id: 4, nombre: 'Base de Datos', carrera: 'Ingeniería de Sistemas', miembros: 30, unido: false, emoji: '🗄️' },
 { id: 5, nombre: 'Marketing', carrera: 'Administración', miembros: 20, unido: false, emoji: '📱' },
 { id: 6, nombre: 'Física III', carrera: 'Ingeniería Civil', miembros: 15, unido: false, emoji: '⚡' },
];

const GruposPage = () => {
    return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 pt-20 pb-8">
        {/* Aquí va el contenido de Grupos */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Grupos</h1>
      </main>
    </div>
  );














};
export default GruposPage;