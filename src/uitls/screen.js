// let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
// let htmlDom = document.getElementsByTagName('html')[0];
// if (htmlWidth < 1280) {
//   htmlWidth = 1280;
// }
// let num = htmlWidth / 1920

// htmlDom.style.transform = `scale(${num})`
// window.onresize = function () {
//   htmlDom.style.transform = `scale(${num})`
//   if (htmlWidth < 1280) {
//     htmlWidth = 1280;
//   }

// }


var s;
function resize() {
  s = window.screen.width / 1920;
  document.body.style.transformOrigin = '0 0';
  document.body.style.transform = 'scale(' + s + ',' + s + ')';
  document.body.style.width = window.innerWidth / s + 'px';
  document.body.style.height = window.innerHeight / s + 'px';
}
window.onresize = function () {
  resize();
}
resize();
