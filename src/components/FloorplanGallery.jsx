import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Shield, FileText } from 'lucide-react';

/* ─── DATA ─────────────────────────────────────────────────────── */
const PROJECTS = [
    {
        id: 'router_4x4',
        macroName: 'ROUTER_4X4_MACRO',
        type: 'IP_BLOCK',
        title: 'Router 4×4 Verification',
        category: 'project',
        color: '#00FF41',
        details: {
            description: 'Full functional verification environment for a 4×4 packet-switched router using UVM methodology.',
            tech: ['UVM', 'SystemVerilog', 'Protocol Checks', 'Scoreboards'],
            highlights: [
                'Developed reusable UVM agent for packet generation',
                'Protocol compliance checking via monitors',
                'Functional coverage closure at 98%',
                'Constrained-random stimulus generation',
            ],
            status: 'VERIFIED',
        },
    },
    {
        id: 'memory_model',
        macroName: 'MEM_MODEL_VER',
        type: 'SRAM_CTRL',
        title: 'Memory Model Verification',
        category: 'project',
        color: '#00D1FF',
        details: {
            description: 'Comprehensive memory model verification using Register Abstraction Layer (RAL) and error injection techniques.',
            tech: ['RAL Model', 'SystemVerilog', 'Error Injection', 'UVM'],
            highlights: [
                'UVM RAL model for register-level testing',
                'Bit-flip and stuck-at fault injection',
                'ECC error detection and correction flow',
                'Boundary condition coverage',
            ],
            status: 'VERIFIED',
        },
    },
    {
        id: 'alu_uart',
        macroName: 'ALU_UART_ENV',
        type: 'DATAPATH',
        title: 'ALU & UART Verification',
        category: 'project',
        color: '#BB86FC',
        details: {
            description: 'Standalone verification environments for ALU and UART serial communication controller.',
            tech: ['SystemVerilog', 'UVM', 'Assertion-Based Verification'],
            highlights: [
                'ALU operation coverage: 100% functional',
                'UART baud rate auto-detection',
                'SVA properties for protocol checks',
                'Self-checking testbench architecture',
            ],
            status: 'COMPLETE',
        },
    },
];

const PATENTS = [
    {
        id: 'patent_uvc',
        macroName: 'PATENT_UVC_CTRL',
        type: 'PATENT',
        title: 'Portable UV-C Sanitizer',
        category: 'patent',
        color: '#FFB700',
        details: {
            patentNo: '202041033151',
            description: 'A portable UV-C light-based sanitization device for rapid surface and object disinfection.',
            tech: ['UV-C Light Control', 'Embedded C', 'Safety Interlock'],
            highlights: [
                'Patent No. 202041033151',
                'Portable form factor design',
                'Safety interlock system',
                'Timer-controlled exposure',
            ],
        },
    },
    {
        id: 'patent_smart_meter',
        macroName: 'SMART_ELEC_METER',
        type: 'PATENT',
        title: 'Smart Electrical Measurement System',
        category: 'patent',
        color: '#FF6B6B',
        details: {
            patentNo: '202141026739',
            description: 'An intelligent electrical measurement system with IoT connectivity for real-time power monitoring.',
            tech: ['IoT', 'Embedded C', 'ADC', 'Communication Protocol'],
            highlights: [
                'Patent No. 202141026739',
                'Real-time power monitoring',
                'IoT data reporting',
                'Multi-channel measurement',
            ],
        },
    },
    {
        id: 'patent_glove_meter',
        macroName: 'MULTIMETER_GLOVE',
        type: 'PATENT',
        title: 'Multimeter on Gloves',
        category: 'patent',
        color: '#34D399',
        details: {
            patentNo: '202141030637',
            description: 'A wearable multimeter integrated into gloves for hands-free electrical measurement in field operations.',
            tech: ['Wearable Tech', 'Embedded Systems', 'Sensor Fusion'],
            highlights: [
                'Patent No. 202141030637',
                'Hands-free measurement',
                'Field-use optimized hardware',
                'Safety-rated insulation',
            ],
        },
    },
];

