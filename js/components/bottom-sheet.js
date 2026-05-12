const BottomSheet = {
  open(contentHTML) {
    const overlay = document.createElement('div');
    overlay.className = 'bottom-sheet-overlay';
    overlay.id = 'bs-overlay';

    const sheet = document.createElement('div');
    sheet.className = 'bottom-sheet';
    sheet.id = 'bottom-sheet';
    sheet.innerHTML = `
      <div class="bottom-sheet__handle"></div>
      ${contentHTML}
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(sheet);

    requestAnimationFrame(() => {
      overlay.classList.add('open');
      sheet.classList.add('open');
    });

    overlay.addEventListener('click', () => this.close());
  },

  close() {
    const overlay = document.getElementById('bs-overlay');
    const sheet = document.getElementById('bottom-sheet');
    if (!sheet) return;

    overlay?.classList.remove('open');
    sheet.classList.remove('open');

    sheet.addEventListener('transitionend', () => {
      overlay?.remove();
      sheet.remove();
    }, { once: true });
  }
};
