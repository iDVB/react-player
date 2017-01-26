import React from 'react'
import { stringify } from 'query-string'
import loadScript from 'load-script'

import Base from './Base'

const SDK_URL = 'http://c.sproutvideo.com/player_api.js'
const MATCH_URL = /((https?:\/\/(videos\.sproutvideo\.com\/embed\/.*|.*\.vids\.io\/videos\/.*)))/
const DEFAULT_IFRAME_PARAMS = {
  api: 1,
  autoplay: 0,
  badge: 0,
  byline: 0,
  fullscreen: 1,
  portrait: 0,
  title: 0
}

export default class SproutVideo extends Base {
  static displayName = 'SproutVideo'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  componentDidMount () {
    // const { onStart, onPause, onEnded } = this.props
    const url = this.props.url
    this.load(url)
    this.loadingSDK = true
    this.getSDK().then(() => {
      this.player = new SV.Player({videoId: this.getID(url)})
      console.log(this.player);

      // this.player.bind('ready', onStart)
      // this.player.bind('play', this.play)
      // this.player.bind('pause', this.pause)
      // this.player.bind('seek', this.seekTo)
      // this.player.bind('volume', this.setVolume)
      // this.player.bind('end', onEnded)
      this.loadingSDK = false
    })
  }
  getSDK () {
    return new Promise((resolve, reject) => {
      loadScript(SDK_URL, (err, script) => {
        if (err) reject(err)
        resolve(script)
      })
    })
  }
  getID (url) {
    let id = url
                .replace("https://klick.vids.io/videos/", "")
                .replace("http://klick.vids.io/videos/", "")
                .replace("https://videos.sproutvideo.com/embed/", "")
                .replace("http://videos.sproutvideo.com/embed/", "")
    
    id = id.substr(0, id.indexOf('/'))

    return id
  }
  getIframeParams () {
    return { ...DEFAULT_IFRAME_PARAMS, ...this.props }
  }
  load (url) {
    this.iframe.src = url
  }
  play () {
    this.player.play()
  }
  pause () {
    this.player.pause()
  }
  stop () {
    this.iframe.src = ''
  }
  seekTo (fraction) {
    this.player.seek(this.duration * fraction)
  }
  setVolume (fraction) {
    this.player.volume(fraction)
  }
  // setPlaybackRate (rate) {
  //   this.player('setPlaybackRate', rate)
  // }
  getDuration () {
    return null
  }
  getFractionPlayed () {
    return null
  }
  getFractionLoaded () {
    return null
  }
  ref = iframe => {
    this.iframe = iframe
  }
  render () {
    const { fullscreen } = this.getIframeParams()
    const style = {
      display: this.props.url ? 'block' : 'none',
      width: '100%',
      height: '100%'
    }
    return (
      <iframe
        ref={this.ref}
        frameBorder='0'
        style={style}
        allowFullScreen={fullscreen}
        className="sproutvideo-player"
      />
    )
  }
}
