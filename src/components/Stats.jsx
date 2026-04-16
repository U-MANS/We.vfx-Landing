import { useCountUp } from '../hooks';

const STATS = [
    { count: 15, suffix: '+', label: 'Años de experiencia' },
    { count: 200, suffix: '+', label: 'Proyectos completados' },
    { count: 30, suffix: '+', label: 'Profesionales en equipo' },
];

function StatItem({ count, suffix, label }) {
    const [ref, value] = useCountUp(count);

    return (
        <div className="stat-item" ref={ref} data-reveal>
            <span className="stat-number">{value}</span>
            <span className="stat-suffix">{suffix}</span>
            <p className="stat-label">{label}</p>
        </div>
    );
}

export default function Stats() {
    return (
        <section className="stats-section">
            <div className="container">
                <div className="stats-grid">
                    {STATS.map((s) => (
                        <StatItem key={s.label} {...s} />
                    ))}
                </div>
            </div>
        </section>
    );
}
