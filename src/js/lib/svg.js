import {TweenMax, Power1, TimelineMax} from 'gsap/TweenMax';

export default function() {
	// セレクター関数
	function select(s) {
		return document.querySelector(s);
	}
	function selectAll(s) {
		return document.querySelectorAll(s);
	}

	// 各svgパーツを取得
	const svg = select('#svg-anime'),
		svgillust = select('.svgillust'),
		note_base1 = select('.note_base1'),
		note_base2 = select('.note_base2'),
		note_memo1 = select('.note_memo1'),
		note_memo2 = select('.note_memo2'),
		note_display = select('.note_display'),
		note_displayflow = select('.note_displayflow'),
		note_graph = selectAll('.note_graph path'),
		note_keyboard = selectAll('.note_keyboard path'),
		paper_base = select('.paper_base'),
		paper_title = selectAll('.paper_title polygon'),
		paper_list = selectAll('.paper_list polygon'),
		iphone_base = select('.iphone_base'),
		iphone_display = select('.iphone_display'),
		iphone_displayflow = select('.iphone_displayflow'),
		iphone_graph = selectAll('.iphone_graph path');

	// 中心を合わせる
  TweenMax.set([
      note_base1,
      note_base2,
      note_memo1,
      note_memo2,
      note_display,
      note_displayflow,
      note_graph,
      note_keyboard,
      paper_base,
      paper_title,
      paper_list,
      iphone_base,
      iphone_display,
      iphone_displayflow,
      iphone_graph
    ], {
		transformOrigin: '50% 50%',
	});

	// 設定が終わったら表示用class付与
	svg.classList.add('active');

	//ノートパソコンのアニメーション設定
	var timeline_note = new TimelineMax({
		repeat: 0,
		delay: 1,
		yoyo: false,
		paused: false,
	});
	timeline_note
		.from(note_base1, 0.3, {scale: 0, ease: Power1.easeOut})
		.from(note_base2, 0.3, {scale: 0, ease: Power1.easeOut})
		.from(note_display, 0.1, {opacity: 0, ease: Power1.easeOut})
		.from(note_memo1, 0.3, {scale: 0, ease: Power1.easeOut})
		.from(note_memo2, 0.3, {scale: 0, ease: Power1.easeOut})
		.staggerFrom(note_keyboard, 0.2, {scale: 0}, 0.01)
		.from(note_displayflow, 0.3, {scale: 0, ease: Power1.easeOut})
		.staggerFrom(note_graph, 0.2, {scale: 0}, 0.01);

	//紙のアニメーション設定
	var timeline_paper = new TimelineMax({
		repeat: 0,
		delay: 1,
		yoyo: false,
		paused: false,
	});
	timeline_paper
		.from(paper_base, 0.3, {scale: 0, ease: Power1.easeOut})
		.staggerFrom(paper_title, 0.3, {scale: 0}, 0.1)
		.staggerFrom(paper_list, 0.3, {scale: 0}, 0.01);

	//iPhoneのアニメーション設定
	var timeline_iphone = new TimelineMax({
		repeat: 0,
		delay: 1.5,
		yoyo: false,
		paused: false,
	});
	timeline_iphone
		.from(iphone_base, 0.3, {scale: 0, ease: Power1.easeOut})
		.from(iphone_display, 0.1, {opacity: 0, ease: Power1.easeOut})
		.from(iphone_displayflow, 0.1, {scale: 0, ease: Power1.easeOut})
		.staggerFrom(iphone_graph, 0.2, {scale: 0}, 0.1);

	//イラスト全体のアニメーション設定
	var timeline = new TimelineMax({
		repeat: -1,
		delay: 1,
		yoyo: true,
		paused: false,
	});
	timeline.from(svgillust, 2, {y: 20, ease: Power1.easeInOut});
}