/* ─── CHIP LAYOUT ──────────────────────────────────────────────── */
/* Each sub-module has an explicit position (% based) and clip-path
   polygon so nothing overlaps and the layout looks like a real die. */

const CHIP_LAYOUT = [
    // ── Patents (large IP blocks) ──
    {
        ...PATENTS[0],
        // L-shaped block — top-left
        x: 4, y: 4, w: 38, h: 42,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 60%, 65% 60%, 65% 100%, 0% 100%)',
        labelPos: { x: 12, y: 20 },
    },
    {
        ...PATENTS[1],
        // Notched rectangle — top-right
        x: 46, y: 4, w: 50, h: 42,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 30% 100%, 30% 70%, 0% 70%)',
        labelPos: { x: 40, y: 16 },
    },
    {
        ...PATENTS[2],
        // Wide block with step — bottom-left
        x: 4, y: 50, w: 44, h: 46,
        clipPath: 'polygon(0% 0%, 70% 0%, 70% 30%, 100% 30%, 100% 100%, 0% 100%)',
        labelPos: { x: 8, y: 55 },
    },
    // ── Academic Projects (smaller macro blocks) ──
    {
        ...PROJECTS[0],
        // Small polygon — mid-right
        x: 52, y: 50, w: 22, h: 22,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 80% 100%, 0% 100%)',
        labelPos: { x: 4, y: 5 },
    },
    {
        ...PROJECTS[1],
        // Hexagonal-ish block — bottom-right
        x: 52, y: 75, w: 22, h: 21,
        clipPath: 'polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%)',
        labelPos: { x: 6, y: 6 },
    },
    {
        ...PROJECTS[2],
        // Trapezoid — far right column
        x: 78, y: 50, w: 18, h: 46,
        clipPath: 'polygon(0% 0%, 100% 5%, 100% 95%, 0% 100%)',
        labelPos: { x: 4, y: 18 },
    },
];

/* Routing bus lines connecting blocks (decorative) */
const ROUTING_LINES = [
    // Horizontal buses
    { x1: '4%', y1: '48%', x2: '96%', y2: '48%', color: '#00FF4120' },
    { x1: '44%', y1: '4%', x2: '44%', y2: '96%', color: '#00FF4118' },
    // Cross routes
    { x1: '50%', y1: '72%', x2: '78%', y2: '72%', color: '#FFB70020' },
    { x1: '74%', y1: '50%', x2: '74%', y2: '96%', color: '#FFB70018' },
    // Short stubs
    { x1: '10%', y1: '48%', x2: '10%', y2: '50%', color: '#00FF4130' },
    { x1: '65%', y1: '48%', x2: '65%', y2: '50%', color: '#00D1FF30' },
];

/* ─── IO PAD RING ──────────────────────────────────────────────── */
function PadRing() {
    const pads = [];
    const padCount = { top: 20, bottom: 20, left: 12, right: 12 };
    const padSize = 8;
    const gap = 2;

    // Top
    for (let i = 0; i < padCount.top; i++) {
        const offset = 20 + i * ((960 - 40) / padCount.top);
        pads.push(
            <rect key={`t${i}`} x={offset} y={2} width={padSize} height={padSize + 2}
                fill={i % 3 === 0 ? '#00FF4118' : '#0a1a0c'}
                stroke="#00FF4120" strokeWidth={0.5} />
        );
    }
    // Bottom
    for (let i = 0; i < padCount.bottom; i++) {
        const offset = 20 + i * ((960 - 40) / padCount.bottom);
        pads.push(
            <rect key={`b${i}`} x={offset} y={590} width={padSize} height={padSize + 2}
                fill={i % 4 === 0 ? '#FFB70015' : '#0a1a0c'}
                stroke="#00FF4120" strokeWidth={0.5} />
        );
    }
    // Left
    for (let i = 0; i < padCount.left; i++) {
        const offset = 20 + i * ((600 - 40) / padCount.left);
        pads.push(
            <rect key={`l${i}`} x={2} y={offset} width={padSize + 2} height={padSize}
                fill={i % 3 === 0 ? '#00D1FF15' : '#0a1a0c'}
                stroke="#00FF4120" strokeWidth={0.5} />
        );
    }
    // Right
    for (let i = 0; i < padCount.right; i++) {
        const offset = 20 + i * ((600 - 40) / padCount.right);
        pads.push(
            <rect key={`r${i}`} x={950} y={offset} width={padSize + 2} height={padSize}
                fill={i % 4 === 0 ? '#BB86FC15' : '#0a1a0c'}
                stroke="#00FF4120" strokeWidth={0.5} />
        );
    }
    return <>{pads}</>;
}

