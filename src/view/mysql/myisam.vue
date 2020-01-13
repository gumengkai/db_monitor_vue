<template>
    <div class="layout">
      <Layout>
       <mysql-menu :value="'2'" :tags="this.Tags"></mysql-menu>
        <Row>
        <card>
        <Table size="small" border
               :columns="columns"
               :data="myisaminfo">

        </Table>
        </card>
        <card>
          <p slot="title" style="font-size: larger">
              键缓存
          </p>
        <Table size="small" border
               :columns="columns1"
               :data="myisaminfo">
        </Table>
        </card>
          <card>
            <DatePicker @on-change="handleDaterangechange" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
          <row>
                <i-col span="12">
                  <br>
            <chart-line2 style="height: 250px;" :title=chart1_title :data1="checktimeData" :data2="openfilesData" :data3="opentablesData"></chart-line2>
                  <br>
            <chart-line1 style="height: 250px;" :title=chart2_title :data1="checktimeData" :data2="slowqueriesData"></chart-line1>
                  <br>
            <chart-line4 style="height: 250px;" :title=chart3_title :data1="checktimeData" :data2="mysqlselData" :data3="mysqlinsData" :data4="mysqlupdData" :data5="mysqldelData"></chart-line4>
              </i-col>
                <i-col span="12">
                  <br>
            <chart-line1 style="height: 250px;" :title=chart4_title :data1="checktimeData" :data2="selectscanData"></chart-line1>
                  <br>
            <chart-line4 style="height: 250px;" :title=chart5_title :data1="checktimeData" :data2="keyreadrequestsData" :data3="keyreadsData" :data4="keywriterequestsData" :data5="keywritesData"></chart-line4>
                  <br>
            <chart-line2 style="height: 250px;" :title=chart6_title :data1="checktimeData" :data2="keyreadrateData" :data3="keywriterateData"></chart-line2>
              </i-col>
          </row>
          </card>
        </Row>
      </Layout>
  </div>
</template>

<script>
import { MysqlMenu } from '_c/top-menu'
import { getMysqlStat, getMysqlStatHis } from '@/api/mysql'
import { ChartPie, ChartLine1, ChartLine2, ChartLine3, ChartLine4 } from '_c/charts'

