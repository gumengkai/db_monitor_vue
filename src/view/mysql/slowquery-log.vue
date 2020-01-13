<template>
  <div class="layout">
     <Layout>
       <mysql-menu :value="'5'" :tags="this.Tags"></mysql-menu>
       <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
    <Card>
        <Table size="small"
               :columns="columns"
               :data="data">
        </Table>
        <br>
        <Page :total="count"
              :page_size='page_size'
              @on-change="get_mysql_parameter"
              show-elevator
              show-total />
    </Card>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { getMysqlSlowquery } from '@/api/mysql'
import { formatDate } from '@/libs/tools'
import { MysqlMenu } from '_c/top-menu'
export default {
  components: {
    MysqlMenu
  },
  data () {
    return {
      Tags: '',
      columns: [
        {
          title: '执行时间',
          key: 'start_time',
          width: 140,
          sortable: true,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.start_time), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '主机信息',
          key: 'client_host',
          width: 190
        },
        {
          title: '执行库',
          key: 'db_name',
          width: 100
        },
        {
          title: 'SQL文本',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, '详情')
            ])
          }
        },
        {
          title: '耗时',
          key: 'query_time',
          width: 100,
          sortable: true
        },
        {
          title: '锁耗时',
          key: 'lock_time',
          width: 100,
          sortable: true
        },
        {
          title: '扫描行数',
          key: 'rows_examined',
          width: 100,
          sortable: true
        },
        {
          title: '发送行数',
          key: 'rows_sent',
          width: 100
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
    this.get_mysql_slowquery(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_mysql_slowquery(`tags=${this.$route.params.tags} `)
    }, 1000 * 20)
  },
  methods: {
    get_mysql_slowquery (parameter) {
      getMysqlSlowquery(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取mysql慢查询解析错误 ${err}`)
      })
    },
    get_mysql_parameter (parameter) {
      console.log(parameter)
      this.get_mysql_slowquery(`tags=${this.$route.params.tags}&page=${parameter}`)
    },
    show (index) {
      this.$Modal.info({
        title: 'SQL文本信息',
        content: `${this.data[index].sql_text}`
      })
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
