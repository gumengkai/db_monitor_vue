<template>
  <div class="layout">
     <Layout>
       <oracle-menu :value="'2'" :tags="this.Tags" ></oracle-menu>
       <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
  <Tabs type="line" @on-click="changeTab" value="storage">
    <TabPane label="存储" name="storage">
      <row>
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
    </TabPane>
    <TabPane label="TOP段空间" name="top_segment">
         <Card>
      <p slot="title">top50段空间</p>
        <Table size="small"
               :columns="columns_top_segment"
               :data="data_top_segment"
               border >
        </Table>
    </Card>
    </TabPane>
    <TabPane label="序列" name="sequence_used">
         <Card>
      <p slot="title">序列使用情况</p>
        <Table size="small"
               :columns="columns_sequence_used"
               :data="data_sequence_used"
               border>
        </Table>
    </Card>
    </TabPane>
      <TabPane label="用户&权限" name="user">
         <Card>
      <p slot="title">账号信息</p>
        <Table size="small"
               :columns="columns_user"
               :data="data_user"
               border>
        </Table>
    </Card>
    <Modal cancel-text=""
        v-model="modal_profile"
        width="600"
        title="用户配置信息">
      <Table size="small"
          :columns="columns_profile"
          :data="data_profile">
     </Table>
    </Modal>
    <Modal cancel-text=""
        v-model="modal_permission"
        width="550"
        title="用户角色&权限">
      <card>
      <p slot="title">角色</p>
      <Table size="small"
          :columns="columns_user_role"
          :data="data_user_role">
     </Table>
      </card>
      <card>
     <p slot="title">系统权限</p>
      <Table size="small"
          :columns="columns_user_grant"
          :data="data_user_grant">
     </Table>
      </card>
    </Modal>
    </TabPane>
  </Tabs>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { OracleMenu } from '_c/top-menu'
import { getOracleTableSpace, getOracleTempTableSpace, getOracleUndoTableSpace,
  getOracleUndoTableSpaceUsed, getOracleControlFile, getOracleRedoLog, getOracleRedoLogSwitch,
  getOracleTopSegment, getOracleSequenceUsed, getOracleUser, getOracleProfile,
  getOracleUserRole, getOracleUserGrant } from '@/api/oracle'
