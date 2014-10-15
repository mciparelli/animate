var _slice = Array.prototype.slice;
'use strict';
var $ = require('jquery');
var autoprefixer = require('autoprefixer-core');
var Promise = require('es6-promise').Promise;

if (!global.document) throw new Error('cannot run animate, need a global document');

/**
 * private vars
 */
var _generateSheet = function() {
  return $('<style/>', {
    class: 'animate',
    id: 'animate',
    type: 'text/css'
  }).appendTo('head')[0].sheet;
};
var _prefix = (function() {
	var _style = document.documentElement.style;
	var _prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'];
	var _prop = 'Animation';
	var _normal = '';
	var _dashed = _normal;
	var _supported = false;
	if (_prop.toLowerCase() in _style) {
		_supported = true;
	} else {
		for (var _i = 0; _i < _prefixes.length; _i++) {
			_normal = _prefixes[_i];
			var normalLow = _normal.toLowerCase();
			var vendorProp = normalLow + _prop;
			if (vendorProp in _style) {
				_dashed = ['-', normalLow, '-'].join('');
				_supported = true;
				break;
			}
		}
	}
	if (!_supported) throw new Error('CSS3 Animations are not supported in this browser. Animate library will not work.');
	return {normal: _normal, dashed: _dashed};
})();
var _kfs = [];
var _sheet = _generateSheet();
var _eventPrefixes = ['webkit', 'moz', 'MS', 'o', ''];

var Animate = function(_eventPrefixes) {
    return function(_sheet) {
        return function(_kfs) {
            return function(_prefix) {
                return function(_generateSheet) {
                    return function() {
                        var Animate = function Animate(selector) {
                            this.animations = [];
                            return this.query(selector);
                        };

                        Object.defineProperties(Animate.prototype, {
                            on: {
                                writable: true,

                                value: function(eventType, listener) {
                                  for (var _p = 0; _p < _eventPrefixes.length; _p++) {
                                    if (!_eventPrefixes[_p]) eventType = eventType.toLowerCase();
                                    var _event = _eventPrefixes[_p] + eventType;
                                    this.$els.on(_event, listener.bind(null, this));
                                  }
                                  return this;
                                }
                            },

                            off: {
                                writable: true,

                                value: function(eventType) {
                                  for (var _p2 = 0; _p2 < _eventPrefixes.length; _p2++) {
                                    if (!_eventPrefixes[_p2]) eventType = eventType.toLowerCase();
                                    var _event2 = _eventPrefixes[_p2] + eventType;
                                    this.$els.off(_event2);
                                  }
                                  return this;
                                }
                            },

                            kf: {
                                writable: true,

                                value: function(keyframe) {
                                    if (!keyframe) throw new Error('.kf expects a keyframe object');
                                    var name = keyframe.name;
                                    delete keyframe.name;
                                    if (!name) {
                                        name = 'keyframe-' + _kfs.length;
                                    }
                                    var _keyframeStr = '@' + _prefix.dashed + 'keyframes ' + name + '  {';
                                    for (var _keyframeProp in keyframe) {
                                        var _keyframeValue = keyframe[_keyframeProp];
                                        if (!Number.isNaN(_keyframeProp) && _keyframeProp >= 0 && _keyframeProp <= 100){
                                            _keyframeProp += '%';
                                        }
                                        if (typeof _keyframeProp !== 'string') throw new Error('object key must be a string or number (0-100)');
                                        _keyframeStr += _keyframeProp;
                                  var _css = ' { ';
                                        for (var _prop2 in _keyframeValue) {
                                            _css += _prop2 + ':' + _keyframeValue[_prop2] + '; ';
                                        }
                                        _css += ' }';
                                  _keyframeStr += autoprefixer.process(_css).css;
                                    }
                                    _keyframeStr += '}';
                                    _sheet.insertRule(_keyframeStr, _sheet.cssRules.length);
                                    _kfs.push(name);
                                    return this;
                                }
                            },

                            keyframe: {
                                writable: true,

                                value: function(kf) {
                                    return this.kf(kf);
                                }
                            },

                            setKeyframe: {
                                writable: true,

                                value: function(keyframe) {
                                    return this.kf(keyframe);
                                }
                            },

                            set: {
                                writable: true,

                                value: function() {
                                    var animationRules = _slice.call(arguments);
                                    for (var _i2 = 0; _i2 < animationRules.length; _i2++) {
                                        var _animationProperties = animationRules[_i2];
                                        if (typeof _animationProperties === 'object') {
                                            _animationProperties = $.extend({
                                                name: '',
                                                duration: '',
                                                timingFunction: '',
                                                delay: '',
                                                iterationCount: '',
                                                direction: '',
                                                fillMode: ''
                                            }, _animationProperties);
                                            _animationProperties = [_animationProperties.name, _animationProperties.duration, _animationProperties.timingFunction, _animationProperties.delay, _animationProperties.iterationCount, _animationProperties.direction, _animationProperties.fillMode].join(' ');
                                        }
                                        if (typeof _animationProperties !== 'string') throw new Error('.set expects a string or an animation object');
                                        this.animations.push(_animationProperties);
                                    }
                                    return this;
                                }
                            },

                            query: {
                                writable: true,

                                value: function(selector) {
                                    this.$els = $(selector);
                                    return this;
                                }
                            },

                            reset: {
                                writable: true,

                                value: function() {
                                    this.animations = [];
                                    this.$els.css('animation', '');
                                    // reflow is needed for animation to restart properly
                                    this.$els.width();
                                return this.off('AnimationIteration').off('AnimationEnd');
                                }
                            },

                            clean: {
                                writable: true,

                                value: function() {
                                  $('style.animate').remove();
                                  _sheet = _generateSheet();
                                  return this.reset();
                                }
                            },

                            pause: {
                                writable: true,

                                value: function() {
                                  this.$els.css('animation-play-state', 'paused');
                                  return this;
                                }
                            },

                            resume: {
                                writable: true,

                                value: function() {
                                    this.$els.css('animation-play-state', 'running');
                                    return this;
                                }
                            },

                            play: {
                                writable: true,

                                value: function() {
                                    var _this = this;
                                    this.$els.css('animation', this.animations.join(','));
                                    this.resume();
                                    return Promise.all(this.animations.map( function() {
                                      return new Promise(function(resolve) {
                                        _this.on('AnimationEnd', resolve);
                                      });
                                    })).then( function() {
                                      return _this.reset();
                                    });
                                }
                            }
                        });

                        return Animate;
                    };
                };
            };
        };
    };
}(_eventPrefixes)(_sheet)(_kfs)(_prefix)(_generateSheet)();

exports.default = function(selector) {
	return new Animate(selector);
};
