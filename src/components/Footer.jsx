import { scrollToSection } from '../hooks';

const LINKS = [
    { id: 'home', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'contacto', label: 'Contacto' },
];

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <img src="/logo.png" alt="We.VFX" />
                    </div>
                    <div className="footer-links">
                        {LINKS.map((link) => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                onClick={(e) => scrollToSection(e, link.id)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2009 - 2026 WeWork Factory, S.L. — Todos los derechos reservados.</p>
                        <a
                            href="https://weworkfactory.com/aviso-legal/"
                            className="footer-legal"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Aviso legal
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
