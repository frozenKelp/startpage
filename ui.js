const Xbtn = document.getElementById('X');
const Xparent = Xbtn.parentElement;
Xbtn.addEventListener('click', close);
function close() {
    Xparent.remove();
}