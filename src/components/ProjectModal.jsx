import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { createPortal, flushSync } from 'react-dom';

function resolveVimeoId(vimeoVideoId, vimeoUrl) {
    if (vimeoVideoId && /^\d+$/.test(String(vimeoVideoId).trim())) return String(vimeoVideoId).trim();
    if (!vimeoUrl) return null;
    const m = String(vimeoUrl).trim().match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? m[1] : null;
}

function buildModalVimeoEmbedSrc(videoId, embedHash) {
    const q = new URLSearchParams({
        badge: '0',
        autopause: '0',
        player_id: '0',
        app_id: '58479',
        title: '0',
        byline: '0',
        portrait: '0',
        color: 'ff4f7b',
    });
    if (embedHash) q.set('h', embedHash);
    return `https://player.vimeo.com/video/${videoId}?${q.toString()}`;
}

function isLikelyImagePoster(url) {
    if (!url || typeof url !== 'string') return false;
    return /\.(gif|png|jpe?g|webp|avif)(\?|$)/i.test(url);
}

/** Modal: mediaUrl (GIF/img en miniatura), videoSrc (MP4 local o URL), Vimeo opcional si no hay videoSrc. */
export default function ProjectModal({
    open,
    onClose,
    title,
    category,
    mediaUrl,
    mediaAlt,
    description,
    children,
    videoSrc,
    vimeoVideoId,
    vimeoUrl,
    vimeoEmbedHash,
}) {
    const closeBtnRef = useRef(null);
    const videoRef = useRef(null);
    const [theaterLayout, setTheaterLayout] = useState(false);
    const [videoPlayGate, setVideoPlayGate] = useState(true);

    const handleVideoPlay = useCallback(() => {
        if (!videoSrc) return;
        const reduceMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
            setTheaterLayout(true);
            return;
        }
        const startVt = document.startViewTransition?.bind(document);
        if (typeof startVt === 'function') {
            startVt(() => {
                flushSync(() => {
                    setTheaterLayout(true);
                });
            });
        } else {
            setTheaterLayout(true);
        }
    }, [videoSrc]);

    useEffect(() => {
        setTheaterLayout(false);
        setVideoPlayGate(true);
    }, [videoSrc, open]);
    const resolvedVimeoId = useMemo(
        () => resolveVimeoId(vimeoVideoId, vimeoUrl),
        [vimeoVideoId, vimeoUrl]
    );
    const vimeoIframeSrc = useMemo(
        () => (resolvedVimeoId ? buildModalVimeoEmbedSrc(resolvedVimeoId, vimeoEmbedHash) : null),
        [resolvedVimeoId, vimeoEmbedHash]
    );
    const vimeoWatchUrl = resolvedVimeoId ? `https://vimeo.com/${resolvedVimeoId}` : null;

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeBtnRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    useEffect(() => {
        if (open) return;
        const v = videoRef.current;
        if (v) {
            v.pause();
            try {
                v.currentTime = 0;
            } catch {
                /* ignore */
            }
        }
    }, [open]);

    const handlePlayOverlayClick = useCallback((e) => {
        e.stopPropagation();
        const v = videoRef.current;
        if (!v) return;
        const p = v.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
    }, []);

    const handleVideoAreaClick = useCallback(() => {
        const v = videoRef.current;
        if (!v || videoPlayGate) return;
        if (v.paused) {
            const p = v.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
        } else {
            v.pause();
        }
    }, [videoPlayGate]);

    const videoPoster = mediaUrl && isLikelyImagePoster(mediaUrl) ? mediaUrl : undefined;
    const showVimeoEmbed = Boolean(vimeoIframeSrc && !videoSrc);

    if (!open || typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="project-modal-overlay"
            onClick={onClose}
            role="presentation"
        >
            <div
                className={`project-modal${theaterLayout && videoSrc ? ' project-modal--theater' : ''}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-modal-title"
            >
                <button
                    ref={closeBtnRef}
                    type="button"
                    className="project-modal-close"
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <div
                    className={`project-modal-inner${videoSrc ? ' project-modal-inner--local-video' : ''}${theaterLayout && videoSrc ? ' project-modal-inner--theater' : ''}`}
                >
                    {videoSrc ? (
                        <div
                            className="project-modal-media project-modal-media--video"
                            role="presentation"
                        >
                            <div className="project-modal-video-slot">
                                <video
                                    ref={videoRef}
                                    key={videoSrc}
                                    src={videoSrc}
                                    playsInline
                                    preload="metadata"
                                    poster={videoPoster}
                                    title={mediaAlt || title || 'Vídeo del proyecto'}
                                    onPlay={() => {
                                        setVideoPlayGate(false);
                                        handleVideoPlay();
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVideoAreaClick();
                                    }}
                                />
                                {videoPlayGate ? (
                                    <button
                                        type="button"
                                        className="project-modal-video-playlayer"
                                        onClick={handlePlayOverlayClick}
                                        aria-label="Reproducir vídeo"
                                    >
                                        <span className="project-modal-video-playlayer__icon" aria-hidden>
                                            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                                                <circle cx="28" cy="28" r="27" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                                                <path
                                                    d="M23 18L40 28L23 38V18Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </span>
                                        <span className="project-modal-video-playlayer__hint">Reproducir</span>
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ) : mediaUrl ? (
                        <div className="project-modal-media">
                            <img
                                src={mediaUrl}
                                alt={mediaAlt || title}
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <div className="project-modal-media project-modal-media--empty">
                            <span>Próximamente</span>
                        </div>
                    )}

                    <div
                        className={`project-modal-body${theaterLayout && videoSrc ? ' project-modal-body--theater' : ''}`}
                    >
                        {category ? (
                            <span className="project-modal-category">{category}</span>
                        ) : null}
                        <h2 id="project-modal-title" className="project-modal-title">
                            {title}
                        </h2>
                        {description ? (
                            <p className="project-modal-desc">{description}</p>
                        ) : null}
                        {children ? <div className="project-modal-extra">{children}</div> : null}
                    </div>
                </div>

                {showVimeoEmbed ? (
                    <div className="project-modal-video-block">
                        <span className="project-modal-video-label">Pieza en vídeo</span>
                        <div className="project-modal-video-frame">
                            <iframe
                                src={vimeoIframeSrc}
                                title={title ? `${title} — Vimeo` : 'Vimeo'}
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                            />
                        </div>
                        {vimeoWatchUrl ? (
                            <a
                                href={vimeoWatchUrl}
                                className="project-modal-vimeo-link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Abrir en Vimeo ↗
                            </a>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>,
        document.body
    );
}
