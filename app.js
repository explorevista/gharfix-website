/**
 * app.js – KarigarHub Pakistan – Complete Application Logic
 * 
 * ✅ Multi-Language: EN/UR/Roman Urdu
 * ✅ AI Assistant: KarigarBot (Chat + Voice)
 * ✅ Firebase Auth + Firestore
 * ✅ IMGBB Image Upload
 * ✅ Admin Panel Access Control
 * ✅ Premium UI Interactions
 */

// ===== IMPORTS =====
import { auth, db } from "./firebase.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  doc, setDoc, getDoc, updateDoc,
  collection, addDoc, getDocs, query, where, orderBy, serverTimestamp
} from "./firebase.js";

// ===== CONFIG =====
export const IMGBB_API_KEY = "6f4684c9de2fadd52ece29d612c11a73";
export const ADMIN_EMAIL = "smarttoolsuniverse2026@gmail.com";

export const SERVICES = [
  { id: 'electrician', name: 'Electrician', icon: '⚡' },
  { id: 'plumber', name: 'Plumber', icon: '🚰' },
  { id: 'ac', name: 'AC Technician', icon: '❄️' },
  { id: 'carpenter', name: 'Carpenter', icon: '🪵' },
  { id: 'mason', name: 'Mason', icon: '🧱' },
  { id: 'painter', name: 'Painter', icon: '🎨' },
  { id: 'car-mechanic', name: 'Car Mechanic', icon: '🚗' },
  { id: 'bike-mechanic', name: 'Bike Mechanic', icon: '🏍️' },
  { id: 'cleaner', name: 'Cleaner', icon: '🧹' },
  { id: 'appliance', name: 'Appliance Repair', icon: '🔧' }
];

export const CONTACT = {
  phones: ['+92 344 1695860', '+92 327 2358384'],
  emails: [
    'muhammadalikn53@gmail.com',
    'smarttoolsuniverse2026@gmail.com',
    'greencontrolcenteraiagent@gmail.com',
    'digitalreadsstudio5@gmail.com',
    'contacttravelscope@gmail.com'
  ],
  social: {
    facebook: 'https://www.facebook.com/share/1HtgWdb4eR/',
    instagram: 'https://www.instagram.com/explorevista2025',
    linkedin: 'https://www.linkedin.com/in/muhammad-ali-kn-22505a28a',
    telegram: 'https://t.me/Aiearnverse',
    yofan: 'https://yo.fan/smartworks',
    lovable: 'https://smartverse-replica-project.lovable.app/'
  }
};

export const FOUNDER = {
  name: 'Muhammad Ali',
  title: 'AI Content Creator, SEO Expert, IT Administrator',
  bio: 'Founder of KarigarHub Pakistan. Passionate about connecting skilled professionals with homeowners across Pakistan. Expert in AI, web development, and digital marketing.'
};