export default {
  name: 'mysql_myisam',
  components: {
    ChartLine1,
    ChartLine2,
    ChartLine3,
    ChartLine4,
    ChartPie,
    MysqlMenu
  },
  data () {
    return {
      Tags: '',
      show: false,
      columns: [
        {
          title: '连接',
          align: 'center',
          children: [
            {
              title: '最大连接数',
              key: 'max_connections',
              width: 100,
              align: 'center'
            },
            {
              title: '当前连接数',
              key: 'max_connections',
              width: 100,
              align: 'center'
            },
            {
              title: '最大连接错误数',
              key: 'max_connections',
              width: 130,
              align: 'center'
            }

          ]
        },
        {
          title: '文件',
          align: 'center',
          children: [
            {
              title: '最大打开文件数量',
              key: 'open_files_limit',
              align: 'center'
            },
            {
              title: '当前打开文件数',
              key: 'open_files',
              align: 'center'
            }

          ]
        },
        {
          title: '表',
          align: 'center',
          children: [
            {
              title: '最大打开表数量',
              key: 'table_open_cache',
              align: 'center'
            },
            {
              title: '当前打开表数量',
              key: 'open_tables',
              align: 'center'
            }

          ]
        }
      ],
      columns1: [
        {
          title: '_buffer_size',
          align: 'center',
          children: [
            {
              title: 'key',
              key: 'key_buffer_size',
              width: 80,
              align: 'center',
              render: (h, params) => {
                const key_buffer_size = params.row.key_buffer_size
                return h('span', parseFloat(key_buffer_size / 1924 / 1024).toFixed(2) + 'MB')
              }
            },
            {
              title: 'sort',
              key: 'sort_buffer_size',
              width: 90,
              align: 'center',
              render: (h, params) => {
                const sort_buffer_size = params.row.sort_buffer_size
                return h('span', parseFloat(sort_buffer_size / 1924).toFixed(2) + 'KB')
              }
            },
            {
              title: 'join',
              key: 'join_buffer_size',
              width: 90,
              align: 'center',
              render: (h, params) => {
                const join_buffer_size = params.row.join_buffer_size
                return h('span', parseFloat(join_buffer_size / 1924).toFixed(2) + 'KB')
              }
            }

          ]
        },
        {
          title: 'key_blocks_',
          align: 'center',
          children: [
            {
              title: 'unused',
              key: 'key_blocks_unused',
              align: 'center',
              width: 80
            },
            {
              title: 'used',
              key: 'key_blocks_used',
              align: 'center',
              width: 70
            },
            {
              title: 'not flushed',
              key: 'key_blocks_not_flushed',
              align: 'center',
              width: 110
            }
          ]
        },
        {
          title: 'rate',
          align: 'center',
          children: [
            {
              title: 'key_blocks_used',
              key: 'table_open_cache',
              align: 'center',
              render: (h, params) => {
                const key_blocks_used = params.row.key_blocks_used
                const key_blocks_unused = params.row.key_blocks_unused
                return h('span', parseFloat(key_blocks_used / (key_blocks_used + key_blocks_unused)).toFixed(2) + '%')
              }
            },
            {
              title: 'key_buffer_read',
              key: 'table_open_cache',
              align: 'center',
              render: (h, params) => {
                const Key_reads = params.row.Key_reads
                const Key_read_requests = params.row.key_read_requests
                return h('span', parseFloat(Key_reads / (Key_reads + Key_read_requests)).toFixed(2) + '%')
              }
            },
            {
              title: 'key_buffer_write',
              key: 'table_open_cache',
              align: 'center',
              render: (h, params) => {
                const Key_writes = params.row.Key_writes
                const key_write_requests = params.row.key_write_requests
                return h('span', parseFloat(Key_writes / (Key_writes + key_write_requests)).toFixed(2) + '%')
              }
            }

          ]
        }
      ],
      data: [],
      myisaminfo: [],
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      checktimeData: [],
      chart1_title: ['打开文件、表数量', '打开文件数量', '打开表数量'],
      opentablesData: [],
      openfilesData: [],
      chart2_title: ['慢查询', '慢查询数量'],
      slowqueriesData: [],
      chart3_title: ['每秒SQL执行次数', 'mysql_sel', 'mysql_ins', 'mysql_upd', 'mysql_del'],
      mysqlselData: [],
      mysqlinsData: [],
      mysqlupdData: [],
      mysqldelData: [],
      chart4_title: ['全表扫描次数', 'select scan'],
      selectscanData: [],
      chart5_title: ['MyISAM读写次数', 'key_read_requests', 'key_reads', 'key_write_requests', 'key_writes'],
      keyreadrequestsData: [],
      keyreadsData: [],
      keywriterequestsData: [],
      keywritesData: [],
      chart6_title: ['MyISAM Key Buffer读写利用率', 'key_buffer_read_rate', 'key_buffer_write_rate'],
      keyreadrateData: [],
      keywriterateData: [],
      daterangeValue: null,
      startTime: '',
      endTime: ''
    }
  },
  computed: {
    access () {
      return this.$store.state.user.access
    }
  },
  created () {
    this.get_mysql_stat(`tags=${this.$route.params.tags} `)
    this.get_mysql_stat_his(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_mysql_stat(`tags=${this.$route.params.tags} `)
      this.get_mysql_stat_his(`tags=${this.$route.params.tags} `)
    }, 1000 * 20)
  },
  methods: {
    get_mysql_stat (parameter) {
      getMysqlStat(parameter).then(res => {
        this.myisaminfo = res.data.results.slice(0, 1)
        console.log(this.myisaminfo)
      }).catch(err => {
        this.$Message.error(`获取mysql资源信息错误 ${err}`)
      })
    },
    get_mysql_stat_his (parameter) {
      getMysqlStatHis(parameter).then(res => {
        this.mysqlstatlist = res.data.results
        this.checktimeData = this.mysqlstatlist.map(mysql => mysql.check_time)
        this.openfilesData = this.mysqlstatlist.map(mysql => mysql.open_files)
        this.opentablesData = this.mysqlstatlist.map(mysql => mysql.open_tables)
        this.slowqueriesData = this.mysqlstatlist.map(mysql => mysql.slow_queries)
        this.mysqlselData = this.mysqlstatlist.map(mysql => mysql.mysql_sel)
        this.mysqlinsData = this.mysqlstatlist.map(mysql => mysql.mysql_ins)
        this.mysqlupdData = this.mysqlstatlist.map(mysql => mysql.mysql_upd)
        this.mysqldelData = this.mysqlstatlist.map(mysql => mysql.mysql_del)
        this.selectscanData = this.mysqlstatlist.map(mysql => mysql.select_scan)
        this.keyreadrequestsData = this.mysqlstatlist.map(mysql => mysql.key_read_requests)
        this.keyreadsData = this.mysqlstatlist.map(mysql => mysql.key_reads)
        this.keywriterequestsData = this.mysqlstatlist.map(mysql => mysql.key_write_requests)
        this.keywritesData = this.mysqlstatlist.map(mysql => mysql.key_writes)
        this.keyreadrateData = this.mysqlstatlist.map(mysql => (parseFloat(mysql.key_reads) * 100 / mysql.key_read_requests).toFixed(2))
        this.keywriterateData = this.mysqlstatlist.map(mysql => (parseFloat(mysql.key_writes) * 100 / mysql.key_write_requests).toFixed(2))
        console.log(this.mysqlstatlist)
      }).catch(err => {
        this.$Message.error(`获取mysql资源信息错误 ${err}`)
      })
    },
    handleDaterangechange (daterange) {
      this.daterangeValue = daterange
      this.startTime = daterange[0]
      this.endTime = daterange[1]
      this.get_mysql_stat_his(`tags=${this.$route.params.tags}&start_time=${this.startTime}&end_time=${this.endTime}`)
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
