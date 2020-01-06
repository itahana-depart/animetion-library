let cssAnimeArr = ['zoomIn', 'fadeInUp', 'zoomInUp', 'fadeInDown', 'zoomFadeInUp', 'zoomFadeInDown', 'fadeInLeft', 'fadeInRight', 'zoomInLeft', 'zoomInRight'];
cssAnimeArr = arrShuffle(cssAnimeArr);
const len = cssAnimeArr.length;
const target = document.querySelector('.js-anime');
const interval = 2000;
let count = 0;

setInterval(() => {
	target.removeAttribute('class');
	target.classList.add(cssAnimeArr[count]);
	count++;
	if (len <= count) {
		count = 0;
	}
}, interval);

function arrShuffle(_arr) {
	let length = _arr.length;
	for (let i = length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let tmp = _arr[i];
		_arr[i] = _arr[j];
		_arr[j] = tmp;
	}
	return _arr.slice();
}
