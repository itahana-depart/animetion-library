import {TweenMax, Expo} from 'gsap/TweenMax';
import ScrollToPlugin from "gsap/ScrollToPlugin";

export default function () {
/**
 * 慣性スクロール
 */
	class ScrollSlow {
		constructor(_scrollTime = 3, _scrollDistance = 6) {
			this.scrollTime = _scrollTime;
			this.scrollDistance = _scrollDistance;
			this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			this.wheelEvent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		}
	}
	function scrollSlowEvent(e) {
		let delta = e.wheelDelta || e.detail * 40 * -1;
		let scrollTop = scrollSlow.scrollTop;
		let finalScroll = scrollTop - delta * scrollSlow.scrollDistance;

		TweenMax.to(window, scrollSlow.scrollTime, {
			scrollTo: {y: finalScroll, autoKill: true},
			ease: Expo.easeOut,
			overwrite: 5,
		});
  }
  const scrollSlow = new ScrollSlow(2, 3);

  // イベント
	window.addEventListener(scrollSlow.wheelEvent, scrollSlowEvent, {passive: true});

/**
 * Parallax
 */
	class Parallax {
		constructor(_delta = 5, _speed = 1, _item = '.parallaxWrap .parallaxItem') {
			this.delta = _delta;
			this.speed = _speed;
			this.item = document.querySelectorAll(_item);
			this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			this.scroll = 0;
			this.flag = false;
		}
		scrollValue() {
			this.scroll = window.pageYOffset || document.documentElement.scrollTop;
		}
		get animeFlag() {
			return this.flag;
		}
		set animeFlag(_val) {
			this.flag = _val ? _val : false;
		}
	}
	function parallaxEvent() {
		parallax.scrollValue();
		parallaxHandler(parallax.item, parallax.scroll);
	}
	function parallaxHandler(_elms, _scroll) {
		if (!parallax.animeFlag) {
			requestAnimationFrame(function() {
				parallax.animeFlag = false;

				_elms.forEach(function(_item) {
					let el = _item;
					let ratio = _item.dataset.parallax;
					// let rect = _item.getBoundingClientRect();
					// let scrollTop = parallax.scrollTop;
					// let itemTop = rect.top + scrollTop;
					// let offsetTop = _scroll + itemTop;
					let translateY = _scroll * ratio;
					// console.log('======================');
					// console.log(_scroll);
					// console.log(translateY);
					// console.log(offsetTop);
					// console.log(ratio);
					// console.log(parallax.delta);
					// console.log('======================');

					TweenMax.to(el, parallax.speed, {
						y: -translateY,
					});
				});
			});
			parallax.animeFlag = true;
		}
  }
  const parallax = new Parallax(5, 1, '.parallaxWrap .parallaxItem');

  // イベント
	window.addEventListener('scroll', parallaxEvent, {passive: true});
	window.addEventListener('DOMContentLoaded', parallaxEvent, {passive: true});
}
