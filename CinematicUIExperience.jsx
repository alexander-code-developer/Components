import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState, useRef } from "react";

const cards = [
  {
    title: "Future Motion",
    desc: "UI beyond interaction",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Human Centered",
    desc: "Design that reacts",
    image:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Immersive UX",
    desc: "Feel every pixel",
    image:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Creative Code",
    desc: "Where art meets logic",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function CinematicUIExperience() {
  const [cycle, setCycle] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  // Optimizar valores de movimiento
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Añadir amortiguación más suave
  const x = useSpring(mx, { 
    stiffness: 40, 
    damping: 25,
    mass: 0.2
  });
  const y = useSpring(my, { 
    stiffness: 40, 
    damping: 25,
    mass: 0.2
  });

  // Optimizar transformaciones para el glow
  const glowX = useTransform(x, (val) => val * 0.5);
  const glowY = useTransform(y, (val) => val * 0.5);

  useEffect(() => {
    // Precargar imágenes para evitar lag
    const preloadImages = () => {
      cards.forEach((card) => {
        const img = new Image();
        img.src = card.image;
      });
    };
    preloadImages();

    // Pequeño delay para asegurar que todo esté listo
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    const loop = setInterval(() => {
      setCycle((c) => c + 1);
    }, 11000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(loop);
    };
  }, []);

  // Optimizar el manejador de mouse
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left - centerX;
    const mouseY = e.clientY - rect.top - centerY;
    
    mx.set(mouseX);
    my.set(mouseY);
  };

  if (!isLoaded) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        <div className="relative z-10">
          <div className="w-16 h-16 border-4 border-white/20 border-t-cyan-400 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* 💥 FLASH BLANCO OPTIMIZADO */}
      <AnimatePresence>
        {cycle > 0 && (
          <motion.div
            key={`flash-${cycle}`}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      {/* 🌌 BACKGROUND MUTANTE - Optimizado con menos repaints */}
      <motion.div
        className="absolute inset-0 bg-black"
        style={{
          background: "radial-gradient(circle at 20% 30%, #9333ea 0%, transparent 55%)"
        }}
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, #9333ea 0%, transparent 55%)",
            "radial-gradient(circle at 80% 20%, #22d3ee 0%, transparent 55%)",
            "radial-gradient(circle at 50% 80%, #f43f5e 0%, transparent 55%)",
          ],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          repeatType: "mirror",
          ease: "linear"
        }}
      />

      {/* 🌪 SUPER GLOW OPTIMIZADO - Usando transformaciones */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full bg-fuchsia-500/30 blur-[200px] pointer-events-none"
        style={{ 
          x: glowX,
          y: glowY 
        }}
      />

      {/* ✨ EFECTO DE PARTICULAS SUTILES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white/30 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0,
            }}
            animate={{
              x: `calc(${Math.random() * 100}% + ${Math.sin(Date.now() * 0.001 + i) * 20}px)`,
              y: `calc(${Math.random() * 100}% + ${Math.cos(Date.now() * 0.001 + i) * 20}px)`,
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* 🎬 TEXTO PRINCIPAL - Animación escalonada */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`main-${cycle}`}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* PRIMERA LINEA */}
          <div className="relative overflow-hidden">
            <motion.h1
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2
              }}
              className="text-white font-black leading-none tracking-tighter
              text-[clamp(3rem,10vw,9rem)]"
            >
              CINEMATIC
            </motion.h1>
            
            {/* EFECTO DE RESPLANDOR DETRÁS */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-3xl -z-10"
            />
          </div>

          {/* SEGUNDA LINEA CON GRADIENTE */}
          <div className="relative overflow-hidden mt-2">
            <motion.h2
              initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ 
                delay: 0.6, 
                duration: 1.4,
                ease: "backOut"
              }}
              className="font-black leading-none tracking-tighter
              text-[clamp(2.5rem,9vw,8rem)]
              bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400
              bg-clip-text text-transparent"
            >
              UI EXPERIENCE
            </motion.h2>
          </div>

          {/* SUBTITULO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="relative"
          >
            <motion.p
              className="mt-8 text-white/80 text-xl max-w-xl font-light tracking-wider"
              whileHover={{ scale: 1.05, color: "rgba(255,255,255,1)" }}
            >
              This is not a website.
              <br />
              It's a moment.
            </motion.p>
            
            {/* LÍNEA DECORATIVA */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.5, duration: 1 }}
              className="h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent mt-4 mx-auto"
              style={{ maxWidth: "200px" }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* 🧨 CARDS CAÓTICAS OPTIMIZADAS - Animación por lotes */}
      <div className="absolute inset-0 pointer-events-none">
        {cards.map((card, i) => (
          <motion.div
            key={`${cycle}-${i}`}
            initial={{
              opacity: 0,
              scale: 0,
              rotate: -45,
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              x: `calc(-50% + ${Math.cos(i * 1.5) * 300}px)`,
              y: `calc(-50% + ${Math.sin(i * 1.5) * 200}px)`,
            }}
            transition={{
              delay: 1.5 + i * 0.15, // Menos delay entre cards
              duration: 1.2, // Duración más corta
              ease: [0.34, 1.56, 0.64, 1], // Curva personalizada
              opacity: { duration: 0.8 },
            }}
            className="absolute top-1/2 left-1/2
            w-[200px] h-[300px] md:w-[260px] md:h-[380px]
            rounded-2xl overflow-hidden
            shadow-[0_60px_120px_rgba(0,0,0,0.8)] 
            hover:shadow-[0_80px_160px_rgba(168,85,247,0.4)] 
            transition-shadow duration-300"
            style={{
              x: x.get() * (0.04 + i * 0.015),
              y: y.get() * (0.04 + i * 0.015),
            }}
            whileHover={{ 
              scale: 1.05,
              zIndex: 50,
              transition: { duration: 0.2 }
            }}
          >
            {/* IMAGEN CON LOADING OPTIMIZADO */}
            <motion.img
              src={card.image}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full object-cover"
              alt={card.title}
            />
            
            {/* OVERLAY CON GRADIENTE */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            
            {/* EFECTO DE BORDE LUMINOSO */}
            <div className="absolute inset-0 border border-white/10 rounded-2xl" />
            
            {/* CONTENIDO */}
            <motion.div 
              className="absolute bottom-0 p-6 text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2 + i * 0.1 }}
            >
              <h3 className="text-2xl font-black mb-2 tracking-tight">
                {card.title}
              </h3>
              <p className="text-sm text-white/80 font-light tracking-wide">
                {card.desc}
              </p>
              
              {/* BOTÓN SUTIL */}
              <motion.div
                className="mt-4 w-8 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-400"
                whileHover={{ width: 40 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* ⚡ CTA VIBRANTE OPTIMIZADO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-center"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 
          rounded-full text-white font-semibold tracking-widest text-sm
          shadow-[0_0_40px_rgba(139,92,246,0.5)]
          hover:shadow-[0_0_60px_rgba(139,92,246,0.8)]
          transition-all duration-300
          hover:scale-105 active:scale-95">
            ENTER THE EXPERIENCE
          </button>
          
          <motion.div
            className="h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mt-4"
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ width: "200px" }}
          />
        </motion.div>
      </motion.div>

      {/* 🔊 AUDIO INDICATOR (Opcional) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute top-6 right-6 flex items-center gap-2 text-white/50 text-sm"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="tracking-widest">IMMERSIVE MODE: ON</span>
      </motion.div>
    </div>
  );
}