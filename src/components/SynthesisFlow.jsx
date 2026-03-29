import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PIPELINE_STAGES = [
    {
        id: 'rtl',
        label: 'RTL INPUT',
        sublabel: 'Verilog / SystemVerilog',
        color: '#00FF41',
        icon: '// HDL',
        desc: 'Hardware Description\nLanguage Source',
        skills: ['Verilog', 'SystemVerilog', 'SystemC'],
        gate: '▷',
    },
    {
        id: 'verification',
        label: 'VERIFICATION',
        sublabel: 'UVM / Xcelium',
        color: '#FFB700',
        icon: '✓ VER',
        desc: 'Functional &\nFormal Verification',
        skills: ['UVM', 'Xcelium', 'QuestaSim'],
        gate: '▷',
    },
    {
        id: 'constraints',
        label: 'CONSTRAINTS',
        sublabel: 'Tcl / SDC',
        color: '#00D1FF',
        icon: '⊳ SDC',
        desc: 'Timing & Power\nConstraints',
        skills: ['Tcl Scripts', 'SDC Files', 'UPF'],
        gate: '▷',
    },
    {
        id: 'synthesis',
        label: 'SYNTHESIS',
        sublabel: 'Genus / Joules',
        color: '#BB86FC',
        icon: '⚙ SYN',
        desc: 'RTL-to-Gates\nMapping & Optimization',
        skills: ['Genus Synthesis', 'Joules RTL Power'],
        gate: '▷',
    },
    {
        id: 'lec',
        label: 'LOGIC SIGN-OFF',
        sublabel: 'Conformal LEC',
        color: '#FF6B6B',
        icon: '≡ LEC',
        desc: 'Logic Equivalence\nCheck & Sign-Off',
        skills: ['Conformal Equivalence Checker', 'ECO', 'CLP'],
        gate: null,
    },
];


const SKILLS_EXTENDED = [
    {
        category: 'Hardware',
        color: '#00FF41',
        items: [
            { name: 'Verilog' },
            { name: 'SystemVerilog' },
            { name: 'SystemC' },
            { name: 'C' },
            { name: 'Embedded C' },
        ],
    },
    {
        category: 'Scripting',
        color: '#00D1FF',
        items: [
            { name: 'Tcl' },
            { name: 'Python' },
        ],
    },
    {
        category: 'EDA Tools',
        color: '#BB86FC',
        items: [
            { name: 'Genus Synthesis' },
            { name: 'Joules RTL Power' },
            { name: 'Xcelium' },
            { name: 'QuestaSim' },
            { name: 'Conformal' },
        ],
    },
];

