
// Make logo interactive
const znLogo = document.querySelector('.zn-logo');

// Reset animation on hover
znLogo.addEventListener('mouseenter', () => {
    const letters = document.querySelectorAll('.letter-z, .letter-n');
    const points = document.querySelectorAll('.data-point');

    // Briefly hide and restart animations
    letters.forEach(letter => {
        letter.style.animation = 'none';
        void letter.offsetWidth; // Trigger reflow
        letter.style.animation = '';
    });

    points.forEach(point => {
        point.style.animation = 'none';
        void point.offsetWidth; // Trigger reflow
        point.style.animation = '';
    });
});

// Typing animation for name
function typeWriter(element, text, speed) {
    let i = 0;
    element.innerHTML = ""; // Use innerHTML instead of textContent

    // Create a span for the cursor
    const cursor = document.createElement('span');
    cursor.className = 'blinking-cursor';
    cursor.textContent = '|';
    element.appendChild(cursor);

    const timer = setInterval(() => {
        if (i < text.length) {
            // Insert text before the cursor
            element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
            i++;
        } else {
            clearInterval(timer);

            // Remove cursor after 3 seconds
            setTimeout(() => {
                cursor.style.transition = 'opacity 0.5s ease-out';
                cursor.style.opacity = '0';

                // Remove cursor from DOM after fade out completes
                setTimeout(() => {
                    element.removeChild(cursor);
                }, 500);
            }, 3000); // 3000ms = 3 seconds
        }
    }, speed);
}


// Start typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const nameElement = document.getElementById('typed-name');
    typeWriter(nameElement, "Ziad Nasser", 150);
});
// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active') ?
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Theme toggle
// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('light-mode', savedTheme === 'light');
    } else {
        body.classList.toggle('light-mode', !prefersDarkScheme.matches);
    }
    updateThemeIcon();
}

