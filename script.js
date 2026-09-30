(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const toast = document.getElementById('toast');
  const year = document.getElementById('currentYear');
  if (year) year.textContent = String(new Date().getFullYear());
  let toastTimer;
  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  }
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll('.section-heading, .service-card, .work-card, .manifesto, .process-list article, .contact-layout > div').forEach(el => {
    el.classList.add('reveal');
    if (revealObserver) revealObserver.observe(el); else el.classList.add('visible');
  });
  document.getElementById('projectForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = [
      'درخواست پروژه جدید — RESTAR WEB',
      `نام: ${data.get('name')}`,
      `راه ارتباطی: ${data.get('contact')}`,
      `نوع پروژه: ${data.get('type')}`,
      `توضیحات: ${data.get('details') || 'ثبت نشده'}`
    ].join('\n');
    try {
      await navigator.clipboard.writeText(message);
      notify('متن درخواست کپی شد. آن را برای RESTAR WEB ارسال کن؛ فرم هنوز به سرور متصل نیست.');
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = message;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed'; area.style.opacity = '0';
      document.body.appendChild(area); area.select();
      const copied = document.execCommand('copy'); area.remove();
      notify(copied ? 'متن درخواست کپی شد. فرم هنوز به سرور متصل نیست.' : 'درخواست آماده شد اما کپی خودکار ممکن نشد؛ اطلاعات را نگه دار و دستی ارسال کن.');
    }
  });
})();
