(() => {
//Clock
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const date = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  document.getElementById('codes').textContent = `${time}  |  ${date}`;
}

updateClock();
setInterval(updateClock, 1000);
})();