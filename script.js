document.addEventListener('DOMContentLoaded', () => {
    // ---- hero terminal animation ----
    const terminalContent = document.getElementById('terminal-content');
    const sequence = [
        { text: '$ pi install git:github.com/deepclause/deepclause-pi', type: 'command', delay: 440 },
        { text: 'installed pi package deepclause-pi', type: 'muted', delay: 260 },
        { text: '$ pi', type: 'command', delay: 380 },
        { text: '> Resolve case AA45175 per the overpayment SOP.', type: 'command', delay: 580 },
        { text: '[deepclause] disposition: $1,275 overpaid', type: 'output', delay: 320 },
        { text: '             re-class $425 + refund $850', type: 'output', delay: 280 },
        { text: '[deepclause] verify: PASS — 7/7 post-conditions', type: 'output', delay: 400 },
        { text: '> Show me a diagram of the policy.', type: 'command', delay: 580 },
        { text: '[deepclause] rendering presentation + spec diagrams', type: 'muted', delay: 340 },
        { text: ' +---------+   +---------+   +---------+', type: 'diagram', delay: 90 },
        { text: ' | request |-->| compute |-->| verify  |', type: 'diagram', delay: 90 },
        { text: ' +---------+   +---------+   +---------+', type: 'diagram', delay: 90 },
        { text: '    |             |             |', type: 'diagram', delay: 90 },
        { text: '    +--- rules ---+--- state ---+', type: 'diagram', delay: 360 },
        { text: '[deepclause] opening diagrams/viewer.html', type: 'output', delay: 420 },
        { text: 'Done. Two views ready; click to enlarge.', type: 'output', delay: 1500 }
    ];

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function typeText(element, text, speed) {
        for (const char of text) {
            element.textContent += char;
            terminalContent.scrollTop = terminalContent.scrollHeight;
            await wait(speed);
        }
    }

    async function renderSequence() {
        if (!terminalContent) {
            return;
        }

        terminalContent.textContent = '';

        for (const line of sequence) {
            const row = document.createElement('div');
            row.className = `terminal-line ${line.type}`;
            terminalContent.appendChild(row);

            if (line.type === 'command') {
                await typeText(row, line.text, 13);
            } else {
                row.textContent = line.text;
            }

            terminalContent.scrollTop = terminalContent.scrollHeight;
            await wait(line.delay);
        }

        await wait(1600);
        renderSequence();
    }

    void renderSequence();

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
