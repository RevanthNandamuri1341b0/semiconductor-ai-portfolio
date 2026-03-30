import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// ── Key Attributes ────────────────────────────────────────────────────────────
const KEY_ATTRIBUTES = [
    {
        id: 'adaptability',
        addr: '0x00',
        signal: 'attr_adapt',
        label: 'ADAPTABILITY',
        detail: 'Rapidly context-switches across customer environments, tool flows, EDA domains, and technical stacks without loss of productivity or accuracy.',
        tags: ['Cross-functional', 'Multi-domain', 'Agile'],
        level: 92,
        color: '#00FF41',
    },
    {
        id: 'communication',
        addr: '0x01',
        signal: 'attr_comm',
        label: 'COMMUNICATION',
        detail: 'Translates complex EDA and silicon concepts into clear, audience-calibrated explanations — from RTL engineers to executive stakeholders and global customers.',
        tags: ['Technical Writing', 'AppNotes', 'Customer-Facing'],
        level: 88,
        color: '#00D1FF',
    },
    {
        id: 'attention',
        addr: '0x02',
        signal: 'attr_detail',
        label: 'ATTENTION TO DETAIL',
        detail: 'Precision-level debugging from gate netlist artifacts to RTL coding style issues — locates the one mis-inferred register in a 2-million-gate design.',
        tags: ['Root-cause', 'Gate-level Debug', 'QA'],
        level: 95,
        color: '#BB86FC',
    },
    {
        id: 'selflearning',
        addr: '0x03',
        signal: 'attr_learn',
        label: 'SELF-LEARNING',
        detail: 'Self-driven skill acquisition across ML accelerator architecture, advanced RTL power analysis, Tcl scripting, and emerging EDA methodologies — evidenced by 3 filed patents.',
        tags: ['R&D', 'Patents', 'Continuous Upskilling'],
        level: 90,
        color: '#FFB700',
    },
    {
        id: 'reverse',
        addr: '0x04',
        signal: 'attr_rev_eng',
        label: 'REVERSE ENGINEERING',
        detail: 'Systematically decomposes black-box tool internals, undocumented synthesis flows, and legacy scripts to root-cause obscure P1 customer failures.',
        tags: ['Tool Internals', 'ECO', 'Flow Debug'],
        level: 93,
        color: '#FF4466',
    },
    {
        id: 'decision',
        addr: '0x05',
        signal: 'attr_decision',
        label: 'CRITICAL DECISION MAKING',
        detail: 'High-confidence judgment under escalation pressure: triaging P1 bugs, selecting synthesis knobs under PPA trade-offs, and prioritising ECO paths to tape-out.',
        tags: ['Escalation Mgmt', 'Triage', 'PPA Trade-offs'],
        level: 87,
        color: '#00FF41',
    },
];

// ── Hobbies ───────────────────────────────────────────────────────────────────
const HOBBIES = [
    {
        id: 'fpga',
        addr: '0x00',
        signal: 'hob_fpga',
        label: 'FPGA PROTOTYPING',
        detail: 'Designing and flashing custom logic cores on Xilinx/Intel FPGAs — a natural extension of professional synthesis work into personal hardware exploration.',
        tags: ['Vivado', 'VHDL', 'Hardware Hacking'],
        color: '#00FF41',
        icon: '⚙',
    },
    {
        id: 'cricket',
        addr: '0x01',
        signal: 'hob_cricket',
        label: 'CRICKET',
        detail: 'Team sport that sharpens situational awareness, strategy under pressure, and collaborative decision-making — skills that translate directly to engineering leadership.',
        tags: ['Team Sport', 'Strategy', 'Leadership'],
        color: '#00D1FF',
        icon: '◎',
    },
    {
        id: 'music',
        addr: '0x02',
        signal: 'hob_music',
        label: 'MUSIC — CARNATIC / GUITAR',
        detail: 'Classical Carnatic vocals and guitar — structured musical theory as a creative counterbalance to analytical rigor, and an exercise in disciplined practice.',
        tags: ['Carnatic', 'Guitar', 'Creative'],
        color: '#BB86FC',
        icon: '♪',
    },
    {
        id: 'travel',
        addr: '0x03',
        signal: 'hob_travel',
        label: 'TRAVEL & EXPLORATION',
        detail: 'Exploring global semiconductor hubs, tech ecosystems, and local cultures — broadens perspective on how silicon products impact society at scale.',
        tags: ['Global Mindset', 'Networking', 'Culture'],
        color: '#FFB700',
        icon: '✈',
    },
    {
        id: 'chess',
        addr: '0x04',
        signal: 'hob_chess',
        label: 'CHESS & STRATEGY GAMES',
        detail: 'Competitive chess for multi-step lookahead, pattern recognition under time constraints, and opponent-modelling — the analogue of timing closure under deadline.',
        tags: ['Pattern Recog.', 'Planning', 'Competitive'],
        color: '#FF4466',
        icon: '♟',
    },
];

