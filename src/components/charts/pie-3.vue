<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)

export default {
  name: 'ChartPie',
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    init () {
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [{
          name: '健康度',
          type: 'pie',
          radius: '64%',
          center: ['50%', '50%'],
          clockwise: false,
          data: [{
            value: this.value[0],
            name: '正常'
          }, {
            value: this.value[2],
            name: '告警'
          }, {
            value: this.value[1],
            name: '危险'
          }],
          label: {
            normal: {
              textStyle: {
                color: '#999',
                fontSize: 12
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              borderWidth: 1,
              borderColor: '#ffffff'
            },
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }],
        color: [
          '#22d4bf',
          '#d4cda6',
          '#d45356'
        ],
        backgroundColor: '#fff'
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
    },
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    debugger
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
