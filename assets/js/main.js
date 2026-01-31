// Enhanced JavaScript functionality for Shubhmilanfilms

// Utility functions
const utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Smooth scroll to element
    smoothScrollTo: (element, duration = 1000) => {
        const targetPosition = element.offsetTop - 80; // Account for fixed navbar
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Enhanced scroll animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll');
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            );

            this.elements.forEach(el => this.observer.observe(el));
        } else {
            // Fallback for older browsers
            this.elements.forEach(el => el.classList.add('fade-in'));
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Add stagger effect for child elements
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('fade-in');
                    }, index * 100);
                });
            }
        });
    }
}

// Enhanced navbar functionality
class EnhancedNavbar {
    constructor() {
        this.navbar = document.querySelector('nav');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.lastScrollTop = 0;
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupActiveLinks();
    }

    setupMobileMenu() {
        if (this.mobileMenuBtn && this.mobileMenu) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.mobileMenu.classList.toggle('hidden');
                this.mobileMenuBtn.classList.toggle('active');
                
                // Animate hamburger icon
                const icon = this.mobileMenuBtn.querySelector('i');
                if (this.mobileMenu.classList.contains('hidden')) {
                    icon.className = 'fas fa-bars text-xl';
                } else {
                    icon.className = 'fas fa-times text-xl';
                }
            });

            // Close mobile menu when clicking on links
            this.mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    this.mobileMenu.classList.add('hidden');
                    this.mobileMenuBtn.classList.remove('active');
                    this.mobileMenuBtn.querySelector('i').className = 'fas fa-bars text-xl';
                });
            });
        }
    }

    setupScrollEffects() {
        const handleScroll = utils.debounce(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove shadow based on scroll position
            if (scrollTop > 100) {
                this.navbar.classList.add('shadow-lg');
            } else {
                this.navbar.classList.remove('shadow-lg');
            }

            // Hide/show navbar on scroll (optional)
            if (scrollTop > this.lastScrollTop && scrollTop > 200) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }
            
            this.lastScrollTop = scrollTop;
        }, 10);

        window.addEventListener('scroll', handleScroll);
    }

    setupActiveLinks() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav a[href]');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('text-gold');
            }
        });
    }
}

// Gallery functionality
class GalleryManager {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.init();
    }

    init() {
        this.setupFiltering();
        this.setupLightbox();
        this.setupKeyboardNavigation();
    }

    setupFiltering() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active button
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter items with animation
                this.galleryItems.forEach((item, index) => {
                    setTimeout(() => {
                        if (filter === 'all' || item.classList.contains(filter)) {
                            item.style.display = 'block';
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(20px)';
                            
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 50);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(-20px)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    }, index * 50);
                });
            });
        });
    }

    setupLightbox() {
        // Close lightbox when clicking outside image
        if (this.lightbox) {
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) {
                    this.closeLightbox();
                }
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.lightbox && this.lightbox.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.closeLightbox();
                }
                // Add arrow key navigation for multiple images
                if (e.key === 'ArrowLeft') {
                    this.previousImage();
                }
                if (e.key === 'ArrowRight') {
                    this.nextImage();
                }
            }
        });
    }

    openLightbox(imageSrc) {
        if (this.lightbox && this.lightboxImg) {
            this.lightboxImg.src = imageSrc;
            this.lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        if (this.lightbox) {
            this.lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    previousImage() {
        // Implementation for previous image navigation
        console.log('Previous image');
    }

    nextImage() {
        // Implementation for next image navigation
        console.log('Next image');
    }
}

// Form enhancements
class FormManager {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            this.setupFormValidation(form);
            this.setupFormSubmission(form);
        });
    }

    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }

    showFieldError(field, isValid, message) {
        const existingError = field.parentNode.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }

        if (!isValid) {
            field.classList.add('border-red-500');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error text-red-500 text-sm mt-1';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        } else {
            field.classList.remove('border-red-500');
            field.classList.add('border-green-500');
        }
    }

    clearErrors(field) {
        field.classList.remove('border-red-500', 'border-green-500');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    setupFormSubmission(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate all fields
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            let isFormValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                this.submitForm(form);
            } else {
                // Scroll to first error
                const firstError = form.querySelector('.field-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Show success message
            this.showSuccessMessage(form);
            
            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 2000);
    }

    showSuccessMessage(form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-600 text-white p-4 rounded-lg mb-6 fade-in';
        successDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-3"></i>
                <span>Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.</span>
            </div>
        `;
        
        form.insertBefore(successDiv, form.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// Performance optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalImages();
    }

    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    preloadCriticalImages() {
        const criticalImages = [
            // Add paths to critical images that should be preloaded
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ScrollAnimations();
    new EnhancedNavbar();
    new GalleryManager();
    new FormManager();
    new PerformanceOptimizer();

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                utils.smoothScrollTo(target);
            }
        });
    });

    // Add loading animation to buttons
    document.querySelectorAll('.btn-loading').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 2000);
            }
        });
    });
});

// Global functions for inline event handlers
window.openLightbox = function(imageSrc) {
    const galleryManager = new GalleryManager();
    galleryManager.openLightbox(imageSrc);
};

window.closeLightbox = function() {
    const galleryManager = new GalleryManager();
    galleryManager.closeLightbox();
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        utils,
        ScrollAnimations,
        EnhancedNavbar,
        GalleryManager,
        FormManager,
        PerformanceOptimizer
    };
}