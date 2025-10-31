(() => {
const total = 16;
let index = 0;

// color palette
const colors = [
'#437c9850', '#16334650', '#b2513a50', '#4b334c50',
'#102c4550', '#121a1150', '#41668250', '#cd9aa150',
'#253b3350', '#57536650', '#35312650', '#23342950',
'#0c363650', '#31505b50', '#1b2c2550', '#452e1c50'
];
document.documentElement.style.setProperty('--containerBorderColor', colors[0]);
let front = document.getElementById('vid_F');
let back  = document.getElementById('vid_B');

front.src = `assets/Side${index + 1}.mp4`;
front.load();
front.play();

function swap() {
  index = (index + 1) % total;

  // update video source
  back.src = `assets/Side${index + 1}.mp4`;
  back.load();
  back.play();

  // update border color variable
  const color = colors[index % colors.length];
  document.documentElement.style.setProperty('--containerBorderColor', color);

  // swap layers
  back.className = 'front';
  front.className = 'back';
  [front, back] = [back, front];
}

front.addEventListener('click', swap);
back.addEventListener('click', swap);
})();
