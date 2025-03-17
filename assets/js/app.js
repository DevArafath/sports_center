document.addEventListener('DOMContentLoaded', function() {
  "use strict";

  /*** Apply .scrolled class to the body as the page is scrolled down*/
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /*** Mobile nav toggle*/
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /*** Hide mobile nav on same-page/hash links that aren't in dropdowns*/
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active') && 
          !navmenu.parentElement.classList.contains('dropdown') && 
          !navmenu.closest('.dropdown ul')) {
        mobileNavToogle();
      }
    });
  });

  /*** Handle dropdown toggles for all levels*/
  document.querySelectorAll('#navmenu .dropdown').forEach(dropdown => {
    const dropdownLink = dropdown.querySelector('a');
    
    // Handle click on dropdown links
    dropdownLink.addEventListener('click', function(e) {
      // Only if mobile view
      if (window.innerWidth <= 1199) {
        e.preventDefault();
        
        // Toggle the active class on the parent dropdown
        dropdown.classList.toggle('active');
        
        // Toggle the dropdown-active class on the next sibling ul
        const dropdownMenu = this.nextElementSibling;
        if (dropdownMenu && dropdownMenu.tagName === 'UL') {
          dropdownMenu.classList.toggle('dropdown-active');
        }
        
        // Toggle the icon rotation
        const icon = this.querySelector('i.fa-caret-down');
        if (icon) {
          icon.classList.toggle('fa-rotate-180');
        }
        
        // Close other dropdowns at the same level
        const siblingDropdowns = dropdown.parentNode.querySelectorAll('.dropdown');
        siblingDropdowns.forEach(sibling => {
          if (sibling !== dropdown && sibling.classList.contains('active')) {
            sibling.classList.remove('active');
            const siblingMenu = sibling.querySelector('ul');
            if (siblingMenu) {
              siblingMenu.classList.remove('dropdown-active');
            }
            const siblingIcon = sibling.querySelector('i.fa-caret-down');
            if (siblingIcon) {
              siblingIcon.classList.remove('fa-rotate-180');
            }
          }
        });
      }
    });
  });

  // Get cursor elements
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorCircle = document.querySelector('.cursor-circle');

  // Get audio elements
  const cueHitSound = document.getElementById('cue-hit-sound');
  const ballHitSound = document.getElementById('ball-hit-sound');

  // Track mouse position
  let mouseX = 0;
  let mouseY = 0;

  // Smoothing factor for cursor circle (lower = smoother)
  const smoothing = 0.15;
  let circleX = 0;
  let circleY = 0;

  // Track which sound to play next
  let playFirstSound = true;

  // Update cursor position on mouse move
  document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // The dot follows the cursor exactly
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
  });

  // Animation loop for smooth circle movement
  function animateCircle() {
      // Calculate new position with smooth movement
      const dx = mouseX - circleX;
      const dy = mouseY - circleY;
      
      circleX += dx * smoothing;
      circleY += dy * smoothing;
      
      cursorCircle.style.left = circleX + 'px';
      cursorCircle.style.top = circleY + 'px';
      
      requestAnimationFrame(animateCircle);
  }

  animateCircle();

  // Handle click events to play sound
  document.addEventListener('click', (e) => {
      // Instead of random, alternate between the two sounds
      if (playFirstSound) {
          // Make sure the audio is ready to play
          cueHitSound.currentTime = 0;
          cueHitSound.play().catch(e => console.error("Error playing cue hit sound:", e));
      } else {
          // Make sure the audio is ready to play
          ballHitSound.currentTime = 0;
          ballHitSound.play().catch(e => console.error("Error playing ball hit sound:", e));
      }
      
      // Toggle for next click
      playFirstSound = !playFirstSound;
      
      // Add click animation effect to circle
      cursorCircle.style.width = '30px';
      cursorCircle.style.height = '30px';
      
      setTimeout(() => {
          cursorCircle.style.width = '40px';
          cursorCircle.style.height = '40px';
      }, 300);
  });

  // Ensure both audio files are loaded properly
  window.addEventListener('load', () => {
      // Preload both sounds
      cueHitSound.load();
      ballHitSound.load();
      
      // Optional debugging to check if audio files are accessible
      console.log("Cue hit sound ready state:", cueHitSound.readyState);
      console.log("Ball hit sound ready state:", ballHitSound.readyState);
  });

  //_______________________________________________________________________
  // UPDATED: Set active link based on current page and section           |
  //----------------------------------------------------------------------
  function setActiveLink() {
    const navLinks = document.querySelectorAll('#navmenu a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // First, remove active class from all links
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // For section-based navigation within a page
    if (currentPage === 'index.html' || currentPage === '') {
      const sections = document.querySelectorAll('section');
      let currentSection = '';
      
      // Find the current section in view
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Adjust for navbar height
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
          currentSection = section.id;
        }
      });
      
      // Set active class for the current section
      if (currentSection) {
        const activeLink = document.querySelector(`#navmenu a[href="index.html#${currentSection}"], #navmenu a[href="#${currentSection}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    } else {
      // For separate pages (products.html, projects.html)
      const activeLink = document.querySelector(`#navmenu a[href="${currentPage}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  }

  // Add event listener for scroll to update active link
  window.addEventListener('scroll', setActiveLink);
  
  // Add event listener for page load to set initial active link
  window.addEventListener('load', setActiveLink);
});