/* ─── POWER GRID OVERLAY ───────────────────────────────────────── */
function PowerGrid() {
    const lines = [];
    for (let i = 0; i < 30; i++) {
        const x = 16 + i * 32;
        lines.push(
            <line key={`v${i}`} x1={x} y1={14} x2={x} y2={586}
                stroke="#00FF4108" strokeWidth={0.5} />
        );
    }
    for (let i = 0; i < 18; i++) {
        const y = 14 + i * 34;
        lines.push(
            <line key={`h${i}`} x1={14} y1={y} x2={946} y2={y}
                stroke="#00FF4108" strokeWidth={0.5} />
        );
    }
    return <>{lines}</>;
}

/* ─── CHIP SUB-MODULE BLOCK ────────────────────────────────────── */
function ChipBlock({ block, onClick, index }) {
    const [hovered, setHovered] = useState(false);
    const isPatent = block.category === 'patent';

    return (
        <motion.div
            className="absolute cursor-pointer"
            style={{
                left: `${block.x}%`,
                top: `${block.y}%`,
                width: `${block.w}%`,
                height: `${block.h}%`,
                clipPath: block.clipPath,
                zIndex: hovered ? 20 : 10,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            onClick={() => onClick(block)}
        >
            {/* Block body */}
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    background: hovered
                        ? `linear-gradient(135deg, ${block.color}18, ${block.color}0a)`
                        : `linear-gradient(135deg, ${block.color}0c, ${block.color}04)`,
                    border: `1.5px solid ${hovered ? block.color : block.color + '40'}`,
                    boxShadow: hovered
                        ? `0 0 30px ${block.color}25, inset 0 0 40px ${block.color}08`
                        : `inset 0 0 20px ${block.color}05`,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Internal routing texture */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: hovered ? 0.25 : 0.1, transition: 'opacity 0.3s' }}>
                    {[...Array(6)].map((_, i) => (
                        <line key={`ih${i}`} x1="0" y1={`${15 + i * 18}%`} x2="100%" y2={`${15 + i * 18}%`}
                            stroke={block.color} strokeWidth={0.4} strokeDasharray="4 8" />
                    ))}
                    {[...Array(4)].map((_, i) => (
                        <line key={`iv${i}`} x1={`${20 + i * 22}%`} y1="0" x2={`${20 + i * 22}%`} y2="100%"
                            stroke={block.color} strokeWidth={0.4} strokeDasharray="6 10" />
                    ))}
                </svg>

                {/* Content label */}
                <div style={{
                    position: 'absolute',
                    left: `${block.labelPos.x}%`,
                    top: `${block.labelPos.y}%`,
                    padding: '6px 10px',
                    zIndex: 2,
                    maxWidth: '85%',
                }}>
                    {/* Type badge */}
                    <div style={{
                        fontSize: '0.5rem',
                        fontWeight: 800,
                        letterSpacing: '0.15em',
                        color: block.color,
                        opacity: 0.55,
                        marginBottom: 4,
                        fontFamily: 'monospace',
                    }}>
                        {block.type}
                    </div>

                    {/* Macro name */}
                    <div style={{
                        fontSize: isPatent ? '0.72rem' : '0.85rem',
                        fontWeight: 700,
                        color: block.color,
                        letterSpacing: '0.06em',
                        fontFamily: 'monospace',
                        textShadow: hovered ? `0 0 12px ${block.color}88` : 'none',
                        transition: 'text-shadow 0.3s',
                        lineHeight: 1.2,
                    }}>
                        {block.macroName}
                    </div>

                    {/* Title */}
                    <div style={{
                        fontSize: '0.6rem',
                        color: block.color,
                        opacity: 0.5,
                        marginTop: 3,
                        fontFamily: 'monospace',
                        lineHeight: 1.3,
                    }}>
                        {block.title}
                    </div>

                    {/* Status / patent icon */}
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                        {isPatent ? (
                            <Shield size={10} style={{ color: block.color, opacity: 0.5 }} />
                        ) : (
                            <Cpu size={10} style={{ color: block.color, opacity: 0.5 }} />
                        )}
                        <span style={{
                            fontSize: '0.48rem',
                            color: block.color,
                            opacity: hovered ? 0.7 : 0.35,
                            fontFamily: 'monospace',
                            letterSpacing: '0.1em',
                            transition: 'opacity 0.3s',
                        }}>
                            {block.details.status || 'FILED'}
                        </span>
                    </div>
                </div>

                {/* Corner die marks */}
                <div style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 8, borderTop: `1px solid ${block.color}30`, borderLeft: `1px solid ${block.color}30` }} />
                <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderTop: `1px solid ${block.color}30`, borderRight: `1px solid ${block.color}30` }} />
                <div style={{ position: 'absolute', bottom: 4, left: 4, width: 8, height: 8, borderBottom: `1px solid ${block.color}30`, borderLeft: `1px solid ${block.color}30` }} />
                <div style={{ position: 'absolute', bottom: 4, right: 4, width: 8, height: 8, borderBottom: `1px solid ${block.color}30`, borderRight: `1px solid ${block.color}30` }} />

                {/* Hover hint */}
                <div style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 12,
                    fontSize: '0.45rem',
                    color: block.color,
                    opacity: hovered ? 0.5 : 0,
                    transition: 'opacity 0.25s',
                    fontFamily: 'monospace',
                }}>
                    // click to expand
                </div>
            </div>
        </motion.div>
    );
}

