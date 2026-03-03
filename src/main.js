import './style.css'

/* ============================================
   MOBILE MENU
   ============================================ */

function initMobileMenu() {
  const burger = document.getElementById('navBurger')
  const links = document.getElementById('navLinks')
  const overlay = document.getElementById('navOverlay')

  if (!burger || !links) return

  function openMenu() {
    burger.classList.add('active')
    links.classList.add('open')
    if (overlay) overlay.classList.add('active')
    document.body.style.overflow = 'hidden'
  }

  function closeMenu() {
    burger.classList.remove('active')
    links.classList.remove('open')
    if (overlay) overlay.classList.remove('active')
    document.body.style.overflow = ''
  }

  function toggleMenu() {
    if (links.classList.contains('open')) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  burger.addEventListener('click', toggleMenu)
  if (overlay) overlay.addEventListener('click', closeMenu)

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu)
  })
}

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */

function initNavScroll() {
  const navbar = document.getElementById('navbar')
  if (!navbar) return

  let ticking = false

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50)
        ticking = false
      })
      ticking = true
    }
  })

  // Set initial state
  navbar.classList.toggle('scrolled', window.scrollY > 50)
}

/* ============================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ============================================ */

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )

  document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el)
  })
}

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1)
      if (!targetId) return

      const target = document.getElementById(targetId)
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth' })
      }
    })
  })
}

/* ============================================
   CONTACT FORM HANDLER
   ============================================ */

function initContactForm() {
  const form = document.getElementById('contactForm')
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const btn = document.getElementById('formSubmit')
    const successEl = document.getElementById('formSuccess')
    const errorEl = document.getElementById('formError')

    // Reset messages
    successEl.style.display = 'none'
    successEl.className = 'form-message'
    errorEl.style.display = 'none'
    errorEl.className = 'form-message'

    // Loading state
    const originalHTML = btn.innerHTML
    btn.innerHTML = '<svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Envoi en cours...'
    btn.disabled = true

    const payload = {
      name: form.querySelector('#name').value,
      email: form.querySelector('#email').value,
      company_type: form.querySelector('#company-type').value,
      message: form.querySelector('#message').value
    }

    try {
      const response = await fetch('/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        successEl.textContent = 'Message envoyé ! Merci pour votre intérêt. Nous avons bien reçu votre message à contact@rhizia.fr.'
        successEl.className = 'form-message success'
        form.reset()
      } else {
        throw new Error(result.message || 'Erreur inconnue')
      }
    } catch {
      errorEl.textContent = "Erreur d'envoi. Veuillez réessayer ou nous écrire directement à contact@rhizia.fr"
      errorEl.className = 'form-message error'
    } finally {
      btn.innerHTML = originalHTML
      btn.disabled = false
    }
  })
}

/* ============================================
   FOOTER YEAR
   ============================================ */

function initFooterYear() {
  const yearEl = document.getElementById('currentYear')
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear()
  }
}

/* ============================================
   INIT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu()
  initNavScroll()
  initScrollAnimations()
  initSmoothScroll()
  initContactForm()
  initFooterYear()
})
