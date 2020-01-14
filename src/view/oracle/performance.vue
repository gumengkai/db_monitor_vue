<template>
     <Layout>
       <oracle-menu :value="'4'" :tags="this.Tags"></oracle-menu>
            <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
              <Card>
                <DatePicker @on-change="handleDaterangechange" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
              <Row>
      <i-col span="12">
        <br>
            <chart-line2 style="height: 250px;" :title=chart1_title :data1="checktimeData" :data2="usercommitsData" :data3="execcountData"></chart-line2>
        <br>
            <chart-line2 style="height: 250px;" :title=chart3_title :data1="checktimeData" :data2="logicalreadsData" :data3="physicalreadsData"></chart-line2>
        <br>
            <chart-line2 style="height: 250px;" :title=chart5_title :data1="checktimeData" :data2="parsecountData" :data3="hardparsecountData"></chart-line2>
      </i-col>
    <i-col span="12">
      <br>
            <chart-line2 style="height: 250px;" :title=chart2_title :data1="checktimeData" :data2="sgasizeData" :data3="pgasizeData"></chart-line2>
      <br>
            <chart-line1 style="height: 250px;" :title=chart4_title :data1="checktimeData" :data2="redosizeData"></chart-line1>
      <br>
            <chart-line2 style="height: 250px;" :title=chart6_title :data1="checktimeData" :data2="memoryusedData"></chart-line2>
       </i-col>
    </Row>
              </Card>
      </Content>
        </Layout>
</template>

<script>
import { OracleMenu } from '_c/top-menu'
import { CountTo } from '_c/count-to'
import { getOracleStatHis } from '@/api/oracle'
import { ChartLine1, ChartLine2 } from '_c/charts'

export default {
  name: 'oracle_view',
  components: {
    OracleMenu,
    CountTo,
    ChartLine1,
    ChartLine2
  },
  data () {
    return {
      Tags: '',
      end: 0,
      asynEndVal: 487,
      integratedEndVal: 3,
      oracleinfoList: [],
      checktimeData: [],
      usercommitsData: [],
      execcountData: [],
      sgasizeData: [],
      pgasizeData: [],
      logicalreadsData: [],
      physicalreadsData: [],
      redosizeData: [],
      parsecountData: [],
      hardparsecountData: [],
      memoryusedData: [],
      chart1_title: ['exec count&user commits', 'user commits', 'exec count'],
      chart2_title: ['sga size&pga size', 'sga size', 'pga size'],
      chart3_title: ['session logical reads&physical reads', 'session logical reads', 'session physical reads'],
      chart4_title: ['redo size(KB)', 'redo size'],
      chart5_title: ['parse&hard parse', 'parse count', 'parse count(hard)'],
      chart6_title: ['memory used percent(%)', 'memory used percent'],
      daterangeValue: null,
      startTime: '',
      endTime: ''
    }
  },
  created () {
    this.get_oracle_stat_his(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_oracle_stat_his(`tags=${this.$route.params.tags} `)
    }, 1000 * 20)
  },
  methods: {
    init () {
    },
    get_oracle_stat_his (parameter) {
      getOracleStatHis(parameter).then(res => {
        this.oracleinfoList = res.data.results
        this.checktimeData = this.oracleinfoList.map(oracle => oracle.check_time)
        this.usercommitsData = this.oracleinfoList.map(oracle => oracle.user_commits)
        this.execcountData = this.oracleinfoList.map(oracle => oracle.exec_count)
        this.sgasizeData = this.oracleinfoList.map(oracle => oracle.sga_size)
        this.pgasizeData = this.oracleinfoList.map(oracle => oracle.pga_size)
        this.logicalreadsData = this.oracleinfoList.map(oracle => oracle.logical_reads)
        this.physicalreadsData = this.oracleinfoList.map(oracle => oracle.physical_reads)
        this.redosizeData = this.oracleinfoList.map(oracle => oracle.redo_size)
        this.parsecountData = this.oracleinfoList.map(oracle => oracle.total_parse_count)
        this.hardparsecountData = this.oracleinfoList.map(oracle => oracle.hard_parse_count)
        this.memoryusedData = this.oracleinfoList.map(oracle => oracle.memory_used_percent)

        console.log(this.oracleinfo)
      }).catch(err => {
        this.$Message.error(`获取Oracle资源信息错误 ${err}`)
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
