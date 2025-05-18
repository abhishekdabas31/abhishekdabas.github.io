/**
 * Advanced UI Effects for Portfolio
 * Author: Abhishek Dabas
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Custom Cursor
    initCustomCursor();
    
    // Initialize Three.js Particle Network
    initThreeJsNetwork();
    
    // Initialize Typing Effect
    initTypingEffect();
    
    // Initialize GSAP animations for scroll effects
    initScrollAnimations();
    
    // Initialize tilt effect on project cards and about image
    initTiltEffects();
    
    // Initialize Timeline animations
    initTimelineAnimations();
    
    // Initialize Tools Grid animations
    initToolsGrid();
});

/**
 * Custom Cursor Effect
 */
function initCustomCursor() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    // Check if on mobile - disable custom cursor
    if (window.innerWidth <= 992) {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
        return;
    }
    
    // Set initial cursor position off-screen
    let cursorX = -100;
    let cursorY = -100;
    
    // Track cursor outline separately for smooth effect
    let outlineX = -100;
    let outlineY = -100;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });
    
    // Handle different states when hovering over interactive elements
    document.querySelectorAll('a, button, .project-card, .skill-category, .contact-form, input, textarea').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hovered');
            if (element.tagName.toLowerCase() === 'a' || element.tagName.toLowerCase() === 'button') {
                cursorOutline.classList.add('link-hovered');
            }
        });
        
        element.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hovered', 'link-hovered');
        });
    });
    
    // Animation loop for smooth cursor movement
    const render = () => {
        // Smooth transition for outline circle
        outlineX += (cursorX - outlineX) * 0.15;
        outlineY += (cursorY - outlineY) * 0.15;
        
        // Apply positions
        cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        
        requestAnimationFrame(render);
    };
    
    requestAnimationFrame(render);
}

/**
 * Three.js Particle Network
 */
function initThreeJsNetwork() {
    // Select the canvas element
    const canvas = document.getElementById('three-canvas');
    
    // Initialize the three.js scene
    const scene = new THREE.Scene();
    
    // Initialize the camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Initialize the renderer
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    
    const positionArray = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    
    const colors = [
        new THREE.Color("#4361ee"), // Primary color
        new THREE.Color("#4895ef"), // Primary light
        new THREE.Color("#4cc9f0"), // Accent color
        new THREE.Color("#7209b7")  // Secondary light
    ];
    
    const colorBuffer = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        // Position of each particle (x, y, z)
        positionArray[i * 3] = (Math.random() - 0.5) * 50;      // X
        positionArray[i * 3 + 1] = (Math.random() - 0.5) * 50;  // Y
        positionArray[i * 3 + 2] = (Math.random() - 0.5) * 50;  // Z
        
        // Size of each particle
        scales[i] = Math.random() * 0.5 + 0.1;
        
        // Color of each particle
        const color = colors[Math.floor(Math.random() * colors.length)];
        colorBuffer[i * 3] = color.r;
        colorBuffer[i * 3 + 1] = color.g;
        colorBuffer[i * 3 + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorBuffer, 3));
    
    // Material for particles
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.4,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
    });
    
    // Create the particle system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    // Lines between nearby particles
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4cc9f0,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    
    let lines = [];
    const maxLineDistance = 10;
    
    // Track mouse position for interactivity
    const mouse = new THREE.Vector2();
    
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate the entire particle system
        particleSystem.rotation.y = elapsedTime * 0.05;
        particleSystem.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;
        
        // Remove old lines
        lines.forEach(line => {
            scene.remove(line);
        });
        lines = [];
        
        // Create new connections between nearby particles
        const positions = particleSystem.geometry.attributes.position.array;
        
        // Only check every 10th particle for connections to improve performance
        for (let i = 0; i < particleCount; i += 10) {
            const pX = positions[i * 3];
            const pY = positions[i * 3 + 1];
            const pZ = positions[i * 3 + 2];
            
            // Transform particle position with rotation
            const vector = new THREE.Vector3(pX, pY, pZ);
            vector.applyQuaternion(particleSystem.quaternion);
            
            for (let j = i + 1; j < particleCount; j += 10) {
                const p2X = positions[j * 3];
                const p2Y = positions[j * 3 + 1];
                const p2Z = positions[j * 3 + 2];
                
                // Transform the second particle position
                const vector2 = new THREE.Vector3(p2X, p2Y, p2Z);
                vector2.applyQuaternion(particleSystem.quaternion);
                
                // Calculate distance between particles
                const distance = vector.distanceTo(vector2);
                
                // If particles are close, draw a line between them
                if (distance < maxLineDistance) {
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([vector, vector2]);
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    scene.add(line);
                    lines.push(line);
                }
            }
        }
        
        // Mouse interaction - particles gravitate toward cursor
        if (mouse.x !== 0 && mouse.y !== 0) {
            const mouseVector = new THREE.Vector3(
                mouse.x * 20, // Amplify effect
                mouse.y * 20,
                0
            );
            
            // Apply some attraction to particles
            for (let i = 0; i < particleCount; i++) {
                const ix = i * 3;
                const iy = i * 3 + 1;
                const iz = i * 3 + 2;
                
                const x = positions[ix];
                const y = positions[iy];
                const z = positions[iz];
                
                const particleVector = new THREE.Vector3(x, y, z);
                const distance = particleVector.distanceTo(mouseVector);
                
                // Only affect nearby particles
                if (distance < 10) {
                    // Calculate attraction force
                    const force = 0.05 / Math.max(distance, 2);
                    const direction = new THREE.Vector3().subVectors(mouseVector, particleVector).normalize();
                    
                    // Apply force
                    positions[ix] += direction.x * force;
                    positions[iy] += direction.y * force;
                    positions[iz] += direction.z * force;
                }
            }
            
            // Update particle positions
            particleSystem.geometry.attributes.position.needsUpdate = true;
        }
        
        // Render the scene
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    animate();
}

