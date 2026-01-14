
import React from 'react';
import { COLORS } from '../constants';

interface ToolbarProps {
  currentColor: string;
  setCurrentColor: (color: string) => void;
  onClear: () => void;
  onPrint: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentColor,
  setCurrentColor,
  onClear,
  onPrint
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 flex flex-col gap-6 no-print">
      <div>
        <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
          <i className="fas fa-palette"></i> Escolha sua Cor
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                currentColor === color ? 'border-indigo-600 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-indigo-50 flex flex-col gap-2">
        <button
          onClick={onClear}
          className="w-full py-3 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <i className="fas fa-trash-alt"></i> Limpar Desenho
        </button>
        <button
          onClick={onPrint}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <i className="fas fa-print"></i> Imprimir Arte
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
