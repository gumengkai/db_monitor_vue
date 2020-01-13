<template>
  <div class="layout">
     <Layout>
       <linux-menu :value="'1'" :tags="this.Tags" ></linux-menu>
            <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
               <Row>
      <i-col span="9">
        <card>
          <Alert show-icon>
             主机信息
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
         </Alert>
          <Table size="small" :show-header="false" :columns="columns1" :data="linuxinfoData"></Table>
        </card>
        <card>
          <Alert show-icon>
             磁盘使用率
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
         </Alert>
          <Table size="small" :columns="columnsDisk" :data="linuxdiskList"></Table>
        </card>
        <card>
          <Alert show-icon>
             告警
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
         </Alert>
          <Table size="small" :columns="columnsAlarm" :data="alarmData"></Table>
        </card>
      </i-col>
    <i-col span="15">
        <i-col span="8">
          <Card>
            <simple-chart-pie style="height: 150px;" :value="cpuusedData" text="CPU使用率"></simple-chart-pie>
          </Card>
        </i-col>
         <i-col span="8">
          <Card>
            <simple-chart-pie style="height: 150px;" :value="memusedData" text="内存使用率"></simple-chart-pie>
          </Card>
        </i-col>
        <i-col span="8">
          <Card>
            <simple-chart-pie style="height: 150px;" :value="loadData" text="LOAD负载"></simple-chart-pie>
          </Card>
        </i-col>
       </i-col>
           <i-col span="15">
          <Card>
            <DatePicker @on-change="handleDaterangechange" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
            <br>
            <chart-line1 style="height: 200px;" :title=chart1_title :data1="checktimeData" :data2="cpuData"></chart-line1>
            <br>
            <chart-line1 style="height: 200px;" :title=chart2_title :data1="checktimeData" :data2="memData"></chart-line1>
            <br>
            <chart-line2 style="height: 200px;" :title=chart3_title :data1="checktimeData" :data2="readmbData" :data3="writembData"></chart-line2>
          </Card>
        </i-col>
    </Row>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { LinuxMenu } from '_c/top-menu'
import InforCard from '_c/info-card'
import { getLinuxStat, getLinuxStatHis, getLinuxDisk } from '@/api/linux'
import { getAlarmInfo } from '@/api/system'
import { ChartPie, SimpleChartPie, ChartLine1, ChartLine2 } from '_c/charts'
import { Tag } from 'iview'

export default {
  name: 'linux_view',
  components: {
    LinuxMenu,
    InforCard,
    SimpleChartPie,
    ChartLine1,
    ChartLine2,
    ChartPie
  },
  data () {
    return {
      Tags: '',
      end: 0,
      asynEndVal: 487,
      integratedEndVal: 3,
      data: [],
      linuxinfo: [],
      linuxinfoList: [],
      linuxdiskList: [],
      alarmData: [],
      columns1: [
        {
          title: 'column1',
          key: 'column1'
        },
        {
          title: 'column2',
          key: 'column2'
        }
      ],
      columnsDisk: [
        {
          title: '磁盘',
          key: 'mount_point',
          width: 100
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
          title: '剩余空间(mb)',
          key: 'free_size',
          width: 120
        }
      ],
      columnsAlarm: [
        {
          title: '告警内容',
          key: 'alarm_content',
          width: 250
        },
        {
          title: '告警时间',
          key: 'alarm_header',
          width: 140,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.alarm_time), 'yyyy-MM-dd hh:mm')
            )
          }
        }
      ],
      linuxinfoData: [],
      cpuusedData: 50,
      memusedData: 50,
      loadData: 50,
      checktimeData: [],
      cpuData: [],
      memData: [],
      readmbData: [],
      writembData: [],
      chart1_title: ['CPU', 'CPU使用率'],
      chart2_title: ['内存', '内存使用率'],
      chart3_title: ['磁盘IO', 'readmb', 'writemb'],
      daterangeValue: null,
      startTime: '',
      endTime: ''
    }
  },
  created () {
    this.get_linux_stat(`tags=${this.$route.params.tags} `)
    this.get_linux_stat_his(`tags=${this.$route.params.tags} `)
    this.get_linux_disk(`tags=${this.$route.params.tags} `)
    this.get_alarm_info(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_linux_stat(`tags=${this.$route.params.tags} `)
      this.get_linux_stat_his(`tags=${this.$route.params.tags} `)
      this.get_linux_disk(`tags=${this.$route.params.tags} `)
      this.get_alarm_info(`tags=${this.$route.params.tags} `)
    }, 1000 * 20)
  },
  methods: {
    init () {
    },
    get_linux_stat (parameter) {
      getLinuxStat(parameter).then(res => {
        this.linuxinfo = res.data.results[0]
        this.linuxinfoData = [
          {
            column1: '主机名: ' + this.linuxinfo.hostname,
            column2: 'IP信息: ' + this.linuxinfo.ipinfo },
          {
            column1: 'linux发行版本: ' + this.linuxinfo.linux_version,
            column2: '内核版本: ' + this.linuxinfo.kernel },
          {
            column1: '架构: ' + this.linuxinfo.frame,
            column2: '运行天数: ' + this.linuxinfo.updays },
          {
            column1: 'CPU型号: ' + this.linuxinfo.cpu_mode,
            column2: 'CPU核数: ' + this.linuxinfo.processor },
          {
            column1: 'CPU频率: ' + this.linuxinfo.cpu_speed,
            column2: 'CPU cache: ' + this.linuxinfo.cpu_cache }
        ]
        this.cpuusedData = this.linuxinfo.cpu_used
        this.memusedData = this.linuxinfo.mem_used
        this.loadData = this.linuxinfo.load1
        console.log(this.linuxinfo)
      }).catch(err => {
        this.$Message.error(`获取linux资源信息错误 ${err}`)
      })
    },
    get_linux_stat_his (parameter) {
      getLinuxStatHis(parameter).then(res => {
        this.linuxinfoList = res.data.results
        this.checktimeData = this.linuxinfoList.map(linux => linux.check_time)
        this.cpuData = this.linuxinfoList.map(linux => linux.cpu_used)
        this.memData = this.linuxinfoList.map(linux => linux.mem_used)
        this.readmbData = this.linuxinfoList.map(linux => linux.read_mb)
        this.writembData = this.linuxinfoList.map(linux => linux.write_mb)
      }).catch(err => {
        this.$Message.error(`获取linux资源信息错误 ${err}`)
      })
    },
    get_linux_disk (parameter) {
      getLinuxDisk(parameter).then(res => {
        this.linuxdiskList = res.data.results
      }).catch(err => {
        this.$Message.error(`获取linux磁盘信息错误 ${err}`)
      })
    },
    get_alarm_info (parameter) {
      getAlarmInfo(parameter).then(res => {
        this.alarmData = res.data.results
        this.count = res.data.count
        console.log(this.alarmData)
      }).catch(err => {
        this.$Message.error(`获取告警信息错误 ${err}`)
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
