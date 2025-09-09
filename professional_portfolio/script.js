// Loading Screen
window.addEventListener('load', () => {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 1000);
  }
});

// Theme Toggle
const themeToggleButton = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
  document.body.classList.add('light');
}

themeToggleButton.setAttribute('aria-pressed', document.body.classList.contains('light') ? 'true' : 'false');

themeToggleButton.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  themeToggleButton.setAttribute('aria-pressed', isLight ? 'true' : 'false');
});

// Mobile Menu Toggle
const menuToggleButton = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-links');

if (menuToggleButton) {
  menuToggleButton.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    menuToggleButton.classList.toggle('active');
    menuToggleButton.setAttribute('aria-expanded', String(isOpen));
    menuToggleButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
}

// Close mobile menu on link click
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('open');
    menuToggleButton.classList.remove('active');
    if (menuToggleButton) {
      menuToggleButton.setAttribute('aria-expanded', 'false');
    }
  });
});

// Active link highlight on scroll
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// Skill Progress Animation
const animateSkills = () => {
  const skillProgresses = document.querySelectorAll('.skill-progress');
  
  skillProgresses.forEach(progress => {
    const width = progress.getAttribute('data-width');
    progress.style.width = width + '%';
  });
};

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      
      // Animate skills when skills section is visible
      if (entry.target.id === 'skills') {
        setTimeout(animateSkills, 300);
      }
    }
  });
}, observerOptions);

