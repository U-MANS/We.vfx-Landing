import { useEffect, useRef, useState } from 'react';

export function useReveal(options = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('revealed');
                    observer.unobserve(el);
                }
            },
            {
                threshold: options.threshold ?? 0.15,
                rootMargin: options.rootMargin ?? '0px 0px -40px 0px'
            }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return ref;
}

export function useCountUp(target, duration = 2000) {
    const ref = useRef(null);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('revealed');
                    const startTime = performance.now();

                    function easeOutQuart(t) {
                        return 1 - Math.pow(1 - t, 4);
                    }

                    function update(now) {
                        const progress = Math.min((now - startTime) / duration, 1);
                        setValue(Math.round(target * easeOutQuart(progress)));
                        if (progress < 1) requestAnimationFrame(update);
                    }

                    requestAnimationFrame(update);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return [ref, value];
}

export function scrollToSection(e, id) {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}
