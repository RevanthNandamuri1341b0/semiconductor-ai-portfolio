import { motion } from 'framer-motion';
import LogicPuzzle from './LogicPuzzle';

export default function AiAccelerator() {
    return (
        <section
            id="ip"
            className="min-h-screen py-24 pl-[190px] md:pl-[220px] relative flex flex-col items-center justify-center"
            style={{ background: 'linear-gradient(to bottom, #050505, #070010, #050505)' }}
        >
            <div className="absolute inset-0 floorplan-grid opacity-10 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10 w-full">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-8 text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-4 h-px bg-eda-purple opacity-50" />
                        <span className="text-xs text-eda-purple opacity-50 tracking-widest">MODULE: LOGIC_SYNTHESIS</span>
                        <div className="w-4 h-px bg-eda-purple opacity-50" />
                    </div>
                    <h2 className="text-3xl font-bold text-eda-purple eda-glow-purple">
                        Interactive Hardware Puzzle
                    </h2>
                    <p className="text-sm text-eda-blue opacity-60 mt-3 flex flex-col items-center gap-1">
                        <span>// Drag logic primitives onto the canvas to construct a circuit that satisfies the boolean equation.</span>
                        <span>// Double-click any gate or wire to delete it.</span>
                        <span className="text-eda-purple text-xs mt-2 border border-eda-purple/20 bg-eda-purple/5 px-4 py-1.5 rounded-sm">Let's build silicon together. Open to collaborations, innovations, and high-impact roles.</span>
                    </p>
                </motion.div>

                {/* Logic Puzzle Canvas */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full border"
                    style={{
                        height: '560px',
                        borderColor: 'rgba(187,134,252,0.3)',
                        background: '#030303',
                        boxShadow: '0 0 40px rgba(187,134,252,0.15)',
                    }}
                >
                    <LogicPuzzle />
                </motion.div>
            </div>
        </section>
    );
}
