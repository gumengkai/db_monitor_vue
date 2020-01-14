<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  props: {
    show: String,
    title: Array,
    data1: Array,
    data2: Array,
    text: String
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    init () {
      let xAxisData = this.data1
      let seriesData1 = this.data2
      let option = {
        title: {
          text: this.title[0],
          subtext: '',
          left: 'center',
          bottom: '5%'
        },
        color: ['#42917c'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: this.title
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.title[0],
            type: 'bar',
            barWidth: '60%',
            data: seriesData1
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
    data1: {
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
