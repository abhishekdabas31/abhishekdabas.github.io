/**
 * Portfolio Website JavaScript
 * Author: Abhishek Dabas
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Check for saved theme preference or set default
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (localStorage.getItem('theme')) {
        document.body.classList.toggle('dark-mode', localStorage.getItem('theme') === 'dark');
    } else {
        document.body.classList.toggle('dark-mode', prefersDarkMode);
    }
    
    // Theme Toggle Functionality
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Save preference to localStorage
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
    
    // Mobile Menu Toggle
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData);
            
            // In a real application, you would send this data to a server
            console.log('Form submitted:', formValues);
            
            // Show success message (in a real app, this would happen after successful AJAX call)
            showFormMessage('Message sent successfully! I will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Form success/error message
    function showFormMessage(message, type) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Add message to DOM
        if (contactForm) {
            contactForm.appendChild(messageElement);
            
            // Remove message after 5 seconds
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }
    
    // Back to Top Button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Project Image Placeholders - Add random colors if no images are set
    const projectImages = document.querySelectorAll('.project-image img');
    projectImages.forEach(img => {
        img.addEventListener('error', function() {
            const parent = this.parentElement;
            const colors = ['#4a6bff', '#12b2b3', '#6c63ff', '#ff6b6b', '#0fb9b1'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Replace broken image with a colored div
            parent.innerHTML = `
                <div style="width: 100%; height: 100%; background-color: ${randomColor}; 
                display: flex; align-items: center; justify-content: center; color: white;">
                    <i class="fas fa-code" style="font-size: 3rem;"></i>
                </div>
            `;
        });
    });
    
    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-level');
    const animateSkills = () => {
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (barPosition < screenPosition) {
                const width = bar.getAttribute('style');
                // Only animate if not already animated
                if (!bar.classList.contains('animated')) {
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                        bar.classList.add('animated');
                    }, 100);
                }
            }
        });
    };
    
    // Run on initial load
    animateSkills();
    
    // Run on scroll
    window.addEventListener('scroll', animateSkills);
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Prevent default behavior
            e.preventDefault();
            
            // Get the target section
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Scroll to the section
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Highlight active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}); 