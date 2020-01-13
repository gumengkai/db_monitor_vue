<template>
  <div class="layout">
     <Layout>
       <oracle-menu :value="'2'" :tags="this.Tags" ></oracle-menu>
       <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
    <Card>
      <p slot="title">表空间</p>
        <Table size="small"
               :columns="columns_tablespace"
               :data="data_tablespace">
        </Table>
        <br>
        <Page :total="count"
              :page_size='page_size'
              @on-change="get_oracle_parameter"
              show-elevator
              show-total />
    </Card>
         <row>
           <i-col span="12">
     <card>
       <p slot="title">临时表空间</p>
          <Table size="small"
               :columns="columns_temp_tablespace"
               :data="data_temp_tablespace">
        </Table>
     </Card>
          <card>
          <p slot="title">UNDO表空间</p>
          <Table size="small"
               :columns="columns_undo_tablespace"
               :data="data_undo_tablespace">
        </Table>
    </Card>
             <card>
          <p slot="title">控制文件</p>
          <Table size="small"
               :columns="columns_controlfile"
               :data="data_controlfile">
        </Table>
    </Card>
             <Modal cancel-text=""
                    v-model="modal_undo"
                    title="UNDO表空间使用信息">
               <Table size="small"
                      :columns="columns_undoused"
                      :data="data_undo_tablespace_used">

               </Table>
             </Modal>
        </i-col>
           <i-col span="12">
             <card>
               <a href="#" slot="extra" @click.prevent="get_oracle_redolog_switch">
            <Icon type="ios-loop-strong"></Icon>
            查看日志切换频率
        </a>
          <p slot="title">在线重做日志</p>
          <Table size="small"
               :columns="columns_redolog"
               :data="data_redolog">
        </Table>
               <Modal cancel-text=""
                      v-model="modal_redo" width="50"
                      :mask-closable="false"
                      title="redo日志切换频率">
                 <div v-if="modal_redo">
                   <Select v-model="redo_range" style="width:110px" placeholder="选择日期范围" @on-change="get_oracle_redolog_switch">
                     <Option value="1">24小时</Option>
                     <Option value="7">7天</Option>
                     <Option value="15">15天</Option>
                     <Option value="30">30天</Option>
                   </Select>
                 <chart-bar style="height: 250px;" :show="modal_redo" :title="chart_title" :data1="statdateData" :data2="redocntData" ></chart-bar>
                 </div>
               </Modal>
    </Card>
        </i-col>
         </Row>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { OracleMenu } from '_c/top-menu'
import { getOracleTableSpace, getOracleTempTableSpace, getOracleUndoTableSpace,
  getOracleUndoTableSpaceUsed, getOracleControlFile, getOracleRedoLog, getOracleRedoLogSwitch } from '@/api/oracle'
import formatDate from '@/libs/tools'
import { Tag } from 'iview'
import { ChartBar, ChartLine1 } from '_c/charts'

