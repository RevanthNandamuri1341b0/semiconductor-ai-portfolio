import { motion } from 'framer-motion';
import AttributesHobbies from './AttributesHobbies';

export default function PersonalIP() {
    return (
        <section
            id="personal"
            className="py-24 pl-[190px] md:pl-[220px] relative"
            style={{ background: 'linear-gradient(to bottom, #050505, #030a05, #050505)' }}
        >
            <div className="absolute inset-0 floorplan-grid opacity-15 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">

                {/* ── Section header ── */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-px bg-eda-green opacity-50" />
                        <span className="text-xs text-eda-green opacity-50 tracking-widest" style={{ fontFamily: '"Fira Code", monospace' }}>
                            MODULE: PERSONAL_IP · KEY_ATTR + HOBBIES
                        </span>
                    </div>
                    <h2
                        className="text-3xl font-bold text-eda-green"
                        style={{ textShadow: '0 0 12px rgba(0,255,65,0.4)', userSelect: 'none' }}
                    >
                        Personal IP
                    </h2>
                    <p className="text-sm text-eda-blue opacity-55 mt-2" style={{ userSelect: 'none', fontFamily: '"Fira Code", monospace' }}>
                        // Two sub-modules — click any cell to expand its descriptor register
                    </p>
                </motion.div>

                {/* ── Key Attributes + Hobbies blocks ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <AttributesHobbies />
                </motion.div>

            </div>
        </section>
    );
}
