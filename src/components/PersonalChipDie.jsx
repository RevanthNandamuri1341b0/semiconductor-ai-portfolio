import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Activity } from 'lucide-react';

const VW = 900;
const VH = 490;

// ── Blocks: 6 cognitive (key attributes) + 6 lifestyle (hobbies) ─────────────
const BLOCKS = [
    // COGNITIVE — left/center
    { id:'adaptability',   cat:'cognitive', label:['ADAPTABILITY'],            sub:'adapt · 92%',      x:45,  y:30,  w:65,  h:360, color:'#00FF41', icon:'⟳', level:92, tag:'ADAPT_CORE',    detail:'Rapidly context-switches across domains, tool flows & customer environments without loss of productivity.' },
    { id:'communication',  cat:'cognitive', label:['COMMUNI-','CATION'],        sub:'comm · 88%',       x:125, y:30,  w:145, h:165, color:'#00D1FF', icon:'⌘', level:88, tag:'COMM_BUS',      detail:'Translates complex EDA concepts to diverse audiences — from RTL engineers to executive stakeholders.' },
    { id:'attention',      cat:'cognitive', label:['ATTENTION','TO DETAIL'],    sub:'prec · 95%',       x:125, y:210, w:145, h:180, color:'#BB86FC', icon:'◎', level:95, tag:'PREC_CORE',     detail:'Precision debugging at gate, RTL & architecture levels — finds the one mis-inferred register in 2M gates.' },
    { id:'selflearning',   cat:'cognitive', label:['SELF-','LEARNING'],         sub:'3 patents · 90%',  x:285, y:30,  w:175, h:220, color:'#FFB700', icon:'↑', level:90, tag:'GROWTH_ENG',    detail:'Self-driven upskilling across ML arch, power analysis, Tcl scripting — evidenced by 3 filed patents.' },
    { id:'reverse',        cat:'cognitive', label:['REVERSE','ENGINEER'],       sub:'P1 debug · 93%',   x:285, y:265, w:175, h:125, color:'#FF4466', icon:'⇌', level:93, tag:'DEBUG_ENG',     detail:'Decomposes black-box tool internals and legacy flows to root-cause obscure P1 customer failures.' },
    { id:'decision',       cat:'cognitive', label:['CRITICAL DECISION MAKING'], sub:'triage · 87%',     x:125, y:405, w:335, h:45,  color:'#00FF41', icon:'⊕', level:87, tag:'DECISION_CTRL', detail:'High-confidence judgment under escalation pressure: P1 triage, ECO path selection, PPA trade-offs.' },
    // LIFESTYLE — right side
    { id:'football',       cat:'lifestyle', label:['FOOTBALL'],                 sub:'team · tactics',   x:475, y:30,  w:145, h:165, color:'#00FF41', icon:'⚽', tag:'TEAM_BUF',      detail:'Team dynamics and split-second tactical decisions — sharpens coordination and reading the field under pressure.' },
    { id:'badminton',      cat:'lifestyle', label:['BADMINTON'],                sub:'reflex · spatial', x:475, y:210, w:145, h:180, color:'#00D1FF', icon:'🏸', tag:'REFLEX_BUF',    detail:'Reflexes, spatial awareness, and rapid course-correction — direct analogues to real-time debug triage.' },
    { id:'cuisines',       cat:'lifestyle', label:['DISCOVERING','CUISINES'],   sub:'global · culture', x:635, y:30,  w:115, h:165, color:'#BB86FC', icon:'🍜', tag:'CULTURE_CACHE', detail:'Exploring global food cultures — broadens perspective and fuels the curiosity that drives engineering creativity.' },
    { id:'motorbike',      cat:'lifestyle', label:['MOTORBIKE','TRAVEL'],       sub:'route · endurance',x:635, y:210, w:115, h:180, color:'#FFB700', icon:'🏍', tag:'ENDURE_REG',    detail:'Long-distance rides demanding route planning, mechanical awareness, and calm decision-making under fatigue.' },
    { id:'reading',        cat:'lifestyle', label:['TECHNICAL','READING'],      sub:'EDA · AI papers',  x:765, y:30,  w:100, h:360, color:'#FF4466', icon:'📚', tag:'KNOW_BUS',      detail:'Deep dives into EDA literature, AI/ML papers, and systems architecture — continuous knowledge compound interest.' },
    { id:'problemsolving', cat:'lifestyle', label:['DOM. PROBLEM','SOLVING'],   sub:'first-principles', x:475, y:405, w:390, h:45,  color:'#00D1FF', icon:'🧩', tag:'ROOT_CAUSE_IO', detail:'Applying engineering first-principles to everyday challenges — the same root-cause instinct, different domain.' },
];

