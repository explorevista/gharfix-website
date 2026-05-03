/**
 * app.js - Core Application Logic
 * GharFix Pakistan - Home Services Platform
 */

// IMGBB API Configuration
export const IMGBB_API_KEY = "6f4684c9de2fadd52ece29d612c11a73";

// Admin Configuration
export const ADMIN_EMAIL = "smarttoolsuniverse2026@gmail.com";

// Service Categories
export const SERVICES = [
  { id: 'electrician', name: 'Electrician', icon: '⚡' },
  { id: 'plumber', name: 'Plumber', icon: '🚰' },
  { id: 'ac', name: 'AC Technician', icon: '❄️' },
  { id: 'carpenter', name: 'Carpenter', icon: '🪵' },
  { id: 'mason', name: 'Mason', icon: '🧱' },
  { id: 'painter', name: 'Painter', icon: '🎨' },
  { id: 'car-mechanic', name: 'Car Mechanic', icon: '🚗' },
  { id: 'bike-mechanic', name: 'Bike Mechanic', icon: '🏍️' }
];

// Real Contact Data
export const CONTACT = {
  phones: ['+92 344 1695860', '+92 327 2358384'],
  emails: [
    'muhammadalikn53@gmail.com',
    'greencontrolcenteraiagent@gmail.com',
    'smarttoolsuniverse2026@gmail.com',
    'digitalreadsstudio5@gmail.com',
    'contacttravelscope@gmail.com'
  ],
  social: {
    yofan: 'https://yo.fan/smartworks',
    lovable: 'https://smartverse-replica-project.lovable.app/',
    telegram: 'https://t.me/Aiearnverse',
    linkedin: 'https://www.linkedin.com/in/muhammad-ali-kn-22505a28a',
    facebook: [
      'https://www.facebook.com/share/1HtgWdb4eR/',
      'https://www.facebook.com/smarttoolsuniverse',
      'https://www.facebook.com/digitalreadsstudio'
    ],
    instagram: [
      'https://www.instagram.com/explorevista2025',
      'https://www.instagram.com/smarttoolsuniverse'
    ]
  }
};

// Founder Info
export const FOUNDER = {
  name: 'Muhammad Ali',
  mission: 'Provide fast and reliable home services in Pakistan'
};

// ============================
// UTILITY FUNCTIONS
// ============================

/**
 * Show toast notification
 */
export function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/**
 * Format phone number for WhatsApp
 */
export function formatWhatsAppNumber(phone) {
  return phone.replace(/\s/g, '').replace('+', '');
}

/**
 * Format date for display
 */
export function formatDate(date) {
  if (!date) return 'N/A';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Upload image to IMGBB
 */
export async function uploadToImgBB(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      
      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}&image=${base64}`,
          { method: 'POST' }
        );
        
        const data = await response.json();
        
        if (data.success) {
          resolve(data.data.url);
        } else {
          reject(new Error(data.error?.message || 'Upload failed'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate password strength
 */
export function isStrongPassword(password) {
  return password.length >= 6;
}

// ============================
// DOM UTILITIES
// ============================

/**
 * Get element by ID with error handling
 */
export function $(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`Element #${id} not found`);
  return el;
}

/**
 * Add event listener with cleanup
 */
export function on(el, event, handler) {
  if (!el) return () => {};
  el.addEventListener(event, handler);
  return () => el.removeEventListener(event, handler);
}

/**
 * Toggle class on element
 */
export function toggleClass(el, className, force) {
  if (!el) return;
  if (typeof force === 'boolean') {
    el.classList.toggle(className, force);
  } else {
    el.classList.toggle(className);
  }
}

// ============================
// THEME MANAGEMENT
// ============================

