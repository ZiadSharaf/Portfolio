// Make logo interactive
const znLogo = document.querySelector('.zn-logo');

if (znLogo) {
    znLogo.addEventListener('mouseenter', () => {
        const letters = document.querySelectorAll('.letter-z, .letter-n');
        const points = document.querySelectorAll('.data-point');

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
}

// Typing animation for name
function typeWriter(element, text, speed) {
    if (!element) return;
    let i = 0;
    element.innerHTML = "";

    const cursor = document.createElement('span');
    cursor.className = 'blinking-cursor';
    cursor.textContent = '|';
    element.appendChild(cursor);

    const timer = setInterval(() => {
        if (i < text.length) {
            element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
            i++;
        } else {
            clearInterval(timer);

            // Remove cursor after 3 seconds
            setTimeout(() => {
                cursor.style.transition = 'opacity 0.5s ease-out';
                cursor.style.opacity = '0';

                setTimeout(() => {
                    if (cursor.parentNode === element) {
                        element.removeChild(cursor);
                    }
                }, 500);
            }, 3000);
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

if (hamburger && navLinks) {
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
}

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function getSavedTheme() {
    try {
        return localStorage.getItem('theme');
    } catch (e) {
        return null;
    }
}

function saveTheme(value) {
    try {
        localStorage.setItem('theme', value);
    } catch (e) {
        // Ignore storage errors in restricted contexts
    }
}

function setInitialTheme() {
    const savedTheme = getSavedTheme();
    if (savedTheme) {
        body.classList.toggle('light-mode', savedTheme === 'light');
    } else {
        body.classList.toggle('light-mode', !prefersDarkScheme.matches);
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    if (!themeToggle) return;
    if (body.classList.contains('light-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    }
}

function toggleTheme() {
    body.classList.toggle('light-mode');
    const isLightMode = body.classList.contains('light-mode');
    saveTheme(isLightMode ? 'light' : 'dark');
    updateThemeIcon();
}

setInitialTheme();

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

const handleSystemThemeChange = (e) => {
    if (!getSavedTheme()) {
        body.classList.toggle('light-mode', !e.matches);
        updateThemeIcon();
    }
};

if (typeof prefersDarkScheme.addEventListener === 'function') {
    prefersDarkScheme.addEventListener('change', handleSystemThemeChange);
} else if (typeof prefersDarkScheme.addListener === 'function') {
    prefersDarkScheme.addListener(handleSystemThemeChange);
}

// Smooth scrolling for anchor links (ignoring modal triggers and bare "#" links)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.classList.contains('open-modal')) return;

        const targetSelector = this.getAttribute('href');
        if (!targetSelector || targetSelector === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Back to Top button visibility on scroll
const backToTopBtn = document.getElementById('backToTop');

const toggleBackToTop = () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
    } else {
        backToTopBtn.classList.remove('active');
    }
};

window.addEventListener('scroll', toggleBackToTop);
toggleBackToTop();

// ===== Project Modal functionality =====
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalGithub = document.getElementById("modalGithub");
const slidesContainer = document.querySelector("#projectModal .slides");
const thumbnailsContainer = document.querySelector("#projectModal .thumbnails");
const closeBtn = document.querySelector("#projectModal .close-btn");
const btnPrev = document.querySelector("#projectModal .prev");
const btnNext = document.querySelector("#projectModal .next");

let currentSlide = 0;
let autoPlayInterval = null;
let videoPlaying = false;

const projectData = [
    {
        title: "Hotel Reservation Performance Dashboard",
        description:
            "Analyzed a dataset of 119,390 hotel bookings using Power BI, Power Query, and DAX to uncover insights on booking patterns, customer segmentation, cancellation rates, and revenue performance.",
        github: "https://github.com/ZiadSharaf/Hotel-Reservation-Performance-Dashboard",
        media: [
            { src: "Hotel Reservation Performance Dashboard Video.mp4", desc: "Walkthrough video of the interactive Power BI dashboard." },
            { src: "Booking_Overview.jpg", desc: "Overview of hotel booking trends and occupancy performance." },
            { src: "Customer_Market_Insights_1.jpg", desc: "Insights into customer behaviour and reservation sources." },
            { src: "Customer_Market_Insights_2.jpg", desc: "Detailed analysis of customer behaviour and booking lead times." },
            { src: "Revenue_Operations.jpg", desc: "Visualization of revenue trends and operational efficiency." },
            { src: "Data_Modeling.jpg", desc: "Star schema data modeling and transformation process in Power BI." }
        ],
    },
    {
        title: "Car Sales Project",
        description:
            "Analyzed 157 car models across 30 manufacturers, cleaned data and imputed missing values with scikit-learn in Python, and built interactive Excel dashboards using Power Query, Power Pivot, and DAX.",
        github: "https://github.com/ZiadSharaf/Car-Sales-Project",
        media: [
            { src: "Car_Sales_Project_Dashboard_Video.mp4", desc: "Walkthrough video of the interactive Excel dashboard." },
            { src: "MainDashboard.png", desc: "Main Excel dashboard summarizing total sales performance." },
            { src: "Performance1Dashboard.png", desc: "Revenue trends and performance metrics visualization." },
            { src: "Performance2Dashboard.png", desc: "Comparative analysis between manufacturers and regions." }
        ],
    },
];

// Open modal
document.querySelectorAll(".projects-grid .btn.open-modal").forEach((btn, fallbackIndex) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        const dataIndex = parseInt(btn.getAttribute("data-index"), 10);
        const index = !Number.isNaN(dataIndex) && projectData[dataIndex] ? dataIndex : fallbackIndex;
        const project = projectData[index];
        if (!project || !modal) return;

        modalTitle.textContent = project.title;
        modalGithub.href = project.github;
        slidesContainer.innerHTML = "";
        thumbnailsContainer.innerHTML = "";

        // Create slides
        project.media.forEach((item, i) => {
            const isVideo = /\.(mp4|webm|ogg)$/i.test(item.src);
            const slide = document.createElement("div");
            slide.className = "slide";

            if (isVideo) {
                const video = document.createElement("video");
                video.controls = true;
                video.playsInline = true;
                video.preload = "auto";
                video.muted = false;
                const source = document.createElement("source");
                source.src = item.src;
                source.type = "video/mp4";
                video.appendChild(source);
                slide.appendChild(video);

                // Stop auto-play while video is playing
                video.addEventListener("play", () => {
                    videoPlaying = true;
                    clearInterval(autoPlayInterval);
                });

                video.addEventListener("ended", () => {
                    videoPlaying = false;
                    startAutoPlay();
                });
            } else {
                const img = document.createElement("img");
                img.src = item.src;
                img.alt = item.desc || "";
                slide.appendChild(img);
            }

            const desc = document.createElement("p");
            desc.className = "media-desc";
            desc.textContent = item.desc || "";
            slide.appendChild(desc);
            slidesContainer.appendChild(slide);

            // Thumbnail
            const thumb = document.createElement(isVideo ? "video" : "img");
            thumb.className = "thumbnail";
            thumb.src = item.src;
            if (isVideo) thumb.muted = true;
            thumb.addEventListener("click", () => {
                currentSlide = i;
                updateSlide(project);
                resetAutoPlay();
            });
            thumbnailsContainer.appendChild(thumb);
        });

        currentSlide = 0;
        modal.dataset.activeIndex = index;
        modal.style.display = "flex";
        updateSlide(project);

        const firstMedia = project.media[0];
        const firstIsVideo = /\.(mp4|webm|ogg)$/i.test(firstMedia.src);
        if (!firstIsVideo) startAutoPlay();
    });
});

function updateSlide(project) {
    const total = slidesContainer.children.length;
    if (!total) return;

    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

    modalDescription.textContent =
        project.media[currentSlide]?.desc || project.description;

    thumbnailsContainer.querySelectorAll(".thumbnail").forEach((t, i) => {
        t.classList.toggle("active", i === currentSlide);
    });

    // Video control
    slidesContainer.querySelectorAll("video").forEach((v, i) => {
        if (i === currentSlide) {
            v.currentTime = 0;
            v.play().catch(() => {});
        } else {
            v.pause();
        }
    });
}

function changeSlide(delta) {
    const total = slidesContainer.children.length;
    if (!total || videoPlaying) return;

    currentSlide = (currentSlide + delta + total) % total;

    const index = parseInt(modal.dataset.activeIndex || 0, 10);
    updateSlide(projectData[index]);
}

function startAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
        if (!videoPlaying) changeSlide(1);
    }, 4000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// Navigation
if (btnPrev) {
    btnPrev.addEventListener("click", () => {
        changeSlide(-1);
        resetAutoPlay();
    });
}
if (btnNext) {
    btnNext.addEventListener("click", () => {
        changeSlide(1);
        resetAutoPlay();
    });
}

// Close modal
if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
}
window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.style.display === "flex") {
        closeModal();
    }
});

function closeModal() {
    if (!modal) return;
    modal.style.display = "none";
    clearInterval(autoPlayInterval);
    slidesContainer.querySelectorAll("video").forEach((v) => v.pause());
    videoPlaying = false;
}

// Form submission
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('form-status');

function validateForm() {
    let isValid = true;

    const name = document.getElementById('name').value.trim();
    const nameError = document.getElementById('name-error');
    if (name === '') {
        nameError.textContent = 'Please enter your name';
        nameError.style.display = 'block';
        isValid = false;
    } else {
        nameError.style.display = 'none';
    }

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

    const subject = document.getElementById('subject').value.trim();
    const subjectError = document.getElementById('subject-error');
    if (subject === '') {
        subjectError.textContent = 'Please enter a subject';
        subjectError.style.display = 'block';
        isValid = false;
    } else {
        subjectError.style.display = 'none';
    }

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

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!validateForm()) return;

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

    contactForm.addEventListener('input', function (e) {
        const field = e.target.id;
        if (!field) return;
        const value = e.target.value.trim();
        const errorElement = document.getElementById(`${field}-error`);
        if (!errorElement) return;

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
}

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

fadeInOnScroll();
window.addEventListener('scroll', fadeInOnScroll);
