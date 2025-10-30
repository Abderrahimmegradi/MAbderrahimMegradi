// Loader
window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('loader').style.opacity = '0';
        document.getElementById('loader').style.visibility = 'hidden';
    }, 2000);
});

// Smart Navigation System
const navbar = document.getElementById('navbar');
const navTrigger = document.getElementById('navTrigger');
let hideTimeout;
let isHomeSection = true;

// Function to show navbar
function showNavbar() {
    navbar.classList.remove('hidden');
}

// Function to hide navbar with delay
function hideNavbarWithDelay() {
    if (!isHomeSection) {
        hideTimeout = setTimeout(() => {
            navbar.classList.add('hidden');
        }, 1500);
    }
}

// Show navbar when hovering over trigger area
navTrigger.addEventListener('mouseenter', function() {
    showNavbar();
    clearTimeout(hideTimeout);
});

// Keep navbar visible when hovering over it
navbar.addEventListener('mouseenter', function() {
    showNavbar();
    clearTimeout(hideTimeout);
});

// Hide navbar when leaving navbar area (with delay)
navbar.addEventListener('mouseleave', function() {
    hideNavbarWithDelay();
});

// Track scroll position to determine if we're in home section
window.addEventListener('scroll', function() {
    const homeSection = document.getElementById('home');
    const homeRect = homeSection.getBoundingClientRect();
    isHomeSection = homeRect.bottom > 100;
    
    if (isHomeSection) {
        showNavbar();
        clearTimeout(hideTimeout);
    } else {
        hideNavbarWithDelay();
    }
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Animate elements on scroll
gsap.utils.toArray('.skill-category, .project-card').forEach(item => {
    gsap.fromTo(item, {
        opacity: 0,
        y: 50
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Hero text animation
gsap.from('.hero-title', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
});

gsap.from('.hero-subtitle', {
    duration: 1,
    y: 30,
    opacity: 0,
    delay: 0.3,
    ease: 'power3.out'
});

gsap.from('.hero-buttons', {
    duration: 1,
    y: 30,
    opacity: 0,
    delay: 0.6,
    ease: 'power3.out'
});

// Floating shapes animation
gsap.to('.shape', {
    y: 'random(-30, 30)',
    x: 'random(-20, 20)',
    rotation: 'random(-10, 10)',
    duration: 'random(3, 5)',
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
});

// Simple Three.js scene for 3D background
function initThreeJS() {
    const container = document.getElementById('three-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x6a11cb, 
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    const shapes = [];
    for (let i = 0; i < 10; i++) {
        const shape = new THREE.Mesh(geometry, material);
        shape.position.x = Math.random() * 20 - 10;
        shape.position.y = Math.random() * 20 - 10;
        shape.position.z = Math.random() * 10 - 20;
        shape.scale.setScalar(Math.random() * 1.5 + 0.5);
        scene.add(shape);
        shapes.push(shape);
    }

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        
        shapes.forEach(shape => {
            shape.rotation.x += 0.005;
            shape.rotation.y += 0.01;
        });
        
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize Three.js after page load
window.addEventListener('load', initThreeJS);

// GLB Models for Projects
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting 3D models initialization...');
    initProject3DModels();
});

function initProject3DModels() {
    const modelConfigs = {
        'project-1-3d': {
            glbUrl: 'models/dining_table.glb',
            autoRotate: true,
            scale: 1.0
        },
        'project-2-3d': {
            glbUrl: 'models/starship_troopers_arachnid_hopper.glb',
            autoRotate: true,
            scale: 1.2
        },
        'project-3-3d': {
            glbUrl: null,
            autoRotate: true,
            scale: 1.0
        }
    };

    // Initialize each project
    Object.keys(modelConfigs).forEach(containerId => {
        initGLBModel(containerId, modelConfigs[containerId]);
    });
}

function initGLBModel(containerId, config) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.log(`❌ Container not found: ${containerId}`);
        return;
    }

    console.log(`🔄 Initializing 3D model for: ${containerId}`);
    console.log(`📁 Model path: ${config.glbUrl}`);

    const loadingIndicator = container.querySelector('.loading-indicator');
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    let mesh;
    let autoRotate = config.autoRotate;

    // For project 3, use fallback immediately
    if (containerId === 'project-3-3d' || !config.glbUrl) {
        console.log(`🎨 Using fallback geometry for: ${containerId}`);
        createFallbackGeometry();
        return;
    }

    // Load GLB model for projects 1 and 2
    // Use the global THREE.GLTFLoader if available, otherwise use fallback
    let GLTFLoader;
    
    if (typeof THREE !== 'undefined' && THREE.GLTFLoader) {
        GLTFLoader = THREE.GLTFLoader;
        console.log('✅ Using THREE.GLTFLoader from global scope');
    } else {
        console.log('❌ THREE.GLTFLoader not found, using fallback geometry');
        createFallbackGeometry();
        return;
    }
    
    const loader = new GLTFLoader();
    
    console.log(`🚀 Starting load for: ${config.glbUrl}`);
    
    loader.load(
        config.glbUrl,
        function(gltf) {
            console.log(`✅ Successfully loaded: ${config.glbUrl}`);
            mesh = gltf.scene;
            scene.add(mesh);
            
            // Center and scale the model
            const box = new THREE.Box3().setFromObject(mesh);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            mesh.position.x = -center.x;
            mesh.position.y = -center.y;
            mesh.position.z = -center.z;
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = (config.scale || 1.5) / maxDim;
            mesh.scale.multiplyScalar(scale);
            
            // Hide loading indicator
            if (loadingIndicator) {
                loadingIndicator.style.opacity = '0';
                setTimeout(() => {
                    loadingIndicator.style.display = 'none';
                }, 300);
            }
            
            console.log(`🎉 Model fully loaded and displayed for: ${containerId}`);
        },
        function(progress) {
            // Loading progress
            if (loadingIndicator && progress.lengthComputable) {
                const percent = (progress.loaded / progress.total * 100);
                loadingIndicator.querySelector('span').textContent = `Loading... ${Math.round(percent)}%`;
            }
        },
        function(error) {
            console.error(`❌ Error loading: ${config.glbUrl}`, error);
            if (loadingIndicator) {
                loadingIndicator.innerHTML = '<div class="error-message">Failed to load 3D model</div>';
            }
            console.log(`🔄 Creating fallback geometry due to error for: ${containerId}`);
            createFallbackGeometry();
        }
    );

    function createFallbackGeometry() {
        console.log(`🎨 Creating fallback geometry for: ${containerId}`);
        
        let geometry;
        
        // Different fallback geometries for each project
        switch(containerId) {
            case 'project-1-3d':
                geometry = new THREE.BoxGeometry(2, 1.5, 1); // Furniture shape
                break;
            case 'project-2-3d':
                geometry = new THREE.OctahedronGeometry(1.2, 1); // Abstract shape
                break;
            case 'project-3-3d':
                geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16); // Complex shape
                break;
            default:
                geometry = new THREE.BoxGeometry(1, 1, 1);
        }
        
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x4a90e2,
            metalness: 0.3,
            roughness: 0.4
        });
        
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        if (loadingIndicator) {
            loadingIndicator.style.opacity = '0';
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
            }, 300);
        }
        
        console.log(`✅ Fallback geometry created for: ${containerId}`);
    }

    camera.position.z = 3;

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        container.style.cursor = 'grabbing';
        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging || !mesh) return;
        
        const deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };

        mesh.rotation.y += deltaMove.x * 0.01;
        mesh.rotation.x += deltaMove.y * 0.01;

        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });

    // Control buttons
    const controls = container.querySelector('.model-controls');
    if (controls) {
        const rotateToggle = controls.querySelector('.rotate-toggle');
        const zoomIn = controls.querySelector('.zoom-in');
        const zoomOut = controls.querySelector('.zoom-out');

        if (rotateToggle) {
            rotateToggle.addEventListener('click', () => {
                autoRotate = !autoRotate;
                rotateToggle.classList.toggle('active', autoRotate);
            });
        }

        if (zoomIn) {
            zoomIn.addEventListener('click', () => {
                camera.position.z = Math.max(camera.position.z - 0.5, 1);
            });
        }

        if (zoomOut) {
            zoomOut.addEventListener('click', () => {
                camera.position.z = Math.min(camera.position.z + 0.5, 10);
            });
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        if (autoRotate && mesh) {
            mesh.rotation.y += 0.005;
        }

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    function handleResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener('resize', handleResize);

    // Initial debug info
    console.log(`✨ 3D scene initialized for: ${containerId}`);
    console.log(`📐 Container size: ${container.clientWidth}x${container.clientHeight}`);
    console.log(`🎯 Camera position: z=${camera.position.z}`);
}

// Smooth scrolling for navigation links
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

// Form submission handler
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name') || this.querySelector('input[type="text"]').value;
    const email = formData.get('email') || this.querySelector('input[type="email"]').value;
    const subject = formData.get('subject') || this.querySelectorAll('input[type="text"]')[1]?.value;
    const message = formData.get('message') || this.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', { name, email, subject, message });
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
    this.reset();
});

// Add intersection observer for additional animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateOnScroll = document.querySelectorAll('.skill-category, .project-card');
    animateOnScroll.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Handle mobile menu toggle (if needed)
document.querySelector('.nav-toggle')?.addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks?.classList.toggle('active');
});

// Add some interactive effects to skill items
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.2s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

console.log('🎯 Portfolio JavaScript loaded successfully!');