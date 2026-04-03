import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const EXPERIENCES = [
    {
        signal: 'intern_en',
        label: 'APP_ENG_INTERN',
        company: 'Cadence Design Systems',
        role: 'Application Engineer Intern',
        startYear: 2022.67, // Sep 2022
        endYear: 2023.5,   // Jun 2023
        color: '#00FF41',
        details: [
            'Assisted with RTL synthesis and power analysis worldwide',
            'Supported Genus Synthesis flows across global customers',
            'Developed expertise in SystemVerilog and Tcl scripting',
        ],
        period: 'Sep 2022 – Jun 2023',
    },
    {
        signal: 'consultant_en',
        label: 'CORP_CONSULTANT',
        company: 'Cadence Design Systems',
        role: 'Corporate Consultant',
        startYear: 2023.5,
        endYear: 2023.83,  // Nov 2023
        color: '#00D1FF',
        details: [
            'Supported Genus and Joules tools',
            'Delivered customer trainings & authored AppNotes',
            'Cross-regional technical consulting',
        ],
        period: 'Jul 2023 – Nov 2023',
    },
    {
        signal: 'senior_ae_en',
        label: 'SENIOR_AE',
        company: 'Cadence Design Systems',
        role: 'Senior Application Engineer',
        startYear: 2023.83,
        endYear: 2026.17, // Present (2026.17 ≈ Mar 2026)
        color: '#BB86FC',
        details: [
            'Customer enablement for Genus Synthesis and Joules RTL Power',
            'Deployed bottom-up flows for large hierarchical designs',
            'Resolved 300+ synthesis & power cases globally',
            'Conducts training programs for global teams',
        ],
        period: 'Nov 2023 – Present',
    },
];

const START_YEAR = 2022;
const END_YEAR = 2027;
const TOTAL_YEARS = END_YEAR - START_YEAR;

function yearToPercent(year) {
    return ((year - START_YEAR) / TOTAL_YEARS) * 100;
}