// ===== MULTI-LANGUAGE SYSTEM =====
export const translations = {
  en: {
    // Navigation
    home: "Home", about: "About", services: "Services", contact: "Contact",
    login: "Login", signup: "Sign Up", dashboard: "Dashboard", admin: "Admin",
    logout: "Logout",
    
    // Hero
    heroTitle: "Find Trusted Home Professionals, Instantly",
    heroSubtitle: "KarigarHub connects you with verified electricians, plumbers, AC technicians & more across Pakistan. Quality work, transparent pricing, guaranteed satisfaction.",
    browseServices: "Browse Services", chatWhatsApp: "Chat on WhatsApp",
    
    // Services
    ourServices: "Our Services", servicesSubtitle: "Professional home repair services at your fingertips",
    
    // Workers
    featuredWorkers: "Featured Professionals", workersSubtitle: "Verified workers ready to help you",
    available: "Available", busy: "Busy", yearsExp: "yrs exp", rating: "rating",
    call: "Call", whatsapp: "WhatsApp",
    
    // Support
    needHelp: "Need Custom Help?",
    needHelpText: "Can't find what you need? Submit a support request and we'll connect you with the right professional within 24 hours.",
    getSupport: "Get Support",
    
    // Contact
    contactTitle: "Contact Us", contactSubtitle: "We're here to help. Reach out anytime.",
    phone: "Phone / WhatsApp", email: "Email", social: "Social Media",
    hours: "Business Hours", hoursText: "Monday - Saturday: 9AM - 9PM PKT\nSunday: 10AM - 6PM PKT",
    
    // Forms
    category: "Category", message: "Message", submit: "Submit Request",
    selectCategory: "Select a category", describeIssue: "Describe your issue in detail...",
    
    // Auth
    welcomeBack: "Welcome Back", loginSubtitle: "Login to access your KarigarHub account",
    email: "Email Address", password: "Password", forgotPass: "Forgot password?",
    noAccount: "Don't have an account?", signUp: "Sign up",
    createAccount: "Create Account", signupSubtitle: "Join KarigarHub to book trusted home services",
    fullName: "Full Name", confirmPassword: "Confirm Password", passHint: "Must be at least 6 characters",
    hasAccount: "Already have an account?", logIn: "Login",
    
    // Dashboard
    dashboardTitle: "Dashboard", findProfessional: "Find a Professional",
    availablePros: "Available Professionals", quickActions: "Quick Actions",
    accountInfo: "Account Info", memberSince: "Member since", role: "Role",
    editProfile: "Edit Profile", bookService: "Book Service",
    
    // AI Assistant
    aiName: "KarigarBot", aiGreeting: "Hello! I'm KarigarBot 👋\nHow can I help you today?",
    aiPlaceholder: "Type your question...", aiSend: "Send", aiVoice: "Voice",
    aiListening: "Listening...",
    
    // Footer
    quickLinks: "Quick Links", legal: "Legal", privacy: "Privacy Policy",
    terms: "Terms of Service", disclaimer: "Disclaimer",
    founded: "Founded by", mission: "Provide fast and reliable home services in Pakistan"
  },
  
  ur: {
    home: "ہوم", about: "ہمارے بارے میں", services: "سروسز", contact: "رابطہ",
    login: "لاگ ان", signup: "سائن اپ", dashboard: "ڈیش بورڈ", admin: "ایڈمن",
    logout: "لاگ آؤٹ",
    
    heroTitle: "قابل اعتماد گھریلو پیشہ ور فوری تلاش کریں",
    heroSubtitle: "کڑیگر ہب آپ کو پورے پاکستان میں تصدیق شدہ الیکٹریشن، پلمبر، اے سی ٹیکنیشن اور دیگر سے جوڑتا ہے۔ معیاری کام، شفاف قیمتیں، مکمل اطمینان کی گارنٹی۔",
    browseServices: "سروسز دیکھیں", chatWhatsApp: "واٹس ایپ پر چیٹ کریں",
    
    ourServices: "ہماری سروسز", servicesSubtitle: "پیشہ ورانہ گھر کی مرمت کی خدمات آپ کی انگلیوں پر",
    
    featuredWorkers: "نمایاں پیشہ ور", workersSubtitle: "تصدیق شدہ ورکرز آپ کی مدد کے لیے تیار",
    available: "دستیاب", busy: "مصروف", yearsExp: "سال تجربہ", rating: "ریٹنگ",
    call: "کال کریں", whatsapp: "واٹس ایپ",
    
    needHelp: "خصوصی مدد چاہیے؟",
    needHelpText: "جو چاہیے وہ نہیں مل رہا؟ سپورٹ درخواست جمع کروائیں اور ہم 24 گھنٹے کے اندر آپ کو صحیح پیشہ ور سے جوڑ دیں گے۔",
    getSupport: "مدد حاصل کریں",
    
    contactTitle: "ہم سے رابطہ کریں", contactSubtitle: "ہم آپ کی مدد کے لیے موجود ہیں۔ کسی بھی وقت رابطہ کریں۔",
    phone: "فون / واٹس ایپ", email: "ای میل", social: "سوشل میڈیا",
    hours: "کاروباری اوقات", hoursText: "پیر - ہفتہ: صبح 9 بجے - رات 9 بجے پی کے ٹی\nاتوار: صبح 10 بجے - شام 6 بجے پی کے ٹی",
    
    category: "زمرہ", message: "پیغام", submit: "درخواست جمع کروائیں",
    selectCategory: "زمرہ منتخب کریں", describeIssue: "اپنے مسئلے کی تفصیل بیان کریں...",
    
    welcomeBack: "خوش آمدید", loginSubtitle: "اپنے کڑیگر ہب اکاؤنٹ تک رسائی کے لیے لاگ ان کریں",
    email: "ای میل ایڈریس", password: "پاس ورڈ", forgotPass: "پاس ورڈ بھول گئے؟",
    noAccount: "اکاؤنٹ نہیں ہے؟", signUp: "سائن اپ کریں",
    createAccount: "اکاؤنٹ بنائیں", signupSubtitle: "قابل اعتماد گھریلو خدمات بک کرنے کے لیے کڑیگر ہب جوائن کریں",
    fullName: "مکمل نام", confirmPassword: "پاس ورڈ کی تصدیق کریں", passHint: "کم از کم 6 حروف ہونے چاہئیں",
    hasAccount: "پہلے سے اکاؤنٹ ہے؟", logIn: "لاگ ان کریں",
    
    dashboardTitle: "ڈیش بورڈ", findProfessional: "پیشہ ور تلاش کریں",
    availablePros: "دستیاب پیشہ ور", quickActions: "فوری اقدامات",
    accountInfo: "اکاؤنٹ کی معلومات", memberSince: "رکنیت سے", role: "کردار",
    editProfile: "پروفائل ایڈٹ کریں", bookService: "سروس بک کریں",
    
    aiName: "کڑیگر بوٹ", aiGreeting: "السلام علیکم! میں کڑیگر بوٹ ہوں 👋\nآج میں آپ کی کیا مدد کر سکتا ہوں؟",
    aiPlaceholder: "اپنا سوال لکھیں...", aiSend: "بھیجیں", aiVoice: "آواز",
    aiListening: "سن رہا ہوں...",
    
    quickLinks: "فوری لنکس", legal: "قانونی", privacy: "رازداری کی پالیسی",
    terms: "سروس کی شرائط", disclaimer: "ڈس کلیمر",
    founded: "بانی", mission: "پاکستان میں تیز اور قابل اعتماد گھریلو خدمات فراہم کرنا"
  },
  
  roman: {
    home: "Home", about: "Hamare Baare Mein", services: "Services", contact: "Rabta",
    login: "Login", signup: "Sign Up", dashboard: "Dashboard", admin: "Admin",
    logout: "Logout",
    
    heroTitle: "Bharose Mand Ghar Ke Professionals, Fauri Talaash",
    heroSubtitle: "KarigarHub aap ko pure Pakistan mein tasdeeq shuda electricians, plumbers, AC technicians aur deegar se jorta hai. Quality kaam, transparent pricing, mukammal itminan ki guarantee.",
    browseServices: "Services Dekhein", chatWhatsApp: "WhatsApp Par Chat Karein",
    
    ourServices: "Hamari Services", servicesSubtitle: "Professional ghar ki marammat ki services aap ki ungliyon par",
    
    featuredWorkers: "Numaya Professionals", workersSubtitle: "Tasdeeq shuda workers aap ki madad ke liye taiyar",
    available: "Dastiyab", busy: "Masroof", yearsExp: "saal tajurba", rating: "rating",
    call: "Call Karein", whatsapp: "WhatsApp",
    
    needHelp: "Khaas Madad Chahiye?",
    needHelpText: "Jo chahiye wo nahi mil raha? Support request jama karwayein aur hum 24 ghante ke andar aap ko sahi professional se jor denge.",
    getSupport: "Madad Hasil Karein",
    
    contactTitle: "Hum Se Rabta Karein", contactSubtitle: "Hum aap ki madad ke liye maujood hain. Kisi bhi waqt rabta karein.",
    phone: "Phone / WhatsApp", email: "Email", social: "Social Media",
    hours: "Karobari Auqaat", hoursText: "Peer - Hafta: Subah 9 baje - Raat 9 baje PKT\nItwaar: Subah 10 baje - Shaam 6 baje PKT",
    
    category: "Category", message: "Message", submit: "Request Jamma Karwayein",
    selectCategory: "Category select karein", describeIssue: "Apne maslay ki tafseel bayan karein...",
    
    welcomeBack: "Khush Amdeed", loginSubtitle: "Apne KarigarHub account tak rasai ke liye login karein",
    email: "Email Address", password: "Password", forgotPass: "Password bhool gaye?",
    noAccount: "Account nahi hai?", signUp: "Sign Up Karein",
    createAccount: "Account Banayein", signupSubtitle: "Qabil-e-bharosa ghar ki services book karne ke liye KarigarHub join karein",
    fullName: "Mukammal Naam", confirmPassword: "Password ki tasdeeq karein", passHint: "Kam az kam 6 haroof hone chahiye",
    hasAccount: "Pehle se account hai?", logIn: "Login Karein",
    
    dashboardTitle: "Dashboard", findProfessional: "Professional Talaash Karein",
    availablePros: "Dastiyab Professionals", quickActions: "Fauri Iqdaamat",
    accountInfo: "Account Ki Maloomat", memberSince: "Membership se", role: "Role",
    editProfile: "Profile Edit Karein", bookService: "Service Book Karein",
    
    aiName: "KarigarBot", aiGreeting: "Assalam u Alaikum! Main KarigarBot hoon 👋\nAaj main aap ki kya madad kar sakta hoon?",
    aiPlaceholder: "Apna sawal likhein...", aiSend: "Bhejein", aiVoice: "Awaaz",
    aiListening: "Sun raha hoon...",
    
    quickLinks: "Fauri Links", legal: "Qanooni", privacy: "Raazdari Ki Policy",
    terms: "Service Ki Sharaait", disclaimer: "Disclaimer",
    founded: "Bani", mission: "Pakistan mein tez aur qabil-e-bharosa ghar ki services faraham karna"
  }
};

