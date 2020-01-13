<template>
  <div class="layout">
     <Layout>
       <redis-menu :value="'3'" :tags="this.Tags"></redis-menu>
       <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
    <Card>
      <br>
      <row>
        <Table stripe
               :columns="columns"
               :data="slowlogData">
        </Table>
      </row>
    </Card>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { getRedisSlowLog } from '@/api/redis'
import { getDate } from '@/libs/tools'
import { RedisMenu } from '_c/top-menu'
export default {
  components: {
    RedisMenu
  },
  data () {
    return {
      Tags: '',
      data: '',
      slowlogData: [],
      columns: [
        {
          title: 'id',
          key: 'id',
          width: 80,
          sortable: true
        },
        {
          title: '时间',
          key: 'start_time',
          width: 160,
          render: (h, params) => {
            debugger
            const timestamp = params.row.start_time
            const start_time = getDate(timestamp, 'year')
            return h('div', start_time
            )
          }
        },
        {
          title: '执行耗时(微妙)',
          key: 'duration',
          width: 120
        },
        {
          title: '命令',
          key: 'command',
          width: 600
        }
      ],
      count: 0,
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
    this.get_redis_slowlog(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_redis_slowlog(`tags=${this.$route.params.tags} `)
    }, 1000 * 2000)
  },
  methods: {
    search () {
      this.get_redis_slowlog(`tags=${this.$route.params.tags} `)
    },
    clear_search () {
      this.get_redis_slowlog(`tags=${this.$route.params.tags} `)
    },
    get_redis_slowlog (parameter) {
      getRedisSlowLog(parameter).then(res => {
        this.data = res.data
        for (let i in this.data) {
          this.slowlogData.push(this.data[i])
        }
        console.log(this.slowlogData)
      }).catch(err => {
        this.$Message.error(`获取redis慢查询信息错误 ${err}`)
      })
    },
    get_oracle_parameter (parameter) {
      console.log(parameter)
      this.get_redis_slowlog(`tags=${this.$route.params.tags}&page=${parameter}`)
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
