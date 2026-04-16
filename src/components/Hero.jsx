import { useEffect, useRef, useCallback, useMemo } from 'react';
import { scrollToSection } from '../hooks';
import LiquidEther from './LiquidEther';

/** Mismo asset que el reel del portfolio (`public/assets/`). */
const HERO_REEL_VIDEO_SRC = '/assets/3838956256.mp4';
// import FloatingLines from './FloatingLines';
// import Hyperspeed from './Hyperspeed';

/*
 * === BACKGROUND ALTERNATIVAS — guardadas para uso futuro ===
 *
 * ─── Hyperspeed ───
 * Para re-activar: descomentar import Hyperspeed, reemplazar <LiquidEther .../> por
 * <Hyperspeed effectOptions={HYPERSPEED_OPTIONS} /> en el div hero-bg.
 *
 * const HYPERSPEED_OPTIONS = {
 *     distortion: 'turbulentDistortion',
 *     length: 400,
 *     roadWidth: 10,
 *     islandWidth: 2,
 *     lanesPerRoad: 4,
 *     fov: 90,
 *     fovSpeedUp: 150,
 *     speedUp: 2,
 *     carLightsFade: 0.4,
 *     totalSideLightSticks: 20,
 *     lightPairsPerRoadWay: 40,
 *     shoulderLinesWidthPercentage: 0.05,
 *     brokenLinesWidthPercentage: 0.1,
 *     brokenLinesLengthPercentage: 0.5,
 *     lightStickWidth: [0.12, 0.5],
 *     lightStickHeight: [1.3, 1.7],
 *     movingAwaySpeed: [60, 80],
 *     movingCloserSpeed: [-120, -160],
 *     carLightsLength: [400 * 0.03, 400 * 0.2],
 *     carLightsRadius: [0.05, 0.14],
 *     carWidthPercentage: [0.3, 0.5],
 *     carShiftX: [-0.8, 0.8],
 *     carFloorSeparation: [0, 5],
 *     colors: {
 *         roadColor: 0x080808,
 *         islandColor: 0x0a0a0a,
 *         background: 0x000000,
 *         shoulderLines: 0x131318,
 *         brokenLines: 0x131318,
 *         leftCars: [0xff4f7b, 0x6750a2, 0xc247ac],
 *         rightCars: [0x4a6cf7, 0x0e5ea5, 0x1b1464],
 *         sticks: 0xff4f7b,
 *     },
 * };
 *
 * ─── FloatingLines ───
 * Para re-activar: descomentar import FloatingLines, reemplazar <LiquidEther .../> por:
 * <FloatingLines
 *     enabledWaves={['top', 'middle', 'bottom']}
 *     lineCount={9}
 *     lineDistance={22}
 *     bendRadius={11.5}
 *     bendStrength={-4.5}
 *     interactive
 *     parallax={true}
 *     animationSpeed={1}
 *     linesGradient={['#e945f5', '#6366F1', '#49266b']}
 * />
 */

