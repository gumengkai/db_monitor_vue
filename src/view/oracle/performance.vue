<template>
     <Layout>
       <oracle-menu :value="'4'" :tags="this.Tags"></oracle-menu>
            <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
    <Tabs type="line" @on-click="changeTab" value="performance-report">
     <TabPane label="诊断报告" name="performance-report">
      <Card>
        <DatePicker @on-change="handleDaterangechange" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
      <Row>
      <i-col span="16">
        <br>
            <chart-line2 style="height: 250px;" :title=chart7_title :data1="checktimeData" :data2="dbtimeData" :data3="dbcpuData"></chart-line2>
      </i-col>
    <i-col span="8">
        <Table
               :columns="snaplistColumns"
               :data="snaplistData"
               height="230" >
        </Table>
       </i-col>
    </Row>
       </Card>
       <Row>
    <Col span="6">
    <Card>
     <p slot="title">生成报告</p>
    <Form ref="formData"
         :model="formData"
        :rules="ruleValidate">
        <FormItem label="报告类型" prop="report_type">
            <Select v-model="formData.report_type" placeholder="选择报告类型">
                <Option value="awr">awr</Option>
                <Option value="ash">ash</Option>
                <Option value="addm">addm</Option>
            </Select>
        </FormItem>
        <FormItem v-show="formData.report_type!='ash'" label="开始快照"
              label-position="top"
              prop="begin_snap">
            <Input v-model="formData.begin_snap"
                placeholder="开始快照ID" />
        </FormItem>
        <FormItem v-show="formData.report_type!='ash'" label="结束快照"
              label-position="top"
              prop="end_snap">
            <Input v-model="formData.end_snap"
                placeholder="结束快照ID" />
        </FormItem>
        <FormItem v-show="formData.report_type=='ash'" label="开始时间"
              label-position="top"
              prop="begin_snap">
            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="formData.begin_snap"
                placeholder="开始时间" />
        </FormItem>
        <FormItem v-show="formData.report_type=='ash'" label="结束时间"
              label-position="top"
              prop="end_snap">
            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="formData.end_snap"
                placeholder="结束时间" />
        </FormItem>
        </Form>
            <Button type="primary"
                    @click="create_oracle_report('formData')">提交</Button>
    </Card>
        </Col>
        <Col span="18">
        <Card>
       <p slot="title">报告列表</p>
         <Table
           :columns="reportlistColumns"
           :data="reportlistData"
           height="230" >
        </Table>
        </Card>
        </col>
        </Row>
       </TabPane>
       <TabPane label="性能图" name="performance-line">
      <Card>
        <DatePicker @on-change="handleDaterangechange" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
      <Row>
      <i-col span="12">
        <br>
            <chart-line2 style="height: 250px;" :title=chart1_title :data1="checktimeData" :data2="usercommitsData" :data3="execcountData"></chart-line2>
        <br>
            <chart-line2 style="height: 250px;" :title=chart3_title :data1="checktimeData" :data2="logicalreadsData" :data3="physicalreadsData"></chart-line2>
        <br>
            <chart-line2 style="height: 250px;" :title=chart5_title :data1="checktimeData" :data2="parsecountData" :data3="hardparsecountData"></chart-line2>
      </i-col>
    <i-col span="12">
      <br>
            <chart-line2 style="height: 250px;" :title=chart2_title :data1="checktimeData" :data2="sgasizeData" :data3="pgasizeData"></chart-line2>
      <br>
            <chart-line1 style="height: 250px;" :title=chart4_title :data1="checktimeData" :data2="redosizeData"></chart-line1>
      <br>
            <chart-line2 style="height: 250px;" :title=chart6_title :data1="checktimeData" :data2="memoryusedData"></chart-line2>
       </i-col>
    </Row>
              </Card>
       </TabPane>
    </Tabs>
      </Content>
        </Layout>
</template>

<script>
import { OracleMenu } from '_c/top-menu'
import { CountTo } from '_c/count-to'
import { getOracleStatHis, getOracleSnapList, getOracleReportList, createOracleReport, deleteOracleReport } from '@/api/oracle'
import { ChartLine1, ChartLine2 } from '_c/charts'
import { formatDate } from '@/libs/tools'
import config from '@/config/index.js'