// ═════════════════════════════════════════════════════════════════════════════
// HierarchyNode — a single expandable leaf in the tree
// ═════════════════════════════════════════════════════════════════════════════
function HierarchyNode({ item, isLast }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            {/* Trunk continuation line (hidden for last item) */}
            {!isLast && (
                <div
                    className="absolute"
                    style={{
                        left: '3px',
                        top: '26px',
                        bottom: 0,
                        width: '1px',
                        background: `${item.color}18`,
                    }}
                />
            )}

            {/* ── Node row ── */}
            <div
                className="flex items-center gap-0 cursor-pointer group select-none"
                onClick={() => setOpen(o => !o)}
            >
                {/* L-shaped branch connector */}
                <div className="flex-shrink-0" style={{ width: 22, paddingTop: 2 }}>
                    <svg width="22" height="26" style={{ display: 'block' }}>
                        <line x1="3" y1="0" x2="3" y2="13" stroke={`${item.color}30`} strokeWidth="1" />
                        <line x1="3" y1="13" x2="20" y2="13" stroke={`${item.color}30`} strokeWidth="1" />
                    </svg>
                </div>

                {/* Diamond node marker */}
                <div
                    className="flex-shrink-0 mr-2"
                    style={{
                        width: 8,
                        height: 8,
                        border: `1px solid ${item.color}`,
                        background: open ? item.color : 'transparent',
                        transform: 'rotate(45deg)',
                        transition: 'background 0.2s',
                        boxShadow: open ? `0 0 6px ${item.color}80` : 'none',
                    }}
                />

                {/* Address + signal + label */}
                <div className="flex items-baseline gap-2 flex-1 py-2">
                    <span
                        style={{
                            fontSize: '0.5rem',
                            color: 'rgba(0,209,255,0.45)',
                            fontFamily: '"Fira Code", monospace',
                            flexShrink: 0,
                        }}
                    >
                        {item.addr}
                    </span>
                    <span
                        style={{
                            fontSize: '0.65rem',
                            fontWeight: open ? 600 : 400,
                            fontFamily: '"Fira Code", monospace',
                            color: open ? item.color : `${item.color}70`,
                            letterSpacing: '0.07em',
                            transition: 'all 0.2s',
                        }}
                    >
                        {item.label}
                    </span>
                    {item.icon && (
                        <span style={{ fontSize: '0.65rem', opacity: 0.35 }}>{item.icon}</span>
                    )}
                    <span
                        style={{
                            fontSize: '0.47rem',
                            color: 'rgba(255,255,255,0.18)',
                            fontFamily: '"Fira Code", monospace',
                            marginLeft: 'auto',
                            flexShrink: 0,
                        }}
                    >
                        [{item.signal}]
                    </span>
                </div>

                {/* Chevron */}
                <motion.div
                    animate={{ rotate: open ? 90 : 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ color: `${item.color}50`, flexShrink: 0, marginLeft: 4 }}
                >
                    <ChevronRight size={10} />
                </motion.div>
            </div>

            {/* ── Expanded sub-module ── */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div
                            style={{
                                marginLeft: 38,
                                marginBottom: 8,
                                paddingLeft: 12,
                                borderLeft: `1px solid ${item.color}20`,
                                paddingTop: 6,
                                paddingBottom: 8,
                            }}
                        >
                            {/* Sub-module header */}
                            <div
                                style={{
                                    fontSize: '0.48rem',
                                    color: `${item.color}50`,
                                    fontFamily: '"Fira Code", monospace',
                                    letterSpacing: '0.1em',
                                    marginBottom: 6,
                                }}
                            >
                                // {item.id.toUpperCase()}_DESC
                            </div>

                            {/* Detail text */}
                            <p
                                style={{
                                    fontSize: '0.62rem',
                                    color: 'rgba(255,255,255,0.48)',
                                    lineHeight: 1.65,
                                    marginBottom: 10,
                                    fontFamily: '"Fira Code", monospace',
                                }}
                            >
                                {item.detail}
                            </p>

                            {/* Proficiency bar (Key Attributes only) */}
                            {item.level !== undefined && (
                                <div style={{ marginBottom: 10 }}>
                                    <div className="flex justify-between" style={{ marginBottom: 4 }}>
                                        <span style={{ fontSize: '0.48rem', color: `${item.color}50`, fontFamily: '"Fira Code", monospace', letterSpacing: '0.1em' }}>
                                            PROFICIENCY
                                        </span>
                                        <span style={{ fontSize: '0.48rem', color: `${item.color}70`, fontFamily: '"Fira Code", monospace' }}>
                                            {item.level}%
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            height: 2,
                                            background: `${item.color}15`,
                                            borderRadius: 1,
                                        }}
                                    >
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.level}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                                            style={{
                                                height: '100%',
                                                background: item.color,
                                                borderRadius: 1,
                                                boxShadow: `0 0 6px ${item.color}60`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5">
                                {item.tags.map(tag => (
                                    <span
                                        key={tag}
                                        style={{
                                            fontSize: '0.5rem',
                                            padding: '2px 7px',
                                            border: `1px solid ${item.color}28`,
                                            color: `${item.color}65`,
                                            fontFamily: '"Fira Code", monospace',
                                            letterSpacing: '0.05em',
                                            background: `${item.color}06`,
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// HierarchyModule — the full tree panel (Key Attributes or Hobbies)
// ═════════════════════════════════════════════════════════════════════════════
function HierarchyModule({ moduleAddr, moduleId, title, subtitle, items, accentColor }) {
    const [allOpen, setAllOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border"
            style={{
                borderColor: `${accentColor}22`,
                background: `${accentColor}04`,
            }}
        >
            {/* ── Module header ── */}
            <div
                className="px-4 py-3 border-b flex items-start justify-between"
                style={{ borderColor: `${accentColor}18` }}
            >
                <div>
                    {/* Addr + module tag */}
                    <div className="flex items-center gap-2 mb-1.5">
                        <span style={{ fontSize: '0.5rem', color: 'rgba(0,209,255,0.5)', fontFamily: '"Fira Code", monospace' }}>
                            {moduleAddr}
                        </span>
                        <div style={{ height: 1, width: 24, background: `${accentColor}25` }} />
                        <span style={{ fontSize: '0.47rem', color: `${accentColor}40`, fontFamily: '"Fira Code", monospace', letterSpacing: '0.12em' }}>
                            HIER_MODULE
                        </span>
                    </div>

                    {/* Module title */}
                    <h3
                        style={{
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: accentColor,
                            fontFamily: '"Fira Code", monospace',
                            letterSpacing: '0.1em',
                            userSelect: 'none',
                            textShadow: `0 0 10px ${accentColor}40`,
                        }}
                    >
                        {title}
                    </h3>

                    {/* Subtitle */}
                    {subtitle && (
                        <p style={{ fontSize: '0.54rem', color: 'rgba(255,255,255,0.28)', marginTop: 4, fontFamily: '"Fira Code", monospace' }}>
                            // {subtitle}
                        </p>
                    )}
                </div>

                {/* Instance count badge */}
                <div
                    style={{
                        padding: '3px 8px',
                        border: `1px solid ${accentColor}25`,
                        background: `${accentColor}08`,
                        fontSize: '0.5rem',
                        color: `${accentColor}60`,
                        fontFamily: '"Fira Code", monospace',
                        letterSpacing: '0.08em',
                        flexShrink: 0,
                    }}
                >
                    INST: {String(items.length).padStart(2, '0')}
                </div>
            </div>

            {/* ── Tree body ── */}
            <div className="px-4 py-3">
                {/* Root node row */}
                <div className="flex items-center gap-2 mb-1 select-none">
                    <div
                        style={{
                            width: 9,
                            height: 9,
                            background: accentColor,
                            opacity: 0.65,
                            flexShrink: 0,
                        }}
                    />
                    <span
                        style={{
                            fontSize: '0.58rem',
                            color: `${accentColor}60`,
                            fontFamily: '"Fira Code", monospace',
                            letterSpacing: '0.08em',
                        }}
                    >
                        {moduleId}/
                    </span>
                </div>

                {/* Child nodes with shared trunk */}
                <div className="relative" style={{ paddingLeft: 0 }}>
                    {items.map((item, i) => (
                        <HierarchyNode
                            key={item.id}
                            item={item}
                            isLast={i === items.length - 1}
                        />
                    ))}
                </div>
            </div>

            {/* ── Module footer ── */}
            <div
                className="px-4 py-2 border-t flex items-center justify-between"
                style={{ borderColor: `${accentColor}12` }}
            >
                <span style={{ fontSize: '0.47rem', color: 'rgba(255,255,255,0.15)', fontFamily: '"Fira Code", monospace' }}>
                    // click any node to expand sub-module
                </span>
                <span style={{ fontSize: '0.47rem', color: `${accentColor}30`, fontFamily: '"Fira Code", monospace' }}>
                    DEPTH: 2 · NODES: {items.length}
                </span>
            </div>
        </motion.div>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// ProfileSection — main section export
// ═════════════════════════════════════════════════════════════════════════════
export default function ProfileSection() {
    return (
        <section
            id="profile"
            className="min-h-screen py-24 pl-[190px] md:pl-[220px] relative"
            style={{ background: 'linear-gradient(to bottom, #050505, #030a05, #050505)' }}
        >
            <div className="absolute inset-0 floorplan-grid opacity-15 pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">

                {/* ── Section header ── */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-px bg-eda-green opacity-50" />
                        <span className="text-xs text-eda-green opacity-50 tracking-widest">
                            MODULE: DESIGN_ATTRIBUTES · PERSONAL_IP
                        </span>
                    </div>
                    <h2
                        className="text-3xl font-bold text-eda-green"
                        style={{ textShadow: '0 0 12px rgba(0,255,65,0.4)', userSelect: 'none' }}
                    >
                        Profile Hierarchy
                    </h2>
                    <p className="text-sm text-eda-blue opacity-55 mt-2" style={{ userSelect: 'none' }}>
                        // Two sub-modules — click any leaf node to expand its descriptor register
                    </p>
                </motion.div>

                {/* ── Two-column module grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* KEY ATTRIBUTES module */}
                    <HierarchyModule
                        moduleAddr="0x00"
                        moduleId="KEY_ATTRIBUTES_v1"
                        title="KEY_ATTRIBUTES"
                        subtitle="Core competencies that drive professional excellence"
                        items={KEY_ATTRIBUTES}
                        accentColor="#00FF41"
                    />

                    {/* HOBBIES module */}
                    <HierarchyModule
                        moduleAddr="0x01"
                        moduleId="HOBBIES_MODULE"
                        title="HOBBIES"
                        subtitle="Personal interests that shape lateral thinking and growth"
                        items={HOBBIES}
                        accentColor="#00D1FF"
                    />

                </div>

                {/* ── Decorative register summary row ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 border p-4 flex items-center justify-between flex-wrap gap-4"
                    style={{
                        borderColor: 'rgba(0,255,65,0.12)',
                        background: 'rgba(0,255,65,0.02)',
                    }}
                >
                    {[
                        { label: 'KEY_ATTR_COUNT',  value: `${KEY_ATTRIBUTES.length}`, color: '#00FF41' },
                        { label: 'HOBBY_COUNT',     value: `${HOBBIES.length}`,         color: '#00D1FF' },
                        { label: 'AVG_PROFICIENCY', value: `${Math.round(KEY_ATTRIBUTES.reduce((s, a) => s + a.level, 0) / KEY_ATTRIBUTES.length)}%`, color: '#BB86FC' },
                        { label: 'TOTAL_NODES',     value: `${KEY_ATTRIBUTES.length + HOBBIES.length}`, color: '#FFB700' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="flex flex-col items-start gap-0.5">
                            <span style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.25)', fontFamily: '"Fira Code", monospace', letterSpacing: '0.1em' }}>
                                {label}
                            </span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color, fontFamily: '"Fira Code", monospace', textShadow: `0 0 8px ${color}50` }}>
                                {value}
                            </span>
                        </div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
