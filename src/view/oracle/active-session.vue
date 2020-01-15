<template>
  <div class="layout">
     <Layout>
       <oracle-menu :value="'3'" :tags="this.Tags"></oracle-menu>
       <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
         <row>
           <Col span="12">
         <card>
          <row>
            <Alert>
             吞吐量(每秒)
         </Alert>
          <Col span="5">
           <infor-card shadow style="background: #97d4b7;">
          <count-to-int :end="this.logonData" count-class="count-style"/>
          <p>登录数</p>
        </infor-card>
          </Col>
            <Col span="5" offset="1">
           <infor-card shadow style="background: #97d4b7;">
          <count-to-int :end="this.execData" count-class="count-style"/>
          <p>执行数</p>
        </infor-card>
          </Col>
            <Col span="5" offset="1">
           <infor-card shadow style="background: #97d4b7;">
          <count-to-int :end="this.commitData" count-class="count-style"/>
          <p>提交数</p>
        </infor-card>
          </Col>
            <Col span="5" offset="1">
           <infor-card shadow style="background: #97d4b7;">
          <count-to-int :end="this.rollbackData" count-class="count-style"/>
          <p>回滚数</p>
        </infor-card>
          </Col>
          </row>
        </card>
           </Col>
           <Col span="6" >
         <card>
          <row>
            <Alert>
             会话(实时)
         </Alert>
            <Col span="11">
           <infor-card shadow style="background: #97d4b7;">
          <count-to-int :end="this.sessionactiveCount" count-class="count-style"/>
          <p>活动</p>
        </infor-card>
          </Col>
            <Col span="11" offset="1">
           <infor-card shadow style="background: #97d4b7;">
          <count-to-int :end="this.sessioninactiveCount" count-class="count-style"/>
          <p>非活动</p>
        </infor-card>
          </Col>
          </row>
        </card>
           </Col>
           <Col span="6">
         <card>
          <row>
            <Alert>
             阻塞&等待(实时)
         </Alert>
            <Col span="11">
           <infor-card shadow style="background: #97d4b7;">
          <count-to-int :end="this.rowlockCount" count-class="count-style"/>
          <p>行锁</p>
        </infor-card>
          </Col>
            <Col span="11" offset="1">
           <infor-card shadow style="background: #97d4b7;">
          <count-to-int :end="this.allblockCount" count-class="count-style"/>
          <p>所有</p>
        </infor-card>
          </Col>
          </row>
        </card>
           </Col>

         </row>

    <Card>
      <Tabs @on-click="changeTab" value="active_session">
        <TabPane label="活动会话(实时)" name="active_session">
        <Table size="small"
               :columns="activesessionColumns"
               :data="activesessionData">
        </Table>
        </TabPane>
        <TabPane label="阻塞&等待会话" name="blocking_session">
          <DatePicker @on-change="handleDaterangechange" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
          <br>
          <br>
          <chart-line6 style="height: 250px;" :title=chart1_title :data1="checktimeData" :data2="enq_tx_row_lock_contention_Data" :data3="enq_tm_contention_Data" :data4="row_cache_lock_Data" :data5="library_cache_lock_Data" :data6="enq_tx_contention_Data" :data7="lock_wait_others_Data"></chart-line6>
        <br>
          <card>
          <p slot="title">当前等待会话列表</p>
          <Table size="small"
               :columns="blockingsessionColumns"
               :data="blockingsessionData">
        </Table>
          </card>
        </TabPane>
      </Tabs>
    </Card>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { getOracleStat, getOracleStatHis, getOracleActiveSession, getOracleBlockingSession, getOracleSessionCount, getOracleBlockCount } from '@/api/oracle'
