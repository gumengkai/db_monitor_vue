<template>
  <div class="layout">
     <Layout>
       <linux-menu :value="'3'" :tags="this.Tags"></linux-menu>
            <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
               <Row :gutter="14">
          <Card>
            <DatePicker @on-change="handleDaterangechange" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
            <br>
            <chart-line4 style="height: 300px;" :title=chart1_title :data1="checktimeData" :data2="memfreeData" :data3="memcacheData" :data4="memusedData" :data5="membufferData"></chart-line4>
            <br>
            <chart-line2 style="height: 300px;" :title=chart2_title :data1="checktimeData" :data2="swapfreeData" :data3="swapusedData"></chart-line2>
            <br>
            <chart-line2 style="height: 300px;" :title=chart3_title :data1="checktimeData" :data2="swapinData" :data3="swapoutData"></chart-line2>
            <br>
            <chart-line4 style="height: 300px;" :title=chart4_title :data1="checktimeData" :data2="pageinData" :data3="pageoutData" :data4="pagefaultData" :data5="pagemjfaultData"></chart-line4>
          </Card>
    </Row>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { LinuxMenu } from '_c/top-menu'
import InforCard from '_c/info-card'
import { getLinuxStatHis } from '@/api/linux'
import { ChartPie, SimpleChartPie, ChartLine2, ChartLine4 } from '_c/charts'

export default {
  name: 'linux_view',
  components: {
    LinuxMenu,
    InforCard,
    SimpleChartPie,
    ChartLine2,
    ChartLine4,
    ChartPie
  },
  data () {
    return {
      Tags: '',
      end: 0,
      asynEndVal: 487,
      integratedEndVal: 3,
      data: [],
      linuxinfoList: [],
      linuxinfoData: [],
      checktimeData: [],
      membufferData: [],
      memcacheData: [],
      memfreeData: [],
      memusedData: [],
      swapusedData: [],
      swapfreeData: [],
      swapinData: [],
      swapoutData: [],
      pageinData: [],
      pageoutData: [],
      pagefaultData: [],
      pagemjfaultData: [],
      chart1_title: ['内存', 'free(mb)', 'cache(mb)', 'used(mb)', 'buffer(mb)'],
      chart2_title: ['SWAP使用量', 'swap free(mb)', 'swap used(mb)'],
      chart3_title: ['SWAP页面数', 'swap in', 'swap out'],
      chart4_title: ['PAGE', 'page_in', 'page_out', 'page_fault', 'page_mjfault'],
      daterangeValue: null,
      startTime: '',
      endTime: ''
    }
  },
  created () {
    this.get_linux_stat_his(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_linux_stat_his(`tags=${this.$route.params.tags} `)
    }, 1000 * 20)
  },
  methods: {
    init () {
    },
    get_linux_stat_his (parameter) {
      getLinuxStatHis(parameter).then(res => {
        this.linuxinfoList = res.data.results
        this.checktimeData = this.linuxinfoList.map(linux => linux.check_time)
        this.membufferData = this.linuxinfoList.map(linux => linux.mem_buffer)
        this.memcacheData = this.linuxinfoList.map(linux => linux.mem_cache)
        this.memfreeData = this.linuxinfoList.map(linux => linux.mem_free)
        this.memusedData = this.linuxinfoList.map(linux => linux.mem_used)
        this.swapusedData = this.linuxinfoList.map(linux => linux.swap_used)
        this.swapfreeData = this.linuxinfoList.map(linux => linux.swap_free)
        this.swapinData = this.linuxinfoList.map(linux => linux.swapin)
        this.swapoutData = this.linuxinfoList.map(linux => linux.swapout)
        this.pageinData = this.linuxinfoList.map(linux => linux.pgin)
        this.pageoutData = this.linuxinfoList.map(linux => linux.pgout)
        this.pagefaultData = this.linuxinfoList.map(linux => linux.pgfault)
        this.pagemjfaultData = this.linuxinfoList.map(linux => linux.pgmjfault)

        console.log(this.linuxinfo)
      }).catch(err => {
        this.$Message.error(`获取linux资源信息错误 ${err}`)
      })
    },
    handleDaterangechange (daterange) {
      this.daterangeValue = daterange
      this.startTime = daterange[0]
      this.endTime = daterange[1]
      this.get_linux_stat_his(`tags=${this.$route.params.tags}&start_time=${this.startTime}&end_time=${this.endTime}`)
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less">
@baseColor: ~"#dc9387";
.countto-page-row{
  height: 200px;
}
.count-to-con{
  display: block;
  width: 100%;
  text-align: center;
}
.count-text{
  font-size: 50px;
  color: @baseColor;
}
.slot-text{
  font-size: 22px;
}
.unit-class{
  font-size: 30px;
  color: @baseColor;
}
.layout-footer-center{
  text-align: center;
}
.count-style{
  font-size: 50px;
}
</style>
