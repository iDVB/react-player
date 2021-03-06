'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _queryString = require('query-string');

var _Base2 = require('./Base');

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IFRAME_SRC = 'https://player.vimeo.com/video/';
var MATCH_URL = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
var MATCH_MESSAGE_ORIGIN = /^https?:\/\/player.vimeo.com/;
var BLANK_VIDEO_URL = 'https://vimeo.com/127250231';
var DEFAULT_IFRAME_PARAMS = {
  api: 1,
  autoplay: 0,
  badge: 0,
  byline: 0,
  fullscreen: 1,
  portrait: 0,
  title: 0
};

var Vimeo = function (_Base) {
  _inherits(Vimeo, _Base);

  function Vimeo() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Vimeo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Vimeo.__proto__ || Object.getPrototypeOf(Vimeo)).call.apply(_ref, [this].concat(args))), _this), _this.onMessage = function (e) {
      if (!MATCH_MESSAGE_ORIGIN.test(e.origin)) return;
      _this.origin = _this.origin || e.origin;
      var data = JSON.parse(e.data);
      if (data.event === 'ready') {
        _this.postMessage('getDuration');
        _this.postMessage('addEventListener', 'playProgress');
        _this.postMessage('addEventListener', 'loadProgress');
        _this.postMessage('addEventListener', 'play');
        _this.postMessage('addEventListener', 'pause');
        _this.postMessage('addEventListener', 'finish');
      }
      if (data.event === 'playProgress') _this.fractionPlayed = data.data.percent;
      if (data.event === 'loadProgress') _this.fractionLoaded = data.data.percent;
      if (data.event === 'play') _this.onPlay();
      if (data.event === 'pause') _this.props.onPause();
      if (data.event === 'finish') _this.onEnded();
      if (data.method === 'getDuration') {
        _this.duration = data.value; // Store for use later
        _this.onReady();
      }
    }, _this.onEnded = function () {
      var _this$props = _this.props,
          loop = _this$props.loop,
          onEnded = _this$props.onEnded;

      if (loop) {
        _this.seekTo(0);
      }
      onEnded();
    }, _this.postMessage = function (method, value) {
      if (!_this.origin) return;
      var data = JSON.stringify({ method: method, value: value });
      return _this.iframe.contentWindow && _this.iframe.contentWindow.postMessage(data, _this.origin);
    }, _this.ref = function (iframe) {
      _this.iframe = iframe;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Vimeo, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          url = _props.url,
          vimeoConfig = _props.vimeoConfig;

      window.addEventListener('message', this.onMessage, false);

      if (!url && vimeoConfig.preload) {
        this.preloading = true;
        this.load(BLANK_VIDEO_URL);
      }

      _get(Vimeo.prototype.__proto__ || Object.getPrototypeOf(Vimeo.prototype), 'componentDidMount', this).call(this);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('message', this.onMessage, false);
      _get(Vimeo.prototype.__proto__ || Object.getPrototypeOf(Vimeo.prototype), 'componentWillUnmount', this).call(this);
    }
  }, {
    key: 'getIframeParams',
    value: function getIframeParams() {
      return _extends({}, DEFAULT_IFRAME_PARAMS, this.props.vimeoConfig.iframeParams);
    }
  }, {
    key: 'load',
    value: function load(url) {
      var id = url.match(MATCH_URL)[3];
      this.iframe.src = IFRAME_SRC + id + '?' + (0, _queryString.stringify)(this.getIframeParams());
    }
  }, {
    key: 'play',
    value: function play() {
      this.postMessage('play');
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.postMessage('pause');
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.iframe.src = '';
    }
  }, {
    key: 'seekTo',
    value: function seekTo(fraction) {
      _get(Vimeo.prototype.__proto__ || Object.getPrototypeOf(Vimeo.prototype), 'seekTo', this).call(this, fraction);
      this.postMessage('seekTo', this.duration * fraction);
    }
  }, {
    key: 'setVolume',
    value: function setVolume(fraction) {
      this.postMessage('setVolume', fraction);
    }
  }, {
    key: 'setPlaybackRate',
    value: function setPlaybackRate(rate) {
      this.postMessage('setPlaybackRate', rate);
    }
  }, {
    key: 'getDuration',
    value: function getDuration() {
      return this.duration;
    }
  }, {
    key: 'getFractionPlayed',
    value: function getFractionPlayed() {
      return this.fractionPlayed || null;
    }
  }, {
    key: 'getFractionLoaded',
    value: function getFractionLoaded() {
      return this.fractionLoaded || null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _getIframeParams = this.getIframeParams(),
          fullscreen = _getIframeParams.fullscreen;

      var style = {
        display: this.props.url ? 'block' : 'none',
        width: '100%',
        height: '100%'
      };
      return _react2['default'].createElement('iframe', {
        ref: this.ref,
        frameBorder: '0',
        style: style,
        allowFullScreen: fullscreen
      });
    }
  }], [{
    key: 'canPlay',
    value: function canPlay(url) {
      return MATCH_URL.test(url);
    }
  }]);

  return Vimeo;
}(_Base3['default']);

Vimeo.displayName = 'Vimeo';
exports['default'] = Vimeo;
module.exports = exports['default'];