import { OracleMenu } from '_c/top-menu'
import InforCard from '_c/info-card'
import { CountTo, CountToInt } from '_c/count-to'
import { ChartLine6 } from '_c/charts'
export default {
  components: {
    OracleMenu,
    InforCard,
    CountTo,
    CountToInt,
    ChartLine6
  },
  data () {
    return {
      Tags: '',
      activesessionColumns: [
        {
          title: '登录时间',
          key: 'LOGON_TIME',
          width: 140
        },
        {
          title: 'SID',
          key: 'SID',
          width: 80
        },
        {
          title: 'SQL_ID',
          key: 'SQL_ID',
          width: 130
        },
        {
          title: '等待事件',
          key: 'EVENT',
          width: 200
        },
        {
          title: '阻塞会话',
          key: 'BLOCKING_SESSION',
          width: 120
        },
        {
          title: '用户名',
          key: 'USERNAME',
          width: 100
        },
        {
          title: '用户名(OS)',
          key: 'OSUSER',
          width: 100
        },
        {
          title: 'MACHINE',
          key: 'MACHINE',
          width: 180
        },
        {
          title: 'PROGRAM',
          key: 'PROGRAM',
          width: 120
        },
        {
          title: 'MODULE',
          key: 'MODULE',
          width: 130
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
          title: 'OWNER',
          key: 'OWNER',
          width: 130
        },
        {
          title: 'OBJECT_NAME',
          key: 'OBJECT_NAME',
          width: 130
        },
        {
          title: 'OBJECT_TYPE',
          key: 'OBJECT_TYPE',
          width: 130
        }
      ],
      blockingsessionColumns: [
        {
          title: '登录时间',
          key: 'LOGON_TIME',
          width: 140
        },
        {
          title: 'SID',
          key: 'SID',
          width: 80
        },
        {
          title: 'SQL_ID',
          key: 'SQL_ID',
          width: 130
        },
        {
          title: '等待事件',
          key: 'EVENT',
          width: 200
        },
        {
          title: '阻塞会话',
          key: 'BLOCKING_SESSION',
          width: 120
        },
        {
          title: '用户名',
          key: 'USERNAME',
          width: 100
        },
        {
          title: '用户名(OS)',
          key: 'OSUSER',
          width: 100
        },
        {
          title: 'MACHINE',
          key: 'MACHINE',
          width: 180
        },
        {
          title: 'PROGRAM',
          key: 'PROGRAM',
          width: 120
        },
        {
          title: 'MODULE',
          key: 'MODULE',
          width: 130
        },
        {
          title: 'SQL_TEXT',
          key: 'OWNER',
          width: 130
        },
        {
          title: 'OWNER',
          key: 'OWNER',
          width: 130
        },
        {
          title: 'OBJECT_NAME',
          key: 'OBJECT_NAME',
          width: 130
        },
        {
          title: 'OBJECT_TYPE',
          key: 'OBJECT_TYPE',
          width: 130
        }
      ],
      checktimeData: [],
      activesessionData: [],
      activesessionCount: 0,
      blockingsessionData: [],
      blockingsessionCount: 0,
      sessioncountData: [],
      sessionactiveCount: 0,
      sessioninactiveCount: 0,
      blockcountData: [],
      rowlockCount: 0,
      allblockCount: 0,
      logonData: 0,
      execData: 0,
      commitData: 0,
      rollbackData: 0,
      enq_tx_row_lock_contention_Data: [],
      enq_tm_contention_Data: [],
      row_cache_lock_Data: [],
      library_cache_lock_Data: [],
      enq_tx_contention_Data: [],
      lock_wait_others_Data: [],
      chart1_title: ['锁等待数量趋势', 'enq: TX - row lock contention', 'enq: TM - contention', 'row cache lock', 'library cache lock', 'enq: TX - contention', 'others'],
      page_size: 10,
      startTime: '',
      endTime: '',
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
    this.get_oracle_stat(`tags=${this.$route.params.tags} `)
    this.get_oracle_active_session(`tags=${this.$route.params.tags} `)
    this.get_oracle_session_count(`tags=${this.$route.params.tags} `)
    this.get_oracle_block_count(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_oracle_stat(`tags=${this.$route.params.tags} `)
      this.get_oracle_active_session(`tags=${this.$route.params.tags} `)
      this.get_oracle_session_count(`tags=${this.$route.params.tags} `)
      this.get_oracle_block_count(`tags=${this.$route.params.tags} `)
    }, 1000 * 2000)
  },
  methods: {
    get_oracle_stat (parameter) {
      getOracleStat(parameter).then(res => {
        this.oracleinfo = res.data.results[0]
        this.logonData = this.oracleinfo.logons_cumulative
        this.execData = this.oracleinfo.exec_count
        this.commitData = this.oracleinfo.user_commits
        this.rollbackData = this.oracleinfo.user_rollbacks
      }).catch(err => {
        this.$Message.error(`获取Oracle资源信息错误 ${err}`)
      })
    },
    get_oracle_stat_his (parameter) {
      getOracleStatHis(parameter).then(res => {
        this.oracleinfoList = res.data.results
        this.checktimeData = this.oracleinfoList.map(oracle => oracle.check_time)
        this.enq_tx_row_lock_contention_Data = this.oracleinfoList.map(oracle => oracle.enq_tx_row_lock_contention)
        this.enq_tm_contention_Data = this.oracleinfoList.map(oracle => oracle.enq_tm_contention)
        this.row_cache_lock_Data = this.oracleinfoList.map(oracle => oracle.row_cache_lock)
        this.library_cache_lock_Data = this.oracleinfoList.map(oracle => oracle.library_cache_lock)
        this.enq_tx_contention_Data = this.oracleinfoList.map(oracle => oracle.enq_tx_contention)
        this.lock_wait_others_Data = this.oracleinfoList.map(oracle => oracle.lock_wait_others)
      }).catch(err => {
        this.$Message.error(`获取Oracle历史状态数据错误 ${err}`)
      })
    },
    get_oracle_active_session (parameter) {
      getOracleActiveSession(parameter).then(res => {
        this.activesessionData = res.data
        this.activesessionCount = res.data.length
        console.log(this.activesessionData)
      }).catch(err => {
        this.$Message.error(`获取活动会话信息错误 ${err}`)
      })
    },
    get_oracle_blocking_session (parameter) {
      getOracleBlockingSession(parameter).then(res => {
        this.blockingsessionData = res.data
        this.blockingsessionCount = res.data.length
        console.log(this.blockingsessionData)
      }).catch(err => {
        this.$Message.error(`获取阻塞会话信息错误 ${err}`)
      })
    },
    get_oracle_session_count (parameter) {
      getOracleSessionCount(parameter).then(res => {
        this.sessioncountData = res.data
        this.sessionactiveCount = this.sessioncountData['ACTIVE']
        this.sessioninactiveCount = this.sessioncountData['INACTIVE']
        console.log(this.sessioncountData)
      }).catch(err => {
        this.$Message.error(`获取日志信息错误 ${err}`)
      })
    },
    get_oracle_block_count (parameter) {
      getOracleBlockCount(parameter).then(res => {
        this.blockcountData = res.data
        this.rowlockCount = this.blockcountData['ROW_LOCK']
        this.allblockCount = this.blockcountData['ALL']
        console.log(this.blockcountData)
      }).catch(err => {
        this.$Message.error(`获取日志信息错误 ${err}`)
      })
    },
    handleDaterangechange (daterange) {
      this.daterangeValue = daterange
      this.startTime = daterange[0]
      this.endTime = daterange[1]
      this.get_oracle_stat_his(`tags=${this.$route.params.tags}&start_time=${this.startTime}&end_time=${this.endTime}`)
    },
    show (index) {
      this.$Modal.info({
        title: 'SQL文本信息',
        content: `${this.activesessionData[index].SQL_TEXT}`
      })
    },
    changeTab (value) {
      if (value === 'blocking_session') {
        this.get_oracle_stat_his(`tags=${this.$route.params.tags} `)
        this.get_oracle_blocking_session(`tags=${this.$route.params.tags} `)
      }
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
