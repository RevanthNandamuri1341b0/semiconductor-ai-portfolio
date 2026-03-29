import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, Github, Linkedin } from 'lucide-react';

const REGISTER_FIELDS = [
    {
        addr: '0x00',
        regName: 'NAME_REG',
        placeholder: 'Your Name',
        type: 'text',
        icon: User,
        bits: '[127:0]',
        desc: 'Sender identification string',
    },
    {
        addr: '0x04',
        regName: 'EMAIL_REG',
        placeholder: 'Your Email Address',
        type: 'email',
        icon: Mail,
        bits: '[255:0]',
        desc: 'Return address for acknowledgement',
    },
    {
        addr: '0x08',
        regName: 'PAYLOAD',
        placeholder: 'Your message...',
        type: 'textarea',
        icon: MessageSquare,
        bits: '[1023:0]',
        desc: 'Data payload — free-form message',
    },
];

const DIRECT_LINKS = [
    {
        href: 'mailto:revanthsai.nandamuri@gmail.com',
        icon: Mail,
        label: 'EMAIL_ADDR [0x04]',
        value: 'revanthsai.nandamuri@gmail.com',
        color: '#00FF41',
    },
    {
        href: 'https://linkedin.com/in/revanth-sai-nandamuri',
        icon: Linkedin,
        label: 'LINKEDIN_REG [0x0C]',
        value: 'linkedin/revanth-sai-nandamuri',
        color: '#00D1FF',
        external: true,
    },
    {
        href: 'https://github.com/revanth-nandamuri',
        icon: Github,
        label: 'GITHUB_REG [0x10]',
        value: 'github/revanth-nandamuri',
        color: '#BB86FC',
        external: true,
    },
];

