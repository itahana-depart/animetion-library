class ScrollAnime {
	constructor(_elemets = '.anime', _className = 'anime-run') {
		this.elemets = _elemets;
		this.threshold = 100;
		this.scrollFlag = false;
		this.wHeight = window.innerHeight;
		this.className = _className;
	}

	showAnime() {
		const elems = document.querySelectorAll(this.elemets);
		const winH = this.wHeight;
		const threshold = this.threshold;
		const className = this.className;

		elems.forEach(function (item) {
			let rect = item.getBoundingClientRect();
			let scrollT = document.documentElement.scrollTop;
			let offsetTop = rect.top + scrollT;
			if (scrollT > offsetTop - winH + threshold) {
				item.classList.add(className);
			}
		});
	}

	init() {
		const self = this;
		window.onload = function () {
			getShowAnime();
		}
		window.onresize = function () {
			getShowAnime();
		}
		document.addEventListener('scroll', function(){
			getShowAnime();
		}, { passive: true });

		function getShowAnime() {
			if (!self.scrollFlag) {
				requestAnimationFrame(function () {
					self.scrollFlag = false;
					self.showAnime();
				});
				self.scrollFlag = true;
			}
		}
	}
}
module.exports = ScrollAnime;
