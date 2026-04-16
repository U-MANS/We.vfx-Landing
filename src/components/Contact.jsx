import { useState, useCallback, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useReveal } from '../hooks';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_t358dbv';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const isConfigured = Boolean(TEMPLATE_ID && PUBLIC_KEY);

export default function Contact() {
    const infoRef = useReveal();
    const formWrapperRef = useReveal();
    const [status, setStatus] = useState('idle');
    const [formError, setFormError] = useState('');

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setFormError('');

        if (!isConfigured) {
            setFormError('Falta configurar EmailJS: en la raíz del proyecto crea .env con VITE_EMAILJS_PUBLIC_KEY y VITE_EMAILJS_TEMPLATE_ID (copia .env.example). El service_id ya está definido por defecto.');
            return;
        }

        const form = e.target;
        const templateParams = {
            from_name: form.name.value.trim(),
            from_email: form.email.value.trim(),
            subject: form.subject.value.trim() || '(sin asunto)',
            message: form.message.value.trim(),
        };

        setStatus('sending');

        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY });
            setStatus('success');
            form.reset();
        } catch (err) {
            console.error('EmailJS:', err);
            setStatus('idle');
            setFormError('No se pudo enviar el mensaje. Revisa la consola o la configuración de EmailJS e inténtalo de nuevo.');
        }
    }, []);

    const sending = status === 'sending';
    const success = status === 'success';

    useEffect(() => {
        if (status !== 'success') return;
        const t = setTimeout(() => setStatus('idle'), 5000);
        return () => clearTimeout(t);
    }, [status]);

    return (
        <section className="contact" id="contacto">
            <div className="container">
                <div className="contact-wrapper">
                    <div className="contact-info" ref={infoRef} data-reveal>
                        <span className="section-tag">Contacto</span>
                        <h2 className="section-title">
                            Hablemos de tu<br />próximo proyecto
                        </h2>
                        <p className="contact-desc">
                            ¿Interesado en trabajar juntos? Cuéntanos sobre tu proyecto y nos
                            pondremos en contacto contigo lo antes posible.
                        </p>
                        <div className="contact-details">
                            <div className="contact-detail-item">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                </svg>
                                <a href="mailto:hola@weworkfactory.com">hola@weworkfactory.com</a>
                            </div>
                            <div className="contact-detail-item">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                </svg>
                                <a href="tel:+34687618415">(+34) 687 618 415</a>
                            </div>
                            <div className="contact-detail-item">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                    <path
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                </svg>
                                <span>Emilio Muñoz, 3 — 28037 Madrid, Spain</span>
                            </div>
                        </div>
                    </div>
                    <div className="contact-form-wrapper" ref={formWrapperRef} data-reveal>
                        <form className="contact-form" onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <input type="text" name="name" placeholder="Nombre" required disabled={sending} autoComplete="name" />
                            </div>
                            <div className="form-group">
                                <input type="email" name="email" placeholder="Email" required disabled={sending} autoComplete="email" />
                            </div>
                            <div className="form-group">
                                <input type="text" name="subject" placeholder="Asunto" disabled={sending} autoComplete="off" />
                            </div>
                            <div className="form-group">
                                <textarea name="message" placeholder="Cuéntanos sobre tu proyecto..." rows="5" required disabled={sending} />
                            </div>
                            {formError ? <p className="contact-form-status contact-form-status--error" role="alert">{formError}</p> : null}
                            {success ? (
                                <p className="contact-form-status contact-form-status--success" role="status">
                                    Mensaje enviado correctamente. Te responderemos pronto.
                                </p>
                            ) : null}
                            <button type="submit" className="btn btn-primary btn-full" disabled={sending}>
                                {sending ? (
                                    <>
                                        <span className="contact-btn-spinner" aria-hidden />
                                        Enviando…
                                    </>
                                ) : (
                                    <>
                                        Enviar mensaje
                                        <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                                            <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
