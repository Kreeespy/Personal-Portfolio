document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    initCanvas();
    initCarousel();
    initSkills(); 
    initScrollSpy();
    initWorks();
});

// Background Effects Thingies
function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 150;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.3 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            this.vx += (Math.random() - 0.5) * 0.02;
            this.vy += (Math.random() - 0.5) * 0.02;

            const maxSpeed = 0.5;
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > maxSpeed) {
                this.vx = (this.vx / speed) * maxSpeed;
                this.vy = (this.vy / speed) * maxSpeed;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(243, 242, 233, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.strokeStyle = `rgba(243, 242, 233, ${0.05 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
    });
    resize();
    initParticles();
    animate();
}

// Skills Section
function initSkills() {
    const container = document.getElementById('skills-container');
    if (!container || typeof skillsData === 'undefined') return;

    container.innerHTML = skillsData.map(group => `
        <div class="rounded-lg border custom-white-border p-8 hover-orange-border-50 transition-colors duration-300 relative group">
            <div class="absolute top-4 right-4 w-2 h-2 custom-orange-bg"></div>
            <h3 class="text-xl font-semibold mb-6 custom-orange tracking-wider">${group.category}</h3>
            <ul class="space-y-3">
                ${group.items.map(skill => `
                    <li class="font-light flex items-center gap-3 opacity-60">
                        <span class="w-1 h-1 bg-[#F3F2E9] opacity-40"></span>
                        ${skill}
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

// Project Carousel
let currentProject = 0;

function initCarousel() {
    if (typeof projectData === 'undefined') return;
    renderProject();
    renderIndicators();
}

function renderProject() {
    const title = document.getElementById('project-title');
    const desc = document.getElementById('project-desc');
    const img = document.getElementById('project-image');
    
    if(!title || !desc || !img) return;

    img.style.opacity = 0;
    
    setTimeout(() => {
        const project = projectData[currentProject];
        title.innerText = project.title;
        desc.innerText = project.description;
        img.src = project.image;
        
        img.style.opacity = 1;
    }, 200);

    updateIndicators();
}
window.changeProject = function(direction) {
    currentProject = (currentProject + direction + projectData.length) % projectData.length;
    renderProject();
}
window.jumpToProject = function(index) {
    currentProject = index;
    renderProject();
}

function renderIndicators() {
    const container = document.getElementById('project-indicators');
    if (!container) return;
    
    container.innerHTML = '';
    projectData.forEach((_, idx) => {
        const btn = document.createElement('button');
        // Add onclick event
        btn.onclick = () => window.jumpToProject(idx); 
        container.appendChild(btn);
    });
    updateIndicators();
}

function updateIndicators() {
    const container = document.getElementById('project-indicators');
    if (!container) return;
    const btns = container.children;
    for (let i = 0; i < btns.length; i++) {
        let classes = "w-12 h-1 transition-colors duration-300 ";
        if (i === currentProject) {
            classes += "custom-orange-bg";
        } else {
            classes += "custom-white-30";
        }
        btns[i].className = classes;
    }
}

//Scroll Navigator
window.scrollToSection = function(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function initScrollSpy() {
    const sections = ['about', 'skills', 'works','projects', 'contact'];
    const navButtons = document.querySelectorAll('.nav-btn');
    
    let activeSectionId = '';

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        sections.forEach(section => {
            const el = document.getElementById(section);
            if (el && scrollPosition >= el.offsetTop) {
                current = section;
            }
        });

        if (current !== activeSectionId) {
            activeSectionId = current;

            navButtons.forEach(btn => {
                const oldIndicator = btn.querySelector('.nav-indicator');
                if (oldIndicator) oldIndicator.remove();

                if (btn.id === `nav-${current}`) {
                    const indicator = document.createElement('span');
                    indicator.className = 'nav-indicator animate-fade-in';
                    btn.appendChild(indicator);
                }
            });
        }
    });
}
let currentWork = 0;

function initWorks() {
    if (typeof worksData === 'undefined') return;
    renderWork();
    renderWorkIndicators();
}

function renderWork() {
    const title = document.getElementById('work-title');
    const desc = document.getElementById('work-desc');
    const img = document.getElementById('work-image');
    
    if(!title || !desc || !img) return;

    img.style.opacity = 0;
    
    setTimeout(() => {
        const work = worksData[currentWork];
        title.innerText = work.title;
        desc.innerText = work.description;
        img.src = work.image;
        img.style.opacity = 1;
    }, 200);

    updateWorkIndicators();
}

window.changeWork = function(direction) {
    currentWork = (currentWork + direction + worksData.length) % worksData.length;
    renderWork();
}

window.jumpToWork = function(index) {
    currentWork = index;
    renderWork();
}

function renderWorkIndicators() {
    const container = document.getElementById('work-indicators');
    if (!container) return;
    
    container.innerHTML = '';
    worksData.forEach((_, idx) => {
        const btn = document.createElement('button');
        btn.onclick = () => window.jumpToWork(idx); 
        container.appendChild(btn);
    });
    updateWorkIndicators();
}

function updateWorkIndicators() {
    const container = document.getElementById('work-indicators');
    if (!container) return;

    const btns = container.children;
    for (let i = 0; i < btns.length; i++) {
        let classes = "w-12 h-1 transition-colors duration-300 ";
        if (i === currentWork) {
            classes += "custom-orange-bg";
        } else {
            classes += "custom-white-30";
        }
        btns[i].className = classes;
    }
}

// For the Main Page's AI Assistant
async function askAI() {
    const responseBox = document.getElementById('llm-response');
    
    responseBox.innerText = "...";
    responseBox.classList.add("animate-pulse");

    try {
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'deepseek-r1', 
                messages: [
                    { role: 'system', 
                    content: 'You are a sarcastic, slightly annoyed AI. The user just pressed a button to talk to you. Your goal is to convince the user, in exactly one short sentence, not more than 10 words, to stop pressing the button and leave you alone. Be witty and dry. At times, shame the user for not having anything to do but press the button to. Have a 1/10 chance to ask them to explore the website instead' 
                    },
                    { role: 'user', content: 'I just pressed the button.' }
                ],
                stream: false
            })
        });

        const data = await response.json();
        
        responseBox.classList.remove("animate-pulse");
        responseBox.innerText = data.message.content;

    } catch (error) {
        responseBox.classList.remove("animate-pulse");
        responseBox.innerHTML = '<span class="text-red-500">Ollama is offline. Finally, some peace and quiet.</span>';
    }
}