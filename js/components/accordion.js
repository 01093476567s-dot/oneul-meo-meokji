function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const accordion = header.closest('.accordion');
      accordion.classList.toggle('accordion--open');
    });
  });
}

function renderAccordion({ id, title, content, open = false }) {
  return `
    <div class="accordion ${open ? 'accordion--open' : ''}" id="${id}">
      <div class="accordion-header">
        <span>${title}</span>
        <span class="accordion-arrow">∨</span>
      </div>
      <div class="accordion-content">
        ${content}
      </div>
    </div>
  `;
}
