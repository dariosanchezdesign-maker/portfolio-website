// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const headerInner = document.querySelector('.header-inner');

if (menuToggle && headerInner) {
  menuToggle.addEventListener('click', () => {
    const isOpen = headerInner.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav a').forEach((link) => {
    link.addEventListener('click', () => {
      headerInner.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Active nav link on scroll
const navLinks = document.querySelectorAll('[data-nav]');
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (sections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((section) => navObserver.observe(section));

  // The last section (footer) is often too short to ever cross the
  // rootMargin band once the page is fully scrolled — force it active
  // when the user has reached the bottom of the page.
  const lastLink = navLinks[navLinks.length - 1];

  window.addEventListener(
    'scroll',
    () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        navLinks.forEach((link) => link.classList.toggle('active', link === lastLink));
      }
    },
    { passive: true }
  );
}

// Services accordion — only one panel open at a time
const serviceItems = document.querySelectorAll('.service-item');

serviceItems.forEach((item) => {
  const header = item.querySelector('.service-header');
  header.addEventListener('click', () => {
    const willOpen = !item.classList.contains('open');
    serviceItems.forEach((other) => {
      other.classList.remove('open');
      other.querySelector('.service-header').setAttribute('aria-expanded', 'false');
    });
    if (willOpen) {
      item.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
    }
  });
});

// Language switcher (English / Spanish)
const translations = {
  es: {
    'nav.about': 'Sobre mí',
    'nav.experience': 'Experiencia',
    'nav.projects': 'Proyectos',
    'nav.contact': 'Contacto',

    'hero.eyebrow': 'Diseñador UX/UI / Desarrollador Web',
    'hero.copy':
      'Diseño y desarrollo productos digitales accesibles y enfocados en conversión — desde prototipos en Figma hasta sitios en Webflow y WordPress listos para producción, para startups y agencias gubernamentales por igual, cada vez más potenciados con herramientas nativas de IA como Claude Code y Cursor para pasar más rápido de la idea al producto final.',
    'hero.cta.experience': 'Ver Experiencia',
    'hero.cta.cv': 'Descargar CV',

    'about.title': 'Sobre mí',
    'about.stat.experience.title': 'Experiencia',
    'about.stat.experience.years': '3+ años',
    'about.stat.experience.role': 'Diseño UI/UX',
    'about.stat.education.title': 'Educación',
    'about.stat.education.degree': 'Licenciatura en Diseño Industrial',
    'about.copy':
      'Como recién graduado en Diseño Industrial en transición hacia el Diseño UI/UX, aporto una perspectiva fresca y una pasión por crear diseños intuitivos centrados en el usuario. Mi formación en Diseño Industrial me brinda una combinación única de habilidades para resolver problemas y sensibilidad estética, que ahora aplico al espacio digital.',

    'experience.title': 'Experiencia',
    'experience.01.title': 'UI/UX',
    'experience.01.body': 'Creación de interfaces de usuario fluidas, efectivas y agradables de usar.',
    'experience.02.title': 'Web y Aplicaciones Móviles',
    'experience.02.body': 'Convirtiendo ideas en experiencias excepcionales para web y aplicaciones móviles.',
    'experience.03.title': 'Desarrollo',
    'experience.03.body': 'Haciendo realidad tu visión mediante tecnología de vanguardia e innovaciones de diseño modernas.',
    'experience.04.title': 'Diseño y Creatividad',
    'experience.04.body': 'Creación de diseños visualmente cautivadores que conectan con tu audiencia.',
    'experience.05.title': 'Flujo de Trabajo con IA',
    'experience.05.body':
      'Combino el oficio del diseño con herramientas nativas de IA como Figma, Claude Code y Cursor para pasar de la idea a un producto funcional más rápido, sin sacrificar la calidad.',

    'projects.title': 'Proyectos',
    'projects.fitforge.caption': 'Aplicación móvil de fitness',
    'projects.dinedivide.caption': 'Aplicación enfocada en comida',
    'projects.autoexpreso.caption': 'App de transporte y servicios automotrices',
    'projects.sectordataviz.caption': 'Con Estudios Técnicos Inc.',
    'projects.bancopopular.caption': 'Diseño de landing page',

    'footer.eyebrow': 'Contáctame',
    'footer.title': 'Contacto',

    'common.back': '← Volver a Proyectos',

    'project.fitforge.tagline': 'Estudio de caso de diseño de aplicación móvil de fitness.',
    'project.dinedivide.tagline': 'Estudio de caso de diseño de aplicación enfocada en comida.',
    'project.autoexpreso.tagline':
      'Estudio de caso de diseño de aplicación de transporte y servicios automotrices.',
    'project.sectordataviz.tagline':
      'Proyecto de visualización de datos para análisis sectorial, desarrollado con Estudios Técnicos Inc.',
    'project.bancopopular.tagline': 'Estudio de caso de diseño de landing page para Banco Popular.',
  },
};

const i18nElements = document.querySelectorAll('[data-i18n]');
const langButtons = document.querySelectorAll('.lang-btn');
const defaultText = new Map();

i18nElements.forEach((el) => {
  const firstLine = el.querySelector('.nav-line:not(.nav-line--dim)');
  defaultText.set(el, firstLine ? firstLine.textContent : el.textContent);
});

function setLanguage(lang) {
  i18nElements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = lang === 'es' ? translations.es[key] : undefined;
    const text = value !== undefined ? value : defaultText.get(el);

    if (el.hasAttribute('data-i18n-first')) {
      el.textContent = '';
      const letter = document.createElement('span');
      letter.className = 'win95-letter';
      letter.textContent = text.charAt(0);
      el.appendChild(letter);
      el.appendChild(document.createTextNode(text.slice(1)));
    } else if (el.hasAttribute('data-i18n-roll')) {
      el.textContent = '';
      const clip = document.createElement('span');
      clip.className = 'nav-clip';
      const roll = document.createElement('span');
      roll.className = 'nav-roll';
      const line1 = document.createElement('span');
      line1.className = 'nav-line';
      line1.textContent = text;
      const line2 = document.createElement('span');
      line2.className = 'nav-line nav-line--dim';
      line2.textContent = text;
      roll.appendChild(line1);
      roll.appendChild(line2);
      clip.appendChild(roll);
      el.appendChild(clip);
    } else {
      el.textContent = text;
    }
  });
  langButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
}

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
});

setLanguage(localStorage.getItem('lang') || 'en');