// ===== STATE MANAGEMENT =====
let currentUser = null;
let userProfile = null;
let currentLang = localStorage.getItem('karigarhub-lang') || 'en';

export const getState = () => ({ user: currentUser, profile: userProfile });
export const isAdmin = () => currentUser?.email === ADMIN_EMAIL;
export const getLang = () => currentLang;

// ===== TOAST SYSTEM =====
export function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ'}</span><span>${message}</span>`;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ===== THEME MANAGEMENT =====
export function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('karigarhub-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('karigarhub-theme', next);
      showToast(`Switched to ${next} mode`, 'success');
    });
  }
}

// ===== LANGUAGE SYSTEM =====
export function initLanguage() {
  const langButtons = document.querySelectorAll('.lang-btn');
  
  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lang = e.target.dataset.lang;
      currentLang = lang;
      
      langButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      updateLanguage();
      localStorage.setItem('karigarhub-lang', lang);
      showToast(`Language changed to ${lang === 'en' ? 'English' : lang === 'ur' ? 'Urdu' : 'Roman Urdu'}`, 'success');
    });
  });
  
  // Load saved language
  if (currentLang) {
    langButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.lang === currentLang);
    });
    updateLanguage();
  }
}

export function updateLanguage() {
  const t = translations[currentLang];
  if (!t) return;
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });
  
  // Update page direction for Urdu
  document.documentElement.setAttribute('lang', currentLang === 'ur' ? 'ur' : currentLang === 'roman' ? 'en' : 'en-GB');
  document.documentElement.setAttribute('dir', currentLang === 'ur' ? 'rtl' : 'ltr');
  
  // Update font for Urdu
  if (currentLang === 'ur') {
    document.body.style.fontFamily = "'Noto Nastaliq Urdu', serif";
  } else {
    document.body.style.fontFamily = "";
  }
}

