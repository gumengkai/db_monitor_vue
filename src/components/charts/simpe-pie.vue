<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartSimplePie',
  props: [
    'value',
    'text'
  ],
  data () {
    return {
      dom: null }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    init () {
      let option = {
        title: {
          text: this.text,
          top: '85%',
          x: 'center',
          textStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#4d6f85'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} : ({d}%)'
        },
        series: [
          {
            name: this.text,
            center: [
              '50%',
              '50%'
            ],
            radius: [
              '49%',
              '50%'
            ],
            clockWise: false,
            hoverAnimation: false,
            type: 'pie',
            data: [{
              value: this.value,
              name: '',
              label: {
                normal: {
                  show: true,
                  formatter: '{d} %',
                  textStyle: {
                    fontSize: 15,
                    fontWeight: 'bold'
                  },
                  position: 'center'
                }
              },
              labelLine: {
                show: false
              },
              itemStyle: {
                normal: {
                  color: '#5886f0',
                  borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#00a2ff'
                  }, {
                    offset: 1,
                    color: '#70ffac'
                  }]),
                  borderWidth: 10
                },
                emphasis: {
                  color: '#5886f0',
                  borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#85b6b2'
                  }, {
                    offset: 1,
                    color: '#6d4f8d'
                  }]),
                  borderWidth: 10
                }
              }
            }, {
              name: ' ',
              value: 100 - this.value,
              itemStyle: {
                normal: {
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  color: 'rgba(0,0,0,0)',
                  borderColor: 'rgba(0,0,0,0)',
                  borderWidth: 0
                },
                emphasis: {
                  color: 'rgba(0,0,0,0)',
                  borderColor: 'rgba(0,0,0,0)',
                  borderWidth: 0
                }
              }
            }]

          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option, true)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
      on(window, 'resize', this.resize)
    })
  },
  watch: {
    value: {
      handler (newVal, oldVal) {
        this.init()
      },
      deep: true
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
