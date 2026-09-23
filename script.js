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

    // ---- hero terminal + chat animation ----
    const terminalContent = document.getElementById('terminal-content');
    const chatContent = document.getElementById('chat-content');
    const heroTitle = document.getElementById('hero-title');
    const heroMeta = document.getElementById('hero-meta');

    const cliLines = [
        { text: '$ npm install -g deepclause-sop2harness', type: 'command', delay: 520 },
        { text: 'added 1 package in 2s', type: 'muted', delay: 400 },
        { text: '$ s2h init', type: 'command', delay: 460 },
        { text: 'scaffolded harness/ · seeded .pi/deepclause/', type: 'output', delay: 500 },
        { text: '$ s2h create "Turn our antenatal care SOP into a harness" --file ./sops/anc-guidelines.pdf', type: 'command', delay: 950 },
        { text: 'ingested anc-guidelines.pdf · pi session authoring skills/anc-routine-care.dml', type: 'diagram', delay: 700 },
        { text: 'validated 3 skills · wrote harness.json + AGENTS.md', type: 'output', delay: 620 },
        { text: '$ s2h commit -m "add antenatal care workflow"', type: 'command', delay: 700 },
        { text: 'harness v0.1.0 · tagged', type: 'output', delay: 520 },
        { text: '$ s2h export --out ./export', type: 'command', delay: 700 },
        { text: 'API + web chat + MCP server + Dockerfile', type: 'output', delay: 1400 }
    ];

    const chatScript = [
        { role: 'user', text: 'First antenatal visit: 26y, 10 weeks, no prior complications.', delay: 680 },
        { role: 'route', text: 'route: anc-routine-care (trigger)', delay: 520 },
        { role: 'assistant', text: 'Decision: routine care — no referral.\n\nPlan (ANC SOP §4.2):\n1. Booking bloods: FBC, group & Rh, HbA1c, HIV, syphilis, HBsAg.\n2. Folic acid 5 mg + iron/folate; calcium if intake is low.\n3. Visits: 4 by 28 wks, 2-weekly to 36, then weekly.\n4. Verify 4/4 post-conditions, then book the next visit.', type: true, delay: 1400 },
        { role: 'usage', text: '1,842 in · 318 out · 3.4s', delay: 2600 }
    ];

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function typeText(element, text, speed, scroller) {
        for (const char of text) {
            element.textContent += char;
            if (scroller) {
                scroller.scrollTop = scroller.scrollHeight;
            }
            await wait(speed);
        }
    }

    function appendLine(text, type) {
        const row = document.createElement('div');
        row.className = `terminal-line ${type}`;
        row.textContent = text;
        terminalContent.appendChild(row);
        terminalContent.scrollTop = terminalContent.scrollHeight;
        return row;
    }

    function appendMessage(role) {
        const row = document.createElement('div');
        row.className = `chat-msg ${role}`;
        chatContent.appendChild(row);
        chatContent.scrollTop = chatContent.scrollHeight;
        return row;
    }

    async function runTerminal() {
        terminalContent.hidden = false;
        chatContent.hidden = true;
        terminalContent.textContent = '';
        heroTitle.textContent = 'terminal';
        heroMeta.textContent = 'sop2harness CLI';

        for (const line of cliLines) {
            const row = appendLine('', line.type);
            if (line.type === 'command') {
                await typeText(row, line.text, 16, terminalContent);
            } else {
                row.textContent = line.text;
            }
            terminalContent.scrollTop = terminalContent.scrollHeight;
            await wait(line.delay);
        }
        await wait(1000);
    }

    async function runChat() {
        terminalContent.hidden = true;
        chatContent.hidden = false;
        chatContent.textContent = '';
        heroTitle.textContent = 'web chat';
        heroMeta.textContent = 'who-anc · v0.1.0';

        for (const message of chatScript) {
            const row = appendMessage(message.role);
            if (message.type) {
                row.classList.add('typing');
                await typeText(row, message.text, 13, chatContent);
                row.classList.remove('typing');
            } else {
                row.textContent = message.text;
            }
            chatContent.scrollTop = chatContent.scrollHeight;
            await wait(message.delay);
        }
    }

    async function runHeroAnimation() {
        if (!terminalContent || !chatContent) {
            return;
        }
        for (;;) {
            await runTerminal();
            await runChat();
        }
    }

    void runHeroAnimation();

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
