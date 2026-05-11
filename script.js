document.addEventListener('DOMContentLoaded', () => {
    const terminalContent = document.getElementById('terminal-content');
    const terminalPreview = document.getElementById('terminal-preview');
    const sequence = [
        { text: '$ npm install -g deepclause-sdk', type: 'command', delay: 560 },
        { text: 'added 1 package in 3s', type: 'output', delay: 360 },
        { text: '$ export OPENAI_API_KEY="sk-..."', type: 'command', delay: 420 },
        { text: '$ deepclause init --model openai:gpt-4o', type: 'command', delay: 560 },
        { text: 'created .deepclause/config.json', type: 'muted', delay: 220 },
        { text: 'created .deepclause/tools/', type: 'muted', delay: 220 },
        { text: '$ deepclause', type: 'command', delay: 520 },
        { text: 'opening fullscreen TUI coding agent...', type: 'muted', delay: 400 },
        { type: 'preview', delay: 3000 }
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

    async function showPreview(duration) {
        if (!terminalPreview || !terminalContent) {
            await wait(duration);
            return;
        }

        terminalContent.classList.add('previewing');
        terminalPreview.classList.add('active');
        await wait(duration);
        terminalPreview.classList.remove('active');
        terminalContent.classList.remove('previewing');
        await wait(220);
    }

    async function renderSequence() {
        if (!terminalContent) {
            return;
        }

        terminalContent.textContent = '';
        terminalContent.classList.remove('previewing');
        terminalPreview?.classList.remove('active');

        for (const line of sequence) {
            if (line.type === 'preview') {
                await showPreview(line.delay);
                continue;
            }

            const row = document.createElement('div');
            row.className = `terminal-line ${line.type}`;
            terminalContent.appendChild(row);

            if (line.type === 'command') {
                await typeText(row, line.text, 15);
            } else {
                row.textContent = line.text;
            }

            terminalContent.scrollTop = terminalContent.scrollHeight;
            await wait(line.delay);
        }

        await wait(1000);
        renderSequence();
    }

    void renderSequence();

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
