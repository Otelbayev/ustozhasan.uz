try {
 const saved = Number(sessionStorage.getItem('ustoz-lead-success'));
 if (saved && Date.now() - saved < 3600000) {
  document.querySelector('#thanks-title').textContent = 'Rahmat! Arizangiz qabul qilindi.';
  document.querySelector('#thanks-copy').textContent = 'Tez orada siz bilan bog‘lanamiz. Hozir Telegram kanalimizga qo‘shiling — kurs yangiliklari va foydali materiallar shu yerda.';
 }
} catch {}