export default {
  name: 'oracle_view',
  components: {
    OracleMenu,
    CountTo,
    ChartLine1,
    ChartLine2
  },
  data () {
    return {
      Tags: '',
      end: 0,
      asynEndVal: 487,
      integratedEndVal: 3,
      oracleinfoList: [],
      checktimeData: [],
      usercommitsData: [],
      execcountData: [],
      sgasizeData: [],
      pgasizeData: [],
      logicalreadsData: [],
      physicalreadsData: [],
      redosizeData: [],
      parsecountData: [],
      hardparsecountData: [],
      memoryusedData: [],
      dbtimeData: [],
      dbcpuData: [],
      snaplistData: [],
      snaplistColumns: [
        {
          title: '开始时间',
          key: 'BEGIN_INTERVAL_TIME',
          width: 120
        },
        {
          title: '结束时间',
          key: 'END_INTERVAL_TIME',
          width: 120
        },
        {
          title: '快照ID',
          key: 'SNAP_ID',
          width: 100
        }
      ],
      chart1_title: ['exec count&user commits', 'user commits', 'exec count'],
      chart2_title: ['sga size&pga size', 'sga size', 'pga size'],
      chart3_title: ['session logical reads&physical reads', 'session logical reads', 'session physical reads'],
      chart4_title: ['redo size(KB)', 'redo size'],
      chart5_title: ['parse&hard parse', 'parse count', 'parse count(hard)'],
      chart6_title: ['memory used percent(%)', 'memory used percent'],
      chart7_title: ['db time&db cpu', 'db time', 'db cpu'],
      daterangeValue: null,
      startTime: '',
      endTime: '',
      formData: {
        tags: '',
        report_type: 'awr',
        begin_snap: '',
        end_snap: ''
      },
      ruleValidate: {
        report_type: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ]
      },
      reportlistData: [],
      reportlistColumns: [
        {
          title: '开始时间',
          key: 'begin_time',
          width: 160
        },
        {
          title: '结束时间',
          key: 'end_time',
          width: 160
        },
        {
          title: '报告类型',
          key: 'report_type',
          width: 100
        },
        {
          title: '状态',
          key: 'status',
          width: 120,
          render: (h, params) => {
            const statusMap = {
              '0': '已生成',
              '1': '正在生成',
              '2': '生成失败'
            }
            const status = params.row.status
            return h('div', statusMap[status])
          }
        },
        {
          title: '创建时间',
          width: 140,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.create_time), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '操作',
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
                    this.show_oracle_report(params.row.file_path)
                  }
                }
              }, '查看'),
              h('Poptip', {
                props: {
                  confirm: true,
                  title: '确定要删除吗！',
                  transfer: true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  'on-ok': () => {
                    this.delete_oracle_report(params.index, params.row.id)
                  }
                }
              }, [h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                }
              }, '删除')])
            ])
          }
        }
      ]
    }
  },
  created () {
    this.get_oracle_stat_his(`tags=${this.$route.params.tags} `)
    this.get_oracle_snap_list(`tags=${this.$route.params.tags} `)
    this.get_oracle_report_list(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_oracle_stat_his(`tags=${this.$route.params.tags} `)
      this.get_oracle_report_list(`tags=${this.$route.params.tags} `)
    }, 1000 * 20)
  },
  methods: {
    init () {
    },
    get_oracle_stat_his (parameter) {
      getOracleStatHis(parameter).then(res => {
        this.oracleinfoList = res.data.results
        this.checktimeData = this.oracleinfoList.map(oracle => oracle.check_time)
        this.usercommitsData = this.oracleinfoList.map(oracle => oracle.user_commits)
        this.execcountData = this.oracleinfoList.map(oracle => oracle.exec_count)
        this.sgasizeData = this.oracleinfoList.map(oracle => oracle.sga_size)
        this.pgasizeData = this.oracleinfoList.map(oracle => oracle.pga_size)
        this.logicalreadsData = this.oracleinfoList.map(oracle => oracle.logical_reads)
        this.physicalreadsData = this.oracleinfoList.map(oracle => oracle.physical_reads)
        this.redosizeData = this.oracleinfoList.map(oracle => oracle.redo_size)
        this.parsecountData = this.oracleinfoList.map(oracle => oracle.total_parse_count)
        this.hardparsecountData = this.oracleinfoList.map(oracle => oracle.hard_parse_count)
        this.memoryusedData = this.oracleinfoList.map(oracle => oracle.memory_used_percent)
        this.dbtimeData = this.oracleinfoList.map(oracle => oracle.dbtime)
        this.dbcpuData = this.oracleinfoList.map(oracle => oracle.dbcpu)
        console.log(this.oracleinfo)
      }).catch(err => {
        this.$Message.error(`获取Oracle资源信息错误 ${err}`)
      })
    },
    get_oracle_snap_list (parameter) {
      getOracleSnapList(parameter).then(res => {
        this.snaplistData = res.data
        console.log(this.snaplistData)
      }).catch(err => {
        this.$Message.error(`获取快照错误 ${err}`)
      })
    },
    get_oracle_report_list (parameter) {
      getOracleReportList(parameter).then(res => {
        this.reportlistData = res.data.results
        console.log(this.reportlistData)
      }).catch(err => {
        this.$Message.error(`获取Oracle报告列表错误 ${err}`)
      })
    },
    show_oracle_report (file_path) {
      debugger
      const reporturl = config.baseUrl.pro + 'oracle/show_report?report_path=' + file_path
      window.open(reporturl)
    },
    create_oracle_report (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formData.tags = this.Tags
          createOracleReport(this.formData).then(res => {
            this.$Message['info']({
              backgroud: true,
              content: '正在生成报告'
            })
          }).catch(err => {
            this.$Message.error(`生成Oracle报告错误 ${err}`)
          })
        }
      })
    },
    delete_oracle_report (index, id) {
      console.log(index, id)
      deleteOracleReport(id).then(res => {
        console.log(res)
        this.$Message.success('删除Oracle配置成功!')
        this.data.splice(index, 1)
      }).catch(err => {
        console.log(err.response)
        this.$Message.error({
          content: `删除Oracle配置错误 ${Object.entries(err.response.data)}`,
          duration: 10,
          closable: true
        })
      })
    },
    handleDaterangechange (daterange) {
      this.daterangeValue = daterange
      this.startTime = daterange[0]
      this.endTime = daterange[1]
      this.get_oracle_stat_his(`tags=${this.$route.params.tags}&start_time=${this.startTime}&end_time=${this.endTime}`)
      this.get_oracle_snap_list(`tags=${this.$route.params.tags}&start_time=${this.startTime}&end_time=${this.endTime}`)
    },
    changeTab (value) {
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less">
@baseColor: ~"#dc9387";
.countto-page-row{
  height: 200px;
}
.count-to-con{
  display: block;
  width: 100%;
  text-align: center;
}
.count-text{
  font-size: 50px;
  color: @baseColor;
}
.slot-text{
  font-size: 22px;
}
.unit-class{
  font-size: 30px;
  color: @baseColor;
}
.layout-footer-center{
  text-align: center;
}
.count-style{
  font-size: 50px;
}
</style>
