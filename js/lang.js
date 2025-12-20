export const LANG = {
  bn: {
    login: "লগইন",
    email: "ইমেইল",
    password: "পাসওয়ার্ড",
    logout: "লগআউট",
    admin: "অ্যাডমিন",
    doctor: "ডাক্তার",
    patient: "রোগী",
    dashboard: "ড্যাশবোর্ড",
    save: "সংরক্ষণ করুন",
    search: "খুঁজুন"
  },
  en: {
    login: "Login",
    email: "Email",
    password: "Password",
    logout: "Logout",
    admin: "Admin",
    doctor: "Doctor",
    patient: "Patient",
    dashboard: "Dashboard",
    save: "Save",
    search: "Search"
  }
};

export function getLang() {
  return localStorage.getItem("lang") || "bn";
}

export function setLang(lang) {
  localStorage.setItem("lang", lang);
  applyLang();
}

export function applyLang() {
  const lang = getLang();
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    if (LANG[lang] && LANG[lang][k]) el.innerText = LANG[lang][k];
  });
}
