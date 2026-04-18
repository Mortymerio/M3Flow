import { useStore } from '../store';

const HelpOverlay = () => {
  const showHelpOverlay = useStore(state => state.showHelpOverlay);
  if (!showHelpOverlay) return null;

  return (
    <div 
      onClick={() => useStore.getState().setShowHelpOverlay(false)} 
      className="absolute inset-0 z-[9999] bg-slate-900/40 overflow-hidden cursor-pointer no-drag flex"
      style={{ WebkitAppRegion: 'no-drag' } as any}
    >
      <div className="absolute top-[45px] right-[25px] text-white text-sm font-bold text-right drop-shadow-md">
        <div className="text-3xl mb-1 -mr-1 text-blue-400 rotate-[45deg] leading-none drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">↑</div>
        Cierra, minimiza o maximiza<br/><span className="text-blue-200">la aplicación desde aquí.</span>
      </div>

      {/* Setting wheel sidebar */}
      <div className="absolute top-[45px] left-[220px] text-white text-sm font-bold text-left drop-shadow-md">
        <div className="text-3xl mb-1 -ml-1 text-blue-400 rotate-[-45deg] leading-none drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">↑</div>
        Opciones Generales<br/><span className="text-blue-200">y Menú "About"</span>
      </div>

      {/* Editor Format Text */}
      <div className="absolute top-[100px] right-[40px] text-white text-sm font-bold text-right flex flex-col items-end drop-shadow-md">
        <div className="text-3xl mb-1 -mr-1 text-blue-400 rotate-[45deg] leading-none drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">↑</div>
        Ajustes visuales:<br/><span className="text-blue-200 font-medium text-xs">Cambia el tipo y tamaño<br/>de fuente a tu gusto.</span>
      </div>
      
      {/* Editor Tags/Status */}
      <div className="absolute top-[45px] right-[200px] text-white text-sm font-bold text-right flex flex-col items-end drop-shadow-md">
        <div className="text-3xl mb-1 -mr-1 text-blue-400 rotate-[45deg] leading-none drop-shadow-[0_0_8_px_rgba(96,165,250,0.8)]">↑</div>
        Clasifica tus notas:<br/><span className="text-blue-200 font-medium text-xs">Carpetas, estados y etiquetas.</span>
      </div>
      
      {/* Sidebar Help / Modes */}
      <div className="absolute bottom-[80px] left-[25px] text-white text-sm font-bold text-left drop-shadow-md">
        <span className="text-blue-200 font-medium text-xs">Cambia el modo de edición (Normal/VIM),</span><br/> 
        el Tema visual y este menú de Ayuda.
        <div className="text-3xl mt-1 -ml-1 text-blue-400 rotate-[-135deg] leading-none drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">↑</div>
      </div>
      
      {/* Export MD/PDF */}
      <div className="absolute bottom-[80px] right-[40px] text-white text-sm font-bold text-right flex flex-col items-end drop-shadow-md">
        <span className="text-blue-200 font-medium text-xs">Exporta rápidamente tu</span><br/>
        nota activa a MD o PDF.
        <div className="text-3xl mt-1 -mr-1 text-blue-400 rotate-[135deg] leading-none drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">↑</div>
      </div>

      <div className="m-auto text-center pointer-events-none bg-slate-900/60 p-10 rounded-3xl border border-white/10 backdrop-blur-md">
        <h1 className="text-white text-4xl font-black mb-4 tracking-tight drop-shadow-2xl">¡Bienvenido a M3Flow!</h1>
        <p className="text-blue-200 text-lg opacity-90 drop-shadow-lg mb-8">Haz click en cualquier parte para desaparecer este tutorial.</p>
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black shadow-2xl transition-all shadow-blue-500/50 border border-white/20">Comenzar</button>
      </div>
    </div>
  );
};

export default HelpOverlay;
