<template>
  <div class="layout">
     <Layout>
       <redis-menu :value="'6'" :tags="this.Tags"></redis-menu>
            <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
               <Row :gutter="14">
          <Card>
            <DatePicker @on-change="handleDaterangechange" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
            <br>
            <chart-line1 style="height: 300px;" :title=chart1_title :data1="checktimeData" :data2="cmdstat_brpopData"></chart-line1>
            <br>
            <chart-line1 style="height: 300px;" :title=chart2_title :data1="checktimeData" :data2="cmdstat_publishData"></chart-line1>
            <br>
            <chart-line1 style="height: 300px;" :title=chart3_title :data1="checktimeData" :data2="cmdstat_setnxData"></chart-line1>
            <br>
            <chart-line1 style="height: 300px;" :title=chart4_title :data1="checktimeData" :data2="cmdstat_execData"></chart-line1>
            <br>
            <chart-line1 style="height: 300px;" :title=chart5_title :data1="checktimeData" :data2="cmdstat_multiData"></chart-line1>
          </Card>
    </Row>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { RedisMenu } from '_c/top-menu'
import InforCard from '_c/info-card'
import { getRedisStatHis } from '@/api/redis'
import { ChartLine1 } from '_c/charts'

export default {
  name: 'redis_view',
  components: {
    RedisMenu,
    InforCard,
    ChartLine1
  },
  data () {
    return {
      Tags: '',
      end: 0,
      asynEndVal: 487,
      integratedEndVal: 3,
      data: [],
      redisinfoList: [],
      redisinfoData: [],
      checktimeData: [],
      cmdstat_brpopData: [],
      cmdstat_publishData: [],
      cmdstat_setnxData: [],
      cmdstat_execData: [],
      cmdstat_multiData: [],
      chart1_title: ['命令：brpop', 'brpop'],
      chart2_title: ['命令：publish', 'publish'],
      chart3_title: ['命令：setnx', 'setnx'],
      chart4_title: ['命令：exec', 'exec'],
      chart5_title: ['命令：multi', 'multi'],
      daterangeValue: null,
      startTime: '',
      endTime: ''
    }
  },
  created () {
    this.get_redis_commandstats(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_redis_commandstats(`tags=${this.$route.params.tags} `)
    }, 1000 * 20)
  },
  methods: {
    init () {
    },
    get_redis_commandstats (parameter) {
      getRedisStatHis(parameter).then(res => {
        const rediscommandstatsData = res.data.results
        this.checktimeData = rediscommandstatsData.map(redis => redis.check_time)
        this.cmdstat_brpopData = rediscommandstatsData.map(redis => redis.cmdstat_brpop)
        this.cmdstat_publishData = rediscommandstatsData.map(redis => redis.cmdstat_publish)
        this.cmdstat_setnxData = rediscommandstatsData.map(redis => redis.cmdstat_setnx)
        this.cmdstat_execData = rediscommandstatsData.map(redis => redis.cmdstat_exec)
        this.cmdstat_multiData = rediscommandstatsData.map(redis => redis.cmdstat_multi)
        console.log(rediscommandstatsData)
      }).catch(err => {
        this.$Message.error(`获取redis信息错误 ${err}`)
      })
    },
    handleDaterangechange (daterange) {
      this.daterangeValue = daterange
      this.startTime = daterange[0]
      this.endTime = daterange[1]
      this.get_redis_commandstats(`tags=${this.$route.params.tags}&start_time=${this.startTime}&end_time=${this.endTime}`)
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