// ===== PASSWORD TOGGLE =====
export function initPasswordToggle() {
  document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.closest('.password-wrapper').querySelector('input');
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;
      toggle.textContent = type === 'password' ? '👁️' : '🙈';
    });
  });
}

// ===== IMAGE UPLOAD (IMGBB) =====
export async function uploadToImgBB(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      try {
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}&image=${base64}`,
          { method: 'POST' }
        );
        const data = await res.json();
        if (data.success) resolve(data.data.url);
        else reject(new Error(data.error?.message || 'Upload failed'));
      } catch (err) { reject(err); }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

// ===== WORKER CARD RENDERER =====
export function renderWorkerCard(worker, lang = currentLang) {
  const t = translations[lang];
  const service = SERVICES.find(s => s.id === worker.category);
  const phone = worker.phone?.replace(/\s/g, '');
  const whatsappUrl = `https://wa.me/92${phone?.startsWith('92') ? phone.slice(2) : phone}`;
  
  return `
    <article class="card worker-card glass">
      <header class="worker-header">
        <img src="${worker.photo || 'https://via.placeholder.com/70?text=👤'}" 
             alt="${worker.name}" class="worker-avatar"
             onerror="this.src='https://via.placeholder.com/70?text=👤'">
        <div class="worker-info">
          <h4>${worker.name}</h4>
          <p class="text-muted">${service?.name || worker.category}</p>
        </div>
        <span class="worker-badge ${worker.available ? 'badge-available' : 'badge-busy'}">
          ${worker.available ? t.available : t.busy}
        </span>
      </header>
      
      <div class="worker-meta">
        ${worker.experience ? `<span>⭐ ${worker.experience} ${t.yearsExp}</span>` : ''}
        ${worker.rating ? `<span>⭐ ${worker.rating}/5 ${t.rating}</span>` : ''}
        ${worker.location ? `<span>📍 ${worker.location}</span>` : ''}
      </div>
      
      <footer class="worker-actions">
        <a href="tel:${worker.phone}" class="btn btn-sm btn-outline">${t.call}</a>
        <a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-whatsapp">${t.whatsapp}</a>
      </footer>
    </article>
  `;
}

