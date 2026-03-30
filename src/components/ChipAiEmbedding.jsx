import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Activity } from 'lucide-react';

// ── Chip canvas dimensions (SVG viewBox) ─────────────────────────────────────
const VW = 900;
const VH = 490;

// ── Functional blocks on the AI accelerator die ───────────────────────────────
const BLOCKS = [
    {
        id: 'hbm',
        label: ['HBM3'],
        sub: '96 GB/s',
        x: 45, y: 30, w: 70, h: 385,
        color: '#00D1FF', cat: 'memory',
        detail: 'High Bandwidth Memory Stack · 24 GB capacity · 96 GB/s peak bandwidth for model weight streaming',
    },
    {
        id: 'embed',
        label: ['TOKEN', 'EMBED'],
        sub: '512-dim',
        x: 130, y: 30, w: 140, h: 170,
        color: '#00FF41', cat: 'compute',
        detail: 'Token embedding lookup engine · 50k vocab · 512-dim FP16 output vectors per token',
    },
    {
        id: 'posenc',
        label: ['POS', 'ENCODE'],
        sub: 'RoPE',
        x: 130, y: 215, w: 140, h: 170,
        color: '#BB86FC', cat: 'compute',
        detail: 'Rotary Position Encoding (RoPE) · fused with embedding output stream · zero additional latency',
    },
    {
        id: 'mha',
        label: ['MULTI-HEAD', 'ATTENTION'],
        sub: '8 × 64d heads',
        x: 285, y: 30, w: 175, h: 225,
        color: '#FFB700', cat: 'compute',
        detail: 'Multi-Head Attention · 8 parallel 64-dim heads · INT8 quantized · FlashAttention v2 kernel',
    },
    {
        id: 'sram',
        label: ['WEIGHT', 'SRAM'],
        sub: '8 MB',
        x: 285, y: 270, w: 175, h: 130,
        color: '#00D1FF', cat: 'memory',
        detail: 'On-chip SRAM weight cache · 8 MB · 2-cycle hit latency · services both Attention and FFN',
    },
    {
        id: 'ffn',
        label: ['FEED', 'FWD NET'],
        sub: '2048-dim',
        x: 475, y: 30, w: 155, h: 225,
        color: '#00FF41', cat: 'compute',
        detail: 'Feed-Forward Network · SiLU gated activation · 2048-dim hidden layer · fully fused kernel',
    },
    {
        id: 'lnorm',
        label: ['LAYER', 'NORM'],
        sub: 'RMSNorm',
        x: 475, y: 270, w: 155, h: 130,
        color: '#BB86FC', cat: 'control',
        detail: 'RMSNorm layer normalization · fused add-residual stream · near-zero silicon area overhead',
    },
    {
        id: 'softmax',
        label: ['SOFTMAX', '+SAMPLE'],
        sub: 'top-k / top-p',
        x: 645, y: 30, w: 120, h: 170,
        color: '#FF4466', cat: 'compute',
        detail: 'Output softmax + top-k/top-p nucleus sampling · temperature scaling · FP16 output precision',
    },
    {
        id: 'pcie',
        label: ['PCIe 5.0'],
        sub: 'x16 · 128 GB/s',
        x: 645, y: 215, w: 120, h: 185,
        color: '#00D1FF', cat: 'io',
        detail: 'PCIe Gen 5.0 x16 host interface · 128 GB/s bidirectional peak throughput · IOMMU protected',
    },
    {
        id: 'ctrl',
        label: ['RISC-V SCHEDULER  /  DMA CONTROLLER'],
        sub: 'RV64GC · 1 GHz',
        x: 130, y: 420, w: 635, h: 45,
        color: '#FFB700', cat: 'control',
        detail: 'RISC-V RV64GC soft-core · kernel dispatch scheduling, DMA orchestration, DVFS power management',
    },
];

