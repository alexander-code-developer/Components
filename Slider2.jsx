import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay, FiMaximize2, FiMinimize2, FiStar } from "react-icons/fi";
import { GiGalaxy, GiLightningArc, GiAtomicSlashes, GiCrystalShine } from "react-icons/gi";

const slides = [
  {
    id: 1,
    title: "NEXUS 01",
    subtitle: "Realidad Cuántica",
    description: "Interfaces holográficas con IA predictiva y renderizado en tiempo real",
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1600",
    color: "from-cyan-500/20 via-blue-500/10 to-purple-500/20",
    accent: "#00f3ff",
    icon: <GiGalaxy className="text-cyan-400" />,
    particles: 15
  },
  {
    id: 2,
    title: "VOLTAGE X",
    subtitle: "Energía Digital",
    description: "Sistema de transmisión de datos con patrones de energía lumínica",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600",
    color: "from-emerald-500/20 via-teal-500/10 to-green-500/20",
    accent: "#00ff9d",
    icon: <GiLightningArc className="text-emerald-400" />,
    particles: 12
  },
  {
    id: 3,
    title: "ATOMOS",
    subtitle: "Estructura Molecular",
    description: "Visualización de estructuras atómicas con simulación de partículas",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1600",
    color: "from-violet-500/20 via-purple-500/10 to-pink-500/20",
    accent: "#d400ff",
    icon: <GiAtomicSlashes className="text-violet-400" />,
    particles: 20
  },
  {
    id: 4,
    title: "CRYSTAL",
    subtitle: "Geometría Pura",
    description: "Arquitectura de cristal digital con refracciones dinámicas",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600",
    color: "from-rose-500/20 via-red-500/10 to-orange-500/20",
    accent: "#ff4d00",
    icon: <GiCrystalShine className="text-rose-400" />,
    particles: 18
  },
];
//Code in my github 

