import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi";

const slides = [
  {
    id: 1,
    title: "Diseño Cinematográfico",
    description: "Animaciones fluidas con efectos de partículas y profundidad",
    image: "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1600",
    color: "from-purple-600/40 to-blue-600/40",
  },
  {
    id: 2,
    title: "Interacción Total",
    description: "Controles táctiles, arrastre y efectos visuales",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600",
    color: "from-emerald-600/40 to-cyan-600/40",
  },
  {
    id: 3,
    title: "Tecnología Avanzada",
    description: "React 18 + Framer Motion con optimización",
    image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1600",
    color: "from-orange-600/40 to-rose-600/40",
  },
  {
    id: 4,
    title: "Experiencia Inmersiva",
    description: "Paralaje y transiciones 3D suaves",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1600",
    color: "from-violet-600/40 to-fuchsia-600/40",
  },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -1000 : 1000,
    opacity: 0,
    scale: 0.9,
  }),
};

export default function EpicSlider() {
  const [[index, direction], setIndex] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { damping: 25, stiffness: 150 });

  const paginate = useCallback(
    (newDirection) => {
      setIndex(([prev]) => [
        (prev + newDirection + slides.length) % slides.length,
        newDirection,
      ]);
      progress.set(0);
    },
    [progress]
  );

  // 🔁 Autoplay con progreso visual
  useEffect(() => {
    if (paused || isDragging) return;
    
    const interval = setInterval(() => {
      const current = progress.get();
      if (current < 1) {
        progress.set(Math.min(current + 0.01, 1));
      }
    }, 45);

    const timeout = setTimeout(() => {
      if (progress.get() >= 0.99) {
        paginate(1);
      }
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [paused, paginate, progress, isDragging]);

  // ⌨️ Teclado mejorado
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.key) {
        case "ArrowRight": paginate(1); break;
        case "ArrowLeft": paginate(-1); break;
        case " ": 
          e.preventDefault();
          setPaused(prev => !prev); 
          break;
        case "f": 
        case "F":
          toggleFullscreen(); 
          break;
        case "Escape": 
          if (isFullscreen && document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
      }
    };
    
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [paginate, isFullscreen]);

  // Pantalla completa mejorada
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.log("Error con pantalla completa:", err);
    }
  }, []);

  // Eventos de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 📱 Eventos táctiles mejorados
  const handleDragStart = (e) => {
    setIsDragging(true);
    setPaused(true);
    const startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    containerRef.current.dataset.dragStart = startX;
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const startX = parseFloat(containerRef.current.dataset.dragStart);
    const endX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
    const diff = endX - startX;
    
    if (Math.abs(diff) > 50) {
      paginate(diff > 0 ? -1 : 1);
    }
    
    // Reanudar autoplay después de un tiempo
    setTimeout(() => setPaused(false), 1500);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-black transition-all duration-300 ${
        isFullscreen 
          ? "fixed inset-0 z-50 w-screen h-screen" 
          : "w-full max-w-6xl mx-auto rounded-3xl shadow-[0_35px_120px_rgba(0,0,0,0.6)]"
      }`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (!isDragging) {
          setTimeout(() => setPaused(false), 300);
        }
      }}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
      onMouseMove={(e) => {
        if (isDragging && e.buttons === 1) {
          const startX = parseFloat(containerRef.current.dataset.dragStart);
          const currentX = e.clientX;
          const diff = currentX - startX;
          
          // Efecto visual de arrastre
          if (Math.abs(diff) > 30) {
            const direction = diff > 0 ? -0.1 : 0.1;
            const currentSlide = document.querySelector('[data-current-slide]');
            if (currentSlide) {
              currentSlide.style.transform = `translateX(${diff * 0.1}px)`;
            }
          }
        }
      }}
    >
      
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent z-30"
        style={{ scaleX: smoothProgress }}
      />

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={slides[index].id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          data-current-slide="true"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
            scale: { duration: 0.4 },
          }}
          className="relative h-[420px] md:h-[550px] lg:h-[650px] cursor-grab active:cursor-grabbing"
          style={isFullscreen ? { height: '100vh' } : {}}
        >
      
          <motion.img
            src={slides[index].image}
            alt={slides[index].title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Overlay dinámico */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slides[index].color} via-black/50 to-transparent`} />

          {/* Contenido */}
          <div className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24">
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.6,
                delay: 0.2
              }}
              className="max-w-2xl text-white"
            >
              <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4">
                Slide {index + 1} / {slides.length}
              </div>
              
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight">
                {slides[index].title}
              </h2>
              
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 font-light">
                {slides[index].description}
              </p>

              <div className="flex gap-3">
                <button 
                  className="px-5 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all 
                  active:scale-95 text-sm"
                  onClick={() => console.log('Explorar')}
                >
                  Explorar
                </button>
                <button 
                  className="px-5 py-2.5 border border-white/50 text-white font-semibold rounded-full hover:bg-white/10 
                  transition-all active:scale-95 text-sm"
                  onClick={() => console.log('Ver más')}
                >
                  Ver más
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>


      <div className="absolute top-4 right-4 flex gap-2 z-30">
        <button
          onClick={() => setPaused(!paused)}
          className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-all"
          title={paused ? "Reanudar" : "Pausar"}
        >
          {paused ? <FiPlay size={18} className="text-white" /> : <FiPause size={18} className="text-white" />}
        </button>
        
        <button
          onClick={toggleFullscreen}
          className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-all"
          title={isFullscreen ? "Salir pantalla completa" : "Pantalla completa"}
        >
          {isFullscreen ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 
              15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0-4h-4m4 
              0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          )}
        </button>
      </div>

      {/* Flechas de navegación */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20
        p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm
        rounded-full transition-all active:scale-95"
      >
        <FiChevronLeft size={24} className="text-white" />
      </button>

      <button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20
        p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm
        rounded-full transition-all active:scale-95"
      >
        <FiChevronRight size={24} className="text-white" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex([i, i > index ? 1 : -1])}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index
                ? "bg-white scale-125"
                : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Contador */}
      <div className="absolute bottom-4 right-4 z-20 text-white/70 text-sm font-mono">
        {String(index + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}
      </div>
    </div>
  );
}
