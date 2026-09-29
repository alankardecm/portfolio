document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const closeMenu = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu'; };
  toggle.addEventListener('click', () => { const open = !nav.classList.contains('open'); nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Fechar' : 'Menu'; });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
  window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  const cards = [...document.querySelectorAll('.project-card')];
  document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let visible = 0;
    cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.cat !== button.dataset.filter; if (!card.hidden) visible++; });
    document.querySelector('.project-count').textContent = `${visible} projetos nesta seleção`;
  }));
  const form = document.querySelector('#raiox-form');
  if (!form) return;
  const suggestions = {
    leadership: 'Mapear decisões recorrentes, responsáveis e critérios de escalonamento. O primeiro passo é entender o que pode ser delegado com segurança.',
    data: 'Revisar fontes, definições dos indicadores e rotina de atualização. Uma base confiável vem antes de novos painéis.',
    process: 'Mapear uma rotina repetitiva e suas exceções antes de automatizar. Definir responsável, regra e acompanhamento do piloto.',
    retention: 'Analisar motivos de cancelamento e qualidade do histórico. Um piloto pode avaliar sinais de risco e ações de retenção.'
  };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const pain = data.get('pain');
    const selected = form.elements.pain.selectedOptions[0].textContent;
    const answers = [`Gargalo: ${selected}`, `Dados: ${data.get('data')}`, `Porte: ${data.get('size')}`, `Retenção: ${data.get('retention')}`];
    const message = ['Olá Alan! Quero conversar sobre a operação da minha empresa.', `Nome: ${data.get('name')}`, `Empresa: ${data.get('company')}`, `E-mail: ${data.get('email')}`, `WhatsApp: ${data.get('phone')}`, ...answers, `Prioridade inicial: ${suggestions[pain]}`].join('\n');
    const result = document.querySelector('#assessment-result');
    result.querySelector('p').textContent = suggestions[pain];
    result.querySelector('a').href = `https://wa.me/5519995483158?text=${encodeURIComponent(message)}`;
    result.hidden = false;
    const status = document.querySelector('#form-status');
    const button = form.querySelector('button[type=submit]');
    button.disabled = true;
    status.textContent = 'Registrando seu pedido de contato…';
    const payload = { name: data.get('name'), company: data.get('company'), email: data.get('email'), phone: data.get('phone'), pain, answers, consent: true, source: 'site_raiox', campaign: 'raiox_operacional_2026' };
    // Keep the existing public CRM contract. Never contact the visitor's localhost.
    let saved = false;
    for (const url of ['/api/public/leads', 'https://comercial.amconsultoria.tech/api/public/leads']) {
      try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(7000) });
        if (response.ok) { saved = true; break; }
      } catch (_) { /* The explicit WhatsApp link remains available. */ }
    }
    status.textContent = saved ? 'Pedido de contato registrado. Se preferir, envie também o resumo pelo WhatsApp abaixo.' : 'Não foi possível registrar o pedido no site. Use o botão abaixo para abrir o resumo no WhatsApp e enviar a mensagem.';
    button.disabled = false;
    result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  });
});
// Accessible service tabs and a transparent operational capacity simulation.
document.addEventListener('DOMContentLoaded', () => {
  const tabs = [...document.querySelectorAll('.service-tab')];
  const activate = (tab, focus = false) => {
    tabs.forEach(t => { const active = t === tab; t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1; document.getElementById(t.getAttribute('aria-controls')).hidden = !active; });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', e => {
      let next = null;
      if(e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(index + 1) % tabs.length];
      if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(index - 1 + tabs.length) % tabs.length];
      if(e.key === 'Home') next = tabs[0];
      if(e.key === 'End') next = tabs[tabs.length - 1];
      if(next) { e.preventDefault(); activate(next, true); }
    });
  });
  const hours = document.querySelector('#value-hours');
  if(!hours) return;
  const hourly = document.querySelector('#value-hour-cost');
  const recovery = document.querySelector('#value-recovery');
  const bounded = el => Math.min(Number(el.max), Math.max(Number(el.min), Number(el.value) || 0));
  const update = () => {
    const time = bounded(hours) * bounded(recovery) / 100;
    document.querySelector('#value-time').textContent = new Intl.NumberFormat('pt-BR', {maximumFractionDigits: 1}).format(time);
    document.querySelector('#value-output').textContent = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL', maximumFractionDigits:0}).format(time * bounded(hourly));
  };
  [hours, hourly, recovery].forEach(el => el.addEventListener('input', update));
  update();
});