export default function WaveformTimeline() {
    const containerRef = useRef(null);
    const [mouseX, setMouseX] = useState(null);
    const [cursorYear, setCursorYear] = useState(null);
    const [hoveredExp, setHoveredExp] = useState(null);
    const [containerRect, setContainerRect] = useState(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const updateRect = () => setContainerRect(el.getBoundingClientRect());
        updateRect();
        window.addEventListener('resize', updateRect);
        return () => window.removeEventListener('resize', updateRect);
    }, []);

    const handleMouseMove = (e) => {
        if (!containerRect) return;
        const relX = e.clientX - containerRect.left;
        const pct = Math.max(0, Math.min(100, (relX / containerRect.width) * 100));
        const year = START_YEAR + (pct / 100) * TOTAL_YEARS;
        setMouseX(relX);
        setCursorYear(year);

        // Find which experience is hovered
        const found = EXPERIENCES.find(exp => year >= exp.startYear && year <= exp.endYear);
        setHoveredExp(found || null);
    };

    const handleMouseLeave = () => {
        setMouseX(null);
        setCursorYear(null);
        setHoveredExp(null);
    };

    const yearTicks = [];
    for (let y = START_YEAR; y <= END_YEAR; y++) {
        yearTicks.push(y);
    }

    return (
        <section
            id="waveform"
            className="min-h-screen py-24 pl-0 md:pl-[220px] relative overflow-hidden"
            style={{ background: 'linear-gradient(to bottom, #050505, #030508, #050505)' }}
        >
            <div className="absolute inset-0 floorplan-grid opacity-20" />

            <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-px bg-eda-green opacity-50" />
                        <span className="text-xs text-eda-green opacity-50 tracking-widest">MODULE: WAVEFORM_VIEWER</span>
                    </div>
                    <h2 className="text-3xl font-bold text-eda-green eda-glow-green">
                        Experience Timeline
                    </h2>
                    <p className="text-sm text-eda-blue opacity-60 mt-2">
            // GTKWave Simulation — Signal Activity
                    </p>
                </motion.div>

                {/* GTKWave window */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="border"
                    style={{ borderColor: 'rgba(0,255,65,0.3)', background: '#020202' }}
                >
                    {/* GTKWave toolbar */}
                    <div className="flex items-center gap-3 px-4 py-2 border-b"
                        style={{ borderColor: 'rgba(0,255,65,0.15)', background: 'rgba(0,0,0,0.5)' }}>
                        <div className="flex gap-1">
                            {['#FF5555', '#FFB700', '#00FF41'].map((c, i) => (
                                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                            ))}
                        </div>
                        <span className="text-xs opacity-40 ml-2">gtkwave — cadence_career_sim.vcd</span>
                        <div className="hidden sm:flex ml-auto gap-4 text-xs opacity-30">
                            <span>Zoom: 100%</span>
                            <span>Cursor: {cursorYear ? cursorYear.toFixed(2) : '--'}</span>
                            <span>Time: 2022–2026</span>
                        </div>
                    </div>

                    {/* Signal pane + waveform area */}
                    <div className="flex">
                        {/* Signal names (left panel) */}
                        <div className="border-r flex-shrink-0 w-20 md:w-40" style={{ borderColor: 'rgba(0,255,65,0.15)' }}>
                            <div className="h-8 border-b flex items-center px-2"
                                style={{ borderColor: 'rgba(0,255,65,0.15)', background: 'rgba(0,0,0,0.3)' }}>
                                <span className="text-xs opacity-30">SIGNAL</span>
                            </div>
                            {EXPERIENCES.map(exp => (
                                <div
                                    key={exp.signal}
                                    className="h-16 border-b flex items-center px-3"
                                    style={{ borderColor: 'rgba(0,255,65,0.1)' }}
                                >
                                    <div>
                                        <div className="text-xs font-mono" style={{ color: exp.color, fontSize: '0.65rem' }}>
                                            {exp.signal}
                                        </div>
                                        <div className="text-xs opacity-40" style={{ color: exp.color, fontSize: '0.55rem' }}>
                                            [1:0]
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Waveform area */}
                        <div
                            ref={containerRef}
                            className="flex-1 relative"
                            style={{ minHeight: '240px' }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Time axis header */}
                            <div className="h-8 border-b relative" style={{ borderColor: 'rgba(0,255,65,0.15)' }}>
                                {yearTicks.map(y => (
                                    <div
                                        key={y}
                                        className="absolute top-0 h-full flex items-center"
                                        style={{ left: `${yearToPercent(y)}%` }}
                                    >
                                        <div className="w-px h-2 mt-auto mb-0" style={{ background: 'rgba(0,255,65,0.3)' }} />
                                        <span className="absolute top-1 text-xs ml-1 opacity-40" style={{ fontSize: '0.55rem', color: '#00FF41', transform: 'translateX(-50%)' }}>
                                            {y}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Signal waveforms */}
                            {EXPERIENCES.map((exp) => {
                                const startPct = yearToPercent(exp.startYear);
                                const endPct = yearToPercent(exp.endYear);
                                const width = endPct - startPct;

                                return (
                                    <div
                                        key={exp.signal}
                                        className="h-16 border-b relative flex items-center"
                                        style={{ borderColor: 'rgba(0,255,65,0.1)' }}
                                    >
                                        {/* Baseline (LOW) */}
                                        <div
                                            className="absolute"
                                            style={{
                                                left: 0,
                                                right: 0,
                                                height: '1px',
                                                top: '75%',
                                                background: `${exp.color}22`,
                                            }}
                                        />

                                        {/* Square wave block (HIGH) */}
                                        <motion.div
                                            className="absolute"
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                                            style={{
                                                left: `${startPct}%`,
                                                width: `${width}%`,
                                                top: '20%',
                                                height: '40%',
                                                background: `${exp.color}22`,
                                                borderTop: `2px solid ${exp.color}`,
                                                borderLeft: `2px solid ${exp.color}`,
                                                borderRight: `2px solid ${exp.color}`,
                                                boxShadow: `0 0 8px ${exp.color}44`,
                                                transformOrigin: 'left center',
                                            }}
                                        />

                                        {/* Label inside wave */}
                                        <div
                                            className="absolute font-mono"
                                            style={{
                                                left: `${startPct + 0.5}%`,
                                                top: '28%',
                                                fontSize: '0.5rem',
                                                color: exp.color,
                                                opacity: 0.7,
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            {exp.label}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Cursor line */}
                            {mouseX !== null && (
                                <div
                                    className="waveform-cursor"
                                    style={{ left: `${mouseX}px` }}
                                />
                            )}

                            {/* Tooltip on hover */}
                            {hoveredExp && mouseX !== null && (
                                <div
                                    className="absolute z-20 border p-3 pointer-events-none"
                                    style={{
                                        left: `${Math.min(mouseX + 12, (containerRect?.width || 300) - 200)}px`,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        borderColor: hoveredExp.color,
                                        background: '#020202',
                                        boxShadow: `0 0 15px ${hoveredExp.color}33`,
                                        minWidth: '180px',
                                    }}
                                >
                                    <div className="font-bold text-xs mb-1" style={{ color: hoveredExp.color, fontSize: '0.7rem' }}>
                                        {hoveredExp.role}
                                    </div>
                                    <div className="text-xs mb-2 opacity-60" style={{ color: hoveredExp.color, fontSize: '0.6rem' }}>
                                        {hoveredExp.period}
                                    </div>
                                    {hoveredExp.details.map((d, i) => (
                                        <div key={i} className="text-xs mb-0.5 flex gap-1" style={{ color: `${hoveredExp.color}aa`, fontSize: '0.6rem' }}>
                                            <span style={{ color: hoveredExp.color }}>▸</span>{d}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status bar */}
                    <div className="flex justify-between px-4 py-1 border-t text-xs opacity-30"
                        style={{ borderColor: 'rgba(0,255,65,0.15)' }}>
                        <span>3 signals loaded</span>
                        <span>cadence_career_sim.vcd</span>
                        <span>Time range: 2022–2026+</span>
                    </div>
                </motion.div>

                {/* Role cards below */}
                <div className="grid md:grid-cols-3 gap-4 mt-8">
                    {EXPERIENCES.map(exp => (
                        <motion.div
                            key={exp.signal}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="border p-4"
                            style={{
                                borderColor: `${exp.color}33`,
                                background: `${exp.color}06`,
                            }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full" style={{ background: exp.color, boxShadow: `0 0 6px ${exp.color}` }} />
                                <span className="text-xs tracking-widest" style={{ color: exp.color, fontSize: '0.65rem' }}>{exp.label}</span>
                            </div>
                            <div className="font-bold text-sm mb-1" style={{ color: exp.color }}>{exp.role}</div>
                            <div className="text-xs mb-3 opacity-60" style={{ color: exp.color }}>{exp.period}</div>
                            {exp.details.map((d, i) => (
                                <div key={i} className="text-xs mb-1 flex gap-1" style={{ color: `${exp.color}99`, fontSize: '0.65rem' }}>
                                    <span style={{ color: exp.color }}>▸</span>{d}
                                </div>
                            ))}
                        </motion.div>
                    ))}
                </div>

                {/* Education block */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-8 border p-4"
                    style={{ borderColor: 'rgba(0,255,65,0.2)', background: 'rgba(0,255,65,0.03)' }}
                >
                    <div className="text-xs opacity-40 mb-2 tracking-widest">// EDUCATION_REG</div>
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <div className="text-eda-green font-bold">B.Tech — Electronics &amp; Communication Engineering</div>
                            <div className="text-sm text-eda-blue opacity-70 mt-1">Vellore Institute of Technology – AP</div>
                        </div>
                        <div className="text-right">
                            <div className="text-eda-green font-bold">CGPA: 8.5</div>
                            <div className="text-xs opacity-50 mt-1">2018 – 2022</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
