'use strict';
import * as $ from 'jquery';
import * as autoprefixer from 'autoprefixer-core';
import {Promise} from 'es6-promise';

if (!global.document) throw new Error('cannot run animate, need a global document');

/**
 * private vars
 */
let generateSheet = () => {
  return $('<style/>', {
    class: 'animate',
    id: 'animate',
    type: 'text/css'
  }).appendTo('head')[0].sheet;
};
let prefix = (() => {
	let style = document.documentElement.style;
	let prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'];
	let prop = 'Animation';
	let normal = '';
	let dashed = normal;
	let supported = false;
	if (prop.toLowerCase() in style) {
		supported = true;
	} else {
		for (let i = 0; i < prefixes.length; i++) {
			normal = prefixes[i];
			var normalLow = normal.toLowerCase();
			var vendorProp = normalLow + prop;
			if (vendorProp in style) {
				dashed = ['-', normalLow, '-'].join('');
				supported = true;
				break;
			}
		}
	}
	if (!supported) throw new Error('CSS3 Animations are not supported in this browser. Animate library will not work.');
	return {normal, dashed};
})();
let kfs = [];
let sheet = generateSheet();
let eventPrefixes = ['webkit', 'moz', 'MS', 'o', ''];

class Animate {
	constructor(selector) {
		this.animations = [];
		return this.query(selector);
	}

  on(eventType, listener) {
    for (let p = 0; p < eventPrefixes.length; p++) {
      if (!eventPrefixes[p]) eventType = eventType.toLowerCase();
      let event = eventPrefixes[p] + eventType;
      this.$els.on(event, listener.bind(null, this));
    }
    return this;
  }

  off(eventType) {
    for (let p = 0; p < eventPrefixes.length; p++) {
      if (!eventPrefixes[p]) eventType = eventType.toLowerCase();
      let event = eventPrefixes[p] + eventType;
      this.$els.off(event);
    }
    return this;
  }

	kf(keyframe) {
		if (!keyframe) throw new Error('.kf expects a keyframe object');
		var name = keyframe.name;
		delete keyframe.name;
		if (!name) {
			name = 'keyframe-' + kfs.length;
		}
		let keyframeStr = '@' + prefix.dashed + 'keyframes ' + name + '  {';
		for (let keyframeProp in keyframe) {
			let keyframeValue = keyframe[keyframeProp];
			if (!Number.isNaN(keyframeProp) && keyframeProp >= 0 && keyframeProp <= 100){
				keyframeProp += '%';
			}
			if (typeof keyframeProp !== 'string') throw new Error('object key must be a string or number (0-100)');
			keyframeStr += keyframeProp;
      let css = ' { ';
			for (let prop in keyframeValue) {
				css += prop + ':' + keyframeValue[prop] + '; ';
			}
			css += ' }';
      keyframeStr += autoprefixer.process(css).css;
		}
		keyframeStr += '}';
		sheet.insertRule(keyframeStr, sheet.cssRules.length);
		kfs.push(name);
		return this;
	}

	keyframe(kf) {
		return this.kf(kf);
	}

	setKeyframe(keyframe) {
		return this.kf(keyframe);
	}

	set(...animationRules) {
		for (let i = 0; i < animationRules.length; i++) {
			let animationProperties = animationRules[i];
			if (typeof animationProperties === 'object') {
				animationProperties = $.extend({
					name: '',
					duration: '',
					timingFunction: '',
					delay: '',
					iterationCount: '',
					direction: '',
					fillMode: ''
				}, animationProperties);
				animationProperties = [animationProperties.name, animationProperties.duration, animationProperties.timingFunction, animationProperties.delay, animationProperties.iterationCount, animationProperties.direction, animationProperties.fillMode].join(' ');
			}
			if (typeof animationProperties !== 'string') throw new Error('.set expects a string or an animation object');
			this.animations.push(animationProperties);
		}
		return this;
	}

	query(selector) {
		this.$els = $(selector);
		return this;
	}

	reset() {
		this.animations = [];
		this.$els.css('animation', '');
		// reflow is needed for animation to restart properly
		this.$els.width();
    return this.off('AnimationIteration').off('AnimationEnd');
	}

  clean() {
    $('style.animate').remove();
    sheet = generateSheet();
    return this.reset();
  }

  pause() {
    this.$els.css('animation-play-state', 'paused');
    return this;
  }

	resume() {
		this.$els.css('animation-play-state', 'running');
		return this;
	}

	play() {
		this.$els.css('animation', this.animations.join(','));
		this.resume();
    return Promise.all(this.animations.map( () => {
      return new Promise(resolve => {
        this.on('AnimationEnd', resolve);
      });
    })).then( () => {
      return this.reset();
    });
	}

}

export default (selector) => {
	return new Animate(selector);
};