// ===== LOAD WORKERS FROM FIRESTORE =====
export async function loadWorkers(containerId, category = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  try {
    container.innerHTML = '<div class="text-center"><span class="loading"></span><p class="text-muted mt-2">Loading professionals...</p></div>';
    
    let q = query(collection(db, 'workers'), where('status', '==', 'approved'));
    if (category) q = query(q, where('category', '==', category));
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      container.innerHTML = '<p class="text-center text-muted">No workers available yet. Check back soon!</p>';
      return;
    }
    
    const workers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    container.innerHTML = workers.map(w => renderWorkerCard(w)).join('');
    
  } catch (error) {
    console.error('Error loading workers:', error);
    container.innerHTML = '<p class="text-center text-muted error">Failed to load workers. Please try again.</p>';
    showToast('Failed to load workers', 'error');
  }
}

// ===== SUPPORT REQUEST =====
export async function submitSupportRequest(category, message) {
  if (!currentUser) {
    showToast('Please login to submit a support request', 'warning');
    return false;
  }
  
  try {
    await addDoc(collection(db, 'support_requests'), {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: userProfile?.name || 'Anonymous',
      category,
      message: message.trim(),
      status: 'open',
      createdAt: serverTimestamp()
    });
    
    showToast('Support request submitted! We\'ll contact you soon.', 'success');
    return true;
  } catch (error) {
    console.error('Support error:', error);
    showToast('Failed to submit request', 'error');
    return false;
  }
}

// ===== PROFILE UPDATE =====
export async function updateProfile(data, imageFile = null) {
  if (!currentUser) return false;
  
  try {
    let photoUrl = userProfile?.photo;
    if (imageFile) photoUrl = await uploadToImgBB(imageFile);
    
    await updateDoc(doc(db, 'users', currentUser.uid), {
      name: data.name,
      phone: data.phone,
      location: data.location,
      photo: photoUrl,
      updatedAt: serverTimestamp()
    });
    
    userProfile = { ...userProfile, ...data, photo: photoUrl };
    showToast('Profile updated successfully', 'success');
    return true;
  } catch (error) {
    console.error('Profile update error:', error);
    showToast('Failed to update profile', 'error');
    return false;
  }
}

