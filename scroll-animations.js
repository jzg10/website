// scroll-animations.js
document.addEventListener('DOMContentLoaded', function() {
    // Get all sections that should animate
    const animatedSections = document.querySelectorAll('.education-section, .experience-section, .section');
    
    // Add initial styles for animation
    const style = document.createElement('style');
    style.textContent = `
        .slide-in-section {
            opacity: 0;
            transform: translateX(-100px);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .slide-in-section.from-right {
            transform: translateX(100px);
        }
        
        .slide-in-section.animate-in {
            opacity: 1;
            transform: translateX(0);
        }
        
        /* Stagger child elements for experience section */
        .experience-section .job {
            opacity: 0;
            transform: translateX(-50px);
            transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .experience-section.animate-in .job {
            opacity: 1;
            transform: translateX(0);
        }
        
        .experience-section.animate-in .job:nth-child(1) {
            transition-delay: 0.1s;
        }
        
        .experience-section.animate-in .job:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .experience-section.animate-in .job:nth-child(3) {
            transition-delay: 0.3s;
        }
        
        /* Stagger project items */
        .section .project {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .section.animate-in .project {
            opacity: 1;
            transform: translateY(0);
        }
        
        .section.animate-in .project:nth-child(1) {
            transition-delay: 0.1s;
        }
        
        .section.animate-in .project:nth-child(2) {
            transition-delay: 0.2s;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize sections with animation classes
    animatedSections.forEach((section, index) => {
        section.classList.add('slide-in-section');
        
        // Alternate slide direction - education and projects from left, experience and skills from right
        if (section.classList.contains('experience-section') || 
            (section.classList.contains('section') && section.querySelector('h2').textContent.trim() === 'Skills')) {
            section.classList.add('from-right');
        }
    });
    
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Optional: Stop observing once animated to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Start observing all animated sections
    animatedSections.forEach(section => {
        observer.observe(section);
    });
    
    // Add smooth scrolling for any anchor links (bonus feature)
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
});