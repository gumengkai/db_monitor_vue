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
              @on-change="get_oracle_parameter"
              show-elevator
              show-total />
      </Row>
    </Card>
  </Row>
</template>

<script>
import { getOracleStatList } from '@/api/oracle'
import { formatDate } from '@/libs/tools'
import { Tag } from 'iview'
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
          width: 120,
          sortable: true,
          render: (h, params) => {
            const tags = params.row.tags
            return h('a', {
              on: {
                'click': () => {
                  this.gotoOracle(tags)
                }
              }
            }, tags)
          }
        },
        {
          title: 'IP地址',
          key: 'host',
          width: 120,
          sortable: true
        },
        {
          title: '实例名',
          key: 'instance_name',
          width: 100
        },
        {
          title: '版本',
          key: 'db_version',
          width: 100
        },
        {
          title: '角色',
          key: 'database_role',
          width: 160
        },
        {
          title: '运行天数',
          key: 'updays',
          width: 90
        },
        {
          title: '审计',
          key: 'audit_trail',
          width: 70
        },
        {
          title: '归档模式',
          key: 'log_mode',
          width: 140
        },
        {
          title: '连接数使用率',
          key: 'process_used_percent',
          width: 110,
          render: (h, params) => {
            const process_used_percent = params.row.process_used_percent
            if (process_used_percent >= 90) {
              return h(Tag, { props: { color: 'error' } }, process_used_percent + '%')
            }
            if (process_used_percent >= 80) {
              return h(Tag, { props: { color: 'warning' } }, process_used_percent + '%')
            }
            if (process_used_percent === null) {
              return null
            } else {
              return h(Tag, { props: { color: 'success' } }, process_used_percent + '%')
            }
          }
        },
        {
          title: 'PGA使用率',
          key: 'pga_used_percent',
          width: 100,
          render: (h, params) => {
            const pga_used_percent = params.row.pga_used_percent
            if (pga_used_percent >= 150) {
              return h(Tag, { props: { color: 'error' } }, pga_used_percent + '%')
            }
            if (pga_used_percent >= 100) {
              return h(Tag, { props: { color: 'warning' } }, pga_used_percent + '%')
            }
            if (pga_used_percent === null) {
              return null
            } else {
              return h(Tag, { props: { color: 'success' } }, pga_used_percent + '%')
            }
          }
        },
        {
          title: 'QPS',
          key: 'qps',
          width: 70
        },
        {
          title: 'TPS',
          key: 'tps',
          width: 70
        },
        {
          title: 'ADG传输延迟',
          key: 'adg_trans_lag',
          width: 130,
          render: (h, params) => {
            const adg_trans_lag = params.row.adg_trans_lag
            const adg_trans_value = params.row.adg_trans_value
            const database_role = params.row.database_role
            if (adg_trans_value >= 1000) {
              return h(Tag, { props: { color: 'error' } }, adg_trans_lag)
            }
            if (adg_trans_value >= 300) {
              return h(Tag, { props: { color: 'warning' } }, adg_trans_lag)
            }
            if (database_role === 'PRIMARY') {
              return null
            } else {
              return h(Tag, { props: { color: 'success' } }, adg_trans_lag)
            }
          }
        },
        {
          title: 'ADG应用延迟',
          key: 'adg_apply_lag',
          width: 130,
          render: (h, params) => {
            const adg_apply_lag = params.row.adg_apply_lag
            const adg_apply_value = params.row.adg_apply_value
            const database_role = params.row.database_role
            if (adg_apply_value >= 1000) {
              return h(Tag, { props: { color: 'error' } }, adg_apply_lag)
            }
            if (adg_apply_value >= 300) {
              return h(Tag, { props: { color: 'warning' } }, adg_apply_lag)
            }
            if (database_role === 'PRIMARY') {
              return null
            } else {
              return h(Tag, { props: { color: 'success' } }, adg_apply_lag)
            }
          }
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
    this.get_oracle_stat_list()
    this.timer = setInterval(() => {
      this.get_oracle_stat_list()
    }, 1000 * 20)
  },
  methods: {
    gotoOracle (tags) {
      const path = '/oracle/' + tags + '/view'
      this.$router.push({ path: path })
    },
    search () {
      console.log(this.host_search)
      this.get_oracle_stat_list(`host=${this.host_search}`)
    },
    clear_search () {
      this.host_search = null
      this.get_oracle_stat_list()
    },
    get_oracle_stat_list (parameter) {
      getOracleStatList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取Oracle资源信息错误 ${err}`)
      })
    },
    get_oracle_parameter (parameter) {
      console.log(parameter)
      this.get_oracle_stat_list(`page=${parameter}`)
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
.ivu-table th, .ivu-table td {
    text-align: center;
}
</style>
