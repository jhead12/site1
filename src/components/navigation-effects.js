import { useEffect } from "react"

export const useNavigationEffects = () => {
  useEffect(() => {
    // Cool hover effects for navigation items
    const addNavEffects = () => {
      // Add ripple effect to mobile menu button
      const mobileMenuButtons = document.querySelectorAll('[aria-label*="menu"]')
      mobileMenuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const rect = button.getBoundingClientRect()
          const size = Math.max(rect.width, rect.height)
          const x = e.clientX - rect.left - size / 2
          const y = e.clientY - rect.top - size / 2
          
          const ripple = document.createElement('div')
          ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(0, 102, 204, 0.3);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
          `
          
          if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style')
            style.id = 'ripple-styles'
            style.textContent = `
              @keyframes ripple {
                to {
                  transform: scale(4);
                  opacity: 0;
                }
              }
            `
            document.head.appendChild(style)
          }
          
          button.style.position = 'relative'
          button.appendChild(ripple)
          
          setTimeout(() => {
            ripple.remove()
          }, 600)
        })
      })

      // Add glow effect to navigation links
      const navLinks = document.querySelectorAll('nav a, nav button')
      navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          link.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          link.style.filter = 'drop-shadow(0 0 15px rgba(0, 102, 204, 0.5))'
          
          // Add particle effect
          if (!link.querySelector('.particle-container')) {
            createParticles(link)
          }
        })
        
        link.addEventListener('mouseleave', () => {
          link.style.filter = 'none'
          const particles = link.querySelector('.particle-container')
          if (particles) {
            particles.remove()
          }
        })
      })

      // Add floating animation to CTA button
      const ctaButtons = document.querySelectorAll('[href*="contact"], [href*="consultation"]')
      ctaButtons.forEach(button => {
        let floatAnimation
        
        const startFloat = () => {
          let start = null
          const float = (timestamp) => {
            if (!start) start = timestamp
            const progress = (timestamp - start) / 3000
            const offset = Math.sin(progress * Math.PI * 2) * 3
            button.style.transform = `translateY(${offset}px)`
            floatAnimation = requestAnimationFrame(float)
          }
          floatAnimation = requestAnimationFrame(float)
        }
        
        const stopFloat = () => {
          if (floatAnimation) {
            cancelAnimationFrame(floatAnimation)
          }
          button.style.transform = 'translateY(0)'
        }
        
        button.addEventListener('mouseenter', stopFloat)
        button.addEventListener('mouseleave', startFloat)
        
        // Start floating initially
        startFloat()
      })

      // Add Matrix-style glow to logo
      const logos = document.querySelectorAll('[alt*="logo"], img[src*="logo"]')
      logos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
          logo.style.transition = 'all 0.4s ease'
          logo.style.filter = 'drop-shadow(0 0 20px rgba(0, 102, 204, 0.8)) saturate(1.2)'
          logo.style.transform = 'scale(1.05) rotate(-1deg)'
        })
        
        logo.addEventListener('mouseleave', () => {
          logo.style.filter = 'none'
          logo.style.transform = 'scale(1) rotate(0deg)'
        })
      })
    }

    // Create particle effect
    const createParticles = (element) => {
      const container = document.createElement('div')
      container.className = 'particle-container'
      container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: -1;
      `
      
      for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div')
        particle.style.cssText = `
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(0, 102, 204, 0.7);
          border-radius: 50%;
          animation: particle-float ${1 + Math.random()}s ease-in-out infinite;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          box-shadow: 0 0 10px rgba(0, 102, 204, 0.5);
        `
        container.appendChild(particle)
      }
      
      // Add particle animation styles
      if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style')
        style.id = 'particle-styles'
        style.textContent = `
          @keyframes particle-float {
            0%, 100% {
              transform: translateY(0px) scale(1);
              opacity: 0.7;
            }
            50% {
              transform: translateY(-10px) scale(1.2);
              opacity: 1;
            }
          }
        `
        document.head.appendChild(style)
      }
      
      element.style.position = 'relative'
      element.appendChild(container)
    }

    // Add smooth scroll effect for navigation
    const addSmoothScroll = () => {
      const navLinks = document.querySelectorAll('a[href^="#"]')
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href')
          if (href.startsWith('#')) {
            e.preventDefault()
            const target = document.querySelector(href)
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              })
            }
          }
        })
      })
    }

    // Initialize effects
    const timer = setTimeout(() => {
      addNavEffects()
      addSmoothScroll()
    }, 100) // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timer)
      // Clean up any animations
      const floatingElements = document.querySelectorAll('[style*="transform"]')
      floatingElements.forEach(el => {
        el.style.transform = ''
      })
    }
  }, [])
}

export default useNavigationEffects
