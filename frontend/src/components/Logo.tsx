/**
 * COMPONENTE: Logo
 * 
 * Logo do MyLocalPlace com design moderno.
 * Combina icone Docker (Box) com texto estilizado.
 */

import { Box } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      {/* Icone Docker em circulo azul */}
      <div className="bg-blue-500 rounded-lg p-2.5 shadow-lg">
        <Box className="w-7 h-7 text-white" strokeWidth={2.5} />
      </div>
      
      {/* Texto do logo */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          My<span className="text-blue-400">Local</span>Place
        </h1>
        <p className="text-xs text-blue-200 font-medium tracking-wide">
          DEVTOOLS DASHBOARD
        </p>
      </div>
    </div>
  );
};

