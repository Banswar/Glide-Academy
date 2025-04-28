
        // Navigation and Page Switching
        document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('nav ul li a, .footer-section a[data-page]');
            const pages = document.querySelectorAll('.page');
            const menuToggle = document.querySelector('.menu-toggle');
            const navMenu = document.getElementById('navMenu');

            // Page Navigation
            function navigateTo(pageId) {
                pages.forEach(page => {
                    page.classList.remove('active');
                });
                
                const targetPage = document.getElementById(pageId);
                if (targetPage) {
                    targetPage.classList.add('active');
                    
                    // Update active nav link
                    navLinks.forEach(link => {
                        if (link.getAttribute('data-page') === pageId) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                    
                    // Scroll to top
                    window.scrollTo(0, 0);
                    
                    // Update URL without reloading (for bookmarking)
                    history.pushState(null, null, `#${pageId}`);
                }
                
                // Close mobile menu
                navMenu.classList.remove('active');
            }

            // Set up navigation click handlers
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const pageId = this.getAttribute('data-page');
                    navigateTo(pageId);
                });
            });

            // Mobile menu toggle
            menuToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });

            // Handle browser back/forward buttons
            window.addEventListener('popstate', function() {
                const hash = window.location.hash.substring(1);
                if (hash) {
                    navigateTo(hash);
                } else {
                    navigateTo('home');
                }
            });

            // Check for hash in URL on page load
            if (window.location.hash) {
                const pageId = window.location.hash.substring(1);
                navigateTo(pageId);
            }

            // Auth tabs
            const authTabs = document.querySelectorAll('.auth-tab');
            const authContents = document.querySelectorAll('.auth-content');

            authTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    authTabs.forEach(t => t.classList.remove('active'));
                    authContents.forEach(c => c.classList.remove('active'));
                    
                    this.classList.add('active');
                    document.getElementById(tabId).classList.add('active');
                });
            });

            // Form submission handlers (for demo - prevent actual form submission)
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    alert('Form submission simulated! In a real application, this would be processed.');
                });
            });
        });

        // Service Worker Registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('sw.js')
                    .then(function(registration) {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    })
                    .catch(function(error) {
                        console.log('ServiceWorker registration failed: ', error);
                    });
            });

            // Listen for online/offline events
            window.addEventListener('online', updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);

            function updateOnlineStatus(event) {
                const offlineNotification = document.getElementById('offlineNotification');
                
                if (navigator.onLine) {
                    offlineNotification.style.display = 'none';
                } else {
                    offlineNotification.style.display = 'block';
                    
                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        offlineNotification.style.display = 'none';
                    }, 5000);
                }
            }

            // Check status on initial load
            updateOnlineStatus();
        }

        