// ── Data-flow wire connections between blocks ─────────────────────────────────
const WIRES = [
    { id: 'w1', path: 'M 115 115 H 130',              active: ['hbm', 'embed'],    lbl: 'embed_wt' },
    { id: 'w2', path: 'M 115 335 H 285',              active: ['hbm', 'sram'],     lbl: 'w_cache'  },
    { id: 'w3', path: 'M 270 115 H 285',              active: ['embed', 'mha'],    lbl: 'tokens'   },
    { id: 'w4', path: 'M 270 300 H 278 V 175 H 285',  active: ['posenc', 'mha'],   lbl: 'pos_enc'  },
    { id: 'w5', path: 'M 372 270 V 255',              active: ['sram', 'mha'],     lbl: 'W_QKV'    },
    { id: 'w6', path: 'M 460 142 H 475',              active: ['mha', 'ffn'],      lbl: 'attn_out' },
    { id: 'w7', path: 'M 460 335 H 475',              active: ['sram', 'lnorm'],   lbl: 'W_ffn'    },
    { id: 'w8', path: 'M 552 270 V 255',              active: ['lnorm', 'ffn'],    lbl: 'norm_out' },
    { id: 'w9', path: 'M 630 115 H 645',              active: ['ffn', 'softmax'],  lbl: 'logits'   },
    { id: 'w10', path: 'M 705 200 V 215',             active: ['softmax', 'pcie'], lbl: 'token_id' },
];

// ── Ordered block sequence for the simulated inference pass ──────────────────
const INFER_SEQ = ['hbm', 'embed', 'posenc', 'mha', 'sram', 'ffn', 'lnorm', 'softmax', 'pcie'];

// ── Category colour map ───────────────────────────────────────────────────────
const CAT_COLORS = { compute: '#00FF41', memory: '#00D1FF', control: '#FFB700', io: '#BB86FC' };

