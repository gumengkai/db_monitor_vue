<template>
  <Row>
    <Card>
      <Row>
        <Input v-model="host_search"
               placeholder="ip地址"
               style="width: 100px" />&nbsp;
        <Button @click="search"
                type="primary">搜索</Button>&nbsp;
        <Button @click="clear_search"
                type="success">刷新</Button>
      </Row>
      <br>
      <Row>
        <Table size="small" border
               :columns="columns"
               :data="data">

        </Table>
      </Row>
      <Row>
        <br>
        <Page :total="count"
              :page_size='page_size'
              @on-change="get_redis_parameter"
              show-elevator
              show-total />
      </Row>
    </Card>
  </Row>
</template>

<script>
import { getRedisStatList } from '@/api/redis'
import { Tag } from 'iview'
import { formatDate } from '@/libs/tools'
export default {
  data () {
    return {
      show: false,
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '标签',
          width: 100,
          sortable: true,
          render: (h, params) => {
            const tags = params.row.tags
            return h('a', {
              on: {
                'click': () => {
                  this.gotoRedis(tags)
                }
              }
            }, tags)
          }
        },
        {
          title: 'IP地址',
          key: 'host',
          width: 150,
          sortable: true
        },
        {
          title: '端口',
          key: 'port',
          width: 80
        },
        {
          title: '版本',
          key: 'version',
          width: 100
        },
        {
          title: '运行天数',
          key: 'updays',
          width: 90
        },
        {
          title: '对象数',
          key: 'total_keys',
          width: 100
        },
        {
          title: '最大内存配置',
          key: 'maxmemory',
          width: 120,
          render: (h, params) => {
            const maxmemory = Number(params.row.maxmemory / 1024 / 1024).toFixed(2)
            return h('div', maxmemory + 'MB')
          }
        },
        {
          title: '内存使用率',
          key: 'maxmemory,used_memory',
          width: 150,
          render: (h, params) => {
            const maxmemory = Number(params.row.maxmemory / 1024 / 1024).toFixed(2)
            const used_memory = params.row.used_memory
            if (maxmemory > 0) {
              var memory_rate = Number(used_memory / maxmemory * 100).toFixed(2)
            }
            if (memory_rate > 80) {
              return h('i-progress', { props: { percent: memory_rate } }, memory_rate + '%')
            }
            if (memory_rate > 60 && memory_rate < 80) {
              return h('i-progress', { props: { percent: memory_rate } }, memory_rate + '%')
            } else {
              return h('i-progress', { props: { percent: memory_rate } }, memory_rate + '%')
            }
          }
        },
        {
          title: '连接数',
          key: 'connected_clients',
          width: 100
        },
        {
          title: '命中率',
          key: 'hits,misses',
          width: 110,
          render: (h, params) => {
            const hits = params.row.hits
            const misses = params.row.misses
            const all = hits + misses
            var hits_rate = -1
            if (all > 0) {
              hits_rate = Number(hits / all).toFixed(2)
            }
            if (hits_rate !== -1 && hits_rate < 0.6) {
              return h(Tag, { props: { color: 'error' } }, hits_rate)
            }
            if (hits_rate !== -1 && hits_rate > 0.6 && hits_rate < 1) {
              return h(Tag, { props: { color: 'warning' } }, hits_rate)
            } else {
              return h(Tag, { props: { color: 'success' } }, hits_rate)
            }
          }
        },
        {
          title: '碎片率',
          key: 'mem_fragmentation_ratio',
          width: 110,
          render: (h, params) => {
            const mem_fragmentation_ratio = params.row.mem_fragmentation_ratio
            if (mem_fragmentation_ratio < 1) {
              return h(Tag, { props: { color: 'error' } }, mem_fragmentation_ratio)
            }
            if (mem_fragmentation_ratio > 1.5) {
              return h(Tag, { props: { color: 'warning' } }, mem_fragmentation_ratio)
            } else {
              return h(Tag, { props: { color: 'success' } }, mem_fragmentation_ratio + '%')
            }
          }
        },
        {
          title: '角色',
          key: 'role',
          width: 100
        },
        {
          title: '状态',
          key: 'status',
          width: 90,
          render: (h, params) => {
            const levelMap = {
              0: { color: 'green', desc: '正常' },
              1: { color: 'red', desc: '失败' }
            }
            const status = params.row.status
            return h(Tag, { props: { color: levelMap[status]['color'] } }, levelMap[status]['desc'])
          },
          fixed: 'right'
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
      data: [],
      count: 0,
      page_size: 10,
      host_search: '',
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
    this.get_redis_stat_list()
    this.timer = setInterval(() => {
      this.get_redis_stat_list()
    }, 1000 * 20)
  },
  methods: {
    gotoRedis (tags) {
      const path = '/redis/' + tags + '/view'
      this.$router.push({ path: path })
    },
    search () {
      console.log(this.host_search)
      this.get_redis_stat_list(`host=${this.host_search}`)
    },
    clear_search () {
      this.host_search = ''
      this.get_redis_stat_list()
    },
    get_redis_stat_list (parameter) {
      getRedisStatList(parameter).then(res => {
        debugger
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取redis资源信息错误 ${err}`)
      })
    },
    get_redis_parameter (parameter) {
      console.log(parameter)
      this.get_redis_stat_list(`page=${parameter}`)
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
