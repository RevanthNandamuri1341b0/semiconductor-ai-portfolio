import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Key Attributes data ───────────────────────────────────────────────────────
const KEY_ATTRIBUTES = [
    {
        id: 'adaptability',
        addr: '0x00',
        label: 'ADAPTABILITY',
        icon: '⟳',
        color: '#00FF41',
        detail: 'Rapidly context-switches across domains, tool flows & customer environments without loss of productivity.',
        level: 92,
    },
    {
        id: 'communication',
        addr: '0x01',
        label: 'COMMUNICATION',
        icon: '⌘',
        color: '#00D1FF',
        detail: 'Translates complex EDA concepts to diverse audiences — from RTL engineers to executive stakeholders.',
        level: 88,
    },
    {
        id: 'attention',
        addr: '0x02',
        label: 'ATTENTION\nTO DETAIL',
        icon: '◎',
        color: '#BB86FC',
        detail: 'Precision debugging at gate, RTL & architecture levels — finds the one mis-inferred register in 2M gates.',
        level: 95,
    },
    {
        id: 'selflearning',
        addr: '0x03',
        label: 'SELF-LEARNING',
        icon: '↑',
        color: '#FFB700',
        detail: 'Self-driven upskilling across ML arch, power analysis, Tcl scripting — evidenced by 3 filed patents.',
        level: 90,
    },
    {
        id: 'reverse',
        addr: '0x04',
        label: 'REVERSE\nENGINEERING',
        icon: '⇌',
        color: '#FF4466',
        detail: 'Decomposes black-box tool internals and legacy flows to root-cause obscure P1 customer failures.',
        level: 93,
    },
    {
        id: 'decision',
        addr: '0x05',
        label: 'CRITICAL\nDECISION MAKING',
        icon: '⊕',
        color: '#00FF41',
        detail: 'High-confidence judgment under escalation pressure: P1 triage, ECO path selection, PPA trade-offs.',
        level: 87,
    },
];

// ── Hobbies / Activities data ─────────────────────────────────────────────────
const HOBBIES = [
    {
        id: 'football',
        addr: '0x00',
        label: 'FOOTBALL',
        icon: '⚽',
        color: '#00FF41',
        detail: 'Team dynamics and split-second tactical decisions — sharpens coordination and reading the field under pressure.',
    },
    {
        id: 'badminton',
        addr: '0x01',
        label: 'BADMINTON',
        icon: '🏸',
        color: '#00D1FF',
        detail: 'Reflexes, spatial awareness, and rapid course-correction — direct analogues to real-time debug triage.',
    },
    {
        id: 'cuisines',
        addr: '0x02',
        label: 'DISCOVERING\nCUISINES',
        icon: '🍜',
        color: '#BB86FC',
        detail: 'Exploring global food cultures — broadens perspective and fuels the curiosity that drives engineering creativity.',
    },
    {
        id: 'motorbike',
        addr: '0x03',
        label: 'MOTORBIKE\nTRAVEL',
        icon: '🏍',
        color: '#FFB700',
        detail: 'Long-distance rides demanding route planning, mechanical awareness, and calm decision-making under fatigue.',
    },
    {
        id: 'reading',
        addr: '0x04',
        label: 'TECHNICAL\nREADING',
        icon: '📚',
        color: '#FF4466',
        detail: 'Deep dives into EDA literature, AI/ML papers, and systems architecture — continuous knowledge compound interest.',
    },
    {
        id: 'problemsolving',
        addr: '0x05',
        label: 'DOMESTIC\nPROBLEM SOLVING',
        icon: '🧩',
        color: '#00D1FF',
        detail: 'Applying engineering first-principles to everyday challenges — the same root-cause instinct, different domain.',
    },
];

