<template>
  <div class="layout">
     <Layout>
       <redis-menu :value="'1'" :tags="this.Tags"></redis-menu>
            <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
               <Row>
      <i-col span="9">
        <card>
          <row>
            <Alert show-icon>
             实例信息
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
         </Alert>
          <Col span="11">
           <infor-card shadow style="background: lightsteelblue;">
          <count-to-int :end="this.total_keys" count-class="count-style"/>
          <p>对象数</p>
        </infor-card>
          </Col>
          <Col span="11" offset="2">
           <infor-card shadow style="background: lightsteelblue; ">
          <count-to :end="this.used_memory" count-class="count-style"/>
          <p>使用内存(MB)</p>
        </infor-card>
          </Col>
          </row>
          <br>
          <row>
          <Col span="11">
           <infor-card shadow style="background: lightsteelblue;">
          <count-to :end="this.hit_rate" count-class="count-style"/>
          <p>累计命中率(%)</p>
        </infor-card>
          </Col>
          <Col span="11" offset="2">
           <infor-card shadow style="background: lightsteelblue; ">
          <count-to-int :end="this.connected_clients" count-class="count-style"/>
          <p>连接数</p>
        </infor-card>
          </Col>
          </row>
        </card>
        <card>
          <Alert show-icon>
             数据库信息
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
         </Alert>
          <Table size="small" :show-header="false" :columns="columns1" :data="redisinfoData"></Table>
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
            <chart-line1 style="height: 200px;" :title=chart5_title :data1="checktimeData" :data2="command_countData"></chart-line1>
             <br>
            <chart-line1 style="height: 200px;" :title=chart6_title :data1="checktimeData" :data2="hitsData"></chart-line1>
             <br>
            <chart-line1 style="height: 200px;" :title=chart1_title :data1="checktimeData" :data2="memData"></chart-line1>
             <br>
            <chart-line4 style="height: 200px;" :title=chart2_title :data1="checktimeData" :data2="net_inputData" :data3="net_outData"></chart-line4>
            <br>
            <chart-line1 style="height: 200px;" :title=chart3_title :data1="checktimeData" :data2="connected_clientsData"></chart-line1>
            <br>
            <chart-line1 style="height: 200px;" :title=chart4_title :data1="checktimeData" :data2="total_keysData"></chart-line1>
          </card>
        </i-col>
    </Row>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { RedisMenu } from '_c/top-menu'
import InforCard from '_c/info-card'
import { CountTo, CountToInt } from '_c/count-to'
import { getRedisStat, getRedisStatHis } from '@/api/redis'
import { getAlarmInfo } from '@/api/system'
import { ChartPie, SimpleChartPie, ChartLine1, ChartLine2, ChartLine3, ChartLine4 } from '_c/charts'

export default {
  name: 'redis_view',
  components: {
    RedisMenu,
    InforCard,
    SimpleChartPie,
    ChartLine1,
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
      redisinfo: [],
      redisinfoList: [],
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
      redisinfoData: [],
      processpieData: 40,
      total_keys: 0,
      used_memory: 0.00,
      hits_all: 0,
      misses_all: 0,
      hit_rate: 0,
      redis_status: '',
      connected_clients: 0,
      checktimeData: [],
      memData: [],
      net_inputData: [],
      net_outData: [],
      connected_clientsData: [],
      total_keysData: [],
      command_countData: [],
      hitsData: [],
      chart1_title: ['内存使用量', 'memory_used'],
      chart2_title: ['网络流量', 'net_input', 'net_output'],
      chart3_title: ['客户端连接统计', 'connected_clients'],
      chart4_title: ['键个数统计', 'total_keys'],
      chart5_title: ['命令统计', 'command_count'],
      chart6_title: ['命中统计', 'hits'],
      daterangeValue: null,
      startTime: '',
      endTime: ''
    }
  },
  created () {
    this.get_redis_stat(`tags=${this.$route.params.tags} `)
    this.get_redis_stat_his(`tags=${this.$route.params.tags} `)
    this.get_alarm_info(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_redis_stat(`tags=${this.$route.params.tags} `)
      this.get_redis_stat_his(`tags=${this.$route.params.tags} `)
      this.get_alarm_info(`tags=${this.$route.params.tags} `)
    }, 1000 * 20)
  },
  methods: {
    init () {
    },
    get_redis_stat (parameter) {
      getRedisStat(parameter).then(res => {
        this.redisinfo = res.data.results[0]
        const redis_sta = this.redisinfo.status
        if (redis_sta === 0) {
          this.redis_status = '运行中'
        } else {
          this.redis_status = '连接失败'
        }
        this.redisinfoData = [
          {
            column1: '版本: ' + this.redisinfo.version,
            column2: '角色: ' + this.redisinfo.role },
          {
            column1: '实例地址: ' + this.redisinfo.host + ':' + this.redisinfo.port,
            column2: '实例类型: ' + this.redisinfo.redis_mode },
          {
            column1: '运行状态: ' + this.redis_status,
            column2: '运行天数: ' + this.redisinfo.updays }
        ]
        this.total_keys = this.redisinfo.total_keys
        this.used_memory = this.redisinfo.used_memory
        this.connected_clients = this.redisinfo.connected_clients
        this.hits_all = this.redisinfo.hits_all
        this.misses_all = this.redisinfo.misses_all
        debugger
        if (this.hits_all + this.misses_all > 0) {
          this.hit_rate = Number(this.hits_all * 100 / (this.hits_all + this.misses_all)).toFixed(2)
        }
        console.log(this.redisinfo)
      }).catch(err => {
        this.$Message.error(`获取redis资源信息错误 ${err}`)
      })
    },
    get_redis_stat_his (parameter) {
      getRedisStatHis(parameter).then(res => {
        this.redisinfoList = res.data.results
        this.checktimeData = this.redisinfoList.map(redis => redis.check_time)
        this.memData = this.redisinfoList.map(redis => redis.used_memory)
        this.net_inputData = this.redisinfoList.map(redis => (Number(redis.net_input_byte) / 1024).toFixed(2))
        this.net_outData = this.redisinfoList.map(redis => (Number(redis.net_out_byte) / 1024).toFixed(2))
        this.connected_clientsData = this.redisinfoList.map(redis => redis.connected_clients)
        this.total_keysData = this.redisinfoList.map(redis => redis.total_keys)
        this.command_countData = this.redisinfoList.map(redis => redis.command_count)
        this.hitsData = this.redisinfoList.map(redis => redis.hits)
      }).catch(err => {
        this.$Message.error(`获取redis资源信息错误 ${err}`)
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
      this.get_redis_stat_his(`tags=${this.$route.params.tags}&start_time=${this.startTime}&end_time=${this.endTime}`)
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
