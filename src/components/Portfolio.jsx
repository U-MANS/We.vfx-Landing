import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { useReveal } from '../hooks';
import ProjectModal from './ProjectModal';

const GIF_BALCON = 'https://weworkfactory.com/wp-content/uploads/2024/03/20240306_GIF_LD_BALCON_420x540.gif';
const GIF_REPSOL_MM = 'https://weworkfactory.com/wp-content/uploads/2024/03/20240306_GIF_REPSOL_MARC_MARQUEZ_420x540_V2.gif';
const GIF_HYUNDAI_MIREIA = 'https://weworkfactory.com/wp-content/uploads/2023/12/20240306_GIF_HYUNDAI_MIREIA_420x540.gif';

/** Vídeos en `public/assets/` (ruta URL-encoded si el nombre lleva espacios). */
const VIDEO_LINEA_DIRECTA = `/assets/${encodeURIComponent('linea directa.mp4')}`;
const VIDEO_REPSOL = '/assets/repsol.mp4';
const VIDEO_HYUNDAI = '/assets/video-hyundai.mp4';

const PROJECTS = [
    {
        id: 'proj-01',
        category: 'Publicidad',
        title: 'Un Tipo Directo',
        thumb: GIF_BALCON,
        modal: {
            title: 'Un Tipo Directo',
            category: 'Publicidad',
            mediaUrl: GIF_BALCON,
            mediaAlt: 'Un tipo directo',
            videoSrc: VIDEO_LINEA_DIRECTA,
        },
    },
    {
        id: 'proj-02',
        category: 'Publicidad',
        title: 'Repsol Marc Márquez',
        thumb: GIF_REPSOL_MM,
        modal: {
            title: 'Repsol Marc Márquez',
            category: 'Publicidad',
            mediaUrl: GIF_REPSOL_MM,
            mediaAlt: 'Repsol Marc Márquez',
            videoSrc: VIDEO_REPSOL,
        },
    },
    {
        id: 'proj-03',
        category: 'Publicidad',
        title: 'Hyundai Mireia',
        thumb: GIF_HYUNDAI_MIREIA,
        modal: {
            title: 'Hyundai Mireia',
            category: 'Publicidad',
            mediaUrl: GIF_HYUNDAI_MIREIA,
            mediaAlt: 'Hyundai Mireia',
            videoSrc: VIDEO_HYUNDAI,
        },
    },
];

/** Reel VFX en `public/assets/` — Vite sirve `public/` desde la raíz del sitio. */
const REEL_VIDEO_SRC = '/assets/3838956256.mp4';

function ProjectCard({ id, category, title, thumb, onSelect }) {
    const wrapperRef = useReveal();
    const cardRef = useRef(null);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;

        const handleMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rx = ((y - rect.height / 2) / (rect.height / 2)) * -6;
            const ry = ((x - rect.width / 2) / (rect.width / 2)) * 6;
            gsap.to(el, { rotateX: rx, rotateY: ry, duration: 0.15, ease: 'power2.out', transformPerspective: 800 });
            el.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
            el.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
        };

        const handleMouseLeave = () => {
            gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.4, ease: 'power2.out' });
        };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className="project-item" ref={wrapperRef} data-reveal>
            <div
                className="project-card"
                ref={cardRef}
                onClick={() => onSelect?.(id)}
            >
                <div className="project-thumb">
                    {thumb ? (
                        <img src={thumb} alt={title} loading="lazy" />
                    ) : (
                        <div className="project-thumb-placeholder">
                            <span className="placeholder-icon">&#9655;</span>
                        </div>
                    )}
                </div>
                <div className="project-info">
                    <span className="project-category">{category}</span>
                    <h3 className="project-title">{title}</h3>
                </div>
                <div className="project-hover-border" />
            </div>
        </div>
    );
}