const BM = Object.fromEntries(BLOCKS.map(b => [b.id, b]));
const bc = id => ({ cx: BM[id].x + BM[id].w / 2, cy: BM[id].y + BM[id].h / 2 });

// Hobby → Attribute correlations (lifestyle feeds cognitive)
const WIRES = [
    { id:'w1', from:'football',       to:'adaptability',  color:'#00FF41' },
    { id:'w2', from:'cuisines',       to:'communication', color:'#BB86FC' },
    { id:'w3', from:'reading',        to:'selflearning',  color:'#FF4466' },
    { id:'w4', from:'badminton',      to:'attention',     color:'#00D1FF' },
    { id:'w5', from:'problemsolving', to:'reverse',       color:'#00D1FF' },
    { id:'w6', from:'motorbike',      to:'decision',      color:'#FFB700' },
];

function wirePath(fromId, toId) {
    const f = bc(fromId); const t = bc(toId);
    const dx = Math.abs(t.cx - f.cx) * 0.45;
    return `M${f.cx},${f.cy} C${f.cx - dx},${f.cy} ${t.cx + dx},${t.cy} ${t.cx},${t.cy}`;
}

// Personality activation sequence (pairs: lifestyle then its matched cognitive)
const SEQ = ['football','adaptability','cuisines','communication','reading','selflearning','badminton','attention','problemsolving','reverse','motorbike','decision'];

const CAT_CLR = { cognitive:'#00FF41', lifestyle:'#00D1FF' };

