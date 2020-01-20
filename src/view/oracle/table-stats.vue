<template>
  <div class="layout">
     <Layout>
       <oracle-menu :value="'6'" :tags="this.Tags"></oracle-menu>
       <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
    <Card>
      <br>
      <row>
        <Table size="small"
               :columns="columns"
               :data="data">
        </Table>
      </row>
        <br>
        <Page :total="count"
              :page_size='page_size'
              @on-change="get_oracle_parameter"
              show-elevator
              show-total />
    </Card>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { getOracleTableStats } from '@/api/oracle'
import { formatDate } from '@/libs/tools'
import { Tag } from 'iview'
import { OracleMenu } from '_c/top-menu'
export default {
  components: {
    OracleMenu
  },
  data () {
    return {
      Tags: '',
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '所属用户',
          key: 'owner',
          width: 100
        },
        {
          title: '表名',
          key: 'table_name',
          width: 150
        },
        {
          title: '行数(最近统计收集)',
          key: 'num_rows',
          width: 150
        },
        {
          title: '变更率',
          key: 'change_pct',
          width: 150,
          render: (h, params) => {
            return h(Tag, params.row.change_pct + '%')
          }
        },
        {
          title: '上次表分析时间',
          key: 'last_analyzed',
          width: 150,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.last_analyzed), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '采集时间',
          key: 'check_time',
          width: 150,
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
    this.get_oracle_table_stats(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_oracle_table_stats(`tags=${this.$route.params.tags} `)
    }, 1000 * 2000)
  },
  methods: {
    get_oracle_table_stats (parameter) {
      getOracleTableStats(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取日志信息错误 ${err}`)
      })
    },
    get_oracle_parameter (parameter) {
      console.log(parameter)
      this.get_oracle_table_stats(`tags=${this.$route.params.tags}&page=${parameter}`)
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
