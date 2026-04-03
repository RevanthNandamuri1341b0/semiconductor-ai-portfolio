import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { id: 'about',     label: 'ABOUT',           signal: 'clk_root',    addr: '0x00' },
    { id: 'synthesis', label: 'SYNTHESIS FLOW',  signal: 'clk_synth',   addr: '0x04' },
    { id: 'floorplan', label: 'FLOORPLAN',       signal: 'clk_fp',      addr: '0x08' },
    { id: 'waveform',  label: 'WAVEFORM',        signal: 'clk_sim',     addr: '0x0C' },
    { id: 'game',      label: 'HW PUZZLE',       signal: 'clk_puzzle',  addr: '0x10' },
    { id: 'ip',        label: 'PERSONAL CHIP',   signal: 'clk_ip',      addr: '0x14' },
    { id: 'contact',   label: 'CONTACT',         signal: 'clk_io',      addr: '0x18' },
];

export default function ClockTreeNav() {
    const [activeSection, setActiveSection] = useState('about');
    const [hoveredItem, setHoveredItem] = useState(null);
    const [pulseItem, setPulseItem] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { threshold: 0.35 }
        );
        NAV_ITEMS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const handleClick = (id) => {
        setPulseItem(id);
        setTimeout(() => setPulseItem(null), 700);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* ── MOBILE TOP BAR (hidden on md+) ── */}
            <div
                className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
                style={{
                    height: '56px',
                    background: '#050505',
                    borderBottom: '1px solid rgba(0,255,65,0.12)',
                }}
            >
                <span className="font-mono tracking-widest" style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.4)' }}>
                    // CTS_ROOT · {NAV_ITEMS.find(n => n.id === activeSection)?.signal}
                </span>

                {/* Hamburger button */}
                <button
                    onClick={() => setMobileOpen(true)}
                    className="flex flex-col gap-1.5 p-2"
                    aria-label="Open navigation"
                >
                    <span className="block w-5 h-px" style={{ background: '#00FF41', boxShadow: '0 0 4px #00FF41' }} />
                    <span className="block w-5 h-px" style={{ background: '#00FF41', boxShadow: '0 0 4px #00FF41' }} />
                    <span className="block w-5 h-px" style={{ background: '#00FF41', boxShadow: '0 0 4px #00FF41' }} />
                </button>
            </div>

            {/* ── MOBILE SLIDE-OUT DRAWER ── */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-[60]">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0"
                        style={{ background: 'rgba(0,0,0,0.85)' }}
                        onClick={() => setMobileOpen(false)}
                    />

                    {/* Drawer panel */}
                    <motion.div
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="absolute left-0 top-0 bottom-0 flex flex-col py-8 px-6"
                        style={{
                            width: '260px',
                            background: '#050505',
                            borderRight: '1px solid rgba(0,255,65,0.15)',
                        }}
                    >
                        {/* Drawer header */}
                        <div className="flex items-center justify-between mb-8">
                            <span className="font-mono tracking-widest" style={{ fontSize: '0.55rem', color: 'rgba(0,255,65,0.3)' }}>
                                // CTS_ROOT
                            </span>
                            <button
                                onClick={() => setMobileOpen(false)}
                                style={{ color: 'rgba(0,255,65,0.5)', fontSize: '1.2rem', lineHeight: 1 }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Nav items */}
                        <div className="flex flex-col gap-1">
                            {NAV_ITEMS.map((item) => {
                                const isActive = activeSection === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 py-3 px-2 cursor-pointer rounded-sm"
                                        style={{
                                            borderBottom: '1px solid rgba(0,255,65,0.07)',
                                            background: isActive ? 'rgba(0,209,255,0.05)' : 'transparent',
                                        }}
                                        onClick={() => {
                                            handleClick(item.id);
                                            setMobileOpen(false);
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                flexShrink: 0,
                                                background: isActive ? '#00D1FF' : 'rgba(0,255,65,0.4)',
                                                boxShadow: isActive ? '0 0 8px #00D1FF' : 'none',
                                            }}
                                        />
                                        <div>
                                            <div style={{ fontSize: '0.5rem', color: 'rgba(0,209,255,0.35)', fontFamily: 'Fira Code, monospace' }}>
                                                {item.addr} · {item.signal}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: isActive ? '600' : '400',
                                                    fontFamily: 'Fira Code, monospace',
                                                    color: isActive ? '#00FF41' : 'rgba(0,255,65,0.7)',
                                                    textShadow: isActive ? '0 0 6px rgba(0,255,65,0.5)' : 'none',
                                                    letterSpacing: '0.06em',
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTS stats footer */}
                        <div
                            className="mt-auto font-mono"
                            style={{ fontSize: '0.5rem', color: 'rgba(0,255,65,0.2)', lineHeight: 1.8, userSelect: 'none' }}
                        >
                            <div>SKEW: 12ps</div>
                            <div>LATENCY: 0.8ns</div>
                            <div>BUFFERS: 24</div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* ── DESKTOP SIDEBAR (hidden below md) ── */}
            <nav
                className="hidden md:flex fixed left-0 top-0 h-full z-50 items-center"
                style={{
                    width: '220px',
                    pointerEvents: 'none',
                    borderRight: '1px solid rgba(0,255,65,0.08)',
                }}
            >
                {/* Vertical glow line along the right edge */}
                <div
                    className="absolute right-0 top-1/4 bottom-1/4"
                    style={{
                        width: '1px',
                        background: 'linear-gradient(to bottom, transparent, rgba(0,255,65,0.25) 40%, rgba(0,255,65,0.25) 60%, transparent)',
                        pointerEvents: 'none',
                    }}
                />

                <div style={{ pointerEvents: 'auto', paddingLeft: '16px', width: '100%' }}>
                    {/* CTS label */}
                    <div
                        className="mb-3 font-mono tracking-widest"
                        style={{ fontSize: '0.55rem', color: 'rgba(0,255,65,0.3)', userSelect: 'none' }}
                    >
          // CTS_ROOT
                    </div>

                    {/* Nav items (no trunk line) */}
                    <div className="relative">
                        {NAV_ITEMS.map((item) => {
                            const isActive = activeSection === item.id;
                            const isHovered = hoveredItem === item.id;
                            const isPulsing = pulseItem === item.id;
                            const accent = isActive ? '#00D1FF' : '#00FF41';

                            return (
                                <div
                                    key={item.id}
                                    className="relative flex items-center py-2 cursor-pointer"
                                    style={{ userSelect: 'none' }}
                                    onMouseEnter={() => setHoveredItem(item.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    onClick={() => handleClick(item.id)}
                                >
                                    {/* Branch node dot */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: '3px',
                                            width: '7px',
                                            height: '7px',
                                            borderRadius: '50%',
                                            background: isActive ? '#00D1FF' : 'rgba(0,255,65,0.5)',
                                            boxShadow: isActive ? '0 0 8px #00D1FF' : isHovered ? '0 0 6px #00FF41' : 'none',
                                            transition: 'all 0.25s',
                                            zIndex: 2,
                                        }}
                                    />

                                    {/* Branch horizontal line */}
                                    <div
                                        style={{
                                            marginLeft: '18px',
                                            width: '18px',
                                            height: '1px',
                                            background: isActive || isHovered ? accent : 'rgba(0,255,65,0.2)',
                                            boxShadow: isActive || isHovered ? `0 0 5px ${accent}` : 'none',
                                            transition: 'all 0.25s',
                                            flexShrink: 0,
                                        }}
                                    />

                                    {/* Pulse sweep on click */}
                                    {isPulsing && (
                                        <motion.div
                                            style={{ position: 'absolute', left: '10px', height: '1px', background: '#00D1FF', boxShadow: '0 0 6px #00D1FF', top: '50%' }}
                                            initial={{ width: 0, opacity: 1 }}
                                            animate={{ width: '160px', opacity: 0 }}
                                            transition={{ duration: 0.55, ease: 'easeOut' }}
                                        />
                                    )}

                                    {/* Label group */}
                                    <div style={{ marginLeft: '8px' }}>
                                        <div
                                            style={{
                                                fontSize: '0.5rem',
                                                color: 'rgba(0,209,255,0.35)',
                                                fontFamily: 'Fira Code, monospace',
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {item.addr}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.55rem',
                                                color: isActive
                                                    ? 'rgba(0,209,255,0.55)'
                                                    : 'rgba(0,255,65,0.25)',
                                                fontFamily: 'Fira Code, monospace',
                                                lineHeight: 1.2,
                                                transition: 'color 0.25s',
                                            }}
                                        >
                                            {item.signal}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.65rem',
                                                fontWeight: isActive ? '600' : '400',
                                                fontFamily: 'Fira Code, monospace',
                                                color: isActive
                                                    ? '#00FF41'
                                                    : isHovered
                                                        ? 'rgba(0,255,65,0.85)'
                                                        : 'rgba(0,255,65,0.45)',
                                                textShadow: isActive ? '0 0 6px rgba(0,255,65,0.5)' : 'none',
                                                transition: 'all 0.25s',
                                                letterSpacing: '0.06em',
                                            }}
                                        >
                                            {item.label}
                                        </div>
                                    </div>

                                    {/* Active left accent bar */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-bar"
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: '20%',
                                                bottom: '20%',
                                                width: '2px',
                                                background: '#00D1FF',
                                                boxShadow: '0 0 6px #00D1FF',
                                                borderRadius: '1px',
                                            }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* CTS stats footer */}
                    <div
                        className="mt-4 font-mono"
                        style={{ fontSize: '0.5rem', color: 'rgba(0,255,65,0.2)', lineHeight: 1.8, userSelect: 'none' }}
                    >
                        <div>SKEW: 12ps</div>
                        <div>LATENCY: 0.8ns</div>
                        <div>BUFFERS: 24</div>
                    </div>
                </div>
            </nav>
        </>
    );
}