export default function RegisterMapContact() {
    const [formData, setFormData] = useState({ NAME_REG: '', EMAIL_REG: '', PAYLOAD: '' });
    const [submitted, setSubmitted] = useState(false);
    const formRef = useRef(null);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Portfolio Contact: ${formData.NAME_REG}`);
        const body = encodeURIComponent(
            `Name: ${formData.NAME_REG}\nEmail: ${formData.EMAIL_REG}\n\nMessage:\n${formData.PAYLOAD}`
        );
        window.location.href = `mailto:revanthsai.nandamuri@gmail.com?subject=${subject}&body=${body}`;
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <section
            id="contact"
            className="min-h-screen py-24 pl-[190px] md:pl-[220px] relative"
            style={{ background: 'linear-gradient(to bottom, #050505, #030505, #050505)' }}
        >
            <div className="absolute inset-0 floorplan-grid opacity-20" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-px bg-eda-green opacity-50" />
                        <span className="text-xs text-eda-green opacity-50 tracking-widest">MODULE: REGISTER_MAP_CONTACT</span>
                    </div>
                    <h2 className="text-3xl font-bold text-eda-green" style={{ textShadow: '0 0 12px rgba(0,255,65,0.4)', userSelect: 'none' }}>
                        Contact Register Map
                    </h2>
                    <p className="text-sm text-eda-blue opacity-60 mt-2" style={{ userSelect: 'none' }}>
                        // Write to registers to initiate communication
                    </p>
                </motion.div>

                {/* ── DIRECT_ACCESS_PORTS ── top, full-width row ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8 border border-eda-green border-opacity-20 p-5"
                    style={{ background: 'rgba(0,255,65,0.025)' }}
                >
                    <div className="text-xs tracking-widest mb-4" style={{ color: 'rgba(0,255,65,0.4)', userSelect: 'none' }}>
                        // DIRECT_ACCESS_PORTS
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        {DIRECT_LINKS.map(({ href, icon: Icon, label, value, color, external }) => (
                            <a
                                key={label}
                                href={href}
                                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                className="flex items-center gap-3 group"
                            >
                                <Icon size={16} style={{ color, flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '0.58rem', color: `${color}55`, userSelect: 'none' }}>
                                        {label}
                                    </div>
                                    <div
                                        className="font-mono transition-opacity group-hover:opacity-100"
                                        style={{ fontSize: '0.75rem', color, opacity: 0.85 }}
                                    >
                                        {value}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* ── Register map table + write form (single column, full-width) ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {/* Register header table */}
                    <div className="border border-eda-green border-opacity-20">
                        <table className="reg-table w-full">
                            <thead>
                                <tr>
                                    <th className="text-eda-green opacity-60" style={{ fontSize: '0.6rem' }}>ADDR</th>
                                    <th className="text-eda-green opacity-60" style={{ fontSize: '0.6rem' }}>REG_NAME</th>
                                    <th className="text-eda-green opacity-60" style={{ fontSize: '0.6rem' }}>BITS</th>
                                    <th className="text-eda-green opacity-60" style={{ fontSize: '0.6rem' }}>DESCRIPTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {REGISTER_FIELDS.map(f => (
                                    <tr key={f.addr}>
                                        <td className="font-mono text-eda-blue" style={{ fontSize: '0.6rem' }}>{f.addr}</td>
                                        <td className="font-mono text-eda-green" style={{ fontSize: '0.6rem' }}>{f.regName}</td>
                                        <td className="font-mono opacity-40" style={{ fontSize: '0.6rem' }}>{f.bits}</td>
                                        <td className="opacity-50" style={{ fontSize: '0.6rem' }}>{f.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Form */}
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="border border-t-0 border-eda-green border-opacity-20 p-6 grid md:grid-cols-2 gap-6"
                    >
                        {/* Left col: Name + Email */}
                        <div className="space-y-5">
                            <div className="text-xs tracking-widest mb-4" style={{ color: 'rgba(0,255,65,0.35)', userSelect: 'none' }}>
                                // BEGIN WRITE TRANSACTION
                            </div>
                            {REGISTER_FIELDS.filter(f => f.type !== 'textarea').map(field => {
                                const Icon = field.icon;
                                return (
                                    <div key={field.regName} className="space-y-1">
                                        <div className="flex items-center gap-2" style={{ userSelect: 'none' }}>
                                            <span style={{ fontSize: '0.6rem', color: '#00D1FF', opacity: 0.7 }}>{field.addr}</span>
                                            <span style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.5)' }}>‣ {field.regName}</span>
                                            <Icon size={10} style={{ color: 'rgba(0,255,65,0.4)' }} />
                                        </div>
                                        <input
                                            type={field.type}
                                            className="eda-input"
                                            placeholder={`// ${field.placeholder}`}
                                            value={formData[field.regName]}
                                            onChange={e => handleChange(field.regName, e.target.value)}
                                            required
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right col: Message + Submit */}
                        <div className="space-y-5 flex flex-col">
                            {REGISTER_FIELDS.filter(f => f.type === 'textarea').map(field => {
                                const Icon = field.icon;
                                return (
                                    <div key={field.regName} className="space-y-1 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2" style={{ userSelect: 'none' }}>
                                            <span style={{ fontSize: '0.6rem', color: '#00D1FF', opacity: 0.7 }}>{field.addr}</span>
                                            <span style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.5)' }}>‣ {field.regName}</span>
                                            <Icon size={10} style={{ color: 'rgba(0,255,65,0.4)' }} />
                                        </div>
                                        <textarea
                                            className="eda-input resize-none flex-1"
                                            style={{ minHeight: '120px' }}
                                            placeholder={`// ${field.placeholder}`}
                                            value={formData[field.regName]}
                                            onChange={e => handleChange(field.regName, e.target.value)}
                                            required
                                        />
                                    </div>
                                );
                            })}

                            <button
                                type="submit"
                                className="eda-btn w-full flex items-center justify-center gap-2"
                                id="contact-submit-btn"
                            >
                                {submitted ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-eda-green animate-pulse" />
                                        WRITE_COMPLETE
                                    </>
                                ) : (
                                    <>
                                        <Send size={14} />
                                        WRITE_REGISTER → transmit_en
                                    </>
                                )}
                            </button>
                            <div className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)', userSelect: 'none' }}>
                                // Sends to: revanthsai.nandamuri@gmail.com
                            </div>
                        </div>
                    </form>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 pt-6 border-t border-eda-green border-opacity-10 text-center"
                >
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.18)', userSelect: 'none' }}>
                        © 2024 Revanth Sai Nandamuri — Built with ⚡ React + Three.js + GSAP
                    </div>
                    <div className="text-xs font-mono mt-1" style={{ color: 'rgba(255,255,255,0.12)', userSelect: 'none' }}>
                        // EDA_PORTFOLIO_v1.0.0 :: CLK=2GHz :: PVT=TT/0.85V/25°C :: STATUS=NOMINAL
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
