import { motion } from 'framer-motion';
import PersonalChipDie from './PersonalChipDie';

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
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-px bg-eda-green opacity-50" />
                        <span className="text-xs text-eda-green opacity-50 tracking-widest" style={{ fontFamily: '"Fira Code", monospace' }}>
                            MODULE: PERSONAL_IP · COGNITIVE + LIFESTYLE
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-eda-green"
                        style={{ textShadow: '0 0 12px rgba(0,255,65,0.4)', userSelect: 'none' }}>
                        Personal Intelligence Chip
                    </h2>
                    <p className="text-sm text-eda-blue opacity-55 mt-2" style={{ fontFamily: '"Fira Code", monospace', userSelect: 'none' }}>
                        // Floorplan of a human mind — hover blocks to inspect · run personality simulation
                    </p>
                </motion.div>

                {/* Chip Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-px bg-eda-blue opacity-40" />
                        <span className="text-xs text-eda-blue opacity-40 tracking-widest" style={{ fontFamily: '"Fira Code", monospace' }}>
                            // SUB-MODULE: HUMAN_ACCEL_v1 · BIO_INTELLIGENCE_PROCESSOR
                        </span>
                    </div>
                    <div className="relative w-full border p-4" style={{
                        borderColor: 'rgba(0,255,65,0.2)',
                        background: 'rgba(0,5,12,0.7)',
                        boxShadow: '0 0 40px rgba(0,255,65,0.05) inset, 0 0 60px rgba(0,0,0,0.5)',
                    }}>
                        {/* Corner decorations */}
                        <div className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
                            style={{ borderTop: '1px solid rgba(0,255,65,0.4)', borderLeft: '1px solid rgba(0,255,65,0.4)' }} />
                        <div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none"
                            style={{ borderBottom: '1px solid rgba(0,255,65,0.4)', borderRight: '1px solid rgba(0,255,65,0.4)' }} />
                        <PersonalChipDie />
                    </div>
                </motion.div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 border p-4 flex items-center justify-between flex-wrap gap-4"
                    style={{ borderColor: 'rgba(0,255,65,0.1)', background: 'rgba(0,255,65,0.02)' }}
                >
                    {[
                        { label: 'COGNITIVE_BLOCKS', value: '06', color: '#00FF41' },
                        { label: 'LIFESTYLE_BLOCKS',  value: '06', color: '#00D1FF' },
                        { label: 'CORRELATIONS',      value: '06', color: '#BB86FC' },
                        { label: 'AVG_PROFICIENCY',   value: '91%', color: '#FFB700' },
                        { label: 'PATENTS_FILED',      value: '03',  color: '#FF4466' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="flex flex-col items-start gap-0.5">
                            <span style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.22)', fontFamily: '"Fira Code",monospace', letterSpacing: '0.1em' }}>{label}</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color, fontFamily: '"Fira Code",monospace', textShadow: `0 0 8px ${color}50` }}>{value}</span>
                        </div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
