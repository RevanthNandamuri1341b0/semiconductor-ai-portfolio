import { motion } from 'framer-motion';
import LogicPuzzle from './LogicPuzzle';

export default function InteractiveGame() {
    return (
        <section
            id="game"
            className="min-h-screen py-24 pl-[190px] md:pl-[220px] relative"
            style={{ background: 'linear-gradient(to bottom, #050505, #070010, #050505)' }}
        >
            <div className="absolute inset-0 floorplan-grid opacity-10 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10 w-full">

                {/* ── Section header ─────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-px bg-eda-purple opacity-50" />
                        <span className="text-xs text-eda-purple opacity-50 tracking-widest">
                            MODULE: LOGIC_SYNTHESIS · BOOLEAN_PUZZLE
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-eda-purple" style={{ textShadow: '0 0 12px rgba(187,134,252,0.4)', userSelect: 'none' }}>
                        Interactive Hardware Puzzle
                    </h2>
                    <p className="text-sm text-eda-blue opacity-60 mt-2" style={{ userSelect: 'none' }}>
                        // Drag logic primitives onto the canvas to construct a circuit that satisfies the boolean equation.&nbsp;
                        Double-click any gate or wire to delete it.
                    </p>
                </motion.div>

                {/* ── Logic Puzzle Canvas ────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    {/* Card */}
                    <div
                        className="relative w-full border"
                        style={{
                            height: '560px',
                            borderColor: 'rgba(187,134,252,0.3)',
                            background: '#030303',
                            boxShadow: '0 0 40px rgba(187,134,252,0.15)',
                        }}
                    >
                        {/* Corner decoration top-left */}
                        <div className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
                            style={{
                                borderTop: '1px solid rgba(187,134,252,0.5)',
                                borderLeft: '1px solid rgba(187,134,252,0.5)',
                            }} />
                        {/* Corner decoration bottom-right */}
                        <div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none"
                            style={{
                                borderBottom: '1px solid rgba(187,134,252,0.5)',
                                borderRight: '1px solid rgba(187,134,252,0.5)',
                            }} />

                        <LogicPuzzle />
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