export default function PersonalChipDie() {
    const [hovered, setHovered]       = useState(null);
    const [activeSet, setActiveSet]   = useState(new Set());
    const [activeWires, setActiveWires] = useState(new Set());
    const [running, setRunning]       = useState(false);
    const [runCount, setRunCount]     = useState(0);
    const [step, setStep]             = useState(-1);
    const [mode, setMode]             = useState('all');
    const [glowing, setGlowing]       = useState(false);

    const runPersonality = () => {
        if (running) return;
        // If already glowing, flash dark first then re-run
        const delay = glowing ? 300 : 0;
        setGlowing(false);
        setActiveSet(new Set()); setActiveWires(new Set()); setStep(-1);
        setRunning(true);
        setRunCount(c => c + 1);

        SEQ.forEach((id, i) => {
            setTimeout(() => {
                setActiveSet(prev => new Set([...prev, id]));
                setStep(i);
                // activate wire if both ends are now lit
                WIRES.forEach(w => {
                    const other = w.from === id ? w.to : w.to === id ? w.from : null;
                    if (other) setActiveSet(prev => {
                        if (prev.has(other)) setActiveWires(aw => new Set([...aw, w.id]));
                        return prev;
                    });
                });
            }, delay + i * 280);
        });

        const total = delay + SEQ.length * 280;
        setTimeout(() => setActiveWires(new Set(WIRES.map(w => w.id))), total);
        // Stay glowing — do not clear activeSet/activeWires
        setTimeout(() => { setRunning(false); setStep(-1); setGlowing(true); }, total + 200);
    };

    const displayBlock = hovered ? BM[hovered] : step >= 0 ? BM[SEQ[step]] : null;
    const isVis = b => mode === 'all' || b.cat === mode;

    return (
        <div style={{ fontFamily:'"Fira Code",monospace', width:'100%' }}>

            {/* Toolbar */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, flexWrap:'wrap', gap:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <Brain size={13} color="#00D1FF" />
                        <span style={{ fontSize:'0.57rem', color:'#00D1FF', letterSpacing:'0.13em' }}>
                            HUMAN_ACCEL_v1 · Bio Intelligence · 6 Traits · 6 Hobbies
                        </span>
                    </div>
                    {Object.entries(CAT_CLR).map(([cat,clr]) => (
                        <div key={cat} style={{ display:'flex', alignItems:'center', gap:4 }}>
                            <div style={{ width:7, height:7, background:clr, opacity:0.65 }} />
                            <span style={{ fontSize:'0.48rem', color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em' }}>{cat.toUpperCase()}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                    {['all','cognitive','lifestyle'].map(m => (
                        <button key={m} onClick={() => setMode(m)} style={{
                            border:`1px solid ${mode===m ? (m==='cognitive'?'#00FF41':m==='lifestyle'?'#00D1FF':'rgba(255,255,255,0.4)') : 'rgba(255,255,255,0.12)'}`,
                            color: mode===m ? (m==='cognitive'?'#00FF41':m==='lifestyle'?'#00D1FF':'rgba(255,255,255,0.8)') : 'rgba(255,255,255,0.3)',
                            background:'transparent', padding:'3px 9px', fontSize:'0.5rem',
                            letterSpacing:'0.08em', cursor:'pointer', fontFamily:'"Fira Code",monospace', transition:'all 0.2s',
                        }}>{m.toUpperCase()}</button>
                    ))}
                    {runCount > 0 && <span style={{ fontSize:'0.5rem', color:'rgba(0,255,65,0.5)' }}>RUN#{String(runCount).padStart(3,'0')}</span>}
                    <button onClick={runPersonality} disabled={running} style={{
                        border:`1px solid ${running?'rgba(0,255,65,0.4)':'rgba(0,209,255,0.45)'}`,
                        color: running?'#00FF41':'#00D1FF',
                        background: running?'rgba(0,255,65,0.04)':'rgba(0,209,255,0.04)',
                        padding:'4px 12px', fontSize:'0.56rem', letterSpacing:'0.1em',
                        cursor: running?'default':'pointer', display:'flex', alignItems:'center', gap:5,
                        transition:'all 0.25s', fontFamily:'"Fira Code",monospace',
                    }}>
                        <Zap size={9}/>{running ? 'RUNNING...' : 'RUN_PERSONALITY →'}
                    </button>
                </div>
            </div>

            {/* SVG Chip */}
            <div style={{ border:'1px solid rgba(0,209,255,0.18)', background:'#030308', position:'relative', overflow:'hidden' }}>
                <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none"
                    style={{ width:'100%', height:'320px', display:'block' }}
                    onMouseLeave={() => setHovered(null)}>
                    <style>{`
                        @keyframes pFlow { to { stroke-dashoffset: -20; } }
                        .wire-on { animation: pFlow 0.55s linear infinite; }
                    `}</style>
                    <defs>
                        <pattern id="pGrid" width="18" height="18" patternUnits="userSpaceOnUse">
                            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#00D1FF" strokeWidth="0.2"/>
                        </pattern>
                        <marker id="arrowOn"  markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><polygon points="0 0,5 2.5,0 5" fill="#00FF4177"/></marker>
                        <marker id="arrowOff" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><polygon points="0 0,5 2.5,0 5" fill="rgba(255,255,255,0.07)"/></marker>
                    </defs>

                    <rect width={VW} height={VH} fill="url(#pGrid)"/>
                    <rect x="28" y="18" width={VW-56} height={VH-30} fill="rgba(0,4,18,0.6)" stroke="rgba(0,209,255,0.13)" strokeWidth="1"/>

                    {/* Pins */}
                    {Array.from({length:17}).map((_,i)=><rect key={`pt${i}`} x={52+i*48} y={7}    width={7} height={11} fill="rgba(0,25,45,0.8)" stroke="rgba(0,209,255,0.18)" strokeWidth="0.5"/>)}
                    {Array.from({length:17}).map((_,i)=><rect key={`pb${i}`} x={52+i*48} y={VH-18} width={7} height={11} fill="rgba(0,25,45,0.8)" stroke="rgba(0,209,255,0.18)" strokeWidth="0.5"/>)}
                    {Array.from({length:10}).map((_,i)=><rect key={`pl${i}`} x={7}      y={45+i*42} width={11} height={7} fill="rgba(0,25,45,0.8)" stroke="rgba(0,209,255,0.18)" strokeWidth="0.5"/>)}
                    {Array.from({length:10}).map((_,i)=><rect key={`pr${i}`} x={VW-18}  y={45+i*42} width={11} height={7} fill="rgba(0,25,45,0.8)" stroke="rgba(0,209,255,0.18)" strokeWidth="0.5"/>)}

                    {/* Divider label */}
                    <line x1="466" y1="25" x2="466" y2="393" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 5"/>
                    <text x="466" y="21" textAnchor="middle" fill="rgba(255,255,255,0.09)" fontSize="5" fontFamily='"Fira Code",monospace'>◄ COGNITIVE · LIFESTYLE ►</text>

                    {/* Scan line during run */}
                    {running && (
                        <rect x="28" y="18" width={VW-56} height="2" fill="#00FF41" opacity="0.15" style={{filter:'drop-shadow(0 0 4px #00FF41)'}}>
                            <animate attributeName="y" from="18" to={VH-10} dur={`${SEQ.length*0.28+0.5}s`} repeatCount="1"/>
                        </rect>
                    )}

                    {/* Correlation wires */}
                    {WIRES.map(wire => {
                        const wOn   = activeWires.has(wire.id);
                        const wHov  = hovered === wire.from || hovered === wire.to;
                        const lit   = wOn || wHov;
                        return (
                            <path key={wire.id} d={wirePath(wire.from, wire.to)} fill="none"
                                stroke={lit ? wire.color : 'rgba(255,255,255,0.04)'}
                                strokeWidth={lit ? 1.6 : 0.6}
                                strokeDasharray={lit ? '5 3' : 'none'}
                                markerEnd={lit ? 'url(#arrowOn)' : 'url(#arrowOff)'}
                                className={wOn ? 'wire-on' : ''}
                                style={{ filter: lit ? `drop-shadow(0 0 4px ${wire.color}80)` : 'none', transition:'stroke 0.3s,stroke-width 0.3s' }}
                            />
                        );
                    })}

                    {/* Blocks */}
                    {BLOCKS.map(block => {
                        const isHov = hovered === block.id;
                        const isAct = activeSet.has(block.id);
                        const vis   = isVis(block);
                        const lit   = (isHov || isAct) && vis;
                        const faded = !vis;
                        const cx = block.x + block.w / 2;
                        const cy = block.y + block.h / 2;
                        const lh = block.h > 60 ? 14 : 11;
                        const lfs = block.w > 150 ? 11 : block.w > 100 ? 10 : 9;
                        const gh  = block.label.length * lh + (block.sub ? 11 : 0);
                        const gy  = cy - gh / 2;
                        return (
                            <g key={block.id} style={{ cursor:'pointer', opacity: faded ? 0.12 : 1, transition:'opacity 0.4s' }}
                                onMouseEnter={() => setHovered(block.id)}
                                onMouseLeave={() => setHovered(null)}>
                                <rect x={block.x} y={block.y} width={block.w} height={block.h} rx={1}
                                    fill={lit ? `${block.color}1C` : `${block.color}09`}
                                    stroke={lit ? `${block.color}CC` : `${block.color}2E`}
                                    strokeWidth={lit ? 1.5 : 0.7}
                                    style={{ filter: lit ? `drop-shadow(0 0 10px ${block.color}55)` : 'none', transition:'all 0.25s' }}/>
                                {/* Top category stripe */}
                                <rect x={block.x} y={block.y} width={block.w} height={2} fill={lit ? block.color : `${block.color}20`} style={{transition:'fill 0.25s'}}/>
                                {/* Corner marks TL */}
                                <line x1={block.x}           y1={block.y+7}     x2={block.x}           y2={block.y}     stroke={`${block.color}55`} strokeWidth="1.5"/>
                                <line x1={block.x}           y1={block.y}       x2={block.x+7}         y2={block.y}     stroke={`${block.color}55`} strokeWidth="1.5"/>
                                <line x1={block.x+block.w-7} y1={block.y}       x2={block.x+block.w}   y2={block.y}     stroke={`${block.color}55`} strokeWidth="1.5"/>
                                <line x1={block.x+block.w}   y1={block.y}       x2={block.x+block.w}   y2={block.y+7}   stroke={`${block.color}55`} strokeWidth="1.5"/>
                                {/* Icon */}
                                {block.h > 50 && (
                                    <text x={cx} y={gy - 2} textAnchor="middle" fontSize={block.h > 120 ? 15 : 10}
                                        style={{ userSelect:'none', opacity: lit ? 0.9 : 0.3 }}>{block.icon}</text>
                                )}
                                {/* Labels */}
                                {block.label.map((ln, li) => (
                                    <text key={li} x={cx} y={gy + li*lh + lh*0.78} textAnchor="middle"
                                        fill={lit ? block.color : `${block.color}65`} fontSize={lfs}
                                        fontFamily='"Fira Code",monospace' fontWeight="600"
                                        style={{ transition:'fill 0.22s', userSelect:'none' }}>{ln}</text>
                                ))}
                                {/* Sub-label */}
                                {block.sub && (
                                    <text x={cx} y={gy + block.label.length*lh + 10} textAnchor="middle"
                                        fill={`${block.color}48`} fontSize={6.5}
                                        fontFamily='"Fira Code",monospace' style={{ userSelect:'none' }}>{block.sub}</text>
                                )}
                                {/* Live pulse dot */}
                                {isAct && (
                                    <circle cx={block.x+block.w-7} cy={block.y+8} r={4} fill={block.color}
                                        style={{ filter:`drop-shadow(0 0 6px ${block.color})` }}>
                                        <animate attributeName="opacity" values="1;0.3;1" dur="0.7s" repeatCount="indefinite"/>
                                    </circle>
                                )}
                                {/* Tag watermark */}
                                <text x={block.x+3} y={block.y+block.h-4} fill={`${block.color}22`} fontSize="4.5"
                                    fontFamily='"Fira Code",monospace' style={{ userSelect:'none' }}>{block.tag}</text>
                            </g>
                        );
                    })}

                    {/* Step label top-left */}
                    {running && step >= 0 && (
                        <text x={33} y={15} textAnchor="start" fill="rgba(0,255,65,0.55)" fontSize="6.5"
                            fontFamily='"Fira Code",monospace' style={{ userSelect:'none' }}>
                            STEP {String(step+1).padStart(2,'0')}/{SEQ.length} · {SEQ[step].toUpperCase()}
                        </text>
                    )}
                    {/* Watermark */}
                    <text x={VW-33} y={15} textAnchor="end" fill="rgba(0,209,255,0.15)" fontSize="6"
                        fontFamily='"Fira Code",monospace' style={{ userSelect:'none' }}>HUMAN_ACCEL_v1 · REV_A</text>
                </svg>
            </div>

            {/* Info panel */}
            <AnimatePresence mode="wait">
                {displayBlock ? (
                    <motion.div key={displayBlock.id}
                        initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
                        transition={{ duration:0.13 }}
                        style={{ marginTop:6, padding:'7px 14px', border:`1px solid ${displayBlock.color}28`,
                            background:`${displayBlock.color}07`, display:'flex', alignItems:'center', gap:12 }}>
                        <Activity size={11} color={displayBlock.color} style={{ flexShrink:0 }}/>
                        <span style={{ color:displayBlock.color, fontSize:'0.58rem', letterSpacing:'0.1em', minWidth:90, flexShrink:0 }}>
                            {displayBlock.id.toUpperCase()}
                        </span>
                        <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.6rem', lineHeight:1.4 }}>{displayBlock.detail}</span>
                        {displayBlock.level && (
                            <div style={{ marginLeft:'auto', flexShrink:0, textAlign:'right' }}>
                                <div style={{ fontSize:'0.48rem', color:`${displayBlock.color}50`, letterSpacing:'0.08em', marginBottom:3 }}>PROFICIENCY</div>
                                <div style={{ width:80, height:2, background:`${displayBlock.color}18`, borderRadius:1 }}>
                                    <motion.div initial={{ width:0 }} animate={{ width:`${displayBlock.level}%` }}
                                        transition={{ duration:0.6, ease:'easeOut' }}
                                        style={{ height:'100%', background:displayBlock.color, borderRadius:1, boxShadow:`0 0 5px ${displayBlock.color}` }}/>
                                </div>
                                <div style={{ fontSize:'0.48rem', color:`${displayBlock.color}70`, marginTop:2 }}>{displayBlock.level}%</div>
                            </div>
                        )}
                        <span style={{ marginLeft: displayBlock.level ? 8 : 'auto', color:`${CAT_CLR[displayBlock.cat]}50`, fontSize:'0.48rem', letterSpacing:'0.1em', flexShrink:0 }}>
                            {displayBlock.cat.toUpperCase()}
                        </span>
                    </motion.div>
                ) : (
                    <motion.div key="ph" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        style={{ marginTop:6, padding:'7px 14px', fontSize:'0.56rem', color:'rgba(255,255,255,0.18)', letterSpacing:'0.04em' }}>
                        // hover a block to inspect · use filters to isolate COGNITIVE or LIFESTYLE · click RUN_PERSONALITY to simulate
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