export default function SynthesisFlow() {
    const sectionRef = useRef(null);
    const pipelineRef = useRef(null);
    const stagesRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate pipeline stages on scroll
            stagesRef.current.forEach((stage, i) => {
                if (!stage) return;

                // Slide in from bottom
                gsap.fromTo(stage,
                    { opacity: 0, y: 60, scale: 0.9 },
                    {
                        opacity: 1, y: 0, scale: 1,
                        duration: 0.6,
                        delay: i * 0.15,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: pipelineRef.current,
                            start: 'top 75%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );

                // Pulsing border after entry
                gsap.to(stage.querySelector('.stage-border'), {
                    boxShadow: `0 0 20px ${PIPELINE_STAGES[i].color}44`,
                    borderColor: PIPELINE_STAGES[i].color,
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: i * 0.3,
                    scrollTrigger: {
                        trigger: pipelineRef.current,
                        start: 'top 75%',
                    },
                });
            });

            // Animate connecting arrows
            gsap.fromTo('.pipe-arrow',
                { opacity: 0, scaleX: 0 },
                {
                    opacity: 1, scaleX: 1,
                    duration: 0.4,
                    stagger: 0.2,
                    ease: 'power2.out',
                    transformOrigin: 'left center',
                    scrollTrigger: {
                        trigger: pipelineRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );

            // Header text animation
            gsap.fromTo('.synth-header',
                { opacity: 0, x: -40 },
                {
                    opacity: 1, x: 0,
                    duration: 0.7,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="synthesis"
            ref={sectionRef}
            className="min-h-screen py-24 pl-[190px] md:pl-[220px] relative"
            style={{ background: 'linear-gradient(to bottom, #050505, #030810, #050505)' }}
        >
            {/* Background grid */}
            <div className="absolute inset-0 floorplan-grid opacity-20" />

            <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
                {/* Section header */}
                <div className="synth-header mb-16">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-px bg-eda-green opacity-50" />
                        <span className="text-xs text-eda-green opacity-50 tracking-widest">MODULE: SYNTHESIS_FLOW</span>
                    </div>
                    <h2 className="text-3xl font-bold text-eda-green" style={{ textShadow: '0 0 12px rgba(0,255,65,0.4)', userSelect: 'none' }}>
                        Synthesis &amp; Verification Pipeline
                    </h2>
                    <p className="text-sm text-eda-blue opacity-60 mt-2">
            // RTL to Gates — Full Implementation Flow
                    </p>
                </div>

                {/* Pipeline diagram */}
                <div ref={pipelineRef} className="flex flex-col md:flex-row items-stretch gap-0 mb-20">
                    {PIPELINE_STAGES.map((stage, i) => (
                        <div key={stage.id} className="flex flex-col md:flex-row items-center flex-1">
                            {/* Stage block */}
                            <div
                                ref={el => stagesRef.current[i] = el}
                                className="flex-1 w-full"
                                style={{ opacity: 0 }}
                            >
                                <div
                                    className="stage-border border p-4 h-full flex flex-col gap-3 transition-all duration-300 hover:scale-105 cursor-default"
                                    style={{
                                        borderColor: `${stage.color}44`,
                                        background: `linear-gradient(135deg, ${stage.color}08, transparent)`,
                                        minHeight: '220px',
                                    }}
                                >
                                    {/* Stage icon / label */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold tracking-widest" style={{ color: stage.color }}>
                                            {stage.icon}
                                        </span>
                                        <span className="text-xs opacity-30" style={{ color: stage.color }}>
                                            0{i + 1}
                                        </span>
                                    </div>

                                    {/* Stage name */}
                                    <div style={{ userSelect: 'none' }}>
                                        <div className="font-bold text-sm" style={{ color: stage.color, textShadow: `0 0 6px ${stage.color}66` }}>
                                            {stage.label}
                                        </div>
                                        <div className="text-xs opacity-60 mt-0.5" style={{ color: stage.color }}>
                                            {stage.sublabel}
                                        </div>
                                    </div>

                                    {/* Gate symbol */}
                                    <div className="text-2xl" style={{ color: stage.color, opacity: 0.4 }}>
                                        {i === 0 ? '▭' : i === 1 ? '◉' : i === 2 ? '⊕' : '✓'}
                                    </div>

                                    {/* Description */}
                                    <div className="text-xs opacity-50 leading-relaxed whitespace-pre-line flex-1" style={{ color: stage.color }}>
                                        {stage.desc}
                                    </div>

                                    {/* Skills chips */}
                                    <div className="flex flex-wrap gap-1 mt-auto">
                                        {stage.skills.map(s => (
                                            <span
                                                key={s}
                                                className="text-xs px-2 py-0.5 border"
                                                style={{
                                                    borderColor: `${stage.color}44`,
                                                    color: stage.color,
                                                    fontSize: '0.6rem',
                                                    background: `${stage.color}11`,
                                                }}
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Arrow connector */}
                            {i < PIPELINE_STAGES.length - 1 && (
                                <div
                                    className="pipe-arrow flex-shrink-0 mx-1 md:mx-0 my-2 md:my-0"
                                    style={{ opacity: 0, transform: 'scaleX(0)' }}
                                >
                                    {/* Horizontal on desktop */}
                                    <div className="hidden md:flex items-center">
                                        <div style={{ width: '24px', height: '1px', background: '#00FF41', boxShadow: '0 0 4px #00FF41' }} />
                                        <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid #00FF41', filter: 'drop-shadow(0 0 3px #00FF41)' }} />
                                    </div>
                                    {/* Vertical on mobile */}
                                    <div className="flex md:hidden justify-center">
                                        <div style={{ width: '1px', height: '20px', background: '#00FF41', boxShadow: '0 0 4px #00FF41' }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mb-8">
                    <h3 className="text-base font-bold mb-8 tracking-widest" style={{ color: 'rgba(0,255,65,0.6)', userSelect: 'none' }}>
                        // Technical Competencies
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {SKILLS_EXTENDED.map(({ category, items, color }) => (
                            <div key={category}
                                className="border p-5 relative"
                                style={{ borderColor: `${color}33`, background: `${color}03` }}>
                                
                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: color, opacity: 0.5 }} />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: color, opacity: 0.5 }} />

                                <div className="text-xs font-bold mb-5 tracking-widest flex items-center gap-2" style={{ color, userSelect: 'none' }}>
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                                    {category.toUpperCase()}
                                </div>
                                
                                <div className="flex flex-col gap-2.5">
                                    {items.map(({ name }) => (
                                        <div key={name} 
                                             className="group flex items-center relative p-2.5 border transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                                             style={{ 
                                                 borderColor: `${color}15`, 
                                                 background: `linear-gradient(90deg, ${color}08, transparent)`
                                             }}>
                                            
                                            {/* Edge Pin Component */}
                                            <div className="absolute -left-[1px] w-[2px] h-[30%] transition-all duration-300 group-hover:h-[70%]" 
                                                 style={{ background: color, boxShadow: `0 0 8px ${color}` }} />

                                            {/* Connecting node */}
                                            <div className="w-1.5 h-1.5 border mr-3 ml-2 transition-transform duration-300 group-hover:scale-150 group-hover:bg-opacity-100" 
                                                 style={{ borderColor: color, background: `${color}20` }} />
                                            
                                            {/* Skill Text */}
                                            <span style={{ 
                                                fontSize: '0.75rem', 
                                                color: `${color}ea`, 
                                                letterSpacing: '0.05em',
                                                userSelect: 'none',
                                            }}>
                                                {name}
                                            </span>
                                            
                                            {/* Background tech pattern on hover */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300"
                                                 style={{
                                                     backgroundImage: `repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 1px, transparent 10px)`
                                                 }} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