const Particle = ({ x, y, color, size }) => (
  <motion.div
    className="absolute rounded-full blur-sm"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}, transparent)`,
    }}
    animate={{
      y: [0, -20, 0],
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: Math.random() * 3 + 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default function Slider() {
  const [[index, direction], setIndex] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);
  const timeProgress = useMotionValue(0);
  const smoothProgress = useSpring(timeProgress, { damping: 25, stiffness: 150 });

  const generateParticles = useCallback((count, color) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      color: color,
      delay: Math.random() * 2
    }));
  }, []);

  const paginate = useCallback(
    (newDirection) => {
      setIndex(([prev]) => [
        (prev + newDirection + slides.length) % slides.length,
        newDirection,
      ]);
      timeProgress.set(0);
      

      const newParticles = generateParticles(
        slides[(index + newDirection + slides.length) % slides.length].particles,
        slides[(index + newDirection + slides.length) % slides.length].accent
      );
      setParticles(newParticles);
    },
    [index, generateParticles, timeProgress]
  );

  useEffect(() => {
    if (paused) return;
    
    const interval = setInterval(() => {
      const current = timeProgress.get();
      if (current < 1) {
        timeProgress.set(Math.min(current + 0.008, 1));
      }
    }, 50);

    const timeout = setTimeout(() => {
      if (timeProgress.get() >= 0.99) {
        paginate(1);
      }
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [paused, paginate, timeProgress]);

  useEffect(() => {
    const initialParticles = generateParticles(slides[index].particles, slides[index].accent);
    setParticles(initialParticles);
  }, [generateParticles, index]);

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

  // Efectos de hover para partículas
  useEffect(() => {
    if (isHovering) {
      const interval = setInterval(() => {
        setParticles(prev => 
          prev.map(p => ({
            ...p,
            x: Math.min(100, Math.max(0, p.x + (Math.random() - 0.5) * 5)),
            y: Math.min(100, Math.max(0, p.y + (Math.random() - 0.5) * 5))
          }))
        );
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isHovering]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gradient-to-br from-gray-900
         via-black to-gray-900 
        transition-all duration-500 ${isFullscreen 
          ? "fixed inset-0 z-50 w-screen h-screen" 
          : "w-full max-w-6xl mx-auto rounded-3xl border border-gray-800 shadow-2xl shadow-blue-500/10"
        }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background: `linear-gradient(90deg, transparent 50%, 
            ${slides[index].accent}20 50%)`,
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '200% 200%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="absolute inset-0 z-1 overflow-hidden">
        {particles.map((particle) => (
          <Particle key={particle.id} {...particle} />
        ))}
      </div>

      <motion.div 
        className="absolute top-0 left-0 right-0 h-0.5 z-30"
        style={{ 
          scaleX: smoothProgress,
          background: `linear-gradient(90deg, transparent, ${slides[index].accent}, transparent)`,
          boxShadow: `0 0 20px ${slides[index].accent}`
        }}
      />

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={slides[index].id}
          custom={direction}
          initial={{
            x: direction > 0 ? 800 : -800,
            opacity: 0,
            rotateY: direction > 0 ? 30 : -30,
          }}
          animate={{
            x: 0,
            opacity: 1,
            rotateY: 0,
          }}
          exit={{
            x: direction > 0 ? -800 : 800,
            opacity: 0,
            rotateY: direction > 0 ? -30 : 30,
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 25,
            opacity: { duration: 0.3 }
          }}
          className="relative h-[500px] md:h-[600px] lg:h-[700px]"
          style={isFullscreen ? { height: '100vh' } : {}}
        >


          <motion.div
            className="absolute inset-0"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img
              src={slides[index].image}
              alt={slides[index].title}
              className="w-full h-full object-cover opacity-60"
            />
          </motion.div>

          <div className={`absolute inset-0 bg-gradient-to-br ${slides[index].color}`} />

          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(${slides[index].accent} 1px, transparent 1px),
                               linear-gradient(90deg, ${slides[index].accent} 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
          <div className="relative z-10 h-full flex items-center px-8 md:px-16 lg:px-24">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.6,
                delay: 0.3
              }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  {slides[index].icon}
                </motion.div>
                <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md 
                  rounded-full border border-gray-700 text-sm text-gray-300">
                  <span className="text-cyan-400 font-bold">TECH</span> • SLIDE {index + 1}
                </div>
              </div>

              <h2 
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-2 leading-tight"
                style={{
                  background: `linear-gradient(45deg, #fff 30%, ${slides[index].accent} 70%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: `drop-shadow(0 0 20px ${slides[index].accent}40)`
                }}
              >
                {slides[index].title}
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <FiStar className="text-yellow-400" />
                <h3 className="text-xl md:text-2xl text-gray-300 font-light">
                  {slides[index].subtitle}
                </h3>
              </div>

              <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl font-light leading-relaxed">
                {slides[index].description}
              </p>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-gray-900 to-black 
                    border border-gray-700 text-white font-medium rounded-lg 
                    hover:border-gray-500 transition-all flex items-center gap-2"
                  style={{
                    boxShadow: `0 0 30px ${slides[index].accent}20`
                  }}
                  onClick={() => console.log('Simular')}
                >
                  <GiAtomicSlashes />
                  Simular Entorno
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-black/80 to-black/40 
                    backdrop-blur-sm border border-gray-600/50 text-white 
                    font-medium rounded-lg hover:border-gray-400 transition-all"
                  onClick={() => console.log('Documentación')}
                >
                  Documentación
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-4 right-4 flex gap-2 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setPaused(!paused)}
          className="p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm 
            rounded-xl border border-gray-700/50 transition-all"
          title={paused ? "Reanudar" : "Pausar"}
          style={{
            boxShadow: `0 0 20px ${paused ? '#00ff9d40' : '#ff4d0040'}`
          }}
        >
          {paused ? 
            <FiPlay size={18} className="text-green-400" /> : 
            <FiPause size={18} className="text-orange-400" />
          }
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleFullscreen}
          className="p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm 
            rounded-xl border border-gray-700/50 transition-all"
          title={isFullscreen ? "Salir pantalla completa" : "Pantalla completa"}
        >
          {isFullscreen ? 
            <FiMinimize2 size={18} className="text-white" /> : 
            <FiMaximize2 size={18} className="text-white" />
          }
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20
          p-4 bg-black/40 backdrop-blur-sm rounded-xl border 
          border-gray-700/50 transition-all group"
        style={{
          boxShadow: `0 0 30px ${slides[index].accent}20`
        }}
      >
        <FiChevronLeft size={24} className="text-white group-hover:text-cyan-400" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20
          p-4 bg-black/40 backdrop-blur-sm rounded-xl border 
          border-gray-700/50 transition-all group"
        style={{
          boxShadow: `0 0 30px ${slides[index].accent}20`
        }}
      >
        <FiChevronRight size={24} className="text-white group-hover:text-cyan-400" />
      </motion.button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => setIndex([i, i > index ? 1 : -1])}
            className="relative"
          >
            <div 
              className={`w-3 h-3 rounded-full transition-all ${
                i === index ? "scale-125" : ""
              }`}
              style={{
                background: i === index ? slides[index].accent : '#374151',
                boxShadow: i === index ? `0 0 15px ${slides[index].accent}` : 'none'
              }}
            />
            {i === index && (
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: slides[index].accent }}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 z-20">
        <div className="text-sm font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: slides[index].accent }}
            />
            <span>SISTEMA ACTIVO</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {String(index + 1).padStart(2, '0')}.{slides[index].title}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-white">
            {String(index + 1).padStart(2, '0')}
            <span className="text-gray-500">/{String(slides.length).padStart(2, '0')}</span>
          </div>
          <div className="text-xs text-gray-500 font-mono mt-1">
            {new Date().getFullYear()} • QUANTUM SLIDER v2.0
          </div>
        </div>
      </div>
    </div>
  );
}