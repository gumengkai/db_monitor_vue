<template>
  <div class="layout">
     <Layout>
       <oracle-menu :value="'1'" :tags="this.Tags" ></oracle-menu>
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
          <count-to :end="this.datafile_size+this.tempfile_size" count-class="count-style"/>
          <p>总大小(G)</p>
        </infor-card>
          </Col>
          <Col span="11" offset="2">
           <infor-card shadow style="background: lightsteelblue; ">
          <count-to :end="this.datafile_size" count-class="count-style"/>
          <p>数据文件(G)</p>
        </infor-card>
          </Col>
          </row>
          <br>
          <row>
          <Col span="11">
           <infor-card shadow style="background: lightsteelblue;">
          <count-to :end="this.tempfile_size" count-class="count-style"/>
          <p>临时文件(G)</p>
        </infor-card>
          </Col>
          <Col span="11" offset="2">
           <infor-card shadow style="background: lightsteelblue; ">
          <count-to :end="this.archivelog_size" count-class="count-style"/>
          <p>归档量(G)</p>
        </infor-card>
          </Col>
          </row>
        </card>
        <card>
          <Alert show-icon>
             数据库信息
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
         </Alert>
          <Table size="small" :show-header="false" :columns="columns1" :data="oracleinfoData"></Table>
        </card>
        <card>
          <Alert show-icon>
             主机信息
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
         </Alert>
          <Table size="small" :show-header="false" :columns="columns1" :data="machineinfoData"></Table>
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
            <simple-chart-pie style="height: 150px;" :value="processpieData" text="连接数使用率"></simple-chart-pie>
          </Card>
        </i-col>
         <i-col span="8">
          <Card>
            <simple-chart-pie style="height: 150px;" :value="undousedPercent" text="undo表空间使用率"></simple-chart-pie>
          </Card>
        </i-col>
        <i-col span="8">
          <Card>
            <simple-chart-pie style="height: 150px;" :value="tempusedPercent" text="临时表空间使用率(temp)"></simple-chart-pie>
          </Card>
        </i-col>
       </i-col>
           <i-col span="15">
             <card>
               <DatePicker @on-change="handleDaterangechange" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
            <chart-line2 style="height: 200px;" :title=chart1_title :data1="checktimeData" :data2="qpsData" :data3="tpsData"></chart-line2>
             <br>
            <chart-line3 style="height: 200px;" :title=chart2_title :data1="checktimeData" :data2="totalsessionsData" :data3="activesessionsData" :data4="blockedsessionsData"></chart-line3>
          </Card>
        </i-col>
    </Row>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { OracleMenu } from '_c/top-menu'
import InforCard from '_c/info-card'
import { CountTo, CountToInt } from '_c/count-to'
import { getOracleStat, getOracleStatHis, getOracleUndoTableSpace, getOracleTempTableSpace } from '@/api/oracle'
import { getAlarmInfo } from '@/api/system'
import { ChartPie, SimpleChartPie, ChartLine2, ChartLine3 } from '_c/charts'
import { formatDate } from '@/libs/tools'

