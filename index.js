/**
 * exports declaration
 */
module.exports = Animate;

/**
 * query dependency
 */
var query = require('query');

/**
 * private variables
 */
var kfs = {};
var sheet = (function createSheet(){
	var sheet = document.createElement('style');
	sheet.title = 'component-animation';
	sheet.type = 'text/css';
	query('head').appendChild(sheet);
    return document.styleSheets[document.styleSheets.length-1];
})();
var el;
var animations = [];

function Animate (selector){
	el = query(selector);
	return new animate;
};
function animate(){
	this.el = el;
};

animate.prototype.on = function(event, listener){
	event = this.propToCamel(event);
	this.el.addEventListener(event, listener, false);
	return this;
};

animate.prototype.off = function(event, listener){
	event = this.propToCamel(event);
	this.el.removeEventListener(event, listener, false);
	return this;
};

animate.prototype.start = function(){
	this
	.setProperty('animation', animations.join(','))
	.play();
	return this;
};

animate.prototype.play = function(){
	this.setProperty('animation-play-state', 'running');
	return this;
};

animate.prototype.pause = function(){
	this.setProperty('animation-play-state', 'paused');
	return this;
};

animate.prototype.clean = function(){
	animations = [];
	this.removeProperty('animation');
};

animate.prototype.set = function setAnimation(name, props, keyframe){
	if (typeof keyframe === 'object'){
		this.kf(name, keyframe);
	}
	if (typeof props === 'object'){
		props = (props.duration || '') + ' ' + (props['timing-function'] || '') + ' ' + (props.delay || '') + ' ' + (props['iteration-count'] || '') + ' ' + (props.direction || '');
	}
	var animation = name + ' ' + props;
	animations.push(animation);
	return this;
};

animate.prototype.removeProperty = function removeProperty(prop){
	el.style.removeProperty(this.getSupportedProperty(prop));
	return this;
};

animate.prototype.setProperty = function setProperty(prop, val){
	el.style.setProperty(this.getSupportedProperty(prop), val, '');
	return this;
};

animate.prototype.propToCamel = function propToCamel(prop){
	return this.prefix + prop.charAt(0).toUpperCase().replace(/-(\w)/g, RegExp.$1.toUpperCase()) + prop.slice(1);
};

animate.prototype.getSupportedProperty = function getSupportedProperty(prop){
	var style = el.style,
		capProp = prop.charAt(0).toUpperCase().replace(/-(\w)/g, RegExp.$1.toUpperCase()) + prop.slice(1),
		prefixes = [ "Moz", "Webkit", "O", "ms" ];
	if (prop in style) {
		return prop;
	} else if (this.prefix){
		return '-' + this.prefix + '-' + prop;
	} else {
		for (var i = prefixes.length - 1; i >= 0; i--) {
			var prefix = prefixes[i].toLowerCase();
			var vendorProp = prefix + capProp;
			if (vendorProp in style){
				this.prefix = prefix;
				return '-' + prefix + '-' + prop;
			}
		}
	}
};

animate.prototype.getPrefix = function getPrefix(prop) {
	var prefix = this.getSupportedProperty(prop).match(/-\w+-/);
	return prefix ? prefix[0] : '';
};

animate.prototype.setKeyframe = function setKeyframe(name, keyframe){
	if (kfs[name]) return this;
	var keyframeStr = '@' + this.getPrefix('animation') + 'keyframes ' + name + '  {';
	for (var i in keyframe){
		var percentage = keyframe[i];
		keyframeStr += i;
		if (i.indexOf('%') === -1 && i !== 'from' && i !== 'to'){
			keyframeStr += '%';
		}
		keyframeStr += ' { ';
		for(var j in percentage){
			keyframeStr += this.getSupportedProperty(j) + ':' + percentage[j] + '; ';
		}
		keyframeStr += ' }';
	}
	keyframeStr += '}';
	sheet.insertRule(keyframeStr, sheet.cssRules.length);
	kfs[name] = keyframeStr;
	return this;
} 
animate.prototype.kf = animate.prototype.setKeyframe;