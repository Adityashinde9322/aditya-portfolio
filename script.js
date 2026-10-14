/**
 * Swara Chaudhari - Portfolio JavaScript
 * Interactive animations, typing effect, personal AI chatbot, scroll reveals & theme toggle
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Current Year in Footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile Navigation Toggle
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close mobile menu on clicking any link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 3. Theme Toggle (Pastel Dark theme is default, Pastel Fairy Light mode on toggle)
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "light") {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    if (themeToggle) themeToggle.textContent = "☼";
  } else {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
    if (themeToggle) themeToggle.textContent = "☾";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = document.body.classList.toggle("light-theme");
      if (isLight) {
        document.body.classList.remove("dark-theme");
        themeToggle.textContent = "☼";
        themeToggle.setAttribute("aria-label", "Switch to dark theme");
        localStorage.setItem("portfolio-theme", "light");
      } else {
        document.body.classList.add("dark-theme");
        themeToggle.textContent = "☾";
        themeToggle.setAttribute("aria-label", "Switch to light theme");
        localStorage.setItem("portfolio-theme", "dark");
      }
    });
  }

  // 4. Hero Professional Role Typing Animation
  const typingRoleEl = document.getElementById("typingRole");
  if (typingRoleEl) {
    const roles = [
      "AI & Data Science Student",
      "Machine Learning Enthusiast",
      "Python, C & Java Programmer",
      "Cybersecurity Explorer"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const holdDuration = 1800;

    const typeStep = () => {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typingRoleEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingRoleEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at the end of word
        setTimeout(() => {
          isDeleting = true;
          typeStep();
        }, holdDuration);
        return;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeStep, 400);
        return;
      }

      setTimeout(typeStep, isDeleting ? deleteSpeed : typeSpeed);
    };

    setTimeout(typeStep, 600);
  }

  // 5. Scroll Reveal Animations with IntersectionObserver
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("active"));
  }

  // 6. Animated Stats Counter
  const counters = document.querySelectorAll(".counter");
  let animatedCounters = false;

  const runCounters = () => {
    counters.forEach((counter) => {
      const target = parseFloat(counter.getAttribute("data-target"));
      const decimals = parseInt(counter.getAttribute("data-decimals") || "0", 10);
      const suffix = counter.getAttribute("data-suffix") || "";
      const duration = 1800; // ms
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = (target * easeOut).toFixed(decimals);

        counter.textContent = currentVal + suffix;

        if (frame >= totalFrames) {
          clearInterval(timer);
          counter.textContent = target.toFixed(decimals) + suffix;
        }
      }, frameDuration);
    });
  };

  const statsSection = document.getElementById("statsCounter");
  if (statsSection && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedCounters) {
            animatedCounters = true;
            runCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  } else {
    runCounters();
  }

  // 7. Interactive 3D Tilt Effect on Profile Card
  const tiltCard = document.getElementById("tiltCard");
  if (tiltCard && window.matchMedia("(hover: hover)").matches) {
    tiltCard.addEventListener("mousemove", (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    tiltCard.addEventListener("mouseleave", () => {
      tiltCard.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  }

  // 8. Toast Notification & Copy-to-Clipboard
  const toast = document.getElementById("toastNotification");
  const toastMessage = document.getElementById("toastMessage");
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;
    toast.classList.add("show");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  };

  const copyButtons = document.querySelectorAll(".copy-btn");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied: ${textToCopy}`);
      } catch (err) {
        const tempInput = document.createElement("input");
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        showToast(`Copied to clipboard!`);
      }
    });
  });

  // 9. Contact Form Handling
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const subject = document.getElementById("subject")?.value.trim();
      const message = document.getElementById("message")?.value.trim();

      if (!name || !email || !message) {
        if (formFeedback) {
          formFeedback.textContent = "Please fill in all required fields.";
          formFeedback.style.color = "#f472b6";
        }
        return;
      }

      const mailtoUrl = `mailto:swarachaudhari23@gmail.com?subject=${encodeURIComponent(
        subject || "Portfolio Contact: " + name
      )}&body=${encodeURIComponent(`Hi Swara,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      if (formFeedback) {
        formFeedback.textContent = "Opening your email app to send message...";
        formFeedback.style.color = "#6ee7b7";
      }

      showToast("Preparing your message email...");
      setTimeout(() => {
        window.location.href = mailtoUrl;
        contactForm.reset();
        if (formFeedback) {
          formFeedback.textContent = "Thank you! You can also email directly at swarachaudhari23@gmail.com";
        }
      }, 700);
    });
  }

  // 10. Personal Chatbot Engine ("Swara AI Assistant")
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const chatCloseBtn = document.getElementById("chatCloseBtn");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");
  const chatChips = document.querySelectorAll(".chat-chip");

  if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener("click", () => {
      const isOpen = chatbotWindow.classList.toggle("open");
      chatbotWindow.setAttribute("aria-hidden", String(!isOpen));
      if (isOpen && chatInput) chatInput.focus();
    });

    if (chatCloseBtn) {
      chatCloseBtn.addEventListener("click", () => {
        chatbotWindow.classList.remove("open");
        chatbotWindow.setAttribute("aria-hidden", "true");
      });
    }

    // Scroll to bottom helper
    const scrollToBottom = () => {
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    };

    // Append Message Helper
    const appendMessage = (text, sender = "bot") => {
      if (!chatMessages) return;
      const msgDiv = document.createElement("div");
      msgDiv.className = `chat-msg ${sender}-msg`;
      msgDiv.innerHTML = `<div class="msg-bubble">${text}</div>`;
      chatMessages.appendChild(msgDiv);
      scrollToBottom();
    };

    // Chatbot Knowledge Engine for Swara Chaudhari
    const getBotResponse = (query) => {
      const q = query.toLowerCase();

      if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("greeting")) {
        return "Hello! 🌸 I'm Swara's portfolio AI. I can tell you about her education, projects, skills, or contact info!";
      }
      
      if (q.includes("about") || q.includes("who is") || q.includes("yourself") || q.includes("bio")) {
        return "Swara Chaudhari is a motivated <strong>AI & Data Science engineering student</strong> at R.C. Patel Institute of Technology, Shirpur. She has a strong foundation in C, Python, and Java, with interests in predictive modeling, machine learning, and cybersecurity! 🌸";
      }

      if (q.includes("skill") || q.includes("stack") || q.includes("language") || q.includes("tech")) {
        return "Swara's key technical skills include:<br>• <strong>Programming:</strong> Python, C, Java (OOP)<br>• <strong>AI & Data Science:</strong> Predictive Modeling, Data Handling, EDA<br>• <strong>Cybersecurity:</strong> Fundamentals & safe coding<br>• <strong>Problem Solving:</strong> Algorithmic logic & structured thinking!";
      }

      if (q.includes("project") || q.includes("work") || q.includes("house price") || q.includes("prediction")) {
        return "Swara's featured projects include:<br>1. <strong>House Price Prediction:</strong> Machine Learning model estimating property values using Python, EDA, and regression.<br>2. <strong>C Algorithmic Logic Suite:</strong> Modular data structures & algorithms.<br>3. <strong>Java OOP System Architecture:</strong> Modular real-world design using OOP paradigms!";
      }

      if (q.includes("education") || q.includes("college") || q.includes("cgpa") || q.includes("marks") || q.includes("10th") || q.includes("ssc")) {
        return "🎓 <strong>Education Milestones:</strong><br>• <strong>B.E. (AI & Data Science):</strong> R.C. Patel Institute of Technology, Shirpur (First Year CGPA: <strong>8.09 / 10</strong>, currently in 2nd Year).<br>• <strong>SSC / 10th:</strong> <strong>92.20% Distinction</strong> (Maharashtra State Board).";
      }

      if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("hire") || q.includes("reach") || q.includes("linkedin")) {
        return "📫 You can reach Swara directly at:<br>• <strong>Email:</strong> <a href='mailto:swarachaudhari23@gmail.com' style='color:#f472b6;'>swarachaudhari23@gmail.com</a><br>• <strong>Phone:</strong> +91 8605469369<br>• <strong>Location:</strong> Nandurbar, Maharashtra<br>• <strong>LinkedIn:</strong> <a href='https://linkedin.com/in/swarachaudhari' target='_blank' style='color:#c084fc;'>linkedin.com/in/swarachaudhari</a>";
      }

      if (q.includes("strength") || q.includes("soft skill")) {
        return "Swara's core strengths are <strong>Quick Learning</strong>, <strong>Logical Thinking</strong>, <strong>Clear Communication</strong>, and <strong>Team Collaboration</strong>! 🤝";
      }

      if (q.includes("resume") || q.includes("cv")) {
        return "You can download Swara's full Resume PDF using the 'Resume' button in the navigation bar or hero section! 📄";
      }

      return "That sounds interesting! 🌸 Swara specializes in AI, Data Science, Python, C, and Java. Feel free to ask about her <strong>skills</strong>, <strong>projects</strong>, <strong>education</strong>, or <strong>contact info</strong>!";
    };

    // Handle Form Submit
    if (chatForm && chatInput) {
      chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const userText = chatInput.value.trim();
        if (!userText) return;

        appendMessage(userText, "user");
        chatInput.value = "";

        // Simulated gentle typing delay
        setTimeout(() => {
          const response = getBotResponse(userText);
          appendMessage(response, "bot");
        }, 500);
      });
    }

    // Handle Pre-set Chip Buttons
    chatChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const question = chip.getAttribute("data-question");
        if (!question) return;

        appendMessage(question, "user");
        setTimeout(() => {
          const response = getBotResponse(question);
          appendMessage(response, "bot");
        }, 450);
      });
    });
  }

  // 11. Navbar Scrollspy Effect
  const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
  const sections = Array.from(navAnchors).map((a) => {
    const id = a.getAttribute("href").substring(1);
    return document.getElementById(id);
  }).filter(Boolean);

  window.addEventListener("scroll", () => {
    let currentId = "";
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute("id");
      }
    });

    navAnchors.forEach((a) => {
      if (a.getAttribute("href") === `#${currentId}`) {
        a.style.color = "var(--text-main)";
        a.style.textShadow = "0 0 10px rgba(244, 114, 182, 0.5)";
      } else {
        a.style.color = "";
        a.style.textShadow = "";
      }
    });
  }, { passive: true });
});