// ═════════════════════════════════════════════════════════════════════════════
export default function ChipAiEmbedding() {
    const [hovered, setHovered]     = useState(null);
    const [activeSet, setActiveSet] = useState(new Set());
    const [running, setRunning]     = useState(false);
    const [count, setCount]         = useState(0);
    const [step, setStep]           = useState(-1);

    // ── Kick off a simulated inference pass ───────────────────────────────────
    const runInference = () => {
        if (running) return;
        setRunning(true);
        setActiveSet(new Set());
        setCount(c => c + 1);
        setStep(0);

        INFER_SEQ.forEach((id, i) => {
            setTimeout(() => {
                setActiveSet(prev => new Set([...prev, id]));
                setStep(i);
            }, i * 280);
        });

        setTimeout(() => {
            setRunning(false);
            setActiveSet(new Set());
            setStep(-1);
        }, INFER_SEQ.length * 280 + 750);
    };

    // ── Which block to show in the info panel ─────────────────────────────────
    const displayBlock = hovered
        ? BLOCKS.find(b => b.id === hovered)
        : step >= 0
            ? BLOCKS.find(b => b.id === INFER_SEQ[step])
            : null;

    return (
        <div style={{ fontFamily: '"Fira Code", monospace', width: '100%' }}>

            {/* ── Toolbar ──────────────────────────────────────────────────── */}
            <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '10px',
            }}>
                {/* Left: chip ID + legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <Cpu size={13} color="#00D1FF" />
                        <span style={{ fontSize: '0.58rem', color: '#00D1FF', letterSpacing: '0.14em' }}>
                            AI_INFERENCE_ACCEL_v2 · 7nm FinFET · 512 TOPS
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {Object.entries(CAT_COLORS).map(([cat, color]) => (
                            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: 7, height: 7, background: color, opacity: 0.65 }} />
                                <span style={{
                                    fontSize: '0.5rem', color: 'rgba(255,255,255,0.35)',
                                    letterSpacing: '0.08em',
                                }}>
                                    {cat.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: counter + run button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {count > 0 && (
                        <span style={{ fontSize: '0.52rem', color: 'rgba(0,255,65,0.55)', letterSpacing: '0.06em' }}>
                            INFER#{String(count).padStart(4, '0')}
                        </span>
                    )}
                    <button
                        onClick={runInference}
                        disabled={running}
                        style={{
                            border: `1px solid ${running ? 'rgba(0,255,65,0.45)' : 'rgba(0,209,255,0.45)'}`,
                            color: running ? '#00FF41' : '#00D1FF',
                            background: running ? 'rgba(0,255,65,0.04)' : 'rgba(0,209,255,0.04)',
                            padding: '4px 12px',
                            fontSize: '0.58rem',
                            letterSpacing: '0.1em',
                            cursor: running ? 'default' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '5px',
                            transition: 'all 0.25s',
                            fontFamily: '"Fira Code", monospace',
                        }}
                    >
                        <Zap size={9} />
                        {running ? 'RUNNING...' : 'RUN_INFERENCE →'}
                    </button>
                </div>
            </div>

            {/* ── SVG Chip ─────────────────────────────────────────────────── */}
            <div style={{
                border: '1px solid rgba(0,209,255,0.18)',
                background: '#030308',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <svg
                    viewBox={`0 0 ${VW} ${VH}`}
                    preserveAspectRatio="none"
                    style={{ width: '100%', height: '310px', display: 'block' }}
                    onMouseLeave={() => setHovered(null)}
                >
                    {/* ── Inline CSS for wire flow animation ─────────────── */}
                    <style>{`
                        @keyframes aiWireFlow {
                            to { stroke-dashoffset: -20; }
                        }
                        .ai-wire-active {
                            animation: aiWireFlow 0.55s linear infinite;
                        }
                    `}</style>

                    {/* ── Defs ────────────────────────────────────────────── */}
                    <defs>
                        <pattern id="aiChipGrid" width="18" height="18" patternUnits="userSpaceOnUse">
                            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#00D1FF" strokeWidth="0.25" />
                        </pattern>

                        {/* Green arrow (active) */}
                        <marker id="arrowGreen" markerWidth="5" markerHeight="5"
                            refX="4" refY="2.5" orient="auto">
                            <polygon points="0 0, 5 2.5, 0 5" fill="#00FF41" opacity="0.9" />
                        </marker>

                        {/* Dim arrow (inactive) */}
                        <marker id="arrowDim" markerWidth="5" markerHeight="5"
                            refX="4" refY="2.5" orient="auto">
                            <polygon points="0 0, 5 2.5, 0 5" fill="rgba(255,255,255,0.1)" />
                        </marker>
                    </defs>

                    {/* Background grid */}
                    <rect width={VW} height={VH} fill="url(#aiChipGrid)" />

                    {/* Die outline */}
                    <rect x="28" y="18" width={VW - 56} height={VH - 30}
                        fill="rgba(0,4,18,0.55)"
                        stroke="rgba(0,209,255,0.16)" strokeWidth="1" />

                    {/* ── Package pins ─────────────────────────────────────── */}
                    {/* Top row */}
                    {Array.from({ length: 17 }).map((_, i) => (
                        <rect key={`pt${i}`}
                            x={52 + i * 48} y={7} width={7} height={11}
                            fill="rgba(0,25,45,0.8)" stroke="rgba(0,209,255,0.22)" strokeWidth="0.5" />
                    ))}
                    {/* Bottom row */}
                    {Array.from({ length: 17 }).map((_, i) => (
                        <rect key={`pb${i}`}
                            x={52 + i * 48} y={VH - 18} width={7} height={11}
                            fill="rgba(0,25,45,0.8)" stroke="rgba(0,209,255,0.22)" strokeWidth="0.5" />
                    ))}
                    {/* Left col */}
                    {Array.from({ length: 10 }).map((_, i) => (
                        <rect key={`pl${i}`}
                            x={7} y={45 + i * 42} width={11} height={7}
                            fill="rgba(0,25,45,0.8)" stroke="rgba(0,209,255,0.22)" strokeWidth="0.5" />
                    ))}
                    {/* Right col */}
                    {Array.from({ length: 10 }).map((_, i) => (
                        <rect key={`pr${i}`}
                            x={VW - 18} y={45 + i * 42} width={11} height={7}
                            fill="rgba(0,25,45,0.8)" stroke="rgba(0,209,255,0.22)" strokeWidth="0.5" />
                    ))}

                    {/* ── Wire connections ─────────────────────────────────── */}
                    {WIRES.map(wire => {
                        const isActive = wire.active.every(id => activeSet.has(id));
                        return (
                            <path
                                key={wire.id}
                                d={wire.path}
                                fill="none"
                                stroke={isActive ? '#00FF41' : 'rgba(255,255,255,0.07)'}
                                strokeWidth={isActive ? 1.8 : 0.8}
                                strokeDasharray={isActive ? '5 3' : 'none'}
                                markerEnd={isActive ? 'url(#arrowGreen)' : 'url(#arrowDim)'}
                                className={isActive ? 'ai-wire-active' : ''}
                                style={{
                                    filter: isActive ? 'drop-shadow(0 0 3px rgba(0,255,65,0.7))' : 'none',
                                    transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
                                }}
                            />
                        );
                    })}

                    {/* ── Functional blocks ────────────────────────────────── */}
                    {BLOCKS.map(block => {
                        const isHov = hovered === block.id;
                        const isAct = activeSet.has(block.id);
                        const lit   = isHov || isAct;

                        const cx = block.x + block.w / 2;
                        const cy = block.y + block.h / 2;
                        const totalLines = block.label.length;
                        const lineH = block.h > 60 ? 14 : 11;
                        const labelFs = block.id === 'ctrl' ? 9.5
                            : block.w > 155 ? 11
                            : block.w > 100 ? 10 : 9;
                        const subFs = 7;

                        // Vertical start for label group
                        const textGroupH = totalLines * lineH + (block.sub ? subFs + 4 : 0);
                        const textGroupY = cy - textGroupH / 2;

                        return (
                            <g
                                key={block.id}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setHovered(block.id)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                {/* Block body */}
                                <rect
                                    x={block.x} y={block.y}
                                    width={block.w} height={block.h}
                                    fill={lit ? `${block.color}1E` : `${block.color}0C`}
                                    stroke={lit ? `${block.color}CC` : `${block.color}35`}
                                    strokeWidth={lit ? 1.5 : 0.75}
                                    rx={1}
                                    style={{
                                        filter: lit
                                            ? `drop-shadow(0 0 10px ${block.color}55)`
                                            : 'none',
                                        transition: 'all 0.25s ease',
                                    }}
                                />

                                {/* Corner accent marks */}
                                <line x1={block.x}           y1={block.y + 7}     x2={block.x}           y2={block.y}         stroke={`${block.color}55`} strokeWidth="1.5" />
                                <line x1={block.x}           y1={block.y}          x2={block.x + 7}       y2={block.y}         stroke={`${block.color}55`} strokeWidth="1.5" />
                                <line x1={block.x + block.w - 7} y1={block.y}     x2={block.x + block.w} y2={block.y}         stroke={`${block.color}55`} strokeWidth="1.5" />
                                <line x1={block.x + block.w} y1={block.y}          x2={block.x + block.w} y2={block.y + 7}    stroke={`${block.color}55`} strokeWidth="1.5" />

                                {/* Main label lines */}
                                {block.label.map((line, li) => (
                                    <text
                                        key={li}
                                        x={cx}
                                        y={textGroupY + li * lineH + lineH * 0.75}
                                        textAnchor="middle"
                                        fill={lit ? block.color : `${block.color}75`}
                                        fontSize={labelFs}
                                        fontFamily='"Fira Code", monospace'
                                        fontWeight="600"
                                        style={{ transition: 'fill 0.22s', userSelect: 'none' }}
                                    >
                                        {line}
                                    </text>
                                ))}

                                {/* Sub-label */}
                                {block.sub && (
                                    <text
                                        x={cx}
                                        y={textGroupY + totalLines * lineH + subFs + 1}
                                        textAnchor="middle"
                                        fill={`${block.color}50`}
                                        fontSize={subFs}
                                        fontFamily='"Fira Code", monospace'
                                        style={{ userSelect: 'none' }}
                                    >
                                        {block.sub}
                                    </text>
                                )}

                                {/* Active status dot */}
                                {isAct && (
                                    <circle
                                        cx={block.x + block.w - 7}
                                        cy={block.y + 8}
                                        r={4}
                                        fill={block.color}
                                        style={{ filter: `drop-shadow(0 0 6px ${block.color})` }}
                                    >
                                        <animate
                                            attributeName="opacity"
                                            values="1;0.4;1"
                                            dur="0.8s"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                )}
                            </g>
                        );
                    })}

                    {/* Scan-line overlay during inference */}
                    {running && (
                        <rect
                            x="28" y="18" width={VW - 56} height="2"
                            fill="#00FF41" opacity="0.18"
                            style={{ filter: 'drop-shadow(0 0 4px #00FF41)' }}
                        >
                            <animate
                                attributeName="y"
                                from="18" to={VH - 10}
                                dur={`${INFER_SEQ.length * 0.28 + 0.5}s`}
                                repeatCount="1"
                            />
                        </rect>
                    )}

                    {/* Die watermark */}
                    <text
                        x={VW - 33} y={15}
                        textAnchor="end"
                        fill="rgba(0,209,255,0.18)"
                        fontSize={6.5}
                        fontFamily='"Fira Code", monospace'
                        style={{ userSelect: 'none' }}
                    >
                        AI_ACCEL_v2 · REV_A
                    </text>

                    {/* Active inference step label */}
                    {running && step >= 0 && (
                        <text
                            x={33} y={15}
                            textAnchor="start"
                            fill="rgba(0,255,65,0.6)"
                            fontSize={6.5}
                            fontFamily='"Fira Code", monospace'
                            style={{ userSelect: 'none' }}
                        >
                            STEP {String(step + 1).padStart(2, '0')}/{INFER_SEQ.length} · {INFER_SEQ[step].toUpperCase()}
                        </text>
                    )}
                </svg>
            </div>

            {/* ── Block info panel ──────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {displayBlock ? (
                    <motion.div
                        key={displayBlock.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.13 }}
                        style={{
                            marginTop: '6px',
                            padding: '7px 14px',
                            border: `1px solid ${displayBlock.color}28`,
                            background: `${displayBlock.color}07`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        <Activity size={11} color={displayBlock.color} style={{ flexShrink: 0 }} />
                        <span style={{
                            color: displayBlock.color,
                            fontSize: '0.6rem',
                            letterSpacing: '0.1em',
                            minWidth: 80,
                            flexShrink: 0,
                        }}>
                            {displayBlock.id.toUpperCase()}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', lineHeight: 1.4 }}>
                            {displayBlock.detail}
                        </span>
                        <span style={{
                            marginLeft: 'auto',
                            color: `${CAT_COLORS[displayBlock.cat]}55`,
                            fontSize: '0.5rem',
                            letterSpacing: '0.1em',
                            flexShrink: 0,
                        }}>
                            {displayBlock.cat.toUpperCase()}
                        </span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            marginTop: '6px',
                            padding: '7px 14px',
                            fontSize: '0.58rem',
                            color: 'rgba(255,255,255,0.18)',
                            letterSpacing: '0.05em',
                        }}
                    >
                        // hover a block to inspect its specs &nbsp;·&nbsp; click RUN_INFERENCE to simulate a forward pass
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