export function initTheme() {
  const toggle = $('themeToggle');
  const saved = localStorage.getItem('gharfix-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  
  // Toggle handler
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('gharfix-theme', next);
    });
  }
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('gharfix-theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}

// ============================
// NAVIGATION
// ============================

export function initNavigation() {
  const mobileToggle = $('mobileToggle');
  const navLinks = $('navLinks');
  
  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', 
        navLinks.classList.contains('active'));
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      toggleClass(navbar, 'scrolled', window.scrollY > 10);
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

// ============================
// AUTH STATE MANAGEMENT
// ============================

let currentUser = null;
let userProfile = null;

export function getCurrentUser() {
  return currentUser;
}

export function getUserProfile() {
  return userProfile;
}

export function isAdmin() {
  return currentUser?.email === ADMIN_EMAIL;
}

export function setAuthState(user, profile) {
  currentUser = user;
  userProfile = profile;
  
  // Update UI based on auth state
  updateAuthUI();
}

function updateAuthUI() {
  const guestNav = $('guestNav');
  const userNav = $('userNav');
  const adminLink = $('adminLink');
  const userName = $('userName');
  
  if (currentUser) {
    guestNav?.classList.add('hidden');
    userNav?.classList.remove('hidden');
    adminLink?.classList.toggle('hidden', !isAdmin());
    
    if (userName) {
      userName.textContent = userProfile?.name || currentUser.email?.split('@')[0] || 'User';
    }
  } else {
    guestNav?.classList.remove('hidden');
    userNav?.classList.add('hidden');
    adminLink?.classList.add('hidden');
  }
}

// ============================
// WORKER MANAGEMENT
// ============================

/**
 * Render worker card HTML
 */
export function renderWorkerCard(worker) {
  const service = SERVICES.find(s => s.id === worker.category);
  const phone = worker.phone?.replace(/\s/g, '');
  const whatsappUrl = `https://wa.me/92${phone?.startsWith('92') ? phone.slice(2) : phone}`;
  
  return `
    <div class="card worker-card animate-fade">
      <div class="worker-header">
        <img src="${worker.photo || 'https://via.placeholder.com/60?text=👤'}" 
             alt="${worker.name}" 
             class="worker-avatar"
             onerror="this.src='https://via.placeholder.com/60?text=👤'">
        <div class="worker-info">
          <h4>${worker.name}</h4>
          <p class="text-muted">${service?.name || worker.category}</p>
        </div>
        <span class="worker-badge ${worker.available ? 'badge-available' : 'badge-busy'}">
          ${worker.available ? 'Available' : 'Busy'}
        </span>
      </div>
      
      ${worker.experience || worker.rating ? `
        <div class="text-muted text-sm">
          ${worker.experience ? `⭐ ${worker.experience} yrs exp` : ''}
          ${worker.experience && worker.rating ? ' • ' : ''}
          ${worker.rating ? `⭐ ${worker.rating}/5` : ''}
        </div>
      ` : ''}
      
      ${worker.location ? `<p class="text-muted text-sm">📍 ${worker.location}</p>` : ''}
      
      <div class="worker-actions">
        <a href="tel:${worker.phone}" class="btn btn-sm btn-outline">📞 Call</a>
        <a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-whatsapp">
          💬 WhatsApp
        </a>
      </div>
    </div>
  `;
}

/**
 * Load workers from Firestore
 */
export async function loadWorkers(containerId, category = null) {
  const container = $(containerId);
  if (!container) return;
  
  try {
    container.innerHTML = '<div class="text-center"><span class="loading"></span><p class="text-muted">Loading workers...</p></div>';
    
    // Import Firestore functions dynamically
    const { collection, getDocs, query, where } = await import('./firebase.js');
    
    let q = query(collection(db, 'workers'), where('status', '==', 'approved'));
    if (category) {
      q = query(q, where('category', '==', category));
    }
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      container.innerHTML = '<p class="text-center text-muted">No workers available yet. Check back soon!</p>';
      return;
    }
    
    const workers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    container.innerHTML = workers.map(renderWorkerCard).join('');
    
  } catch (error) {
    console.error('Error loading workers:', error);
    container.innerHTML = '<p class="text-center text-muted error">Failed to load workers. Please try again.</p>';
    showToast('Failed to load workers', 'error');
  }
}

// ============================
// SUPPORT SYSTEM
// ============================

export async function submitSupportRequest(category, message) {
  if (!currentUser) {
    showToast('Please login to submit a support request', 'warning');
    return false;
  }
  
  try {
    const { collection, addDoc, serverTimestamp } = await import('./firebase.js');
    
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
    console.error('Support submission error:', error);
    showToast('Failed to submit request. Please try again.', 'error');
    return false;
  }
}

