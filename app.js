/**
 * app.js – Core Application Logic (COMPLETE)
 * GharFix Pakistan – Production Ready
 * 
 * ✅ Auth: Email/Password
 * ✅ Firestore: users, workers, support_requests
 * ✅ IMGBB: Image upload
 * ✅ Admin: Restricted access
 * ✅ UI: Premium interactions
 */

// ✅ IMPORTS
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

// ✅ CONFIG
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
  { id: 'bike-mechanic', name: 'Bike Mechanic', icon: '🏍️' }
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

export const FOUNDER = {
  name: 'Muhammad Ali',
  mission: 'Provide fast and reliable home services in Pakistan'
};

// ✅ STATE
let currentUser = null;
let userProfile = null;

export const getState = () => ({ user: currentUser, profile: userProfile });
export const isAdmin = () => currentUser?.email === ADMIN_EMAIL;

// ✅ TOAST
export function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ'}</span><span>${message}</span>`;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ✅ THEME
export function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('gharfix-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  
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

// ✅ IMGBB UPLOAD
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

// ✅ AUTH UI
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

// ✅ WORKER CARD
export function renderWorkerCard(worker) {
  const service = SERVICES.find(s => s.id === worker.category);
  const phone = worker.phone?.replace(/\s/g, '');
  const whatsappUrl = `https://wa.me/92${phone?.startsWith('92') ? phone.slice(2) : phone}`;
  
  return `
    <article class="card worker-card glass">
      <header class="worker-header">
        <img src="${worker.photo || 'https://via.placeholder.com/64?text=👤'}" 
             alt="${worker.name}" class="worker-avatar"
             onerror="this.src='https://via.placeholder.com/64?text=👤'">
        <div class="worker-info">
          <h4>${worker.name}</h4>
          <p class="text-muted">${service?.name || worker.category}</p>
        </div>
        <span class="worker-badge ${worker.available ? 'badge-available' : 'badge-busy'}">
          ${worker.available ? 'Available' : 'Busy'}
        </span>
      </header>
      ${worker.experience || worker.rating ? `
        <p class="text-muted text-sm">
          ${worker.experience ? `⭐ ${worker.experience}yrs` : ''}
          ${worker.experience && worker.rating ? ' • ' : ''}
          ${worker.rating ? `${worker.rating}/5 ★` : ''}
        </p>
      ` : ''}
      ${worker.location ? `<p class="text-muted text-sm">📍 ${worker.location}</p>` : ''}
      <footer class="worker-actions">
        <a href="tel:${worker.phone}" class="btn btn-sm btn-outline">📞 Call</a>
        <a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-whatsapp">💬 WhatsApp</a>
      </footer>
    </article>
  `;
}

// ✅ LOAD WORKERS
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
    container.innerHTML = workers.map(renderWorkerCard).join('');
  } catch (error) {
    console.error('Error loading workers:', error);
    container.innerHTML = '<p class="text-center text-muted error">Failed to load workers. Please try again.</p>';
    showToast('Failed to load workers', 'error');
  }
}

// ✅ SUPPORT REQUEST
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

// ✅ PROFILE UPDATE
export async function updateProfile(data, imageFile = null) {
  if (!currentUser) return false;
  try {
    let photoUrl = userProfile?.photo;
    if (imageFile) photoUrl = await uploadToImgBB(imageFile);
    
    await updateDoc(doc(db, 'users', currentUser.uid), {
      name: data.name, phone: data.phone, location: data.location,
      photo: photoUrl, updatedAt: serverTimestamp()
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

// ✅ NAVIGATION
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
  
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }
}

// ✅ SERVICE CATEGORIES
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

// ✅ SUPPORT FORM
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

// ✅ AUTH LISTENER
export async function initAuthListener() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const profile = userDoc.exists() ? userDoc.data() : null;
        currentUser = user;
        userProfile = profile;
        updateAuthUI(true, user, profile);
        if (document.getElementById('workersGrid')) loadWorkers('workersGrid');
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

// ✅ MAIN INIT
export function initApp() {
  initTheme();
  initNavigation();
  initServiceCategories();
  initSupportForm();
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
  const founderMission = document.getElementById('founderMission');
  if (founderName) founderName.textContent = FOUNDER.name;
  if (founderMission) founderMission.textContent = FOUNDER.mission;
  
  // Current year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ✅ GLOBAL ERROR HANDLING
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  if (e.message?.includes('Firebase') || e.message?.includes('Network')) {
    showToast('A network error occurred. Please check your connection.', 'error');
  }
});

// ✅ INIT ON DOM READY
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
