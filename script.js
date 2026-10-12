document.addEventListener('DOMContentLoaded', () => {
    // ---- mermaid diagrams ----
    if (window.mermaid) {
        window.mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            theme: 'base',
            flowchart: {
                curve: 'basis',
                htmlLabels: true,
                nodeSpacing: 45,
                rankSpacing: 72,
                padding: 14,
                useMaxWidth: true
            },
            themeVariables: {
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                fontSize: '15px',
                primaryColor: '#ffffff',
                primaryTextColor: '#16181d',
                primaryBorderColor: '#cac2b4',
                lineColor: '#0a7a8c',
                secondaryColor: '#f1eee7',
                tertiaryColor: '#eef6f7',
                edgeLabelBackground: '#f7f5f0'
            }
        });

        window.mermaid.run({ querySelector: '.mermaid' }).catch((error) => {
            console.error('mermaid render failed', error);
        });
    }

    // ---- hero film (film/index.html in an iframe) ----
    const filmFrame = document.getElementById('film-frame');
    const film = document.getElementById('hero-film');

    if (filmFrame && film) {
        // Small screens get the square cut, which stays readable when scaled down.
        const square = window.matchMedia('(max-width: 640px)').matches;
        filmFrame.classList.toggle('is-square', square);
        film.src = square ? film.dataset.srcSquare : film.dataset.srcWide;

        // Pause the film while it is off screen.
        const post = (action) => {
            if (film.contentWindow) {
                film.contentWindow.postMessage({ dcFilm: action }, '*');
            }
        };
        const filmObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => post(entry.isIntersecting ? 'play' : 'pause'));
        }, { threshold: 0.2 });
        film.addEventListener('load', () => filmObserver.observe(filmFrame));
    }

    // ---- click-to-enlarge lightbox ----
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg) {
        const closeLightbox = () => {
            lightbox.hidden = true;
            lightboxImg.removeAttribute('src');
            document.body.style.overflow = '';
        };

        document.querySelectorAll('.zoomable').forEach((img) => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.dataset.full || img.src;
                lightboxImg.alt = img.alt || '';
                lightbox.hidden = false;
                lightbox.scrollTop = 0;
                document.body.style.overflow = 'hidden';
            });
        });

        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        const closeButton = lightbox.querySelector('.lightbox-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeLightbox);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !lightbox.hidden) {
                closeLightbox();
            }
        });
    }

    // ---- reveal on scroll ----
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
});