// Observe sections for animations
sections.forEach(section => {
  observer.observe(section);
});

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Filter projects
    projectCards.forEach(card => {
      const categories = card.getAttribute('data-category').split(' ');
      
      if (filter === 'all' || categories.includes(filter)) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Back to Top Button
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Contact Form Handling (mailto)
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    if (!name || !email || !subject || !message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    const mailto = `mailto:mohabahmedzaher@gmail.com?subject=${encodeURIComponent(subject + ' — from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' <' + email + '>')}`;

    window.location.href = mailto;
  });
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#38bdf8'};
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
  `;
  
  notification.querySelector('.notification-content').style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
  `;
  
  notification.querySelector('.notification-close').style.cssText = `
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    margin-left: auto;
    padding: 4px;
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Close button functionality
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, 5000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  
  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
  const heroName = document.querySelector('.hero-title .name');
  if (heroName) {
    const originalText = heroName.textContent;
    setTimeout(() => {
      typeWriter(heroName, originalText, 150);
    }, 1000);
  }
});

// Counter animation for stats
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.textContent);
    const increment = target / 100;
    let current = 0;
    
    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '') + 
                             (counter.textContent.includes('%') ? '%' : '');
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + (counter.textContent.includes('+') ? '+' : '') + 
                             (counter.textContent.includes('%') ? '%' : '');
      }
    };
    
    updateCounter();
  });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  statsObserver.observe(heroStats);
}

// Footer year
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .animate {
    animation: fadeInUp 0.6s ease forwards;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .project-card {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .skill-progress {
    transition: width 1.5s ease;
  }
  
  .notification {
    font-family: 'Inter', sans-serif;
  }
  
  .notification i {
    font-size: 1.1rem;
  }
  
  .notification-close:hover {
    opacity: 0.8;
  }
  /* Ensure hero name letters can transform individually */
  .hero .hero-title .name .char { display: inline-block; will-change: transform, text-shadow; }
`;

document.head.appendChild(style);

// Anime.js animations (guard if library is present)
window.addEventListener('load', () => {
  if (typeof anime === 'undefined') return;

  // Hero intro
  anime({
    targets: '.hero .hero-title .name',
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 900,
    easing: 'easeOutExpo',
    delay: 200
  });

  anime({
    targets: '.hero .cta-group .btn',
    translateY: [16, 0],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutQuad',
    delay: anime.stagger(100, { start: 350 })
  });

  // Skills icons stagger when section enters view
  const skillsIcons = document.querySelectorAll('.skill-icons-grid .skill-icon');
  if (skillsIcons.length) {
    const skillsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: '.skill-icons-grid .skill-icon',
            opacity: [0, 1],
            translateY: [14, 0],
            duration: 700,
            easing: 'easeOutCubic',
            delay: anime.stagger(80)
          });
          skillsObs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    skillsObs.observe(document.getElementById('skills'));
  }

  // Project cards fade-up on scroll
  const projectGrid = document.querySelector('.project-grid');
  if (projectGrid) {
    const cards = projectGrid.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
    });
    const projObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: 1,
            translateY: 0,
            duration: 700,
            easing: 'easeOutQuad'
          });
          projObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(card => projObs.observe(card));
  }

  // Testimonials subtle float on hover
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      anime.remove(card);
      anime({ targets: card, translateY: -6, duration: 350, easing: 'easeOutQuad' });
    });
    card.addEventListener('mouseleave', () => {
      anime.remove(card);
      anime({ targets: card, translateY: 0, duration: 350, easing: 'easeOutQuad' });
    });
  });

  // Floating background shapes gentle motion
  anime({
    targets: ['.shape-1', '.shape-2', '.shape-3'],
    translateY: (el, i) => [i % 2 === 0 ? -12 : 12, i % 2 === 0 ? 12 : -12],
    translateX: (el, i) => [i % 2 === 0 ? -8 : 8, i % 2 === 0 ? 8 : -8],
    rotate: ['-10deg', '10deg'],
    direction: 'alternate',
    easing: 'easeInOutSine',
    duration: 5000,
    loop: true
  });

  // Theme toggle micro-interaction
  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      anime.remove(themeBtn);
      anime({ targets: themeBtn, scale: [1, 0.9, 1], rotate: '+=180', duration: 500, easing: 'easeOutBack' });
    });
  }

  // Filter buttons click feedback
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      anime.remove(btn);
      anime({ targets: btn, scale: [1, 0.96, 1], duration: 220, easing: 'easeOutQuad' });
    });
  });

  // Social links hover pop
  document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      anime.remove(link);
      anime({ targets: link, scale: 1.08, duration: 220, easing: 'easeOutQuad' });
    });
    link.addEventListener('mouseleave', () => {
      anime.remove(link);
      anime({ targets: link, scale: 1, duration: 220, easing: 'easeOutQuad' });
    });
  });

  // Project overlay links hover bounce
  document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      anime.remove(link);
      anime({ targets: link, translateY: -3, duration: 200, easing: 'easeOutQuad' });
    });
    link.addEventListener('mouseleave', () => {
      anime.remove(link);
      anime({ targets: link, translateY: 0, duration: 220, easing: 'easeOutQuad' });
    });
  });

  // Back-to-top attention pulse when visible
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const visObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({ targets: backToTop, scale: [1, 1.08, 1], duration: 800, easing: 'easeInOutQuad' });
        }
      });
    });
    visObs.observe(backToTop);
  }

  // Navbar links entrance on load
  anime({
    targets: '.nav-links li',
    opacity: [0, 1],
    translateY: [8, 0],
    easing: 'easeOutQuad',
    duration: 500,
    delay: anime.stagger(60, { start: 120 })
  });

  // Hero SVG line draw
  const heroPath = document.querySelector('#heroLine path');
  if (heroPath) {
    const length = heroPath.getTotalLength();
    heroPath.style.strokeDasharray = String(length);
    heroPath.style.strokeDashoffset = String(length);
    anime({
      targets: heroPath,
      strokeDashoffset: [length, 0],
      duration: 1800,
      easing: 'easeInOutSine',
      delay: 600
    });
  }

  // Top scroll progress bar
  const scrollBar = document.getElementById('scrollProgress');
  if (scrollBar) {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollBar.style.width = progress + '%';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
  }

  // Section headers subtle accent on reveal
  document.querySelectorAll('.section-header h2').forEach(h => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            letterSpacing: ['-0.04em', '-0.02em'],
            duration: 600,
            easing: 'easeOutQuad'
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(h);
  });

  // Project card tilt on hover
  document.querySelectorAll('.project-card').forEach(card => {
    const rect = () => card.getBoundingClientRect();
    card.addEventListener('mousemove', (e) => {
      const r = rect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      anime.remove(card);
      anime({ targets: card, rotateY: dx * 6, rotateX: -dy * 6, duration: 200, easing: 'easeOutQuad' });
    });
    card.addEventListener('mouseleave', () => {
      anime.remove(card);
      anime({ targets: card, rotateX: 0, rotateY: 0, duration: 300, easing: 'easeOutQuad' });
    });
  });

  // Anime.js stat counters (override native counter when visible)
  try {
    if (typeof statsObserver !== 'undefined' && heroStats) {
      statsObserver.unobserve(heroStats);
    }
  } catch {}
  document.querySelectorAll('.stat-number').forEach(num => {
    const original = num.textContent;
    const hasPlus = original.includes('+');
    const hasPct = original.includes('%');
    const target = parseInt(original);
    num.textContent = '0' + (hasPlus ? '+' : '') + (hasPct ? '%' : '');
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: { val: 0 },
            val: target,
            round: 1,
            duration: 1600,
            easing: 'easeOutExpo',
            update: (anim) => {
              const v = anim.animations[0].currentValue;
              num.textContent = v + (hasPlus ? '+' : '') + (hasPct ? '%' : '');
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    obs.observe(num);
  });

  // Continuous dynamic wave effect for hero name after typing completes
  const nameEl = document.querySelector('.hero .hero-title .name');
  if (nameEl) {
    const text = nameEl.getAttribute('data-original') || nameEl.textContent.trim();
    // Calculate when typing likely finishes (matches typeWriter speed: 150ms per char + initial 1000ms delay)
    const startDelay = 1000 + text.length * 150 + 300;

    const wrapLetters = () => {
      // Avoid double-wrap
      if (nameEl.querySelector('.char')) return;
      const frag = document.createDocumentFragment();
      for (const ch of text) {
        if (ch === ' ') {
          frag.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = ch;
          frag.appendChild(span);
        }
      }
      nameEl.textContent = '';
      nameEl.appendChild(frag);
    };

    const startWave = () => {
      // Base wave
      anime({
        targets: '.hero .hero-title .name .char',
        translateY: [0, -4],
        direction: 'alternate',
        easing: 'easeInOutSine',
        duration: 700,
        delay: anime.stagger(60),
        loop: true
      });

      // Soft pulse glow
      anime({
        targets: '.hero .hero-title .name .char',
        textShadow: [
          '0 0 0 rgba(56,189,248,0)',
          '0 0 8px rgba(56,189,248,0.45)'
        ],
        direction: 'alternate',
        easing: 'easeInOutSine',
        duration: 1800,
        delay: anime.stagger(90),
        loop: true
      });

      // Occasional glitch jitter
      setInterval(() => {
        anime({
          targets: '.hero .hero-title .name .char',
          translateX: [
            { value: 0, duration: 0 },
            { value: 2, duration: 40 },
            { value: -2, duration: 60 },
            { value: 0, duration: 40 }
          ],
          easing: 'linear',
          delay: anime.stagger(20, { from: 'center' })
        });
      }, 3500);

      // Mouse reactive ripple
      const onMove = (e) => {
        const rect = nameEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.min(1, Math.hypot(dx, dy) / 240);
        anime({
          targets: '.hero .hero-title .name .char',
          translateY: (el, i) => {
            const offset = (i - (nameEl.textContent.length / 2));
            return -4 - Math.sin((offset / 2) + (Date.now() / 600)) * (4 * (1 - dist));
          },
          duration: 300,
          easing: 'easeOutSine'
        });
      };
      window.addEventListener('mousemove', onMove);
    };

    setTimeout(() => { wrapLetters(); startWave(); }, startDelay);
  }
});

// Background particles canvas (lightweight)
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  const numParticles = Math.min(90, Math.floor((width * height) / 30000));
  const particles = [];
  const connectionDist = 120;

  function themeColors() {
    const isLight = document.body.classList.contains('light');
    return {
      dot: isLight ? 'rgba(14,165,233,0.6)' : 'rgba(56,189,248,0.6)',
      line: isLight ? 'rgba(14,165,233,0.15)' : 'rgba(56,189,248,0.15)'
    };
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.6
      });
    }
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function step() {
    const colors = themeColors();
    ctx.clearRect(0, 0, width, height);

    // Update positions
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    // Draw connections
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.line;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < connectionDist) {
          ctx.globalAlpha = 1 - dist / connectionDist;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Draw dots
    ctx.fillStyle = colors.dot;
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  // Keep canvas behind content
  function ensureLayering() {
    const heroBg = document.querySelector('.hero-background');
    if (heroBg) {
      heroBg.style.zIndex = '1';
    }
    // Canvas is z-index 0 via CSS
  }

  createParticles();
  ensureLayering();
  step();
  window.addEventListener('resize', () => { resize(); createParticles(); });

  // Update colors on theme toggle
  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', () => setTimeout(() => {}, 0));
})();
