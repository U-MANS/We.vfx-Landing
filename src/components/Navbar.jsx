import { useState, useEffect } from 'react';
import { scrollToSection } from '../hooks';

const LINKS = [
    { id: 'home', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'contacto', label: 'Contacto' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.pageYOffset > 50);

            const scrollPos = window.pageYOffset + window.innerHeight / 3;
            document.querySelectorAll('section[id]').forEach((section) => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');
                if (scrollPos >= top && scrollPos < top + height) {
                    setActiveSection(id);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = (e, id) => {
        setMenuOpen(false);
        document.body.style.overflow = '';
        scrollToSection(e, id);
    };

    const toggleMenu = () => {
        const next = !menuOpen;
        setMenuOpen(next);
        document.body.style.overflow = next ? 'hidden' : '';
    };

    return (
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
            <div className="nav-container">
                <a href="#home" className="nav-logo" onClick={(e) => handleLinkClick(e, 'home')}>
                    <img src="/logo.png" alt="We.VFX Logo" />
                </a>
                <div className={`nav-menu${menuOpen ? ' open' : ''}`}>
                    {LINKS.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            className={`nav-link${activeSection === link.id ? ' active' : ''}`}
                            onClick={(e) => handleLinkClick(e, link.id)}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
                <button
                    className={`nav-toggle${menuOpen ? ' active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Abrir menú"
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>
        </nav>
    );
}
