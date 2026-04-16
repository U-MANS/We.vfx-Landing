import { useReveal } from '../hooks';

const SERVICES = [
    {
        icon: (
            <svg viewBox="0 0 48 48" fill="none">
                <path d="M24 4L6 14v20l18 10 18-10V14L24 4z" stroke="currentColor" strokeWidth="2" />
                <path d="M6 14l18 10m0 0l18-10m-18 10v20" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
        title: 'CGI',
        desc: 'Creación de entornos, personajes y objetos tridimensionales fotorrealistas.',
    },
    {
        icon: (
            <svg viewBox="0 0 48 48" fill="none">
                <rect x="4" y="8" width="40" height="28" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M20 18l8 6-8 6V18z" fill="currentColor" />
                <path d="M16 40h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        title: 'Producción',
        desc: 'Desarrollo integral de contenidos audiovisuales, publicidad y ficción.',
    },
    {
        icon: (
            <svg viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
                <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="M24 4v8m0 24v8M4 24h8m24 0h8" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
        title: 'Supervisión VFX',
        desc: 'Supervisión en set y en postproducción para garantizar la calidad visual.',
    },
    {
        icon: (
            <svg viewBox="0 0 48 48" fill="none">
                <path d="M8 8h12v12H8zM28 8h12v12H28zM8 28h12v12H8zM28 28h12v12H28z" stroke="currentColor" strokeWidth="2" />
                <path d="M14 14l6 6M28 14l-6 6M14 28l6-6M28 28l-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        title: 'Composición',
        desc: 'Integración de capas y elementos visuales para un resultado impecable.',
    },
];

function ServiceCard({ icon, title, desc }) {
    const ref = useReveal();
    return (
        <div className="service-item" ref={ref} data-reveal>
            <div className="service-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
        </div>
    );
}

export default function Services() {
    return (
        <section className="services-strip">
            <div className="container">
                <div className="services-grid">
                    {SERVICES.map((s) => (
                        <ServiceCard key={s.title} {...s} />
                    ))}
                </div>
            </div>
        </section>
    );
}
