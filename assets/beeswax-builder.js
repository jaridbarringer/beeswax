(() => {
  const config = window.BeeswaxBuilderSettings || {};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEnabled = config.reveal !== false;
  const parallaxEnabled = config.parallax !== false;
  const strength = Number(config.strength) || 16;
  const init = () => {
    if (!reduced && revealEnabled && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('bw-is-visible'); observer.unobserve(entry.target); }
      }), { threshold: 0.12 });
      document.querySelectorAll('[data-bw-reveal]').forEach((el) => observer.observe(el));
    } else {
      document.querySelectorAll('[data-bw-reveal]').forEach((el) => el.classList.add('bw-is-visible'));
    }
    if (!reduced && parallaxEnabled) {
      const images = [...document.querySelectorAll('.bw-motion--parallax .bw-parallax-image')];
      if (images.length) {
        let ticking = false;
        const update = () => {
          images.forEach((img) => {
            const rect = img.closest('.bw-builder')?.getBoundingClientRect();
            if (!rect) return;
            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const offset = (progress - 0.5) * strength;
            img.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0) scale(1.12)';
          });
          ticking = false;
        };
        window.addEventListener('scroll', () => { if (!ticking) { window.requestAnimationFrame(update); ticking = true; } }, { passive: true });
        window.addEventListener('resize', update, { passive: true });
        update();
      }
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