// ===== AI ASSISTANT – KARIGARBOT =====
export function initAIAssistant() {
  const toggle = document.getElementById('aiToggle');
  const chat = document.getElementById('aiChat');
  const close = document.getElementById('aiClose');
  const input = document.getElementById('aiInput');
  const send = document.getElementById('aiSend');
  const voiceBtn = document.getElementById('aiVoice');
  const messages = document.getElementById('aiMessages');
  
  if (!toggle || !chat) return;
  
  // Toggle chat
  toggle.addEventListener('click', () => {
    chat.classList.toggle('active');
    if (chat.classList.contains('active')) {
      // Add greeting if first message
      if (messages.children.length === 0) {
        addAIMessage(translations[currentLang].aiGreeting, 'bot');
      }
      input?.focus();
    }
  });
  
  // Close chat
  close?.addEventListener('click', () => {
    chat.classList.remove('active');
  });
  
  // Send message
  function sendMessage() {
    const text = input?.value.trim();
    if (!text) return;
    
    addAIMessage(text, 'user');
    input.value = '';
    
    // Process AI response
    setTimeout(() => {
      const response = generateAIResponse(text);
      addAIMessage(response, 'bot');
    }, 800);
  }
  
  send?.addEventListener('click', sendMessage);
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  // Voice input
  let recognition;
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = currentLang === 'ur' ? 'ur-PK' : 'en-US';
    recognition.continuous = false;
    
    voiceBtn?.addEventListener('click', () => {
      if (voiceBtn.classList.contains('listening')) {
        recognition?.stop();
      } else {
        recognition?.start();
        voiceBtn.classList.add('listening');
        showToast(translations[currentLang].aiListening, 'info');
      }
    });
    
    recognition?.addEventListener('result', (e) => {
      const text = e.results[0][0].transcript;
      if (input) input.value = text;
      sendMessage();
    });
    
    recognition?.addEventListener('end', () => {
      voiceBtn?.classList.remove('listening');
    });
  } else {
    voiceBtn?.style.display = 'none';
  }
  
  // Add message to chat
  function addAIMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `ai-message ${sender}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }
  
  // Simple AI response generator (expand for production)
  function generateAIResponse(userText) {
    const t = translations[currentLang];
    const lower = userText.toLowerCase();
    
    if (lower.includes('electrician') || lower.includes('bijli') || lower.includes('wiring')) {
      return t.lang === 'ur' ? 
        "ہم نے آپ کے علاقے میں تصدیق شدہ الیکٹریشنز تلاش کر لیے ہیں۔ واٹس ایپ پر رابطہ کریں یا 'سروسز' سیکشن میں دیکھیں۔" :
        "We found verified electricians in your area. Contact via WhatsApp or check the 'Services' section.";
    }
    if (lower.includes('plumber') || lower.includes('nal') || lower.includes('pipe')) {
      return t.lang === 'ur' ? 
        "پلمبر کی ضرورت ہے؟ ہمارے پاس ماہر پلمبرز موجود ہیں۔ فوری بکنگ کے لیے واٹس ایپ کریں۔" :
        "Need a plumber? We have expert plumbers available. WhatsApp for instant booking.";
    }
    if (lower.includes('ac') || lower.includes('air conditioner') || lower.includes('cooling')) {
      return t.lang === 'ur' ? 
        "اے سی مرمت کے لیے ہمارے ٹیکنیشنز تیار ہیں۔ قیمت اور دستیابی کے لیے رابطہ کریں۔" :
        "Our AC technicians are ready for repairs. Contact for pricing and availability.";
    }
    if (lower.includes('price') || lower.includes('cost') || lower.includes('kitna')) {
      return t.lang === 'ur' ? 
        "قیمتیں کام کی نوعیت اور مقام پر منحصر ہیں۔ براہ کرم واٹس ایپ پر تفصیلات بھیجیں، ہم آپ کو فوری جواب دیں گے۔" :
        "Prices depend on job type and location. Please WhatsApp us details for an instant quote.";
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('سلام')) {
      return t.lang === 'ur' ? 
        "السلام علیکم! میں کڑیگر بوٹ ہوں۔ آپ کی کس طرح مدد کر سکتا ہوں؟" :
        "Hello! I'm KarigarBot. How can I help you today?";
    }
    
    return t.lang === 'ur' ? 
      "میں آپ کی مدد کرنے کے لیے یہاں ہوں۔ براہ کرم اپنی ضرورت بتائیں، جیسے 'مجھے الیکٹریشن چاہیے' یا 'اے سی مرمت'۔" :
      "I'm here to help! Please tell me what you need, like 'I need an electrician' or 'AC repair'.";
  }
}

// ===== NAVIGATION =====
export function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== SERVICE CATEGORIES =====
export function initServiceCategories() {
  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const category = btn.dataset.service;
      
      const workersSection = document.getElementById('workersGrid');
      if (workersSection) {
        loadWorkers('workersGrid', category);
        workersSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = `dashboard.html?category=${category}`;
      }
    });
  });
}

// ===== SUPPORT FORM =====
export function initSupportForm() {
  const form = document.getElementById('supportForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const category = document.getElementById('supportCategory')?.value;
    const message = document.getElementById('supportMessage')?.value;
    
    if (!category || !message?.trim()) {
      showToast('Please fill in all fields', 'warning');
      return;
    }
    
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="loading"></span> Sending...';
    
    const success = await submitSupportRequest(category, message);
    
    btn.disabled = false;
    btn.innerHTML = originalText;
    
    if (success) form.reset();
  });
}

// ===== AUTH LISTENER =====
export async function initAuthListener() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const profile = userDoc.exists() ? userDoc.data() : null;
        
        currentUser = user;
        userProfile = profile;
        
        updateAuthUI(true, user, profile);
        
        // Load workers if on dashboard/home
        if (document.getElementById('workersGrid')) {
          loadWorkers('workersGrid');
        }
      } catch (error) {
        console.error('Auth listener error:', error);
        updateAuthUI(true, user, null);
      }
    } else {
      currentUser = null;
      userProfile = null;
      updateAuthUI(false);
    }
  });
}

// ===== AUTH UI UPDATES =====
function updateAuthUI(isLoggedIn, user = null, profile = null) {
  const guestNav = document.getElementById('guestNav');
  const userNav = document.getElementById('userNav');
  const adminLink = document.getElementById('adminLink');
  const userName = document.getElementById('userName');
  
  if (isLoggedIn && user) {
    guestNav?.classList.add('hidden');
    userNav?.classList.remove('hidden');
    adminLink?.classList.toggle('hidden', !isAdmin());
    
    if (userName && profile) {
      userName.textContent = profile.name || user.email?.split('@')[0] || 'User';
    }
  } else {
    guestNav?.classList.remove('hidden');
    userNav?.classList.add('hidden');
    adminLink?.classList.add('hidden');
  }
}

// ===== MAIN INIT =====
export function initApp() {
  initTheme();
  initLanguage();
  initNavigation();
  initPasswordToggle();
  initServiceCategories();
  initSupportForm();
  initAIAssistant();
  initAuthListener();
  
  // Populate contact data
  document.querySelectorAll('[data-phone]').forEach((el, i) => {
    el.href = `tel:${CONTACT.phones[i]?.replace(/\s/g, '')}`;
    el.textContent = CONTACT.phones[i];
  });
  
  document.querySelectorAll('[data-email]').forEach((el, i) => {
    el.href = `mailto:${CONTACT.emails[i]}`;
    el.textContent = CONTACT.emails[i];
  });
  
  // Founder info
  const founderName = document.getElementById('founderName');
  const founderTitle = document.getElementById('founderTitle');
  const founderBio = document.getElementById('founderBio');
  if (founderName) founderName.textContent = FOUNDER.name;
  if (founderTitle) founderTitle.textContent = FOUNDER.title;
  if (founderBio) founderBio.textContent = FOUNDER.bio;
  
  // Current year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ===== GLOBAL ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  if (e.message?.includes('Firebase') || e.message?.includes('Network')) {
    showToast('A network error occurred. Please check your connection.', 'error');
  }
});

// ===== INIT ON DOM READY =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// ===== EXPORT FOR OTHER PAGES =====
export { showToast, updateLanguage, getLang, isAdmin, renderWorkerCard, loadWorkers, submitSupportRequest, updateProfile, uploadToImgBB };
