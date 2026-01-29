/**
 * @file
 * Eldir theme JavaScript for progressive enhancement.
 * 
 * Provides modern interactivity while maintaining functionality without JS.
 */

(function (Drupal, drupalSettings, once) {

  'use strict';

  /**
   * Initialize smooth scrolling for anchor links.
   */
  Drupal.behaviors.eldirSmoothScroll = {
    attach: function (context, settings) {
      once('eldir-smooth-scroll', 'a[href^="#"]', context).forEach(function (element) {
        element.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // Update URL without jumping
            if (history.pushState) {
              history.pushState(null, null, targetId);
            }
            
            // Set focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus();
          }
        });
      });
    }
  };

  /**
   * Enhance tables for mobile responsiveness.
   */
  Drupal.behaviors.eldirResponsiveTables = {
    attach: function (context, settings) {
      once('eldir-responsive-table', 'table', context).forEach(function (table) {
        // Add wrapper for horizontal scrolling on mobile
        if (!table.parentElement.classList.contains('table-wrapper')) {
          const wrapper = document.createElement('div');
          wrapper.classList.add('table-responsive-wrapper');
          table.parentNode.insertBefore(wrapper, table);
          wrapper.appendChild(table);
        }
        
        // Add data-label attributes for mobile card view (optional enhancement)
        const headers = table.querySelectorAll('thead th');
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(function (row) {
          const cells = row.querySelectorAll('td');
          cells.forEach(function (cell, index) {
            if (headers[index]) {
              const headerText = headers[index].textContent.trim();
              cell.setAttribute('data-label', headerText);
            }
          });
        });
      });
    }
  };

  /**
   * Mobile navigation toggle.
   */
  Drupal.behaviors.eldirMobileNav = {
    attach: function (context, settings) {
      once('eldir-mobile-nav', '#navigation', context).forEach(function (nav) {
        // Only add mobile menu if there are links
        const links = nav.querySelector('ul.links');
        if (!links) return;
        
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.classList.add('mobile-nav-toggle');
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-controls', 'mobile-menu');
        toggleButton.setAttribute('aria-label', Drupal.t('Toggle navigation menu'));
        toggleButton.innerHTML = '<span class="menu-icon"></span>';
        
        // Add button before navigation links
        const limiter = nav.querySelector('.limiter');
        limiter.insertBefore(toggleButton, links);
        
        // Set ID on links container
        links.setAttribute('id', 'mobile-menu');
        
        // Toggle functionality
        toggleButton.addEventListener('click', function () {
          const expanded = this.getAttribute('aria-expanded') === 'true';
          this.setAttribute('aria-expanded', !expanded);
          links.classList.toggle('is-open');
          nav.classList.toggle('nav-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
          if (!nav.contains(e.target)) {
            toggleButton.setAttribute('aria-expanded', 'false');
            links.classList.remove('is-open');
            nav.classList.remove('nav-open');
          }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') {
            toggleButton.setAttribute('aria-expanded', 'false');
            links.classList.remove('is-open');
            nav.classList.remove('nav-open');
            toggleButton.focus();
          }
        });
      });
    }
  };

  /**
   * Enhance form validation with better UX.
   */
  Drupal.behaviors.eldirFormEnhancement = {
    attach: function (context, settings) {
      once('eldir-form-enhance', 'input[required], textarea[required], select[required]', context).forEach(function (field) {
        // Add visual indicator for required fields
        const label = field.closest('.form-item')?.querySelector('label');
        if (label && !label.querySelector('.form-required-marker')) {
          const marker = document.createElement('span');
          marker.classList.add('form-required-marker');
          marker.setAttribute('aria-hidden', 'true');
          marker.textContent = ' *';
          label.appendChild(marker);
        }
        
        // Real-time validation feedback
        field.addEventListener('blur', function () {
          if (!this.validity.valid) {
            this.classList.add('has-error');
            this.setAttribute('aria-invalid', 'true');
          } else {
            this.classList.remove('has-error');
            this.removeAttribute('aria-invalid');
          }
        });
        
        field.addEventListener('input', function () {
          if (this.classList.contains('has-error') && this.validity.valid) {
            this.classList.remove('has-error');
            this.removeAttribute('aria-invalid');
          }
        });
      });
    }
  };

  /**
   * Auto-expand textareas as user types.
   */
  Drupal.behaviors.eldirAutoExpandTextarea = {
    attach: function (context, settings) {
      once('eldir-auto-expand', 'textarea', context).forEach(function (textarea) {
        // Skip textareas with explicit rows attribute set by user
        if (textarea.hasAttribute('data-no-auto-expand')) return;
        
        function adjustHeight() {
          this.style.height = 'auto';
          this.style.height = (this.scrollHeight) + 'px';
        }
        
        textarea.addEventListener('input', adjustHeight);
        // Initial adjustment
        adjustHeight.call(textarea);
      });
    }
  };

  /**
   * Live status updates for hosting tasks (WebSocket ready).
   */
  Drupal.behaviors.eldirLiveTaskStatus = {
    attach: function (context, settings) {
      // Check if we're on a hosting page with tasks
      if (!document.body.classList.contains('path-hosting')) return;
      
      once('eldir-live-status', '.hosting-task-item', context).forEach(function (taskItem) {
        const statusCell = taskItem.querySelector('.hosting-task-status');
        if (!statusCell) return;
        
        // Add polling for status updates (placeholder for WebSocket implementation)
        // This would connect to a WebSocket endpoint in production
        taskItem.setAttribute('data-task-id', taskItem.dataset.taskId);
        taskItem.classList.add('live-update-enabled');
        
        // Visual indicator that live updates are active
        const liveIndicator = document.createElement('span');
        liveIndicator.classList.add('live-indicator');
        liveIndicator.setAttribute('title', Drupal.t('Live updates enabled'));
        liveIndicator.setAttribute('aria-label', Drupal.t('Live updates enabled'));
        statusCell.appendChild(liveIndicator);
      });
    }
  };

  /**
   * Collapsible sections/panels.
   */
  Drupal.behaviors.eldirCollapsible = {
    attach: function (context, settings) {
      once('eldir-collapsible', '.hosting-panel[data-collapsible]', context).forEach(function (panel) {
        const header = panel.querySelector('h2, h3, h4');
        if (!header) return;
        
        // Make header clickable
        header.style.cursor = 'pointer';
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'true');
        header.setAttribute('tabindex', '0');
        
        // Add toggle icon
        const icon = document.createElement('span');
        icon.classList.add('collapse-icon');
        icon.setAttribute('aria-hidden', 'true');
        header.appendChild(icon);
        
        // Get content to collapse
        const content = Array.from(panel.children).filter(el => el !== header);
        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('panel-content');
        content.forEach(el => contentWrapper.appendChild(el));
        panel.appendChild(contentWrapper);
        
        // Toggle function
        function toggle() {
          const isExpanded = header.getAttribute('aria-expanded') === 'true';
          header.setAttribute('aria-expanded', !isExpanded);
          contentWrapper.classList.toggle('is-collapsed');
          panel.classList.toggle('is-collapsed');
        }
        
        header.addEventListener('click', toggle);
        header.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        });
      });
    }
  };

  /**
   * Highlight current page in navigation.
   */
  Drupal.behaviors.eldirActiveTrail = {
    attach: function (context, settings) {
      const currentPath = window.location.pathname;
      once('eldir-active-trail', '#navigation a, .sidebar a', context).forEach(function (link) {
        const linkPath = link.getAttribute('href');
        if (linkPath && currentPath.indexOf(linkPath) === 0 && linkPath !== '/') {
          link.classList.add('is-active-trail');
          link.closest('li')?.classList.add('is-active-trail');
        }
      });
    }
  };

  /**
   * Add copy-to-clipboard functionality for code blocks.
   */
  Drupal.behaviors.eldirCopyCode = {
    attach: function (context, settings) {
      once('eldir-copy-code', 'pre code, #hosting-task-log', context).forEach(function (codeBlock) {
        const wrapper = codeBlock.parentElement;
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.classList.add('copy-code-button');
        copyButton.setAttribute('aria-label', Drupal.t('Copy to clipboard'));
        copyButton.textContent = Drupal.t('Copy');
        
        // Position button
        wrapper.style.position = 'relative';
        wrapper.appendChild(copyButton);
        
        copyButton.addEventListener('click', function () {
          const text = codeBlock.textContent;
          navigator.clipboard.writeText(text).then(function () {
            copyButton.textContent = Drupal.t('Copied!');
            copyButton.classList.add('copied');
            setTimeout(function () {
              copyButton.textContent = Drupal.t('Copy');
              copyButton.classList.remove('copied');
            }, 2000);
          }).catch(function (err) {
            console.error('Failed to copy text: ', err);
          });
        });
      });
    }
  };

})(Drupal, drupalSettings, once);