export default {
  name: 'oracle_view',
  components: {
    OracleMenu,
    InforCard,
    SimpleChartPie,
    ChartLine2,
    ChartLine3,
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
      oracleinfo: [],
      oracleinfoList: [],
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
      oracleinfoData: [],
      machineinfoData: [],
      processpieData: 40,
      datafile_size: 0.00,
      tempfile_size: 0.00,
      archivelog_size: 0.00,
      qpsData: [],
      tpsData: [],
      checktimeData: [],
      totalsessionsData: [],
      activesessionsData: [],
      blockedsessionsData: [],
      chart1_title: ['QPS&TPS', 'qps', 'tps'],
      chart2_title: ['会话', 'total sessions', 'active sessions', 'blocked sessions'],
      daterangeValue: null,
      startTime: '',
      endTime: '',
      undoTablespace: '',
      undousedPercent: 0,
      tempusedPercent: 0
    }
  },
  created () {
    this.get_oracle_stat(`tags=${this.$route.params.tags} `)
    this.get_oracle_stat_his(`tags=${this.$route.params.tags} `)
    this.get_alarm_info(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_oracle_stat(`tags=${this.$route.params.tags} `)
      this.get_oracle_stat_his(`tags=${this.$route.params.tags} `)
      this.get_alarm_info(`tags=${this.$route.params.tags} `)
    }, 1000 * 20)
  },
  methods: {
    init () {
    },
    get_oracle_stat (parameter) {
      getOracleStat(parameter).then(res => {
        this.oracleinfo = res.data.results[0]
        this.oracleinfoData = [
          {
            column1: 'DBID: ' + this.oracleinfo.dbid,
            column2: 'DBNAME: ' + this.oracleinfo.dbname },
          {
            column1: '实例名: ' + this.oracleinfo.instance_name,
            column2: '实例编号: ' + this.oracleinfo.inst_id },
          {
            column1: 'Oracle版本: ' + this.oracleinfo.db_version,
            column2: 'RAC: ' + this.oracleinfo.is_rac },
          {
            column1: '归档: ' + this.oracleinfo.log_mode,
            column2: '当前连接数: ' + this.oracleinfo.current_process },
          {
            column1: 'SGA: ' + this.oracleinfo.sga_size + 'MB',
            column2: 'PGA: ' + this.oracleinfo.pga_size + 'MB' },
          {
            column1: '审计: ' + this.oracleinfo.audit_trail,
            column2: '闪回: ' + this.oracleinfo.flashback_on }
        ]
        this.machineinfoData = [
          {
            column1: '主机名: ' + this.oracleinfo.hostname,
            column2: 'IP: ' + this.oracleinfo.host },
          {
            column1: 'CPU核数: ' + this.oracleinfo.num_cpus,
            column2: '物理内存: ' + (Number(this.oracleinfo.physical_memory) / 1024 / 1024 / 1024).toFixed(2) + 'GB' },
          {
            column1: '平台: ' + this.oracleinfo.platform
          }
        ]
        this.processpieData = this.oracleinfo.process_used_percent
        this.datafile_size = this.oracleinfo.datafile_size
        this.tempfile_size = this.oracleinfo.tempfile_size
        this.archivelog_size = this.oracleinfo.archivelog_size
        this.undoTablespace = this.oracleinfo.undo_tablespace
        console.log(this.oracleinfo)
        this.get_oracle_undo_tablespace(`tags=${this.$route.params.tags}&undotablespace_name=${this.undoTablespace} `)
        this.get_oracle_temp_tablespace(`tags=${this.$route.params.tags}&temptablespace_name=TEMP`)
      }).catch(err => {
        this.$Message.error(`获取Oracle资源信息错误 ${err}`)
      })
    },
    get_oracle_stat_his (parameter) {
      getOracleStatHis(parameter).then(res => {
        this.oracleinfoList = res.data.results
        this.checktimeData = this.oracleinfoList.map(oracle => oracle.check_time)
        this.qpsData = this.oracleinfoList.map(oracle => oracle.qps)
        this.tpsData = this.oracleinfoList.map(oracle => oracle.tps)
        this.totalsessionsData = this.oracleinfoList.map(oracle => oracle.total_sessions)
        this.activesessionsData = this.oracleinfoList.map(oracle => oracle.active_sessions)
        this.blockedsessionsData = this.oracleinfoList.map(oracle => oracle.blocked_sessions)
        console.log(this.oracleinfo)
      }).catch(err => {
        this.$Message.error(`获取Oracle资源信息错误 ${err}`)
      })
    },
    get_oracle_undo_tablespace (parameter) {
      getOracleUndoTableSpace(parameter).then(res => {
        this.undoinfo = res.data.results[0]
        this.undousedPercent = this.undoinfo.percent_used
        console.log(this.undoinfo)
      }).catch(err => {
        this.$Message.error(`获取Oracle undo表空间信息错误 ${err}`)
      })
    },
    get_oracle_temp_tablespace (parameter) {
      getOracleTempTableSpace(parameter).then(res => {
        this.tempinfo = res.data.results[0]
        const cnt = res.data.count
        if (cnt > 0) {
          this.tempusedPercent = this.tempinfo.percent_used
        }
        console.log(this.tempinfo)
      }).catch(err => {
        this.$Message.error(`获取Oracle temp表空间信息错误 ${err}`)
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
      this.get_oracle_stat_his(`tags=${this.$route.params.tags}&start_time=${this.startTime}&end_time=${this.endTime}`)
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
