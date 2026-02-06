document.addEventListener('DOMContentLoaded', () => {
    const terminalContent = document.getElementById('terminal-content');

    const sequence = [
        { text: "> const vm = new AgentVM({ network: true });", delay: 50 },
        { text: "> await vm.start();", delay: 50 },
        { text: "[System] Booting Alpine Linux (WASM)...", delay: 800, color: "#aaa" },
        { text: "[System] Network initialized. IP: 10.0.2.15", delay: 500, color: "#aaa" },
        { text: "> await vm.exec('python3 -c \"print(\"Hello OpenClaw\")\"');", delay: 50 },
        { text: "Hello OpenClaw", delay: 300, color: "var(--color-fg)" },
        { text: "> await vm.exec('curl -I google.com');", delay: 50 },
        { text: "HTTP/1.1 200 OK\nDate: Mon, 02 Feb 2026 12:00:00 GMT\nContent-Type: text/html; charset=ISO-8859-1", delay: 400, color: "#aaa" },
        { text: "> // Agent finished task safely.", delay: 50, color: "#0066cc" }
    ];

    let currentLine = 0;

    async function typeLine(lineObj) {
        const div = document.createElement('div');
        div.style.marginBottom = "4px";
        if (lineObj.color) div.style.color = lineObj.color;

        terminalContent.appendChild(div);

        const text = lineObj.text;

        // If it starts with '>', type it out accurately
        if (text.startsWith('>')) {
            div.textContent = "> ";
            for (let i = 1; i < text.length; i++) {
                div.textContent += text[i];
                await new Promise(r => setTimeout(r, Math.random() * 30 + 20));
            }
        } else {
            // System output appears instantly or in chunks
            div.textContent = text;
        }

        // Scroll to bottom
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    async function runSequence() {
        for (const line of sequence) {
            await typeLine(line);
            await new Promise(r => setTimeout(r, line.delay));
        }
    }

    // Start after a short delay
    setTimeout(runSequence, 1000);

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Carousel Logic
    const track = document.querySelector('.agent-track');
    const cards = document.querySelectorAll('.agent-card');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track && cards.length > 0) {
        // Generate dots
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                scrollToIndex(index);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        // Navigation Buttons
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                const currentIndex = getActiveIndex();
                if (currentIndex > 0) {
                    scrollToIndex(currentIndex - 1);
                }
            });

            nextBtn.addEventListener('click', () => {
                const currentIndex = getActiveIndex();
                if (currentIndex < cards.length - 1) {
                    scrollToIndex(currentIndex + 1);
                }
            });
        }

        function getActiveIndex() {
            const cardWidth = cards[0].offsetWidth + 30; // 30 is gap
            return Math.round(track.scrollLeft / cardWidth);
        }

        function scrollToIndex(index) {
            const cardWidth = cards[0].offsetWidth + 30;
            track.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
        }

        // Update active dot on scroll
        track.addEventListener('scroll', () => {
            const activeIndex = getActiveIndex();
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });

    }

    // Toggle Logic
    const btnHuman = document.getElementById('btn-human');
    const btnAgent = document.getElementById('btn-agent');
    const viewHuman = document.getElementById('view-human');
    const viewAgent = document.getElementById('view-agent');

    if (btnHuman && btnAgent && viewHuman && viewAgent) {
        btnHuman.addEventListener('click', () => {
            btnHuman.classList.add('active');
            btnAgent.classList.remove('active');
            viewHuman.classList.add('active');
            viewHuman.classList.remove('hidden');
            viewAgent.classList.remove('active');
            viewAgent.classList.add('hidden');
        });

        btnAgent.addEventListener('click', () => {
            btnAgent.classList.add('active');
            btnHuman.classList.remove('active');
            viewAgent.classList.add('active');
            viewAgent.classList.remove('hidden');
            viewHuman.classList.remove('active');
            viewHuman.classList.add('hidden');
        });
    }
});
