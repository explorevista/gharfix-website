// app.js - Complete Application Logic

// Language Translations
const translations = {
  en: {
    home: "Home",
    about: "About",
    services: "Services",
    contact: "Contact",
    login: "Login",
    signup: "Sign Up",
    heroTitle: "Har Ghar Ki Har Repair, Ek Click Par",
    heroSubtitle: "Find verified electricians, plumbers, AC technicians & mechanics across Pakistan. Quality work, guaranteed satisfaction.",
    browseServices: "Browse Services",
    chatWhatsApp: "Chat on WhatsApp",
    ourServices: "Our Services",
    servicesSubtitle: "Professional home repair services at your fingertips",
    featuredWorkers: "Featured Professionals",
    workersSubtitle: "Verified workers ready to help you",
    needHelp: "Need Custom Help?",
    needHelpText: "Can't find what you need? Submit a support request and we'll connect you with the right professional within 24 hours.",
    getSupport: "Get Support"
  },
  ur: {
    home: "ہوم",
    about: "ہمارے بارے میں",
    services: "سروسز",
    contact: "رابطہ",
    login: "لاگ ان",
    signup: "سائن اپ",
    heroTitle: "ہر گھر کی ہر ریپئر، ایک کلک پر",
    heroSubtitle: "پورے پاکستان میں تصدیق شدہ الیکٹریشن، پلمبر، AC ٹیکنیشن اور میکانکس تلاش کریں۔ معیاری کام، مکمل اطمینان۔",
    browseServices: "سروسز دیکھیں",
    chatWhatsApp: "واٹس ایپ پر چیٹ کریں",
    ourServices: "ہماری سروسز",
    servicesSubtitle: "پیشہ ورانہ گھر کی مرمت کی خدمات آپ کی انگلیوں پر",
    featuredWorkers: "نمایاں پیشہ ور",
    workersSubtitle: "تصدیق شدہ ورکرز آپ کی مدد کے لیے تیار",
    needHelp: "خصوصی مدد چاہیے؟",
    needHelpText: "جو چاہیے وہ نہیں مل رہا؟ سپورٹ درخواست جمع کروائیں اور ہم 24 گھنٹے کے اندر آپ کو صحیح پیشہ ور سے جوڑ دیں گے۔",
    getSupport: "مدد حاصل کریں"
  },
  ar: {
    home: "الرئيسية",
    about: "حول",
    services: "الخدمات",
    contact: "اتصل",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    heroTitle: "كل إصلاح منزلي بنقرة واحدة",
    heroSubtitle: "اعثر على كهربائيين وسباكين وفنيي تكييف وميكانيكيين معتمدين في جميع أنحاء باكستان. عمل عالي الجودة مع ضمان الرضا.",
    browseServices: "تصفح الخدمات",
    chatWhatsApp: "دردشة على واتساب",
    ourServices: "خدماتنا",
    servicesSubtitle: "خدمات إصلاح المنازل الاحترافية في متناول يدك",
    featuredWorkers: "المهنيون المميزون",
    workersSubtitle: "عمال معتمدون جاهزون لمساعدتك",
    needHelp: "تحتاج إلى مساعدة مخصصة؟",
    needHelpText: "لا تجد ما تحتاجه؟ قدم طلب دعم وسنقوم بتوصيلك بالمحترف المناسب خلال 24 ساعة.",
    getSupport: "احصل على الدعم"
  },
  ru: {
    home: "Главная",
    about: "О нас",
    services: "Услуги",
    contact: "Контакт",
    login: "Вход",
    signup: "Регистрация",
    heroTitle: "Весь ремонт дома в один клик",
    heroSubtitle: "Найдите проверенных электриков, сантехников, техников по кондиционерам и механиков по всей Пакистану. Качественная работа с гарантией.",
    browseServices: "Просмотреть услуги",
    chatWhatsApp: "Чат в WhatsApp",
    ourServices: "Наши услуги",
    servicesSubtitle: "Профессиональные услуги по ремонту дома у вас под рукой",
    featuredWorkers: "Избранные специалисты",
    workersSubtitle: "Проверенные работники готовы помочь вам",
    needHelp: "Нужна индивидуальная помощь?",
    needHelpText: "Не можете найти то, что вам нужно? Отправьте запрос в поддержку, и мы свяжем вас с подходящим специалистом в течение 24 часов.",
    getSupport: "Получить поддержку"
  }
};

let currentLang = 'en';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initNavigation();
  initPasswordToggle();
  initAuth();
  initServiceCategories();
  initSupportForm();
  updateLanguage();
});

// Theme Toggle
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('gharfix-theme');
  
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
  
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('gharfix-theme', next);
      showToast(`Switched to ${next} mode`, 'success');
    });
  }
}

// Language Toggle
function initLanguage() {
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lang = e.target.dataset.lang;
      currentLang = lang;
      
      langButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      updateLanguage();
      localStorage.setItem('gharfix-lang', lang);
    });
  });
  
  // Load saved language
  const saved = localStorage.getItem('gharfix-lang');
  if (saved) {
    currentLang = saved;
    langButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.lang === saved);
    });
  }
}

function updateLanguage() {
  const t = translations[currentLang];
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });
  
  // Update page direction for Arabic/Urdu
  if (currentLang === 'ar' || currentLang === 'ur') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }
}

// Password Visibility Toggle
function initPasswordToggle() {
  document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.previousElementSibling;
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      toggle.textContent = type === 'password' ? '👁️' : '🙈';
    });
  });
}

// Navigation
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Service Categories
function initServiceCategories() {
  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.service;
      showToast(`Loading ${category} professionals...`, 'info');
      // Add your worker filtering logic here
    });
  });
}

// Support Form
function initSupportForm() {
  const form = document.getElementById('supportForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const category = document.getElementById('supportCategory').value;
      const message = document.getElementById('supportMessage').value;
      
      if (!category || !message.trim()) {
        showToast('Please fill in all fields', 'error');
        return;
      }
      
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.innerHTML = '<span class="loading"></span> Sending...';
      btn.disabled = true;
      
      try {
        // Import Firebase functions
        const { db, collection, addDoc, serverTimestamp } = await import('./firebase.js');
        
        await addDoc(collection(db, 'support_requests'), {
          category,
          message: message.trim(),
          status: 'open',
          createdAt: serverTimestamp()
        });
        
        showToast('Support request submitted! We\'ll contact you soon.', 'success');
        form.reset();
      } catch (error) {
        console.error('Error:', error);
        showToast('Failed to submit request. Please try again.', 'error');
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }
}

// Toast Notification
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Auth Functions (will be called from login/signup pages)
window.initAuth = async function() {
  const { auth, onAuthStateChanged } = await import('./firebase.js');
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User logged in:', user.email);
    } else {
      console.log('User logged out');
    }
  });
};

// Export for other pages
window.showToast = showToast;
window.updateLanguage = updateLanguage;
window.currentLang = currentLang;
