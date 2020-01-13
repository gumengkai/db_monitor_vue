<template>
    <div class="layout">
      <Layout>
       <mysql-menu :value="'3'" :tags="this.Tags"></mysql-menu>
        <Row>
        <card>
        <Table size="small" border
               :columns="columns"
               :data="innodbinfo">

        </Table>
        </card>
          <card>
            <DatePicker @on-change="handleDaterangechange" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
            <row>
                <i-col span="12">
                  <br>
            <chart-line1 style="height: 250px;" :title=chart1_title :data1="checktimeData" :data2="bufferpoolhitData"></chart-line1>
                  <br>
            <chart-line2 style="height: 250px;" :title=chart2_title :data1="checktimeData" :data2="bufferpoolusedData" :data3="bufferpooldirtyData"></chart-line2>
                  <br>
            <chart-line1 style="height: 250px;" :title=chart3_title :data1="checktimeData" :data2="rowlockwaitsData"></chart-line1>
                  <br>
            <chart-line1 style="height: 250px;" :title=chart4_title :data1="checktimeData" :data2="rowlockwaittimeData"></chart-line1>
                  <br>
            <chart-line1 style="height: 250px;" :title=chart5_title :data1="checktimeData" :data2="dirtypagesData"></chart-line1>
                </i-col>
          <i-col span="12">
            <br>
            <chart-line1 style="height: 250px;" :title=chart6_title :data1="checktimeData" :data2="datafsyncsData"></chart-line1>
            <br>
            <chart-line2 style="height: 250px;" :title=chart7_title :data1="checktimeData" :data2="datareadData" :data3="datawrittenData"></chart-line2>
            <br>
            <chart-line2 style="height: 250px;" :title=chart8_title :data1="checktimeData" :data2="datareadsData" :data3="datawritesData"></chart-line2>
            <br>
            <chart-line1 style="height: 250px;" :title=chart9_title :data1="checktimeData" :data2="logwritesData"></chart-line1>
            <br>
            <chart-line1 style="height: 250px;" :title=chart10_title :data1="checktimeData" :data2="oslogwrittenData"></chart-line1>
              </i-col>
            </row>>
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
          title: 'innodb_buffer_pool',
          align: 'center',
          children: [
            {
              title: 'size',
              key: 'innodb_buffer_pool_size',
              width: 150,
              align: 'center',
              render: (h, params) => {
                const key_buffer_size = params.row.key_buffer_size
                return h('span', parseFloat(key_buffer_size / 1924 / 1024).toFixed(2) + 'MB')
              }
            }
          ]
        },
        {
          title: 'Pages',
          align: 'center',
          children: [
            {
              title: 'total',
              key: 'innodb_buffer_pool_pages_total',
              align: 'center',
              width: 70
            },
            {
              title: 'data',
              key: 'innodb_buffer_pool_pages_data',
              align: 'center',
              width: 70
            },
            {
              title: 'dirty',
              key: 'innodb_buffer_pool_pages_dirty',
              align: 'center',
              width: 70
            },
            {
              title: 'flushed',
              key: 'innodb_buffer_pool_pages_flushed',
              align: 'center',
              width: 90
            },
            {
              title: 'free',
              key: 'innodb_buffer_pool_pages_free',
              align: 'center',
              width: 70
            }
          ]
        },
        {
          title: 'IO',
          align: 'center',
          children: [
            {
              title: 'capacity',
              key: 'innodb_io_capacity',
              align: 'center',
              width: 90
            },
            {
              title: 'read_thread',
              key: 'innodb_read_io_threads',
              align: 'center',
              width: 110
            },
            {
              title: 'write_thread',
              key: 'innodb_write_io_threads',
              align: 'center',
              width: 110
            }
          ]
        },
        {
          title: 'Innodb_rows',
          align: 'center',
          children: [
            {
              title: 'read',
              key: 'innodb_rows_read',
              align: 'center',
              width: 70
            },
            {
              title: 'insert',
              key: 'innodb_rows_inserted',
              align: 'center',
              width: 70
            },
            {
              title: 'update',
              key: 'innodb_rows_updated',
              align: 'center',
              width: 80
            },
            {
              title: 'delete',
              key: 'innodb_rows_deleted',
              align: 'center',
              width: 80
            }
          ]
        }
      ],
      data: [],
      innodbinfo: [],
      create: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      checktimeData: [],
      chart1_title: ['innodb缓冲区命中率', '命中率'],
      bufferpoolhitData: [],
      chart2_title: ['innodb缓冲区使用率、脏块率', '使用率', '脏块率'],
      bufferpoolusedData: [],
      bufferpooldirtyData: [],
      chart3_title: ['Innodb锁等待次数', 'innodb锁等待次数'],
      rowlockwaitsData: [],
      chart4_title: ['Innodb锁平均等待时间', 'innodb锁平均等待时间'],
      rowlockwaittimeData: [],
      chart5_title: ['InnoDB脏页数量', 'innodb脏页数量'],
      dirtypagesData: [],
      chart6_title: ['InnoDB数据刷新频率', 'innodb数据刷新频率'],
      datafsyncsData: [],
      chart7_title: ['InnoDB读写量', '读数量(KB)', '写数量(KB)'],
      datareadData: [],
      datawrittenData: [],
      chart8_title: ['InnoDB读写次数', '读次数', '写次数'],
      datareadsData: [],
      datawritesData: [],
      chart9_title: ['InnoDB日志文件写次数', '日志写出次数'],
      logwritesData: [],
      chart10_title: ['InnoDB日志写出量', '日志写出量(KB)'],
      oslogwrittenData: []

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
        this.data = res.data.results
        this.innodbinfo = res.data.results.slice(0, 1)
        console.log(this.innodbinfo)
      }).catch(err => {
        this.$Message.error(`获取mysql资源信息错误 ${err}`)
      })
    },
    get_mysql_stat_his (parameter) {
      getMysqlStatHis(parameter).then(res => {
        this.data = res.data.results
        this.mysqlstatlist = res.data.results
        this.checktimeData = this.mysqlstatlist.map(mysql => mysql.check_time)
        this.bufferpoolhitData = this.mysqlstatlist.map(mysql => mysql.innodb_buffer_pool_hit)
        this.bufferpoolusedData = this.mysqlstatlist.map(mysql => (parseFloat(mysql.innodb_buffer_pool_pages_total - mysql.innodb_buffer_pool_pages_free) * 100 / mysql.innodb_buffer_pool_pages_total).toFixed(2))
        this.bufferpooldirtyData = this.mysqlstatlist.map(mysql => (parseFloat(mysql.innodb_buffer_pool_pages_dirty) * 100 / mysql.innodb_buffer_pool_pages_total).toFixed(2))
        this.rowlockwaitsData = this.mysqlstatlist.map(mysql => mysql.innodb_row_lock_waits)
        this.rowlockwaittimeData = this.mysqlstatlist.map(mysql => mysql.innodb_row_lock_time_avg)
        this.dirtypagesData = this.mysqlstatlist.map(mysql => mysql.innodb_buffer_pool_pages_dirty)
        this.datafsyncsData = this.mysqlstatlist.map(mysql => mysql.innodb_data_fsyncs)
        this.datareadData = this.mysqlstatlist.map(mysql => mysql.innodb_data_read)
        this.datawrittenData = this.mysqlstatlist.map(mysql => mysql.innodb_data_written)
        this.datareadsData = this.mysqlstatlist.map(mysql => mysql.innodb_data_reads)
        this.datawritesData = this.mysqlstatlist.map(mysql => mysql.innodb_data_writes)
        this.logwritesData = this.mysqlstatlist.map(mysql => mysql.innodb_log_writes)
        this.oslogwrittenData = this.mysqlstatlist.map(mysql => mysql.innodb_os_log_written)
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
.ivu-table th, .ivu-table td {
    text-align: center;
}
</style>