// ── Sub-sub block: individual chip cell ──────────────────────────────────────
function ChipCell({ item, showLevel }) {
    const [active, setActive] = useState(false);

    return (
        <div className="relative">
            {/* Cell block */}
            <motion.div
                onClick={() => setActive(a => !a)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
                className="cursor-pointer relative p-3 border select-none"
                style={{
                    borderColor: active ? `${item.color}88` : `${item.color}28`,
                    background: active ? `${item.color}12` : `${item.color}06`,
                    boxShadow: active ? `0 0 14px ${item.color}20` : 'none',
                    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                    minHeight: 72,
                }}
            >
                {/* Corner accent TL */}
                <div className="absolute top-0 left-0 w-3 h-3 pointer-events-none"
                    style={{ borderTop: `1px solid ${item.color}60`, borderLeft: `1px solid ${item.color}60` }} />
                {/* Corner accent BR */}
                <div className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none"
                    style={{ borderBottom: `1px solid ${item.color}60`, borderRight: `1px solid ${item.color}60` }} />

                {/* Addr badge */}
                <div style={{
                    fontSize: '0.45rem',
                    color: `${item.color}50`,
                    fontFamily: '"Fira Code", monospace',
                    marginBottom: 4,
                    letterSpacing: '0.08em',
                }}>
                    {item.addr}
                </div>

                {/* Icon + label */}
                <div className="flex items-start gap-2">
                    <span style={{ fontSize: '1rem', lineHeight: 1, flexShrink: 0, marginTop: 1 }}>
                        {item.icon}
                    </span>
                    <div
                        style={{
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            fontFamily: '"Fira Code", monospace',
                            color: active ? item.color : `${item.color}85`,
                            letterSpacing: '0.07em',
                            lineHeight: 1.35,
                            transition: 'color 0.2s',
                            whiteSpace: 'pre-line',
                        }}
                    >
                        {item.label}
                    </div>
                </div>

                {/* Active indicator dot */}
                {active && (
                    <div
                        className="absolute top-2 right-2"
                        style={{
                            width: 5, height: 5,
                            borderRadius: '50%',
                            background: item.color,
                            boxShadow: `0 0 6px ${item.color}`,
                        }}
                    />
                )}
            </motion.div>

            {/* Expanded detail panel */}
            <AnimatePresence initial={false}>
                {active && (
                    <motion.div
                        key="detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div
                            className="px-3 pt-2 pb-3 border border-t-0"
                            style={{
                                borderColor: `${item.color}22`,
                                background: `${item.color}05`,
                            }}
                        >
                            <p style={{
                                fontSize: '0.58rem',
                                color: 'rgba(255,255,255,0.45)',
                                fontFamily: '"Fira Code", monospace',
                                lineHeight: 1.65,
                                marginBottom: showLevel ? 8 : 0,
                            }}>
                                {item.detail}
                            </p>

                            {/* Proficiency bar — Key Attributes only */}
                            {showLevel && item.level !== undefined && (
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span style={{ fontSize: '0.45rem', color: `${item.color}50`, fontFamily: '"Fira Code", monospace', letterSpacing: '0.1em' }}>
                                            PROFICIENCY
                                        </span>
                                        <span style={{ fontSize: '0.45rem', color: `${item.color}70`, fontFamily: '"Fira Code", monospace' }}>
                                            {item.level}%
                                        </span>
                                    </div>
                                    <div style={{ height: 2, background: `${item.color}18`, borderRadius: 1 }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.level}%` }}
                                            transition={{ duration: 0.75, ease: 'easeOut' }}
                                            style={{
                                                height: '100%',
                                                background: item.color,
                                                borderRadius: 1,
                                                boxShadow: `0 0 5px ${item.color}70`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Sub-block: module panel containing a grid of chip cells ──────────────────
function ModuleBlock({ moduleAddr, moduleId, title, subtitle, items, accentColor, showLevel }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border"
            style={{
                borderColor: `${accentColor}28`,
                background: `rgba(3,3,8,0.7)`,
            }}
        >
            {/* ── Sub-block header ── */}
            <div
                className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: `${accentColor}18` }}
            >
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span style={{ fontSize: '0.48rem', color: 'rgba(0,209,255,0.45)', fontFamily: '"Fira Code", monospace' }}>
                            {moduleAddr}
                        </span>
                        <div style={{ height: 1, width: 20, background: `${accentColor}22` }} />
                        <span style={{ fontSize: '0.45rem', color: `${accentColor}40`, fontFamily: '"Fira Code", monospace', letterSpacing: '0.14em' }}>
                            SUB_MODULE
                        </span>
                    </div>
                    <h3 style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: accentColor,
                        fontFamily: '"Fira Code", monospace',
                        letterSpacing: '0.1em',
                        userSelect: 'none',
                        textShadow: `0 0 10px ${accentColor}35`,
                    }}>
                        {title}
                    </h3>
                    <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.25)', marginTop: 3, fontFamily: '"Fira Code", monospace' }}>
                        // {subtitle}
                    </p>
                </div>
                <div style={{
                    padding: '3px 8px',
                    border: `1px solid ${accentColor}22`,
                    background: `${accentColor}07`,
                    fontSize: '0.48rem',
                    color: `${accentColor}55`,
                    fontFamily: '"Fira Code", monospace',
                    letterSpacing: '0.08em',
                    flexShrink: 0,
                }}>
                    {moduleId} · INST:{String(items.length).padStart(2, '0')}
                </div>
            </div>

            {/* ── 2-col grid of sub-sub blocks ── */}
            <div className="p-4 grid grid-cols-2 gap-3">
                {items.map(item => (
                    <ChipCell key={item.id} item={item} showLevel={showLevel} />
                ))}
            </div>

            {/* ── Sub-block footer ── */}
            <div
                className="px-4 py-2 border-t flex items-center justify-between"
                style={{ borderColor: `${accentColor}10` }}
            >
                <span style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.14)', fontFamily: '"Fira Code", monospace' }}>
                    // click any cell to expand descriptor
                </span>
                <span style={{ fontSize: '0.45rem', color: `${accentColor}28`, fontFamily: '"Fira Code", monospace' }}>
                    CELLS: {items.length} · DEPTH: 2
                </span>
            </div>
        </motion.div>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// AttributesHobbies — top-level container, exported for AiAccelerator
// ═════════════════════════════════════════════════════════════════════════════
export default function AttributesHobbies() {
    return (
        <div className="w-full mt-6">
            {/* ── Parent label ── */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-px bg-eda-blue opacity-40" />
                <span className="text-xs text-eda-blue opacity-40 tracking-widest" style={{ fontFamily: '"Fira Code", monospace' }}>
                    // SUB-MODULE: PERSONAL_IP · KEY_ATTR + ACTIVITIES
                </span>
            </div>

            {/* ── Two sub-blocks side by side ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ModuleBlock
                    moduleAddr="0x20"
                    moduleId="KEY_ATTR_v1"
                    title="KEY_ATTRIBUTES"
                    subtitle="Core competencies driving professional excellence"
                    items={KEY_ATTRIBUTES}
                    accentColor="#00FF41"
                    showLevel={true}
                />
                <ModuleBlock
                    moduleAddr="0x21"
                    moduleId="ACTIVITIES"
                    title="HOBBIES &amp; ACTIVITIES"
                    subtitle="Personal IP blocks — interests that shape lateral thinking"
                    items={HOBBIES}
                    accentColor="#00D1FF"
                    showLevel={false}
                />
            </div>
        </div>
    );
}