/**
 * Typing Effect
 */
function initTypingEffect() {
    const options = {
        strings: [
            'Specializing in LLM and agent systems evaluation',
            'Creating robust AI safety frameworks',
            'Building the future of AI with research',
            'Developing autonomous evaluation systems'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 1000,
        loop: true
    };
    
    new Typed('#typing-text', options);
}

/**
 * GSAP ScrollTrigger Animations
 */
function initScrollAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Reveal animations for sections
    document.querySelectorAll('.section-title, .skill-category, .project-card, .education-item, .about-text p, .about-text h3').forEach(element => {
        gsap.fromTo(element, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Animate skill bars
    document.querySelectorAll('.skill-level').forEach(bar => {
        const width = bar.style.width;
        
        gsap.fromTo(bar, 
            { width: 0 },
            {
                width: width,
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Parallax effect for hero section
    gsap.to('.hero-content', {
        y: 100,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}

/**
 * Tilt Effect for Cards and Images
 */
function initTiltEffects() {
    // Initialize tilt effect for project cards
    VanillaTilt.init(document.querySelectorAll('.project-card'), {
        max: 10,
        speed: 300,
        glare: true,
        'max-glare': 0.1,
        scale: 1.05
    });
    
    // Initialize tilt for about image
    VanillaTilt.init(document.querySelectorAll('.about-image'), {
        max: 10,
        speed: 300,
        glare: true,
        'max-glare': 0.2,
        scale: 1.05
    });
}

/**
 * Timeline Animation
 */
function initTimelineAnimations() {
    // Check if timeline section exists
    if (!document.querySelector('.timeline')) return;
    
    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Set up ScrollTrigger for each timeline item
    timelineItems.forEach((item, index) => {
        gsap.fromTo(item, 
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0, 
                duration: 0.8,
                delay: index * 0.2, // Staggered animation
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleClass: {targets: item, className: 'active'},
                    once: true
                }
            }
        );
    });
    
    // Animate timeline line drawing
    gsap.fromTo('.timeline::before',
        { scaleY: 0, transformOrigin: 'top' },
        {
            scaleY: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1
            }
        }
    );
}

/**
 * Tools Grid Animation
 */
function initToolsGrid() {
    // Check if tools grid exists
    if (!document.querySelector('.tools-grid')) return;
    
    const toolItems = document.querySelectorAll('.tool-item');
    
    // Set initial opacity to 0
    gsap.set(toolItems, { opacity: 0, y: 20 });
    
    // Staggered appearance of tool items
    gsap.to(toolItems, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.tools-grid',
            start: 'top 80%'
        }
    });
    
    // Add hover effects with subtle animations
    toolItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item.querySelector('.tool-icon i'), {
                y: -5,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item.querySelector('.tool-icon i'), {
                y: 0,
                duration: 0.2,
                ease: 'power2.in'
            });
        });
    });
} 