export default {
  components: {
    OracleMenu,
    ChartBar,
    ChartLine1
  },
  data () {
    return {
      Tags: '',
      show: false,
      redo_range: 7,
      modal_undo: false,
      modal_redo: false,
      columns_tablespace: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '表空间',
          width: 100,
          sortable: true,
          render: (h, params) => {
            const tags = params.row.tags
            const tablespace_name = params.row.tablespace_name
            return h('a', {
              on: {
                'click': () => {
                  this.gotoTablespace(tags, tablespace_name)
                }
              }
            }, tablespace_name)
          }
        },
        {
          title: '数据文件数量',
          key: 'datafile_count',
          width: 120
        },
        {
          title: '总大小(G)',
          key: 'total_size',
          width: 100
        },
        {
          title: '使用大小(G)',
          key: 'used_size',
          width: 120
        },
        {
          title: '剩余空间(G)',
          key: 'free_size',
          width: 120,
          sortable: true
        },
        {
          title: '日均使用大小(MB)',
          key: 'used_mb',
          width: 160,
          sortable: true
        },
        {
          title: '预计支持天数',
          width: 150,
          sortable: true,
          render: (h, params) => {
            const used_mb = Number(params.row.used_mb)
            const free_mb = Number(params.row.free_size * 1024)
            const free_days = (free_mb / used_mb).toFixed(2)
            return h('div', free_days)
          }
        },
        {
          title: '使用率',
          key: 'percent_used',
          sortType: 'desc',
          sortable: true,
          width: 110,
          render: (h, params) => {
            const percent_used = params.row.percent_used
            if (percent_used >= 95) {
              return h(Tag, { props: { color: 'error' } }, percent_used + '%')
            }
            if (percent_used >= 80) {
              return h(Tag, { props: { color: 'warning' } }, percent_used + '%')
            } else {
              return h(Tag, { props: { color: 'success' } }, percent_used + '%')
            }
          }
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
      columns_temp_tablespace: [
        {
          title: '临时表空间',
          width: 130,
          sortable: true,
          render: (h, params) => {
            const tags = params.row.tags
            const tablespace_name = params.row.temptablespace_name
            return h('a', {
              on: {
                'click': () => {
                  this.gotoTemptablespace(tags, tablespace_name)
                }
              }
            }, tablespace_name)
          }
        },
        {
          title: '总大小(M)',
          key: 'total_size',
          width: 100
        },
        {
          title: '使用空间(M)',
          key: 'used_size',
          width: 110
        },
        {
          title: '使用率',
          key: 'percent_used',
          width: 110,
          render: (h, params) => {
            const percent_used = params.row.percent_used
            if (percent_used >= 90) {
              return h(Tag, { props: { color: 'error' } }, percent_used + '%')
            }
            if (percent_used >= 80) {
              return h(Tag, { props: { color: 'warning' } }, percent_used + '%')
            } else {
              return h(Tag, { props: { color: 'success' } }, percent_used + '%')
            }
          }
        }
      ],
      columns_undo_tablespace: [
        {
          title: 'UNDO表空间',
          width: 130,
          sortable: true,
          render: (h, params) => {
            const tags = params.row.tags
            const tablespace_name = params.row.undotablespace_name
            return h('a', {
              on: {
                'click': () => {
                  this.gotoUndotablespace(tags, tablespace_name)
                }
              }
            }, tablespace_name)
          }
        },
        {
          title: '总大小(M)',
          key: 'total_size',
          width: 100
        },
        {
          title: '使用空间(M)',
          width: 130,
          sortable: true,
          render: (h, params) => {
            const tablespace_name = params.row.undotablespace_name
            return h('a', {
              on: {
                'click': () => {
                  this.get_oracle_undotablespace_used(`tags=${this.$route.params.tags}&undotablespace_name=${tablespace_name} `)
                  this.modal_undo = true
                }
              }
            }, params.row.used_size)
          }
        },
        {
          title: '使用率',
          key: 'percent_used',
          width: 110,
          render: (h, params) => {
            const percent_used = params.row.percent_used
            if (percent_used >= 90) {
              return h(Tag, { props: { color: 'error' } }, percent_used + '%')
            }
            if (percent_used >= 80) {
              return h(Tag, { props: { color: 'warning' } }, percent_used + '%')
            } else {
              return h(Tag, { props: { color: 'success' } }, percent_used + '%')
            }
          }
        }
      ],
      columns_undoused: [
        {
          title: 'UNDO表空间',
          key: 'TABLESPACE_NAME',
          width: 180
        },
        {
          title: '状态',
          key: 'STATUS',
          width: 150
        },
        {
          title: '大小(MB)',
          key: 'MB',
          width: 150
        }
      ],
      columns_controlfile: [
        {
          title: '控制文件',
          key: 'name',
          width: 350
        },
        {
          title: '大小(M)',
          key: 'size',
          width: 100
        }
      ],
      columns_redolog: [
        {
          title: '组',
          key: 'group_no',
          width: 30
        },
        {
          title: '序号',
          key: 'sequence_no',
          width: 60
        },
        {
          title: '日志文件',
          key: 'member',
          width: 300
        },
        {
          title: '大小(MB)',
          key: 'size',
          width: 100
        },
        {
          title: '是否归档',
          key: 'archived',
          width: 100
        }
      ],
      data_undo_tablespace_used: [],
      data_tablespace: [],
      data_temp_tablespace: [],
      data_undo_tablespace: [],
      data_controlfile: [],
      data_redolog: [],
      statdateData: [],
      redocntData: [],
      chart_title: ['日志切换次数', 'log count'],
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
    this.get_oracle_tablespace_list(`tags=${this.$route.params.tags} `)
    this.get_oracle_temptablespace_list(`tags=${this.$route.params.tags} `)
    this.get_oracle_undotablespace_list(`tags=${this.$route.params.tags} `)
    this.get_oracle_controlfile(`tags=${this.$route.params.tags} `)
    this.get_oracle_redolog(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_oracle_tablespace_list(`tags=${this.$route.params.tags} `)
      this.get_oracle_temptablespace_list(`tags=${this.$route.params.tags} `)
      this.get_oracle_undotablespace_list(`tags=${this.$route.params.tags} `)
      this.get_oracle_controlfile(`tags=${this.$route.params.tags} `)
      this.get_oracle_redolog(`tags=${this.$route.params.tags} `)
    }, 1000 * 20)
  },
  methods: {
    gotoTablespace (tags, tablespace_name) {
      const path = '/oracle/' + tags + '/resource/tablespace/' + tablespace_name
      this.$router.push({ path: path })
    },
    gotoTemptablespace (tags, tablespace_name) {
      const path = '/oracle/' + tags + '/resource/temptablespace/' + tablespace_name
      this.$router.push({ path: path })
    },
    gotoUndotablespace (tags, tablespace_name) {
      const path = '/oracle/' + tags + '/resource/undotablespace/' + tablespace_name
      this.$router.push({ path: path })
    },
    get_oracle_undotablespace_used (parameter) {
      getOracleUndoTableSpaceUsed(parameter).then(res => {
        this.data_undo_tablespace_used = res.data
        console.log(this.data_undo_tablespace_used)
      }).catch(err => {
        this.$Message.error(`获取UNDO表空间信息错误 ${err}`)
      })
    },
    get_oracle_tablespace_list (parameter) {
      getOracleTableSpace(parameter).then(res => {
        this.data_tablespace = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取Oracle表空间信息错误 ${err}`)
      })
    },
    get_oracle_temptablespace_list (parameter) {
      getOracleTempTableSpace(parameter).then(res => {
        this.data_temp_tablespace = res.data.results
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取Oracle临时表空间信息错误 ${err}`)
      })
    },
    get_oracle_undotablespace_list (parameter) {
      getOracleUndoTableSpace(parameter).then(res => {
        this.data_undo_tablespace = res.data.results
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取Oracle临时表空间信息错误 ${err}`)
      })
    },
    get_oracle_controlfile (parameter) {
      getOracleControlFile(parameter).then(res => {
        this.data_controlfile = res.data.results
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取Oracle控制文件信息错误 ${err}`)
      })
    },
    get_oracle_redolog (parameter) {
      getOracleRedoLog(parameter).then(res => {
        this.data_redolog = res.data.results
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取Oracle redo log信息错误 ${err}`)
      })
    },
    get_oracle_redolog_switch () {
      const parameter = `tags=${this.$route.params.tags}&redo_range=${this.redo_range} `
      this.modal_redo = true
      getOracleRedoLogSwitch(parameter).then(res => {
        const redolog_swtich_list = res.data
        this.statdateData = redolog_swtich_list.map(redo => redo.STAT_DATE)
        this.redocntData = redolog_swtich_list.map(redo => redo.LOG_COUNT)
        console.log(redolog_swtich_list)
      }).catch(err => {
        this.$Message.error(`获取redo切换信息错误 ${err}`)
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
.ivu-table .demo-table-info-cell-danger {
  background-color: #d40f35;
  color: #fff;
}
.ivu-table .demo-table-info-cell-mormal {
  background-color: #22d489;
  color: #fff;
}
</style>
