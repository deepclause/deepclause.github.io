// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll-based animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and content sections
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .use-case-card, .example-card, .video-card, .download-card, .arch-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add active state to nav links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // Add copy button to code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const pre = block.parentElement;
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        button.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            padding: 0.5rem 1rem;
            background: rgba(99, 102, 241, 0.9);
            color: white;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.3s;
        `;

        pre.style.position = 'relative';
        
        button.addEventListener('click', async () => {
            const code = block.textContent;
            await navigator.clipboard.writeText(code);
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });

        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(79, 70, 229, 1)';
            button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = 'rgba(99, 102, 241, 0.9)';
            button.style.transform = 'translateY(0)';
        });

        pre.appendChild(button);
    });

    // Mobile menu toggle (for future implementation)
    const createMobileMenu = () => {
        const nav = document.querySelector('.nav');
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-toggle';
        menuButton.innerHTML = '☰';
        menuButton.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-primary);
            
            @media (max-width: 768px) {
                display: block;
            }
        `;
        
        // Add to nav (implementation can be expanded)
        const navContainer = document.querySelector('.nav-container');
        if (window.innerWidth <= 768) {
            navContainer.appendChild(menuButton);
        }
    };

    createMobileMenu();

    // Add parallax effect to hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }

    // Add hover effect to download buttons
    const downloadButtons = document.querySelectorAll('.btn-download');
    downloadButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Syntax highlighting for code blocks (simplified and reliable)
    const highlightCode = () => {
        document.querySelectorAll('pre code.language-prolog').forEach(block => {
            // Get original text
            let text = block.textContent;
            let html = '';
            let i = 0;
            
            while (i < text.length) {
                let matched = false;
                
                // Check for comment
                if (text[i] === '%') {
                    let end = text.indexOf('\n', i);
                    if (end === -1) end = text.length;
                    html += `<span style="color: #86efac; font-style: italic;">${escapeHtml(text.substring(i, end))}</span>`;
                    i = end;
                    matched = true;
                }
                // Check for string
                else if (text[i] === '"') {
                    let end = i + 1;
                    while (end < text.length && (text[end] !== '"' || text[end-1] === '\\')) {
                        end++;
                    }
                    end++;
                    html += `<span style="color: #fcd34d;">${escapeHtml(text.substring(i, end))}</span>`;
                    i = end;
                    matched = true;
                }
                // Check for @(
                else if (text.substring(i, i+2) === '@(') {
                    html += '<span style="color: #f0abfc; font-weight: 600;">@(</span>';
                    i += 2;
                    matched = true;
                }
                // Check for operators
                else if (text.substring(i, i+2) === ':-') {
                    html += '<span style="color: #67e8f9;">:-</span>';
                    i += 2;
                    matched = true;
                }
                else if (text.substring(i, i+2) === '\\=') {
                    html += '<span style="color: #67e8f9;">\\=</span>';
                    i += 2;
                    matched = true;
                }
                else if (text.substring(i, i+2) === '>=') {
                    html += '<span style="color: #67e8f9;">>=</span>';
                    i += 2;
                    matched = true;
                }
                else if (text.substring(i, i+2) === '=<') {
                    html += '<span style="color: #67e8f9;">=&lt;</span>';
                    i += 2;
                    matched = true;
                }
                else if (text.substring(i, i+2) === '\\+') {
                    html += '<span style="color: #67e8f9;">\\+</span>';
                    i += 2;
                    matched = true;
                }
                // Check for word (keyword, predicate, or variable)
                else if (/[a-zA-Z_]/.test(text[i])) {
                    let start = i;
                    while (i < text.length && /[a-zA-Z0-9_]/.test(text[i])) {
                        i++;
                    }
                    let word = text.substring(start, i);
                    
                    // Skip whitespace to check for parenthesis
                    let j = i;
                    while (j < text.length && /\s/.test(text[j])) j++;
                    
                    // Keywords
                    if (['agent_main', 'tool', 'answer', 'log', 'format', 'param', 'findall', 
                         'member', 'forall', 'minimize', 'end_thinking', 'observation', 'chat',
                         'system', 'fail', 'true'].includes(word)) {
                        html += `<span style="color: #7dd3fc; font-weight: 600;">${word}</span>`;
                    }
                    // Variables (uppercase or underscore start)
                    else if (/^[A-Z_]/.test(word)) {
                        html += `<span style="color: #bef264;">${word}</span>`;
                    }
                    // Predicates (followed by parenthesis)
                    else if (text[j] === '(') {
                        html += `<span style="color: #93c5fd;">${word}</span>`;
                    }
                    // Regular text
                    else {
                        html += word;
                    }
                    matched = true;
                }
                // Check for numbers
                else if (/[0-9]/.test(text[i])) {
                    let start = i;
                    while (i < text.length && /[0-9.]/.test(text[i])) {
                        i++;
                    }
                    html += `<span style="color: #fdba74;">${text.substring(start, i)}</span>`;
                    matched = true;
                }
                
                // Default: add character as-is
                if (!matched) {
                    html += escapeHtml(text[i]);
                    i++;
                }
            }
            
            block.innerHTML = html;
        });
    };
    
    // Helper to escape HTML
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    highlightCode();
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Console easter egg
console.log('%c🎉 Welcome to DeepClause! %c\n\nInterested in the code? Check out our GitHub:\nhttps://github.com/deepclause/deepclause-desktop', 
    'color: #6366f1; font-size: 20px; font-weight: bold;',
    'color: #475569; font-size: 14px;'
);
