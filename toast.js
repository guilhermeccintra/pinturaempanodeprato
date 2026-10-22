document.addEventListener('DOMContentLoaded', function () {
  var toast = document.getElementById('purchase-toast');
  if (!toast) return;

  var nameEl = document.getElementById('pt-name');
  var actionEl = document.getElementById('pt-action');
  var timeEl = document.getElementById('pt-time');
  var closeBtn = toast.querySelector('.pt-close');

  var names = ['Mariana', 'Carlos', 'Fernanda', 'Thiago', 'Gabriela', 'Felipe', 'Aline', 'Lucas', 'Juliana', 'Rodrigo', 'Camila', 'Bruno'];
  var initials = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'J.', 'L.', 'M.', 'R.', 'S.', 'T.'];
  var actions = ['garantiu a Coleção!', 'acabou de garantir a Coleção!'];
  var times = ['há poucos segundos', 'há 1 minuto', 'há 2 minutos', 'há 3 minutos'];

  var pick = function (list) {
    return list[Math.floor(Math.random() * list.length)];
  };

  var hideTimer = null;

  var show = function () {
    nameEl.textContent = pick(names) + ' ' + pick(initials);
    actionEl.textContent = pick(actions);
    timeEl.textContent = pick(times);

    toast.classList.add('pt-show');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 5000);
  };

  var hide = function () {
    toast.classList.remove('pt-show');
  };

  closeBtn.addEventListener('click', function () {
    clearTimeout(hideTimer);
    hide();
  });

  // Primeira exibição após 4 segundos, depois a cada 30 segundos
  setTimeout(function () {
    show();
    setInterval(show, 30000);
  }, 4000);
});
