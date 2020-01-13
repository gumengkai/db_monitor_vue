<template>
  <div class="layout">
     <Layout>
       <linux-menu :value="'2'" :tags="this.Tags" ></linux-menu>
            <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
               <Row>
                 <Card>
                 <Table size="small" border
               :columns="columns"
               :data="linuxdiskList">
                </Table>
                 </Card>
               </Row>
              <Card>
                <DatePicker @on-change="handleDaterangechange" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
              <row>
                <br>
             <i-col span="12">
            <chart-line2 style="height: 300px;" :title=chart1_title :data1="checktimeData" :data2="rdavgkbData" :data3="wravgkbData"></chart-line2>
            <br>
            <chart-line4 style="height: 300px;" :title=chart2_title :data1="checktimeData" :data2="rdrtData" :data3="wrrtData" :data4="qtimeData" :data5="stimeData"></chart-line4>
            <br>
            <chart-line5 style="height: 300px;" :title=chart3_title :data1="checktimeData" :data2="rdmrgsData" :data3="wrmrgsData" :data4="iosData" :data5="rdsData" :data6="wrsData"></chart-line5>
              </i-col>
                 <i-col span="12">
            <chart-line2 style="height: 300px;" :title=chart4_title :data1="checktimeData" :data2="rdmsData" :data3="wrmsData"></chart-line2>
            <br>
            <chart-line4 style="height: 300px;" :title=chart5_title :data1="checktimeData" :data2="busyData" :data3="rdcncdData" :data4="wrcncdData" :data5="inprgData"></chart-line4>
              </i-col>
              </Row>
                 </Card>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { LinuxMenu } from '_c/top-menu'
import InforCard from '_c/info-card'
import { formatDate } from '@/libs/tools'
import { getLinuxDisk, getLinuxIoStatHis } from '@/api/linux'
import { ChartPie, SimpleChartPie, ChartLine2, ChartLine4, ChartLine5 } from '_c/charts'
import { Tag } from 'iview'

export default {
  name: 'linux_view',
  components: {
    LinuxMenu,
    InforCard,
    SimpleChartPie,
    ChartLine2,
    ChartLine4,
    ChartLine5,
    ChartPie
  },
  data () {
    return {
      Tags: '',
      end: 0,
      asynEndVal: 487,
      integratedEndVal: 3,
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: 'IP地址',
          key: 'host',
          width: 120,
          sortable: true
        },
        {
          title: '挂载点',
          key: 'mount_point',
          width: 100
        },
        {
          title: '目录大小(GB)',
          key: 'total_size',
          width: 120
        },
        {
          title: '使用空间(GB)',
          key: 'used_size',
          width: 120
        },
        {
          title: '剩余空间(GB)',
          key: 'free_size',
          width: 120
        },
        {
          title: '使用率',
          key: 'used_percent',
          width: 100,
          render: (h, params) => {
            const used_percent = params.row.used_percent
            if (used_percent >= 95) {
              return h(Tag, { props: { color: 'error' } }, used_percent + '%')
            }
            if (used_percent >= 85) {
              return h(Tag, { props: { color: 'warning' } }, used_percent + '%')
            }
            if (used_percent === null) {
              return null
            } else {
              return h(Tag, { props: { color: 'success' } }, used_percent + '%')
            }
          }
        },
        {
          title: '设备',
          key: 'dev',
          width: 100
        },
        {
          title: '采集时间',
          key: 'check_time',
          width: 140,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.check_time), 'yyyy-MM-dd hh:mm')
            )
          }
        }
      ],
      linuxdiskList: [],
      linuxiostatlist: [],
      checktimeData: [],
      rdsData: [],
      rdavgkbData: [],
      rdmsData: [],
      rdmrgsData: [],
      rdcncdData: [],
      rdrtData: [],
      wrsData: [],
      wravgkbData: [],
      wrmsData: [],
      wrmrgsData: [],
      wrcncdData: [],
      wrrtData: [],
      busyData: [],
      inprgData: [],
      iosData: [],
      qtimeData: [],
      stimeData: [],
      chart1_title: ['IO请求平均大小', '读请求平均大小', '写请求平均大小'],
      chart2_title: ['IO响应时间', '读响应时间', '写响应时间', 'IO请求队列时间', 'IO请求服务时间'],
      chart3_title: ['IO请求数', '每秒读合并数', '每秒写合并数', 'ios', '每秒读请求数', '每秒写请求数'],
      chart4_title: ['IO吞吐量', '每秒读(MB)', '每秒写(MB)'],
      chart5_title: ['磁盘繁忙度', '%util', '读并发数', '写并发数', '排队请求数'],
      daterangeValue: null,
      startTime: '',
      endTime: ''
    }
  },
  created () {
    this.get_linux_disk(`tags=${this.$route.params.tags} `)
    this.get_linux_io_stat_his(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_linux_disk(`tags=${this.$route.params.tags} `)
      this.get_linux_io_stat_his(`tags=${this.$route.params.tags} `)
    }, 1000 * 20)
  },
  methods: {
    init () {
    },
    get_linux_disk (parameter) {
      getLinuxDisk(parameter).then(res => {
        this.linuxdiskList = res.data.results
        console.log(this.linuxdiskList)
      }).catch(err => {
        this.$Message.error(`获取linux磁盘使用率信息错误 ${err}`)
      })
    },
    get_linux_io_stat_his (parameter) {
      getLinuxIoStatHis(parameter).then(res => {
        this.linuxiostatlist = res.data.results
        this.checktimeData = this.linuxiostatlist.map(linux => linux.check_time)
        this.rdsData = this.linuxiostatlist.map(linux => linux.rd_s)
        this.rdavgkbData = this.linuxiostatlist.map(linux => linux.rd_avgkb)
        this.rdmsData = this.linuxiostatlist.map(linux => linux.rd_m_s)
        this.rdmrgsData = this.linuxiostatlist.map(linux => linux.rd_mrg_s)
        this.rdcncdData = this.linuxiostatlist.map(linux => linux.rd_cnc)
        this.rdrtData = this.linuxiostatlist.map(linux => linux.rd_rt)
        this.wrsData = this.linuxiostatlist.map(linux => linux.wr_s)
        this.wravgkbData = this.linuxiostatlist.map(linux => linux.wr_avgkb)
        this.wrmsData = this.linuxiostatlist.map(linux => linux.wr_m_s)
        this.wrmrgsData = this.linuxiostatlist.map(linux => linux.wr_mrg_s)
        this.wrcncdData = this.linuxiostatlist.map(linux => linux.wr_cnc)
        this.wrrtData = this.linuxiostatlist.map(linux => linux.wr_rt)
        this.busyData = this.linuxiostatlist.map(linux => linux.busy)
        this.inprgData = this.linuxiostatlist.map(linux => linux.in_prg)
        this.iosData = this.linuxiostatlist.map(linux => linux.io_s)
        this.qtimeData = this.linuxiostatlist.map(linux => linux.qtime)
        this.stimeData = this.linuxiostatlist.map(linux => linux.stime)
        console.log(this.linuxinfo)
      }).catch(err => {
        this.$Message.error(`获取linux IO信息错误 ${err}`)
      })
    },
    handleDaterangechange (daterange) {
      this.daterangeValue = daterange
      this.startTime = daterange[0]
      this.endTime = daterange[1]
      this.get_linux_io_stat_his(`tags=${this.$route.params.tags}&start_time=${this.startTime}&end_time=${this.endTime}`)
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