function ReelShowcase() {
    const reelRef = useReveal();
    const frameRef = useRef(null);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = useCallback(() => {
        setIsPlaying(true);
        if (frameRef.current) {
            gsap.fromTo(frameRef.current,
                { opacity: 0, scale: 0.97 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
            );
        }
    }, []);

    useEffect(() => {
        if (!isPlaying) return;
        const v = videoRef.current;
        if (!v) return;
        const p = v.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
    }, [isPlaying]);

    return (
        <div className="reel-showcase" ref={reelRef} data-reveal>
            <div className="reel-container">
                {!isPlaying && (
                    <div className="reel-poster" onClick={handlePlay} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePlay(); } }}>
                        <div className="reel-poster-bg" />
                        <div className="reel-play-btn">
                            <svg viewBox="0 0 80 80" fill="none">
                                <circle cx="40" cy="40" r="39" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                                <circle cx="40" cy="40" r="39" stroke="url(#playGrad)" strokeWidth="2" strokeDasharray="245" strokeDashoffset="245" className="reel-play-circle" />
                                <path d="M33 25L57 40L33 55V25Z" fill="white" />
                                <defs>
                                    <linearGradient id="playGrad" x1="0" y1="0" x2="80" y2="80">
                                        <stop offset="0%" stopColor="#FF4F7B" />
                                        <stop offset="100%" stopColor="#4A6CF7" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="reel-poster-label">
                            <span className="reel-label-tag">WEWORK REEL VFX</span>
                            <span className="reel-label-cta">Reproducir reel</span>
                        </div>
                    </div>
                )}
                <div
                    className="reel-iframe-wrap reel-video-wrap"
                    ref={frameRef}
                    style={{ opacity: isPlaying ? 1 : 0, pointerEvents: isPlaying ? 'auto' : 'none' }}
                >
                    {isPlaying && (
                        <video
                            ref={videoRef}
                            className="reel-video"
                            src={REEL_VIDEO_SRC}
                            controls
                            playsInline
                            loop
                            preload="auto"
                            title="WEWORK REEL VFX"
                        />
                    )}
                </div>
            </div>
            <div className="reel-glow" />
        </div>
    );
}

export default function Portfolio() {
    const headerRef = useReveal();
    const gridRef = useRef(null);
    const [selectedId, setSelectedId] = useState(null);

    const selectedProject = useMemo(
        () => PROJECTS.find((p) => p.id === selectedId) ?? null,
        [selectedId]
    );

    const handleProjectSelect = useCallback((id) => {
        setSelectedId(id);
    }, []);

    const modalProps = selectedProject
        ? {
            title: selectedProject.modal?.title ?? selectedProject.title,
            category: selectedProject.modal?.category ?? selectedProject.category,
            mediaUrl: selectedProject.modal?.mediaUrl ?? selectedProject.thumb ?? undefined,
            mediaAlt: selectedProject.modal?.mediaAlt ?? selectedProject.title,
            description: selectedProject.modal?.description,
            children: selectedProject.modal?.children,
            videoSrc: selectedProject.modal?.videoSrc,
            vimeoVideoId: selectedProject.modal?.vimeoVideoId,
            vimeoUrl: selectedProject.modal?.vimeoUrl,
            vimeoEmbedHash: selectedProject.modal?.vimeoEmbedHash,
        }
        : {
            title: '',
            category: undefined,
            mediaUrl: undefined,
            mediaAlt: undefined,
            description: undefined,
            children: undefined,
            videoSrc: undefined,
            vimeoVideoId: undefined,
            vimeoUrl: undefined,
            vimeoEmbedHash: undefined,
        };

    return (
        <section className="portfolio" id="portfolio">
            <ProjectModal
                open={selectedId !== null}
                onClose={() => setSelectedId(null)}
                {...modalProps}
            />
            <div className="container">
                <div className="section-header" ref={headerRef} data-reveal>
                    <span className="section-tag">Portfolio</span>
                    <h2 className="section-title">Nuestros Proyectos</h2>
                    <p className="section-desc">
                        Implementamos tecnologías avanzadas en nuestras etapas de producción
                        y en la creación de efectos visuales, ofreciendo resultados innovadores
                        y de vanguardia.
                    </p>
                </div>

                <ReelShowcase />

                <div className="projects-divider">
                    <span className="divider-line" />
                    <span className="divider-label">Proyectos destacados</span>
                    <span className="divider-line" />
                </div>

                <div className="projects-grid" ref={gridRef}>
                    {PROJECTS.map((p) => (
                        <ProjectCard key={p.id} {...p} onSelect={handleProjectSelect} />
                    ))}
                </div>
            </div>
        </section>
    );
}
