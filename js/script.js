// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything after page load
    initLoader();
    initNavigation();
    initHeroAnimation();
    initScrollAnimations();
    initProjectInteractions();
    initContactForm();
});

// Loader
function initLoader() {
    const loader = document.getElementById('loader');
    
    // Hide loader after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    loader.style.display = 'none';
                }
            });
        }, 1500);
    });
}

// Smart Navigation
function initNavigation() {
    const nav = document.getElementById('navbar');
    const navTrigger = document.getElementById('navTrigger');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    // Function to update nav visibility
    function updateNavVisibility() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY <= 50) {
            nav.classList.remove('hidden');
        } else if (currentScrollY > lastScrollY) {
            // Scrolling down
            nav.classList.add('hidden');
        } else {
            // Scrolling up
            nav.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    // Throttled scroll event listener
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavVisibility);
            ticking = true;
        }
    });
    
    // Show nav on hover at top of page
    navTrigger.addEventListener('mouseenter', () => {
        nav.classList.remove('hidden');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hero Section Animation
function initHeroAnimation() {
    // Animate hero content
    gsap.from('.hero-title, .hero-subtitle, .hero p, .hero-buttons', {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // Animate floating shapes
    gsap.to('.shape', {
        y: 'random(-30, 30)',
        rotation: 'random(-10, 10)',
        duration: 'random(3, 6)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5
    });
}

// Scroll Animations
function initScrollAnimations() {
    // Animate sections on scroll
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
    
    // Animate skill cards
    gsap.utils.toArray('.skill-category').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
    
    // Animate project cards
    gsap.utils.toArray('.project-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
}

// Project Interactions
function initProjectInteractions() {
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Initialize 3D model interactions
    initModelInteractions();
}

// 3D Model Interactions
function initModelInteractions() {
    // This function would handle custom interactions with 3D models
    // For now, we'll rely on model-viewer's built-in controls
    
    // Add loading states for models
    const modelViewers = document.querySelectorAll('model-viewer');
    
    modelViewers.forEach(viewer => {
        viewer.addEventListener('load', function() {
            console.log('3D model loaded successfully');
        });
        
        viewer.addEventListener('error', function() {
            console.error('Failed to load 3D model');
            // Fallback: Show placeholder image
            const placeholder = document.createElement('div');
            placeholder.style.width = '100%';
            placeholder.style.height = '100%';
            placeholder.style.background = 'var(--gradient)';
            placeholder.style.borderRadius = '10px 10px 0 0';
            placeholder.style.display = 'flex';
            placeholder.style.alignItems = 'center';
            placeholder.style.justifyContent = 'center';
            placeholder.innerHTML = '<i class="fas fa-cube" style="font-size: 3rem; color: white;"></i>';
            
            this.parentNode.replaceChild(placeholder, this);
        });
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name') || this.querySelector('input[type="text"]').value;
            const email = formData.get('email') || this.querySelector('input[type="email"]').value;
            const subject = formData.get('subject') || this.querySelectorAll('input[type="text"]')[1].value;
            const message = formData.get('message') || this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // In a real application, you would send this data to a server
            console.log('Form submitted:', { name, email, subject, message });
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            this.reset();
        });
    }
}

// Utility function for handling responsive behavior
function handleResize() {
    // Adjust any layout elements on window resize
    const nav = document.getElementById('navbar');
    if (window.innerWidth <= 768) {
        // Mobile adjustments
    } else {
        // Desktop adjustments
    }
}

// Listen for window resize
window.addEventListener('resize', handleResize);

// Initialize on page load
window.addEventListener('load', handleResize);