export default function Hero() {
    const heroRef = useRef(null);
    const particlesRef = useRef(null);
    const contentRef = useRef(null);
    const bgRef = useRef(null);
    const gridRef = useRef(null);
    const reelVideoRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
    const rafRef = useRef(null);

    const reelRevealRef = useMemo(() => {
        if (typeof window === 'undefined') return null;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? null : reelVideoRef;
    }, []);

    useEffect(() => {
        const container = particlesRef.current;
        if (!container) return;
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (8 + Math.random() * 14) + 's';
            p.style.animationDelay = Math.random() * 10 + 's';
            p.style.width = p.style.height = (1 + Math.random() * 2.5) + 'px';
            p.style.background = `hsl(${Math.random() > 0.5 ? 340 : 230}, 80%, 65%)`;
            container.appendChild(p);
        }
        return () => { container.innerHTML = ''; };
    }, []);

    const lerp = useCallback((a, b, t) => a + (b - a) * t, []);

    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;

        const handleMouseMove = (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            mouseRef.current.targetX = (x - 0.5) * 2;
            mouseRef.current.targetY = (y - 0.5) * 2;

        };

        const handleMouseLeave = () => {
            mouseRef.current.targetX = 0;
            mouseRef.current.targetY = 0;
        };

        const animate = () => {
            const m = mouseRef.current;
            m.x = lerp(m.x, m.targetX, 0.06);
            m.y = lerp(m.y, m.targetY, 0.06);

            if (contentRef.current) {
                const badge = contentRef.current.querySelector('.hero-badge');
                const title = contentRef.current.querySelector('.hero-title');
                const subtitle = contentRef.current.querySelector('.hero-subtitle');
                const cta = contentRef.current.querySelector('.hero-cta');

                if (badge) badge.style.transform = `translate(${m.x * -25}px, ${m.y * -20}px)`;
                if (title) title.style.transform = `translate(${m.x * -15}px, ${m.y * -12}px)`;
                if (subtitle) subtitle.style.transform = `translate(${m.x * -8}px, ${m.y * -6}px)`;
                if (cta) cta.style.transform = `translate(${m.x * -5}px, ${m.y * -4}px)`;
            }

            if (bgRef.current) {
                bgRef.current.style.transform = `translate(${m.x * 20}px, ${m.y * 15}px) scale(1.05)`;
            }

            if (gridRef.current) {
                gridRef.current.style.transform = `translate(${m.x * 12}px, ${m.y * 10}px)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        hero.addEventListener('mousemove', handleMouseMove);
        hero.addEventListener('mouseleave', handleMouseLeave);
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            hero.removeEventListener('mousemove', handleMouseMove);
            hero.removeEventListener('mouseleave', handleMouseLeave);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [lerp]);

    useEffect(() => {
        if (!reelRevealRef) return;
        const v = reelVideoRef.current;
        if (!v) return;
        v.muted = true;
        v.playsInline = true;
        v.setAttribute('playsinline', '');
        const p = v.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
    }, [reelRevealRef]);

    return (
        <section className="hero" id="home" ref={heroRef}>
            <div className="hero-bg" ref={bgRef}>
                <video
                    ref={reelVideoRef}
                    className="hero-reel-feed"
                    src={HERO_REEL_VIDEO_SRC}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    tabIndex={-1}
                />
                <LiquidEther
                   colors={[ '#5227FF', '#FF9FFC', '#B497CF' ]}
                   mouseForce={20}
                   cursorSize={170}
                   isViscous
                   viscous={30}
                   iterationsViscous={32}
                   iterationsPoisson={32}
                   resolution={0.5}
                   isBounce={false}
                   autoDemo
                   autoSpeed={0.5}
                   autoIntensity={2.2}
                   takeoverDuration={0.25}
                   autoResumeDelay={3000}
                   autoRampDuration={0.6}
                   color0="#5227FF"
                   color1="#FF9FFC"
                   color2="#B497CF"
                   revealVideoRef={reelRevealRef}
                />
                <div className="hero-gradient" />
                <div className="hero-particles" ref={particlesRef} />
                <div className="hero-grid-overlay" ref={gridRef} />
            </div>
            <div className="hero-content" ref={contentRef}>
                <div className="hero-badge">
                    <span className="badge-dot" />
                    Producción &middot; Supervisión &middot; CGI
                </div>
                <h1 className="hero-title">
                    <span className="title-line">Efectos Visuales</span>
                    <span className="title-line accent">de Vanguardia</span>
                </h1>
                <p className="hero-subtitle">
                    Equipo de profesionales con dilatada experiencia en producción,
                    supervisión, composición y CGI, avalados con reconocimientos en
                    certámenes internacionales.
                </p>
                <div className="hero-cta">
                    <a href="#portfolio" className="btn btn-primary" onClick={(e) => scrollToSection(e, 'portfolio')}>
                        Ver Portfolio
                    </a>
                    <a href="#contacto" className="btn btn-outline" onClick={(e) => scrollToSection(e, 'contacto')}>
                        Contactar
                    </a>
                </div>
            </div>
            <div className="hero-scroll-indicator">
                <div className="scroll-line" />
                <span>Scroll</span>
            </div>
        </section>
    );
}