/* ─── MODAL (unchanged) ───────────────────────────────────────── */
function MacroModal({ item, onClose }) {
    if (!item) return null;
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: 'rgba(0,0,0,0.88)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="relative max-w-lg w-full border p-6"
                    style={{
                        borderColor: item.color,
                        background: '#060606',
                        boxShadow: `0 0 60px ${item.color}22`,
                    }}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-3 right-3" style={{ color: item.color, opacity: 0.5 }}>
                        <X size={18} />
                    </button>

                    <div className="mb-5">
                        <div className="text-xs tracking-widest mb-1" style={{ color: item.color, opacity: 0.5, fontSize: '0.6rem' }}>
                            {item.type} :: {item.macroName}
                        </div>
                        <h3 className="text-xl font-bold" style={{ color: item.color, textShadow: `0 0 12px ${item.color}66` }}>
                            {item.title}
                        </h3>
                    </div>

                    <p className="text-sm mb-5 leading-relaxed" style={{ color: `${item.color}88` }}>
                        {item.details.description}
                    </p>

                    {item.details.patentNo && (
                        <div className="mb-4 px-3 py-2 border text-xs" style={{ borderColor: `${item.color}44`, color: item.color }}>
                            <FileText size={12} className="inline mr-2" />
                            Patent Application No. {item.details.patentNo}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-5">
                        {item.details.tech.map(t => (
                            <span key={t} className="px-2 py-0.5 border" style={{
                                borderColor: `${item.color}44`,
                                color: item.color,
                                fontSize: '0.65rem',
                            }}>
                                {t}
                            </span>
                        ))}
                    </div>

                    <div>
                        <div className="text-xs mb-2" style={{ color: item.color, opacity: 0.5 }}>// highlights</div>
                        {item.details.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-2 mb-1.5" style={{ color: `${item.color}aa` }}>
                                <span style={{ color: item.color }}>▸</span>
                                <span style={{ fontSize: '0.7rem' }}>{h}</span>
                            </div>
                        ))}
                    </div>

                    {item.details.status && (
                        <div className="mt-5 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                            <span style={{ fontSize: '0.65rem', color: item.color, opacity: 0.7 }}>
                                STATUS: {item.details.status}
                            </span>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/* ─── MAIN COMPONENT ───────────────────────────────────────────── */
export default function FloorplanGallery() {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <section
            id="floorplan"
            className="min-h-screen py-24 pl-0 md:pl-[220px] relative"
            style={{ background: 'linear-gradient(to bottom, #050505, #050a05, #050505)' }}
        >
            <div className="absolute inset-0 floorplan-grid opacity-20" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-px bg-eda-green opacity-50" />
                        <span className="text-xs text-eda-green opacity-50 tracking-widest">MODULE: FLOORPLAN_VIEW</span>
                    </div>
                    <h2 className="text-3xl font-bold text-eda-green" style={{ textShadow: '0 0 12px rgba(0,255,65,0.4)', userSelect: 'none' }}>
                        IC Floorplan — Academic Projects &amp; Patents
                    </h2>
                    <p className="text-sm text-eda-blue opacity-60 mt-2" style={{ userSelect: 'none' }}>
                        // Click any macro block to expand
                    </p>
                </motion.div>



                {/* ─── THE CHIP DIE ─────────────────── */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 960,
                    aspectRatio: '960 / 600',
                    margin: '0 auto',
                    border: '2.5px solid #00FF4130',
                    background: 'linear-gradient(145deg, #060a06, #040804, #060a06)',
                    boxShadow: '0 0 80px rgba(0,255,65,0.05), inset 0 0 80px rgba(0,0,0,0.6)',
                    borderRadius: 2,
                }}>
                    {/* SVG overlay: pad ring + power grid + routing */}
                    <svg
                        viewBox="0 0 960 600"
                        style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            pointerEvents: 'none', zIndex: 1,
                        }}
                        preserveAspectRatio="none"
                    >
                        <PowerGrid />
                        <PadRing />

                        {/* Routing lines */}
                        {ROUTING_LINES.map((l, i) => (
                            <line key={i}
                                x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                                stroke={l.color} strokeWidth={1.5}
                            />
                        ))}

                        {/* Die corner marks */}
                        <polyline points="2,20 2,2 20,2" fill="none" stroke="#00FF4140" strokeWidth={1} />
                        <polyline points="940,2 958,2 958,20" fill="none" stroke="#00FF4140" strokeWidth={1} />
                        <polyline points="2,580 2,598 20,598" fill="none" stroke="#00FF4140" strokeWidth={1} />
                        <polyline points="940,598 958,598 958,580" fill="none" stroke="#00FF4140" strokeWidth={1} />

                        {/* Die label */}
                        <text x="16" y="596" fill="#00FF4120" fontSize="7" fontFamily="monospace">
                            REVANTH_SOC_v1.0 // TSMC 7nm FF+ // DIE: 12.4mm × 8.6mm
                        </text>
                        <text x="750" y="12" fill="#00FF4118" fontSize="6" fontFamily="monospace">
                            UTIL: 72.1% | MACROS: 6 | VDD: 0.85V
                        </text>
                    </svg>

                    {/* Sub-module blocks */}
                    {CHIP_LAYOUT.map((block, i) => (
                        <ChipBlock key={block.id} block={block} onClick={setSelectedItem} index={i} />
                    ))}
                </div>

                {/* Info bar below the chip */}
                <div className="mt-4 flex justify-between text-xs font-mono" style={{ color: 'rgba(0,255,65,0.3)', userSelect: 'none', maxWidth: 960, margin: '12px auto 0' }}>
                    <span>DIE AREA: 12.4mm × 8.6mm</span>
                    <span>PROCESS: 7nm FF+</span>
                    <span>UTIL: 72.1%</span>
                    <span>MACROS: {PROJECTS.length + PATENTS.length}</span>
                </div>
            </div>

            {selectedItem && (
                <MacroModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </section>
    );
}
