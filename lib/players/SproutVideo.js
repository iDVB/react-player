'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _queryString = require('query-string');

var _loadScript = require('load-script');

var _loadScript2 = _interopRequireDefault(_loadScript);

var _Base2 = require('./Base');

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SDK_URL = 'http://c.sproutvideo.com/player_api.js';
var MATCH_URL = /((https?:\/\/(videos\.sproutvideo\.com\/embed\/.*|.*\.vids\.io\/videos\/.*)))/;
var DEFAULT_IFRAME_PARAMS = {
  api: 1,
  autoplay: 0,
  badge: 0,
  byline: 0,
  fullscreen: 1,
  portrait: 0,
  title: 0
};

var SproutVideo = function (_Base) {
  _inherits(SproutVideo, _Base);

  function SproutVideo() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SproutVideo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SproutVideo.__proto__ || Object.getPrototypeOf(SproutVideo)).call.apply(_ref, [this].concat(args))), _this), _this.ref = function (iframe) {
      _this.iframe = iframe;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SproutVideo, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      // const { onStart, onPause, onEnded } = this.props
      var url = this.props.url;
      this.load(url);
      this.loadingSDK = true;
      this.getSDK().then(function () {
        _this2.player = new SV.Player({ videoId: _this2.getID(url) });
        console.log(_this2.player);

        // this.player.bind('ready', onStart)
        // this.player.bind('play', this.play)
        // this.player.bind('pause', this.pause)
        // this.player.bind('seek', this.seekTo)
        // this.player.bind('volume', this.setVolume)
        // this.player.bind('end', onEnded)
        _this2.loadingSDK = false;
      });
    }
  }, {
    key: 'getSDK',
    value: function getSDK() {
      return new Promise(function (resolve, reject) {
        (0, _loadScript2['default'])(SDK_URL, function (err, script) {
          if (err) reject(err);
          resolve(script);
        });
      });
    }
  }, {
    key: 'getID',
    value: function getID(url) {
      var id = url.replace("https://klick.vids.io/videos/", "").replace("http://klick.vids.io/videos/", "").replace("https://videos.sproutvideo.com/embed/", "").replace("http://videos.sproutvideo.com/embed/", "");

      id = id.substr(0, id.indexOf('/'));

      return id;
    }
  }, {
    key: 'getIframeParams',
    value: function getIframeParams() {
      return _extends({}, DEFAULT_IFRAME_PARAMS, this.props);
    }
  }, {
    key: 'load',
    value: function load(url) {
      this.iframe.src = url;
    }
  }, {
    key: 'play',
    value: function play() {
      this.player.play();
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.player.pause();
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.iframe.src = '';
    }
  }, {
    key: 'seekTo',
    value: function seekTo(fraction) {
      this.player.seek(this.duration * fraction);
    }
  }, {
    key: 'setVolume',
    value: function setVolume(fraction) {
      this.player.volume(fraction);
    }
    // setPlaybackRate (rate) {
    //   this.player('setPlaybackRate', rate)
    // }

  }, {
    key: 'getDuration',
    value: function getDuration() {
      return null;
    }
  }, {
    key: 'getFractionPlayed',
    value: function getFractionPlayed() {
      return null;
    }
  }, {
    key: 'getFractionLoaded',
    value: function getFractionLoaded() {
      return null;
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
        allowFullScreen: fullscreen,
        className: 'sproutvideo-player'
      });
    }
  }], [{
    key: 'canPlay',
    value: function canPlay(url) {
      return MATCH_URL.test(url);
    }
  }]);

  return SproutVideo;
}(_Base3['default']);

SproutVideo.displayName = 'SproutVideo';
exports['default'] = SproutVideo;
module.exports = exports['default'];