// ============================
// PROFILE MANAGEMENT
// ============================

export async function updateProfile(data, imageFile = null) {
  if (!currentUser) return false;
  
  try {
    const { doc, updateDoc } = await import('./firebase.js');
    
    let photoUrl = userProfile?.photo;
    
    // Upload new image if provided
    if (imageFile) {
      photoUrl = await uploadToImgBB(imageFile);
    }
    
    await updateDoc(doc(db, 'users', currentUser.uid), {
      name: data.name,
      phone: data.phone,
      location: data.location,
      photo: photoUrl,
      updatedAt: serverTimestamp()
    });
    
    // Update local profile
    userProfile = { ...userProfile, ...data, photo: photoUrl };
    
    showToast('Profile updated successfully', 'success');
    return true;
    
  } catch (error) {
    console.error('Profile update error:', error);
    showToast('Failed to update profile', 'error');
    return false;
  }
}

// ============================
// INITIALIZATION
// ============================

export function initApp() {
  // Initialize theme
  initTheme();
  
  // Initialize navigation
  initNavigation();
  
  // Set real contact data on pages
  populateContactData();
  
  // Initialize auth listener if firebase is loaded
  if (window.authInitialized) {
    initAuthListener();
  }
  
  // Handle service category clicks
  initServiceCategories();
  
  // Handle support form
  initSupportForm();
  
  // Handle image error fallbacks
  initImageFallbacks();
}

function populateContactData() {
  // Phone links
  document.querySelectorAll('[data-phone]').forEach(el => {
    const phone = CONTACT.phones[0];
    el.href = `tel:${phone.replace(/\s/g, '')}`;
    el.textContent = phone;
  });
  
  // Email links
  document.querySelectorAll('[data-email]').forEach((el, i) => {
    el.href = `mailto:${CONTACT.emails[i % CONTACT.emails.length]}`;
    el.textContent = CONTACT.emails[i % CONTACT.emails.length];
  });
  
  // Social links
  const socialMap = {
    'telegram': CONTACT.social.telegram,
    'linkedin': CONTACT.social.linkedin,
    'yofan': CONTACT.social.yofan,
    'lovable': CONTACT.social.lovable
  };
  
  document.querySelectorAll('[data-social]').forEach(el => {
    const key = el.dataset.social;
    if (socialMap[key]) {
      el.href = socialMap[key];
    }
  });
  
  // Founder info
  const founderName = $('founderName');
  const founderMission = $('founderMission');
  if (founderName) founderName.textContent = FOUNDER.name;
  if (founderMission) founderMission.textContent = FOUNDER.mission;
}

function initServiceCategories() {
  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const category = btn.dataset.service;
      
      // Navigate to workers view with filter
      if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('index')) {
        const workersSection = $('workersGrid');
        if (workersSection) {
          loadWorkers('workersGrid', category);
          workersSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = `dashboard.html?category=${category}`;
      }
    });
  });
}

function initSupportForm() {
  const form = $('supportForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const category = $('#supportCategory')?.value;
    const message = $('#supportMessage')?.value;
    
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
    
    if (success) {
      form.reset();
    }
  });
}

function initImageFallbacks() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.classList.add('img-placeholder');
      this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394A3B8"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E';
    });
  });
}

// Initialize auth listener (called after firebase.js loads)
export async function initAuthListener() {
  const { onAuthStateChanged, doc, getDoc } = await import('./firebase.js');
  
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const profile = userDoc.exists() ? userDoc.data() : null;
        setAuthState(user, profile);
      } catch (error) {
        console.error('Error loading user profile:', error);
        setAuthState(user, null);
      }
    } else {
      setAuthState(null, null);
    }
  });
}

// Export Firebase references for other modules
export let auth, db;
export async function initFirebase() {
  const firebase = await import('./firebase.js');
  auth = firebase.auth;
  db = firebase.db;
  window.authInitialized = true;
  return firebase;
}

// Global error handler
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // Don't show toast for every error, only critical ones
  if (e.message?.includes('Firebase') || e.message?.includes('Network')) {
    showToast('A network error occurred. Please check your connection.', 'error');
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
