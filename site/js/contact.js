(function () {
  'use strict';
  var form = document.getElementById('contact-form');
  if (!form) return;

  var errorEl = document.getElementById('form-error');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorEl.hidden = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
      .then(function (r) {
        if (r.ok) {
          showConfirmation();
        } else {
          errorEl.hidden = false;
        }
      })
      .catch(function () {
        errorEl.hidden = false;
      });
  });

  // Aligns the top edge of the e-mail/WhatsApp block with the Message field when the two columns sit side by side.
  var blocks = document.querySelector('.contact-blocks');
  function alignBlocks() {
    var target = document.getElementById('message');
    if (!blocks || !target) return;
    blocks.style.marginTop = '';
    var b = blocks.getBoundingClientRect();
    var t = target.getBoundingClientRect();
    if (b.right > t.left) return;
    var base = parseFloat(getComputedStyle(blocks).marginTop) || 0;
    var next = base + (t.top - b.top);
    if (next >= 20) blocks.style.marginTop = next + 'px';
  }
  alignBlocks();
  window.addEventListener('resize', alignBlocks);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignBlocks);

  function showConfirmation() {
    var col = document.getElementById('form-col');
    col.innerHTML =
      '<div class="contact-confirm">' +
      '<h2>Message envoyé</h2>' +
      '<p>Merci, votre demande est bien arrivée. Une réponse vous parviendra sous 48 heures ouvrées.</p>' +
      '</div>';
  }
})();
