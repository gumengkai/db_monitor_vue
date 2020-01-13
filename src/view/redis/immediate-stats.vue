<template>
  <div class="layout">
     <Layout>
       <redis-menu :value="'2'" :tags="this.Tags"></redis-menu>
       <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
    <Card>
      <br>
      <row>
        <Table stripe size="large"
               :columns="columns"
               :data="redisstatsData">
        </Table>
      </row>
    </Card>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { getRedisImmediateStats } from '@/api/redis'
import { RedisMenu } from '_c/top-menu'
export default {
  components: {
    RedisMenu
  },
  data () {
    return {
      Tags: '',
      paramName: '',
      redisstatsData: [],
      columns: [
        {
          title: '分组',
          key: 'section',
          width: 150
        },
        {
          title: '键',
          key: 'key',
          width: 250
        },
        {
          title: '键值',
          key: 'val',
          width: 600
        }
      ],
      data: {},
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
    this.get_redis_immediatestats(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_redis_immediatestats(`tags=${this.$route.params.tags} `)
    }, 1000 * 2000)
  },
  methods: {
    search () {
      this.get_redis_immediatestats(`tags=${this.$route.params.tags}&paraname=${this.paramName} `)
    },
    clear_search () {
      this.paramName = ''
      this.get_redis_immediatestats(`tags=${this.$route.params.tags} `)
    },
    get_redis_immediatestats (parameter) {
      getRedisImmediateStats(parameter).then(res => {
        debugger
        var allData = res.data
        for (const section in allData) {
          const sectionData = allData[section]
          for (const key in sectionData) {
            const val = sectionData[key]
            const map = {}
            map['section'] = section
            map['key'] = key
            map['val'] = val
            this.redisstatsData.push(map)
          }
        }

        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取Redis配置信息错误 ${err}`)
      })
    },
    get_oracle_parameter (parameter) {
      console.log(parameter)
      this.get_redis_immediatestats(`tags=${this.$route.params.tags}&page=${parameter}`)
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
