import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Zap } from 'lucide-react';

const BOOT_LINES = [
    '> Initializing EDA Runtime v2.4.1...',
    '> Loading synthesis libraries...',
    '> Mounting design database...',
    '> Checking license server: [CADENCE_LICENSE OK]',
    '> Timing engine: MMMC ready',
    '> Power grid analysis: ACTIVE',
    '> sys_rst_n asserted — awaiting de-assertion...',
];

export default function HeroPost({ onBooted }) {
    const [booted, setBooted] = useState(false);
    const [bootLines, setBootLines] = useState([]);
    const [showContent, setShowContent] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);

    const containerRef = useRef(null);
    const clockRef = useRef(null);

    // Typewriter boot sequence
    useEffect(() => {
        if (booted) {
            let i = 0;
            const interval = setInterval(() => {
                if (i < BOOT_LINES.length) {
                    setBootLines(prev => [...prev, BOOT_LINES[i]]);
                    i++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        setShowContent(true);
                        setGlitchActive(true);
                        setTimeout(() => setGlitchActive(false), 2000);
                    }, 400);
                }
            }, 200);
            return () => clearInterval(interval);
        }
    }, [booted]);

    const handleReset = () => {
        if (booted) return;
        setBooted(true);

        // GSAP clock signal animation
        const tl = gsap.timeline();
        tl.to(clockRef.current, {
            duration: 0.1,
            opacity: 1,
            ease: 'none',
        })
            .to('.clock-line-top', { scaleX: 1, duration: 0.5, ease: 'power2.out', transformOrigin: 'left center' })
            .to('.clock-line-bottom', { scaleX: 1, duration: 0.5, ease: 'power2.out', transformOrigin: 'right center' }, '-=0.3')
            .to('.clock-line-left', { scaleY: 1, duration: 0.5, ease: 'power2.out', transformOrigin: 'top center' }, '-=0.3')
            .to('.clock-line-right', { scaleY: 1, duration: 0.5, ease: 'power2.out', transformOrigin: 'bottom center' }, '-=0.3');
    };

    return (
        <section
            id="about"
            ref={containerRef}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pl-0 md:pl-[220px] pt-14 md:pt-0"
            style={{ background: 'radial-gradient(ellipse at center, #050d05 0%, #050505 70%)' }}
        >
            {/* Grid background */}
            <div className="absolute inset-0 floorplan-grid opacity-30" />

            {/* Clock signal border lines */}
            <div ref={clockRef} className="absolute inset-0 pointer-events-none opacity-0">
                <div className="clock-line-top absolute top-0 left-0 w-full h-px bg-eda-blue"
                    style={{ boxShadow: '0 0 8px #00D1FF', transform: 'scaleX(0)' }} />
                <div className="clock-line-bottom absolute bottom-0 left-0 w-full h-px bg-eda-blue"
                    style={{ boxShadow: '0 0 8px #00D1FF', transform: 'scaleX(0)' }} />
                <div className="clock-line-left absolute top-0 left-0 w-px h-full bg-eda-blue"
                    style={{ boxShadow: '0 0 8px #00D1FF', transform: 'scaleY(0)' }} />
                <div className="clock-line-right absolute top-0 right-0 w-px h-full bg-eda-blue"
                    style={{ boxShadow: '0 0 8px #00D1FF', transform: 'scaleY(0)' }} />
            </div>

            {/* Corner decorations */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-8 h-8 border-eda-green z-10`}
                    style={{
                        borderTopWidth: pos.includes('top') ? '1px' : 0,
                        borderBottomWidth: pos.includes('bottom') ? '1px' : 0,
                        borderLeftWidth: pos.includes('left') ? '1px' : 0,
                        borderRightWidth: pos.includes('right') ? '1px' : 0,
                        boxShadow: '0 0 8px #00FF41',
                    }} />
            ))}

            {/* Header status bar */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 md:px-8 py-2 border-b border-eda-green border-opacity-20 text-xs text-eda-green text-opacity-50 mt-14 md:mt-0">
                <span className="flex items-center gap-2">
                    <Terminal size={12} /> EDA_RUNTIME v2.4.1
                </span>
                <span className="hidden sm:block">CLK: 2GHz | PVT: TT/0.85V/25°C</span>
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-eda-green animate-pulse" />
                    <span className="hidden sm:inline">SYS_STATUS: </span>NOMINAL
                </span>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl">
                {/* Boot terminal */}
                <AnimatePresence>
                    {booted && !showContent && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-xl text-left mb-8"
                        >
                            <div className="border border-eda-green border-opacity-30 bg-black bg-opacity-60 p-4 rounded-sm">
                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-eda-green border-opacity-20">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                    <div className="w-2 h-2 rounded-full bg-eda-green" />
                                    <span className="ml-2 text-xs opacity-50">genus_shell</span>
                                </div>
                                {bootLines.map((line, i) => (
                                    <p key={i} className="text-xs font-mono text-eda-green opacity-80 leading-6">
                                        {line}
                                    </p>
                                ))}
                                {bootLines.length < BOOT_LINES.length && (
                                    <span className="text-eda-green animate-pulse text-xs">▋</span>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main content */}
                <AnimatePresence>
                    {showContent && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="flex flex-col items-center"
                        >
                            {/* Chip icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.6, type: 'spring' }}
                                className="mb-6"
                            >
                                <Cpu size={48} color="#00D1FF" style={{ filter: 'drop-shadow(0 0 16px #00D1FF)' }} />
                            </motion.div>

                            {/* Name with glitch */}
                            <div className="relative mb-2">
                                <motion.h1
                                    className="text-4xl md:text-6xl font-bold text-eda-green"
                                    style={{ textShadow: '0 0 12px rgba(0,255,65,0.5)', userSelect: 'none' }}
                                    data-text="Revanth Sai Nandamuri"
                                    animate={glitchActive ? {
                                        x: [0, -3, 3, -1, 1, 0],
                                        filter: ['none', 'blur(1px)', 'none'],
                                    } : {}}
                                    transition={{ duration: 0.4 }}
                                >
                                    Revanth Sai Nandamuri
                                </motion.h1>
                                {glitchActive && (
                                    <>
                                        <span className="absolute inset-0 text-4xl md:text-6xl font-bold text-eda-blue opacity-80"
                                            style={{
                                                clipPath: 'polygon(0 15%, 100% 15%, 100% 35%, 0 35%)',
                                                transform: 'translateX(-3px)',
                                            }}>
                                            Revanth Sai Nandamuri
                                        </span>
                                        <span className="absolute inset-0 text-4xl md:text-6xl font-bold text-eda-purple opacity-80"
                                            style={{
                                                clipPath: 'polygon(0 60%, 100% 60%, 100% 80%, 0 80%)',
                                                transform: 'translateX(3px)',
                                            }}>
                                            Revanth Sai Nandamuri
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Title */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="overflow-hidden"
                            >
                                <p className="text-base md:text-xl text-eda-blue mb-1 font-medium tracking-widest" style={{ textShadow: '0 0 8px rgba(0,209,255,0.4)', userSelect: 'none' }}>
                                    Implementation Engineer — Design, Verification, Synthesis, Power
                                </p>
                            </motion.div>

                            {/* Role badge */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-wrap items-center justify-center gap-3 my-3"
                                style={{ userSelect: 'none' }}
                            >
                                <span className="px-3 py-1 text-xs tracking-widest"
                                    style={{ border: '1px solid rgba(187,134,252,0.5)', color: '#BB86FC', background: 'transparent' }}>
                                    CADENCE DESIGN SYSTEMS
                                </span>
                                <span className="px-3 py-1 text-xs tracking-widest"
                                    style={{ border: '1px solid rgba(255,183,0,0.5)', color: '#FFB700', background: 'transparent' }}>
                                    SENIOR AE
                                </span>
                            </motion.div>

                            {/* Summary */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="mt-4 max-w-2xl text-sm leading-relaxed text-center"
                                style={{ color: 'rgba(0,255,65,0.65)', userSelect: 'none' }}
                            >
                                Senior Application Engineer at Cadence Design Systems with 2+ years in RTL Synthesis and RTL Power Estimation.
                                Enables global customers on&nbsp;
                                <span style={{ color: '#00D1FF' }}>Genus</span> and <span style={{ color: '#00D1FF' }}>Joules</span>,
                                delivers trainings, writes AppNotes, and debugs complex synthesis/power issues rapidly.
                            </motion.p>

                            {/* Stats row */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="flex gap-6 md:gap-8 mt-6 md:mt-8 text-center"
                                style={{ userSelect: 'none' }}
                            >
                                {[
                                    { value: '300+', label: 'Cases Resolved', hex: '#00FF41' },
                                    { value: '2+', label: 'Years @ Cadence', hex: '#00D1FF' },
                                    { value: '3', label: 'Patents Filed', hex: '#BB86FC' },
                                ].map(({ value, label, hex }) => (
                                    <div key={label} className="flex flex-col items-center">
                                        <span className="text-2xl font-bold" style={{ color: hex, textShadow: `0 0 10px ${hex}66` }}>
                                            {value}
                                        </span>
                                        <span className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Scroll hint */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                                className="mt-12 flex flex-col items-center gap-2 text-xs opacity-40"
                            >
                                <Zap size={14} color="#00FF41" />
                                <span>SCROLL TO EXPLORE</span>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Boot Button */}
                {!booted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <p className="text-xs text-eda-green opacity-50 tracking-widest mb-4">
              // SYSTEM HALTED — AWAITING RESET
                        </p>
                        <button
                            onClick={handleReset}
                            id="sys-reset-btn"
                            className="relative group"
                        >
                            <div className="absolute -inset-1 bg-eda-blue opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
                            <div className="relative border border-eda-blue px-12 py-4 text-eda-blue font-mono text-xl tracking-widest hover:bg-eda-blue hover:bg-opacity-10 transition-all cursor-pointer"
                                style={{ boxShadow: '0 0 20px rgba(0,209,255,0.3)', textShadow: '0 0 10px #00D1FF' }}>
                                sys_rst_n
                            </div>
                            <div className="absolute -bottom-6 left-0 right-0 text-center text-xxs text-eda-blue opacity-40 text-xs">
                // active-low reset
                            </div>
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Bottom status bar */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-4 md:px-8 py-2 border-t border-eda-green border-opacity-20 text-xs text-eda-green text-opacity-40">
                <span>MODULE: HERO_POST.JSX</span>
                <span className="hidden sm:block">INST: revanth_nandamuri_v1</span>
                <span>LOC: VIT-AP → CADENCE</span>
            </div>
        </section>
    );
}
