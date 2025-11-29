// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initNavigation();
    initHeroAnimation();
    initScrollAnimations();
    initProjectInteractions();
    initContactForm();
    initProjectFilters();
    initImageModal();
    initMobileMenu();
});

// Loader
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    loader.style.display = 'none';
                }
            });
        }, 1000);
    });
}

// Smart Navigation
function initNavigation() {
    const nav = document.getElementById('navbar');
    const navTrigger = document.getElementById('navTrigger');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavVisibility() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY <= 50) {
            nav.classList.remove('hidden');
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavVisibility);
            ticking = true;
        }
    });
    
    if (navTrigger) {
        navTrigger.addEventListener('mouseenter', () => {
            nav.classList.remove('hidden');
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navLinks && navToggle) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    }
}

// Hero Section Animation
function initHeroAnimation() {
    gsap.from('.hero-title, .hero-subtitle, .hero p, .hero-buttons', {
        duration: 1.2,
        y: 60,
        opacity: 0,
        stagger: 0.3,
        ease: 'power3.out',
        delay: 0.5
    });
    
    gsap.to('.shape', {
        y: 'random(-30, 30)',
        rotation: 'random(-15, 15)',
        duration: 'random(4, 8)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3
    });
}

// Scroll Animations
function initScrollAnimations() {
    // Section animations
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
    
    // Skill cards animation
    gsap.utils.toArray('.skill-category').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power2.out'
        });
    });
    
    // Project cards animation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power2.out'
        });
    });
}

// Project Interactions
function initProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -8,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
    
    initModelInteractions();
}

// Project Filters
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    gsap.to(card, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        display: 'block'
                    });
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.5,
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// Image Modal
function initImageModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;

    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.close-modal');

    document.querySelectorAll('.view-image-btn').forEach(button => {
        button.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            modal.style.display = 'block';
            modalImg.src = imageSrc;
            
            const projectTitle = this.closest('.project-card').querySelector('h4');
            captionText.innerHTML = projectTitle ? projectTitle.textContent : 'Project Image';
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// 3D Model Interactions
function initModelInteractions() {
    const modelViewers = document.querySelectorAll('model-viewer');
    
    modelViewers.forEach(viewer => {
        viewer.addEventListener('load', function() {
            console.log('3D model loaded:', this.src);
        });
        
        viewer.addEventListener('error', function() {
            console.warn('3D model failed to load:', this.src);
            this.style.display = 'none';
            
            const placeholder = this.parentNode.querySelector('.model-placeholder');
            if (placeholder) {
                placeholder.style.display = 'flex';
            }
        });
    });
}

// Contact Form with EmailJS - USING YOUR IDs
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Initialize EmailJS with your public key
    emailjs.init("mV3jRjollvHITFTkC"); // Using what you think is public key
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const name = this.name.value.trim();
        const email = this.email.value.trim();
        const message = this.message.value.trim();
        
        if (!name || !email || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Send email using EmailJS
        emailjs.sendForm(
            'service_velvtqa',     // Your service ID
            'template_sjcsjmd',    // Your template ID
            this
        )
        .then(function(response) {
            console.log('Email sent successfully!', response);
            showNotification('Thank you for your message! I will get back to you soon.', 'success');
            contactForm.reset();
        }, function(error) {
            console.error('EmailJS Error:', error);
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}
// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#1e90ff'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    gsap.from(notification, {
        x: 300,
        opacity: 0,
        duration: 0.3
    });
    
    // Remove after 5 seconds
    setTimeout(() => {
        gsap.to(notification, {
            x: 300,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                notification.remove();
            }
        });
    }, 5000);
}

// Handle responsive behavior
function handleResize() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

// Event Listeners
window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);

// Initialize Three.js scene if needed
function initThreeScene() {
    const container = document.getElementById('three-container');
    if (!container) return;
    
    // Basic Three.js scene setup can be added here
    console.log('Three.js container ready');
}