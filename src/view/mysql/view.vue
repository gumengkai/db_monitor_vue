<template>
  <div class="layout">
     <Layout>
       <mysql-menu :value="'1'" :tags="this.Tags"></mysql-menu>
            <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
               <Row>
      <i-col span="9">
        <card>
          <row>
            <Alert show-icon>
             容量
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
         </Alert>
          <Col span="11">
           <infor-card shadow style="background: lightsteelblue;">
          <count-to :end="this.data_size+this.index_size" count-class="count-style"/>
          <p>总大小(G)</p>
        </infor-card>
          </Col>
          <Col span="11" offset="2">
           <infor-card shadow style="background: lightsteelblue; ">
          <count-to :end="this.data_size" count-class="count-style"/>
          <p>数据(G)</p>
        </infor-card>
          </Col>
          </row>
          <br>
          <row>
          <Col span="11">
           <infor-card shadow style="background: lightsteelblue;">
          <count-to :end="this.index_size" count-class="count-style"/>
          <p>索引(G)</p>
        </infor-card>
          </Col>
          <Col span="11" offset="2">
           <infor-card shadow style="background: lightsteelblue; ">
          <count-to :end="this.total_rows" count-class="count-style"/>
          <p>总条目数(百万)</p>
        </infor-card>
          </Col>
          </row>
        </card>
        <card>
          <Alert show-icon>
             数据库信息
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
         </Alert>
          <Table size="small" :show-header="false" :columns="columns1" :data="mysqlinfoData"></Table>
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
          <Card>
            <DatePicker @on-change="handleDaterangechange" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
            <br>
            <chart-line2 style="height: 200px;" :title=chart1_title :data1="checktimeData" :data2="qpsData" :data3="tpsData"></chart-line2>
             <br>
            <chart-line4 style="height: 200px;" :title=chart2_title :data1="checktimeData" :data2="threadsrunningData" :data3="threadsconnectedData" :data4="threadswaitedData" :data5="threadscachedData"></chart-line4>
             <br>
            <chart-line2 style="height: 200px;" :title=chart3_title :data1="checktimeData" :data2="bytesreceivedData" :data3="bytessentData"></chart-line2>
          </card>
        </i-col>
    </Row>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { MysqlMenu } from '_c/top-menu'
import InforCard from '_c/info-card'
import { CountTo, CountToInt } from '_c/count-to'
import { getMysqlStat, getMysqlStatHis } from '@/api/mysql'
import { getAlarmInfo } from '@/api/system'
import { ChartPie, SimpleChartPie, ChartLine2, ChartLine3, ChartLine4 } from '_c/charts'

export default {
  name: 'mysql_view',
  components: {
    MysqlMenu,
    InforCard,
    SimpleChartPie,
    ChartLine2,
    ChartLine3,
    ChartLine4,
    CountTo,
    CountToInt,
    ChartPie
  },
  data () {
    return {
      Tags: '',
      end: 0,
      asynEndVal: 487,
      integratedEndVal: 3,
      data: [],
      mysqlinfo: [],
      mysqlinfoList: [],
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
      alarmData: [],
      mysqlinfoData: [],
      processpieData: 40,
      data_size: 0.00,
      index_size: 0.00,
      total_rows: 0,
      checktimeData: [],
      qpsData: [],
      tpsData: [],
      threadsconnectedData: [],
      threadsrunningData: [],
      threadscachedData: [],
      threadswaitedData: [],
      bytesreceivedData: [],
      bytessentData: [],
      chart1_title: ['QPS&TPS', 'qps', 'tps'],
      chart2_title: ['线程', 'threads connected', 'threads running', 'threads waited', 'threads cached'],
      chart3_title: ['网络流量', 'bytes received(KB)', 'bytes sent(KB)'],
      daterangeValue: null,
      startTime: '',
      endTime: ''
    }
  },
  created () {
    this.get_mysql_stat(`tags=${this.$route.params.tags} `)
    this.get_mysql_stat_his(`tags=${this.$route.params.tags} `)
    this.get_alarm_info(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_mysql_stat(`tags=${this.$route.params.tags} `)
      this.get_mysql_stat_his(`tags=${this.$route.params.tags} `)
      this.get_alarm_info(`tags=${this.$route.params.tags} `)
    }, 1000 * 20)
  },
  methods: {
    init () {
    },
    get_mysql_stat (parameter) {
      getMysqlStat(parameter).then(res => {
        this.mysqlinfo = res.data.results[0]
        this.mysqlinfoData = [
          {
            column1: '版本: ' + this.mysqlinfo.version,
            column2: '运行天数: ' + this.mysqlinfo.updays },
          {
            column1: '基础目录: ' + this.mysqlinfo.basedir,
            column2: '数据目录: ' + this.mysqlinfo.datadir },
          {
            column1: '慢查询: ' + this.mysqlinfo.slow_query_log,
            column2: '二进制日志: ' + this.mysqlinfo.log_bin },
          {
            column1: 'innodb换冲池: ' + this.mysqlinfo.innodb_buffer_pool_size / 1024 / 1024 + 'MB',
            column2: '排序区: ' + this.mysqlinfo.sort_buffer_size / 1024 + 'KB' },
          {
            column1: '最大连接数: ' + this.mysqlinfo.max_connections
          }
        ]
        this.data_size = this.mysqlinfo.data_size
        this.index_size = this.mysqlinfo.index_size
        this.total_rows = this.mysqlinfo.total_rows / 10000 / 100
        console.log(this.mysqlinfo)
      }).catch(err => {
        this.$Message.error(`获取mysql资源信息错误 ${err}`)
      })
    },
    get_mysql_stat_his (parameter) {
      getMysqlStatHis(parameter).then(res => {
        this.mysqlinfoList = res.data.results
        this.checktimeData = this.mysqlinfoList.map(mysql => mysql.check_time)
        this.qpsData = this.mysqlinfoList.map(mysql => mysql.qps)
        this.tpsData = this.mysqlinfoList.map(mysql => mysql.tps)
        this.threadsconnectedData = this.mysqlinfoList.map(mysql => mysql.threads_connected)
        this.threadsrunningData = this.mysqlinfoList.map(mysql => mysql.threads_running)
        this.threadscachedData = this.mysqlinfoList.map(mysql => mysql.threads_cached)
        this.threadswaitedData = this.mysqlinfoList.map(mysql => mysql.threads_waited)
        this.bytesreceivedData = this.mysqlinfoList.map(mysql => mysql.bytes_received)
        this.bytessentData = this.mysqlinfoList.map(mysql => mysql.bytes_sent)
      }).catch(err => {
        this.$Message.error(`获取mysql资源信息错误 ${err}`)
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
      this.get_mysql_stat_his(`tags=${this.$route.params.tags}&start_time=${this.startTime}&end_time=${this.endTime}`)
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
