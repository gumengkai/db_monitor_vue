<template>
  <div class="layout">
     <Layout>
       <redis-menu :value="'7'" :tags="this.Tags"></redis-menu>
       <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
    <Card>
      <Row>
          <Select v-model="logLevel" style="width:80px">
        <Option value="all">全部</Option>
        <Option value="error">严重</Option>
        <Option value="warn">告警</Option>
        <Option value="info">一般</Option>
        </Select>

        <Input v-model="logContent"
               placeholder="输入日志内容搜索"
               style="width: 150px" />&nbsp;

        <Button @click="search"
                type="primary">查询</Button>&nbsp;
        <Button @click="clear_search"
                type="success">刷新</Button>
      </Row>
      <br>
        <Table size="small"
               :columns="columns"
               :data="data">
        </Table>
        <br>
        <Page :total="count"
              :page_size='page_size'
              @on-change="get_redis_parameter"
              show-elevator
              show-total />
    </Card>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { getAlertLog } from '@/api/system'
import { Tag } from 'iview'
import { RedisMenu } from '_c/top-menu'
export default {
  components: {
    RedisMenu
  },
  data () {
    return {
      Tags: '',
      show: false,
      logContent: '',
      logLevel: '',
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '日志时间',
          key: 'log_time',
          width: 200
        },
        {
          title: '日志级别',
          key: 'log_level',
          width: 110,
          render: (h, params) => {
            const log_level = params.row.log_level
            if (log_level === 'error') {
              return h(Tag, { props: { color: 'error' } }, '严重')
            }
            if (log_level === 'warn') {
              return h(Tag, { props: { color: 'warning' } }, '告警')
            } else {
              return h(Tag, { props: { color: 'success' } }, '一般')
            }
          }
        },
        {
          title: '日志内容',
          key: 'log_content',
          width: 550
        }
      ],
      data: [],
      count: 0,
      page_size: 10,
      create: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      updateId: null
    }
  },
  computed: {
    access () {
      return this.$store.state.user.access
    }
  },
  created () {
    this.get_redis_alert_log(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_redis_alert_log(`tags=${this.$route.params.tags} `)
    }, 1000 * 20)
  },
  methods: {
    get_redis_alert_log (parameter) {
      getAlertLog(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取redis日志信息错误 ${err}`)
      })
    },
    get_redis_parameter (parameter) {
      console.log(parameter)
      this.get_redis_alert_log(`tags=${this.$route.params.tags}&page=${parameter}`)
    },
    search () {
      if (this.logLevel === 'all') {
        this.get_redis_alert_log(`tags=${this.$route.params.tags}&search=${this.logContent} `)
      } else { this.get_redis_alert_log(`tags=${this.$route.params.tags}&log_level=${this.logLevel}&search=${this.logContent} `) }
    },
    clear_search () {
      this.logLevel = 'all'
      this.logContent = ''
      this.get_redis_alert_log(`tags=${this.$route.params.tags} `)
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>
<style>
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.ivu-table .demo-table-info-cell-danger {
  background-color: #d40f35;
  color: #fff;
}
.ivu-table .demo-table-info-cell-mormal {
  background-color: #22d489;
  color: #fff;
}
</style>