import { formatDate } from '@/libs/tools'
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
      modal_profile: false,
      modal_permission: false,
      columns_tablespace: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '表空间',
          width: 200,
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
          width: 60
        },
        {
          title: '序号',
          key: 'sequence_no',
          width: 120
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
      columns_top_segment: [
        {
          title: '用户',
          key: 'OWNER',
          width: 150
        },
        {
          title: '段名',
          key: 'SEGMENT_NAME',
          width: 300
        },
        {
          title: '分区名',
          key: 'PARTITION_NAME',
          width: 200
        },
        {
          title: '类型',
          key: 'SEGMENT_TYPE',
          width: 170
        },
        {
          title: '表空间',
          key: 'TABLESPACE_NAME',
          width: 160
        },
        {
          title: '使用空间(M)',
          key: 'SEGMENT_SIZE',
          width: 150
        }
      ],
      columns_sequence_used: [
        {
          title: '用户',
          key: 'SEQUENCE_OWNER',
          width: 180
        },
        {
          title: '序列名',
          key: 'SEQUENCE_NAME',
          width: 300
        },
        {
          title: '最小序列号',
          key: 'MIN_VALUE',
          width: 120
        },
        {
          title: '最大序列号',
          key: 'MAX_VALUE',
          width: 150
        },
        {
          title: '序列自增量',
          key: 'INCREMENT_BY',
          width: 100
        },
        {
          title: '是否循环',
          key: 'CYCLE_FLAG',
          width: 100
        },
        {
          title: '是否按顺序',
          key: 'CYCLE_FLAG',
          width: 100
        },
        {
          title: '缓存值',
          key: 'CACHE_SIZE',
          width: 80
        },
        {
          title: '最后序列号',
          key: 'LAST_NUMBER',
          width: 100
        }
      ],
      columns_user: [
        {
          title: '用户名',
          key: 'USERNAME',
          width: 120
        },
        {
          title: '创建时间',
          key: 'CREATED',
          width: 150
        },
        {
          title: '配置策略',
          width: 110,
          sortable: true,
          render: (h, params) => {
            const profile = params.row.PROFILE
            return h('a', {
              on: {
                'click': () => {
                  this.get_oracle_profile(`tags=${this.$route.params.tags}&profile=${profile} `)
                  this.modal_profile = true
                }
              }
            }, params.row.PROFILE)
          }
        },
        {
          title: '账号状态',
          key: 'ACCOUNT_STATUS',
          width: 120
        },
        {
          title: '锁定时间',
          key: 'LOCK_DATE',
          width: 150
        },
        {
          title: '到期时间',
          key: 'EXPIRR_DATE',
          width: 150
        },
        {
          title: '角色&权限',
          key: 'action',
          width: 120,
          align: 'center',
          render: (h, params) => {
            debugger
            const user = params.row.USERNAME
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
                    this.modal_permission = true
                    this.get_oracle_user_role(`tags=${this.$route.params.tags}&user=${user} `)
                    this.get_oracle_user_grant(`tags=${this.$route.params.tags}&user=${user} `)
                  }
                }
              }, '查看')
            ])
          }
        },
        {
          title: '默认表空间',
          key: 'DEFAULT_TABLESPACE',
          width: 200
        },
        {
          title: '临时表空间',
          key: 'TEMPORARY_TABLESPACE',
          width: 100
        }
      ],
      columns_profile: [
        {
          title: '配置',
          key: 'PROFILE',
          width: 120
        },
        {
          title: '资源',
          key: 'RESOURCE_NAME',
          width: 200
        },
        {
          title: '资源类型',
          key: 'RESOURCE_TYPE',
          width: 150
        },
        {
          title: '资源限制',
          key: 'LIMIT',
          width: 150
        }
      ],
      columns_user_role: [
        {
          title: '用户名',
          key: 'GRANTEE',
          width: 120
        },
        {
          title: '角色权限',
          key: 'GRANTED_ROLE',
          width: 200
        },
        {
          title: '再授权',
          key: 'ADMIN_OPTION',
          width: 150
        }
      ],
      columns_user_grant: [
        {
          title: '用户名',
          key: 'GRANTEE',
          width: 120
        },
        {
          title: '权限',
          key: 'PRIVILEGE',
          width: 200
        },
        {
          title: '再授权',
          key: 'ADMIN_OPTION',
          width: 150
        }
      ],
      data_undo_tablespace_used: [],
      data_tablespace: [],
      data_temp_tablespace: [],
      data_undo_tablespace: [],
      data_controlfile: [],
      data_redolog: [],
      data_top_segment: [],
      data_sequence_used: [],
      data_user: [],
      data_profile: [],
      data_user_role: [],
      data_user_grant: [],
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
    get_oracle_top_segment () {
      const parameter = `tags=${this.$route.params.tags} `
      getOracleTopSegment(parameter).then(res => {
        this.data_top_segment = res.data
        console.log(this.data_top_segment)
      }).catch(err => {
        this.$Message.error(`获取top段信息错误 ${err}`)
      })
    },
    get_oracle_sequence_used () {
      const parameter = `tags=${this.$route.params.tags} `
      getOracleSequenceUsed(parameter).then(res => {
        this.data_sequence_used = res.data
        console.log(this.data_sequence_used)
      }).catch(err => {
        this.$Message.error(`获取序列使用信息错误 ${err}`)
      })
    },
    get_oracle_user () {
      const parameter = `tags=${this.$route.params.tags} `
      getOracleUser(parameter).then(res => {
        this.data_user = res.data
        console.log(this.data_user)
      }).catch(err => {
        this.$Message.error(`获取数据库账号信息错误 ${err}`)
      })
    },
    get_oracle_profile (parameter) {
      getOracleProfile(parameter).then(res => {
        this.data_profile = res.data
        console.log(this.data_profile)
      }).catch(err => {
        this.$Message.error(`获取用户配置信息错误 ${err}`)
      })
    },
    get_oracle_user_role (parameter) {
      getOracleUserRole(parameter).then(res => {
        this.data_user_role = res.data
        console.log(this.data_user_role)
      }).catch(err => {
        this.$Message.error(`获取用户角色信息错误 ${err}`)
      })
    },
    get_oracle_user_grant (parameter) {
      getOracleUserGrant(parameter).then(res => {
        this.data_user_grant = res.data
        console.log(this.data_user_grant)
      }).catch(err => {
        this.$Message.error(`获取用户授权信息错误 ${err}`)
      })
    },
    changeTab (value) {
      if (value === 'top_segment') {
        this.get_oracle_top_segment(`tags=${this.$route.params.tags} `)
      }
      if (value === 'sequence_used') {
        this.get_oracle_sequence_used(`tags=${this.$route.params.tags} `)
      }
      if (value === 'user') {
        this.get_oracle_user(`tags=${this.$route.params.tags} `)
      }
    },
    get_oracle_parameter (parameter) {
      console.log(parameter)
      this.get_oracle_tablespace_list(`page=${parameter}`)
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
