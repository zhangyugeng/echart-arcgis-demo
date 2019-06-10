import { throttle } from 'lodash'

export default function (declare, lang, Point, ScreenPoint) {
  return declare('Echarts3Layer', null, {
    name: 'Echarts3Layer',
    _map: null,
    _ec: null, // echart
    _geoCoord: [],
    _option: null,
    _mapOffset: [0, 0],
    constructor (map, ec) {
      this._map = ec
      const div = (this._echartsContainer = document.createElement('div'))
      div.style.position = 'absolute'
      div.style.height = map.height + 'px'
      div.style.width = map.width + 'px'
      div.style.top = '0'
      div.style.left = '0'
      map.__container.appendChild(div)
      // document.getElementById('viewDiv').appendChild(div)
      this._init(map, ec)
    },
    _init (map, ec) {
      const overlay = this
      overlay._map = map
      overlay._ec = ec
      overlay.getEchartsContainer = () => overlay._echartsContainer
      overlay.getMap = () => overlay._map
      overlay.geoCoord2Pixel = e => {
        const t = new Point(e[0], e[1])
        const i = overlay._map.toScreen(t)
        return [i.x, i.y]
      }
      overlay.pixel2GeoCoord = e => {
        debugger
        const t = overlay._map.toMap(new ScreenPoint(e[0], e[1]))
        return [t.lng, t.lat]
      }
      overlay.initECharts = (...args) => {
        overlay._ec = ec.init.apply(ec, args) // 初始化echart   apply应用  apply劫持对象的方法
        overlay._bindEvent()
        return overlay._ec
      }
      overlay.getECharts = () => {
        return overlay._ec
      }
      overlay.setOption = (options, notMerge) => {
        overlay._option = options
        overlay._ec.setOption(options, notMerge)
        // eslint-disable-next-line
        overlay._ec._coordSysMgr._coordinateSystems[0].__proto__.dataToPoint = coord => {
          const t = new Point(coord[0], coord[1])
          ScreenPoint = overlay._map.toScreen(t)
          return [ScreenPoint.x, ScreenPoint.y]
        }
      }
      overlay._bindEvent = () => {
        overlay._map.on('zoom-end', () => {
          overlay._ec.resize()
          overlay._echartsContainer.style.visibility = 'visible'
        })
        overlay._map.on('zoom-start', () => {
          overlay._echartsContainer.style.visibility = 'hidden'
        })
        overlay._map.on('pan', () => {
          overlay._echartsContainer.style.visibility = 'hidden'
        })
        overlay._map.on('pan-end', () => {
          overlay._ec.resize()
          overlay._echartsContainer.style.visibility = 'visible'
        })
        overlay._map.on('resize', () => {
          const content =
            overlay._echartsContainer.parentNode.parentNode.parentNode
          overlay._mapOffset = [
            -parseInt(content.style.left, 10) || 0,
            -parseInt(content.style.top, 10) || 0
          ]
          overlay._echartsContainer.style.left = overlay._mapOffset[0] + 'px'
          overlay._echartsContainer.style.top = overlay._mapOffset[1] + 'px'
          setTimeout(() => {
            overlay._map.resize()
            overlay._map.reposition()
            overlay._ec.resize()
          }, 200)
          overlay._echartsContainer.style.visibility = 'visible'
        })
        // let _lastStableScale = overlay._map.getScale()
        // overlay._map.root.addEventListener('gesturestart', () => {
        //   _lastStableScale = overlay._map.getScale()
        // })
        // overlay._map.root.addEventListener('gesturechange', e => {
        //   const scale = 1 / e.scale
        //   const flag = e.scale > 1 ? 0.5 : 2
        //   overlay._map.setScale(_lastStableScale * scale * flag)
        // })
        overlay._ec.getZr().on('dragstart', () => {})
        overlay._ec.getZr().on('dragend', () => {})
        overlay._ec.getZr().on('touchstart', e => {
          if (e.event.targetTouches.length === 2) {
            const [x1, x2, y1, y2] = [
              e.event.targetTouches[0].pageX,
              e.event.targetTouches[1].pageX,
              e.event.targetTouches[0].pageY,
              e.event.targetTouches[1].pageY
            ]
            overlay._touchC = Math.sqrt(
              (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)
            )
          }
        })
        overlay._ec.getZr().on('touchend', e => {
          if (e.event.targetTouches.length === 2) {
            const [x1, x2, y1, y2] = [
              e.event.targetTouches[0].pageX,
              e.event.targetTouches[1].pageX,
              e.event.targetTouches[0].pageY,
              e.event.targetTouches[1].pageY
            ]

            const touchC = Math.sqrt(
              (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)
            )
            const gismap = overlay._map
            if (touchC > overlay._touchC) {
              gismap.setZoom(gismap.getZoom() + 1)
            } else {
              gismap.setZoom(gismap.getZoom() - 1)
            }
            overlay._touchC = 0
          }
        })
        // const zoomin = e => {
        //   const dt = e.wheelDelta
        //   if (dt < 0 && overlay._map.getScale() >= 20000000) {
        //     return
        //   }
        //   overlay._map._extentUtil({
        //     numLevels: dt > 0 ? 1 : -1
        //   })
        // }

        // overlay._ec.getZr().on(
        //   'mousewheel',
        //   throttle(zoomin, 250, {
        //     leading: true
        //   })
        // )
      }
    }
  })
}