// Update the theme icon based on current mode
function updateThemeIcon() {
    if (body.classList.contains('light-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    }
}

// Toggle between light and dark mode
function toggleTheme() {
    body.classList.toggle('light-mode');
    const isLightMode = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    updateThemeIcon();
}

// Initialize theme on page load
setInitialTheme();

// Add event listener for theme toggle
themeToggle.addEventListener('click', toggleTheme);

// Listen for system theme changes
prefersDarkScheme.addListener((e) => {
    if (!localStorage.getItem('theme')) {
        body.classList.toggle('light-mode', !e.matches);
        updateThemeIcon();
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const modal = document.getElementById("projectModal");
const closeBtn = document.querySelector(".close-btn");
const slidesContainer = document.querySelector(".slides");
const thumbnailsContainer = document.querySelector(".thumbnails");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalGithub = document.getElementById("modalGithub");
let currentSlide = 0;
let autoPlayInterval;

const projectData = [
    {
        title: "Car Sales Project",
        description: "Analysis of sales, performance, and profitability across 30 manufacturers and 157 car models.",
        github: "https://github.com/ZiadSharaf/Car-Sales-Project",
        media: [
            { type: "image", src: "MainDashboard.png", caption: "Main Dashboard & KPIs" },
            { type: "image", src: "Performance1Dashboard.png", caption: "Manufacturer Performance" },
            { type: "image", src: "Performance2Dashboard.png", caption: "Price vs Performance Analysis" },
            { type: "video", src: "Car_Sales_Project_Dashboard_Video.mp4", caption: "Video Walkthrough" }
        ]
    }
];

document.querySelectorAll(".projects-grid .btn").forEach((btn, index) => {
    if (projectData[index]) {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const project = projectData[index];

            // Fill modal content
            modalTitle.textContent = project.title;
            modalDescription.textContent = project.description;
            modalGithub.setAttribute("href", project.github);
            modalGithub.setAttribute("target", "_blank");
            modalGithub.setAttribute("rel", "noopener noreferrer");

            // Fill media and thumbnails
            slidesContainer.innerHTML = "";
            thumbnailsContainer.innerHTML = "";

            project.media.forEach((item) => {
                let mediaElement;
                if (item.type === "video") {
                    mediaElement = `<div class="slide"><video src="${item.src}" controls></video><p>${item.caption}</p></div>`;
                } else {
                    mediaElement = `<div class="slide"><img src="${item.src}" alt=""><p>${item.caption}</p></div>`;
                }
                slidesContainer.innerHTML += mediaElement;
                thumbnailsContainer.innerHTML += mediaElement;
            });

            currentSlide = 0;
            updateSlide();

            // Add thumbnail click events
            thumbnailsContainer.querySelectorAll("img, video").forEach((thumb, i) => {
                thumb.addEventListener("click", () => {
                    currentSlide = i;
                    updateSlide();
                    resetAutoPlay();
                });
            });

            modal.style.display = "flex";
            startAutoPlay();
        });
    }
});

closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

document.querySelector(".prev").addEventListener("click", () => {
    prevSlide();
    resetAutoPlay();
});

document.querySelector(".next").addEventListener("click", () => {
    nextSlide();
    resetAutoPlay();
});

function updateSlide() {
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    thumbnailsContainer.querySelectorAll("img, video").forEach((thumb, i) => {
        thumb.classList.toggle("active", i === currentSlide);
    });
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slidesContainer.children.length) % slidesContainer.children.length;
    updateSlide();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slidesContainer.children.length;
    updateSlide();
}

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 4000); // 4 seconds per slide
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

function closeModal() {
    modal.style.display = "none";
    clearInterval(autoPlayInterval);
}

// Initialize DataTable
$(document).ready(function () {
    $('#skillsTable').DataTable({
        responsive: true,
        paging: false,
        searching: true,
        info: false,
        ordering: false,
        order: [[0, 'asc']],
        columnDefs: [
            { targets: [0, 1, 2], searchable: true }
        ]
    });
});

// Form submission
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('form-status');

// Form validation
function validateForm() {
    let isValid = true;

    // Validate name
    const name = document.getElementById('name').value.trim();
    const nameError = document.getElementById('name-error');
    if (name === '') {
        nameError.textContent = 'Please enter your name';
        nameError.style.display = 'block';
        isValid = false;
    } else {
        nameError.style.display = 'none';
    }

    // Validate email
    const email = document.getElementById('email').value.trim();
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        emailError.textContent = 'Please enter your email';
        emailError.style.display = 'block';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email';
        emailError.style.display = 'block';
        isValid = false;
    } else {
        emailError.style.display = 'none';
    }

    // Validate subject
    const subject = document.getElementById('subject').value.trim();
    const subjectError = document.getElementById('subject-error');
    if (subject === '') {
        subjectError.textContent = 'Please enter a subject';
        subjectError.style.display = 'block';
        isValid = false;
    } else {
        subjectError.style.display = 'none';
    }

    // Validate message
    const message = document.getElementById('message').value.trim();
    const messageError = document.getElementById('message-error');
    if (message === '') {
        messageError.textContent = 'Please enter your message';
        messageError.style.display = 'block';
        isValid = false;
    } else {
        messageError.style.display = 'none';
    }

    return isValid;
}

// Form submission
contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    // Change button to loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            formStatus.textContent = 'Thank you! Your message has been sent successfully.';
            formStatus.className = 'form-status success';
            contactForm.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        formStatus.textContent = 'Oops! There was a problem sending your message. Please try again later.';
        formStatus.className = 'form-status error';
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// Real-time validation
contactForm.addEventListener('input', function (e) {
    const field = e.target.id;
    const value = e.target.value.trim();
    const errorElement = document.getElementById(`${field}-error`);

    if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value === '') {
            errorElement.textContent = 'Please enter your email';
            errorElement.style.display = 'block';
        } else if (!emailRegex.test(value)) {
            errorElement.textContent = 'Please enter a valid email';
            errorElement.style.display = 'block';
        } else {
            errorElement.style.display = 'none';
        }
    } else {
        if (value === '') {
            errorElement.textContent = `Please enter your ${field}`;
            errorElement.style.display = 'block';
        } else {
            errorElement.style.display = 'none';
        }
    }
});

// Animation on scroll
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInOnScroll = () => {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Run once on page load
fadeInOnScroll();

// Then run on scroll
window.addEventListener('scroll', fadeInOnScroll);