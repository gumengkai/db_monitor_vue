<template>
  <Row>
    <Card>
      <Row>
        <Button @click="add"
                v-if="addAccessAll"
                type="primary">添加</Button>&nbsp;
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
        <Table border
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
      <Row>
        <Drawer title="Oracle数据库配置"
                v-model="create"
                width="720"
                :mask-closable="this.close"
                :styles="styles">
          <Form ref="formData"
                :model="formData"
                :rules="ruleValidate">
            <Alert show-icon>Oracle连接配置</Alert>
            <Row :gutter="32">
              <Col span="6">
              <FormItem label="标签"
                        label-position="top"
                        prop="tags">
                <Input v-model="formData.tags"
                       placeholder="自定义唯一标签" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="ip地址"
                        label-position="top"
                        prop="host">
                <Input v-model="formData.host"
                       placeholder="请填写ip地址" />
              </FormItem>
              </Col>
              <Col span="4">
              <FormItem label="端口号"
                        label-position="top"
                        prop="port">
                <InputNumber v-model="formData.port"
                       placeholder="数据库实例端口号">
                </InputNumber>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="服务名"
                        label-position="top"
                        prop="service_name">
                <Input v-model="formData.service_name"
                       placeholder="数据库实例服务名">
                </Input>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="linux主机"
                        label-position="top"
                        prop="linux_tags">
                <Select v-model="formData.linux_tags"
                        placeholder="选择linux主机">
                 <Option v-for="item in linuxdata" :value="item.tags" :key="item.tags" :label="item.tags"></Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="数据库版本"
                        label-position="top"
                        prop="db_version">
                <Select v-model="formData.db_version"
                        placeholder="">
                  <Option value="Oracle11g">Oracle11g</Option>
                  <Option value="Oracle12c">Oracle12c</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
              <Col span="6">
              <FormItem label="数据库用户名"
                        label-position="top"
                        prop="db_user">
                <Input v-model="formData.db_user"
                       placeholder="数据库用户名">
                </Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="数据库密码"
                        label-position="top"
                        prop="db_password">
                <Input type="password" v-model="formData.db_password"
                       placeholder="数据库用户密码" />
              </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
                   <Col span="6">
              <FormItem label="数据库用户名(cdb)"
                        label-position="top"
                        prop="db_user_cdb">
                <Input v-model="formData.db_user_cdb"
                       placeholder="Oracle12c需填">
                </Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="数据库密码(cdb)"
                        label-position="top"
                        prop="db_password_cdb">
                <Input type="password" v-model="formData.db_password_cdb"
                       placeholder="Oracle12c需填" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="数据库服务名(cdb)"
                        label-position="top"
                        prop="service_name_cdb">
                <Input v-model="formData.service_name_cdb"
                       placeholder="Oracle12c需填" />
              </FormItem>
              </Col>
            </Row>
            <Alert show-icon>数据库描述</Alert>
            <Row :gutter="32">
              <Col span="6">
              <FormItem label="数据库名"
                        label-position="top"
                        prop="dbname">
                <Input v-model="formData.dbname"
                       placeholder="如orcl" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="实例名"
                        label-position="top"
                        prop="instance_name">
                <Input v-model="formData.instance_name"
                       placeholder="如orcl1" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="vip地址"
                        label-position="top"
                        prop="db_vip">
                <Input v-model="formData.db_vip"
                       placeholder="数据库VIP地址">
                </Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="安装地址"
                        label-position="top"
                        prop="db_loc">
                <Input v-model="formData.db_loc"
                       placeholder="数据库软件安装地址">
                </Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="业务系统"
                        label-position="top"
                        prop="bussiness_system">
                <Input v-model="formData.bussiness_system"
                       placeholder="归属业务系统，如账务">
                </Input>
              </FormItem>
              </Col>
            <Col span="6">
              <FormItem label="系统等级"
                        label-position="top"
                        prop="system_level">
                <Select v-model="formData.system_level"
                        placeholder="">
                  <Option value='0'>核心系统</Option>
                  <Option value='0'>重要系统</Option>
                  <Option value='0'>一般系统</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="资源描述"
                        label-position="top"
                        prop="res_description">
                <Input v-model="formData.res_description"
                       placeholder="如账务库1号节点">
                </Input>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="主要数据库用户"
                        label-position="top"
                        prop="main_dbuser">
                <Input v-model="formData.main_dbuser"
                       placeholder="列举数据库中核心用户">
                </Input>
              </FormItem>
              </Col>
            </Row>
            <Alert show-icon>告警配置</Alert>
             <Row :gutter="32">
              <div>
            <Form class="step-form" :label-width="100">
              <FormItem label="选择告警配置">
                <CheckboxGroup>
                  <Checkbox v-model="formData.alarm_connect" true-value="1" false-value="0" label="数据库通断告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_tablespace" true-value="1" false-value="0" label="表空间使用率告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_undo_tablespace" true-value="1" false-value="0" label="UNDO表空间使用率告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_temp_tablespace" true-value="1" false-value="0" label="临时表空间使用率告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_process" true-value="1" false-value="0"  label="连接数告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_pga" true-value="1" false-value="0"  label="PGA使用率告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_archive" true-value="1" false-value="0"  label="归档使用率告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_adg" true-value="1" false-value="0" label="ADG延迟告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_alert_log" true-value="1" false-value="0"  label="后台日志告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_invalid_index" true-value="1" false-value="0"  label="失效索引告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_expired_password" true-value="1" false-value="0" label="密码过期告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_wait_events" true-value="1" false-value="0"  label="等待事件告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_lock" true-value="1" false-value="0"  label="锁异常告警"></Checkbox>
                </CheckboxGroup>
              </FormItem>
            </Form>
          </div>
            </Row>
          </Form>
          <div class="demo-drawer-footer" v-show="showfooter" >
            <Button style="margin-right: 8px"
                    @click="create = false">取消</Button>
            <Button type="primary"
                    @click="handleSubmit('formData')">提交</Button>
          </div>
        </Drawer>

      </Row>
    </Card>
  </Row>
</template>

<script>
import { getOracleList, getLinuxList, createOracle, updateOracle, deleteOracle } from '@/api/assets'
import { hasOneOf } from '@/libs/tools'
import { Tag } from 'iview'
export default {
  data () {
    return {
      show: false,
      columns: [
        {
          title: '标签',
          key: 'tags',
          width: 120,
          sortable: true
        },
        {
          title: 'IP地址',
          key: 'host',
          width: 150,
          sortable: true
        },
        {
          title: '端口号',
          key: 'port',
          width: 80
        },
        {
          title: '数据库版本',
          key: 'db_version',
          width: 100
        },
        {
          title: '数据库名',
          key: 'dbname',
          width: 90
        },
        {
          title: '实例名',
          key: 'instance_name',
          width: 90
        },
        {
          title: '业务系统',
          key: 'bussiness_system',
          width: 90
        },
        {
          title: '系统等级',
          key: 'system_level',
          width: 120,
          render: (h, params) => {
            const levelMap = {
              0: { color: 'red', desc: '核心系统' },
              1: { color: 'orange', desc: '重要系统' },
              2: { color: 'gray', desc: '一般系统' }
            }
            const system_level = params.row.system_level
            return h(Tag, { props: { color: levelMap[system_level]['color'] } }, levelMap[system_level]['desc'])
          }
        },
        {
          title: '资源描述',
          key: 'res_description',
          width: 200
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
                    this.show = true
                    this.view(params.index)
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: (this.updateAccessAll !== true) ? 'none' : 'inline-block'
                },
                on: {
                  click: () => {
                    this.update(params.index)
                  }
                }
              }, '编辑'),
              h('Poptip', {
                props: {
                  confirm: true,
                  title: '确定要删除吗！',
                  transfer: true
                },
                style: {
                  marginRight: '5px',
                  display: (this.deleteAccessAll !== true) ? 'none' : 'inline-block'
                },
                on: {
                  'on-ok': () => {
                    this.remove(params.index, params.row.id)
                  }
                }
              }, [h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: (this.deleteAccessAll !== true) ? 'none' : 'inline-block'
                }
              }, '删除')])
            ])
          }
        }
      ],
      data: [],
      linuxdata: [],
      count: 0,
      page_size: 10,
      host_search: '',
      create: false,
      close: false,
      showfooter: true,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      updateId: null,
      formData: {
        tags: '',
        host: '',
        hostname: '',
        port: 1521,
        service_name: '',
        db_version: 'Oracle11g',
        dbname: '',
        instance_name: '',
        db_vip: '',
        db_loc: '',
        bussiness_system: '',
        system_level: '0',
        res_description: '',
        main_dbuser: '',
        db_user: '',
        db_password: '',
        db_user_cdb: '',
        db_password_cdb: '',
        service_name_cdb: '',
        linux_tags: '',
        alarm_connect: '',
        alarm_tablespace: '',
        alarm_undo_tablespace: '',
        alarm_temp_tablespace: '',
        alarm_process: '',
        alarm_pga: '',
        alarm_archive: '',
        alarm_adg: '',
        alarm_alert_log: '',
        alarm_invalid_index: '',
        alarm_expired_password: '',
        alarm_wait_events: '',
        alarm_lock: ''
      },
      ruleValidate: {
        tags: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        host: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        service_name: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        db_user: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        db_password: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        linux_tags: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.get_oracle_list()
  },
  computed: {
    access () {
      return this.$store.state.user.access
    },
    addAccessAll () {
      return hasOneOf(['assets.add_oraclelist'], this.access)
    },
    updateAccessAll () {
      return hasOneOf(['assets.change_oraclelist'], this.access)
    },
    deleteAccessAll () {
      return hasOneOf(['assets.delete_oraclelist'], this.access)
    }
  },
  methods: {
    search () {
      console.log(this.host_search)
      this.get_oracle_list(`host=${this.host_search}`)
    },
    clear_search () {
      this.host_search = ''
      this.get_oracle_list()
    },
    get_oracle_list (parameter) {
      getOracleList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取Oracle资源信息错误 ${err}`)
      })
    },
    get_linux_list (parameter) {
      getLinuxList(parameter).then(res => {
        this.linuxdata = res.data.results
        console.log(this.linuxdata)
      }).catch(err => {
        this.$Message.error(`获取Linux主机资源信息错误 ${err}`)
      })
    },
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false
      if (this.checkAll) {
        this.actions_checked = this.actions
      } else {
        this.actions_checked = []
      }
    },
    checkAllGroupChange (data) {
      console.log(data)
      if (data.length === this.actions.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
    get_oracle_parameter (parameter) {
      console.log(parameter)
      this.get_oracle_list(`page=${parameter}`)
    },
    view (index) {
      this.update(index)
      this.showfooter = false
      this.close = true
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        console.log()
        if (valid) {
          debugger
          if (!this.updateId) {
            createOracle(this.formData).then(res => {
              console.log(res)
              this.$Message.success('新增Oracle配置成功!')
              this.get_oracle_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `新增Oracle配置错误 ${Object.entries(err.response.data)}`,
                duration: 10,
                closable: true
              })
            })
          } else {
            console.log(this.updateId)
            updateOracle(this.updateId, this.formData).then(res => {
              console.log(res)
              this.$Message.success('更新Oracle配置成功!')
              this.get_oracle_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `更新Oracle配置错误 ${Object.entries(err.response.data)}`,
                duration: 10,
                closable: true
              })
            })
          }
        } else {
          this.$Message.error('错误!')
        }
      })
    },
    add () {
      this.get_linux_list()
      this.create = true
      this.showfooter = true
      this.close = false
      this.updateId = null
      this.formData.tags = ''
      this.formData.host = ''
      this.formData.hostname = ''
      this.formData.port = 1521
      this.formData.service_name = ''
      this.formData.db_version = 'Oracle11g'
      this.formData.dbname = ''
      this.formData.instance_name = ''
      this.formData.db_vip = ''
      this.formData.db_loc = ''
      this.formData.bussiness_system = ''
      this.formData.system_level = '0'
      this.formData.res_description = ''
      this.formData.main_dbuser = ''
      this.formData.db_user = ''
      this.formData.db_password = ''
      this.formData.db_user_cdb = ''
      this.formData.db_password_cdb = ''
      this.formData.service_name_cdb = ''
      this.formData.linux_tags = ''
      this.formData.alarm_connect = '1'
      this.formData.alarm_tablespace = '1'
      this.formData.alarm_undo_tablespace = '1'
      this.formData.alarm_temp_tablespace = '1'
      this.formData.alarm_process = '1'
      this.formData.alarm_pga = '1'
      this.formData.alarm_archive = '1'
      this.formData.alarm_adg = '1'
      this.formData.alarm_alert_log = '1'
      this.formData.alarm_invalid_index = '1'
      this.formData.alarm_expired_password = '1'
      this.formData.alarm_wait_events = '1'
      this.formData.alarm_lock = '1'
    },
    remove (index, id) {
      console.log(index, id)
      deleteOracle(id).then(res => {
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
    update (index) {
      this.get_linux_list()
      this.create = true
      this.showfooter = true
      this.close = false
      this.formData.tags = this.data[index].tags
      this.formData.host = this.data[index].host
      this.formData.hostname = this.data[index].hostname
      this.formData.port = this.data[index].port
      this.formData.service_name = this.data[index].service_name
      this.formData.dbname = this.data[index].dbname
      this.formData.instance_name = this.data[index].instance_name
      this.formData.db_vip = this.data[index].db_vip
      this.formData.db_loc = this.data[index].db_loc
      this.formData.bussiness_system = this.data[index].bussiness_system
      this.formData.system_level = String(this.data[index].system_level)
      this.formData.res_description = this.data[index].res_description
      this.formData.main_dbuser = this.data[index].main_dbuser
      this.formData.db_version = this.data[index].db_version
      this.formData.db_user = this.data[index].db_user
      this.formData.db_password = this.data[index].db_password
      this.formData.db_user_cdb = this.data[index].db_user_cdb
      this.formData.db_password_cdb = this.data[index].db_password_cdb
      this.formData.service_name_cdb = this.data[index].service_name_cdb
      this.formData.linux_tags = this.data[index].linux_tags
      this.formData.alarm_connect = String(this.data[index].alarm_connect)
      this.formData.alarm_tablespace = String(this.data[index].alarm_tablespace)
      this.formData.alarm_undo_tablespace = String(this.data[index].alarm_undo_tablespace)
      this.formData.alarm_temp_tablespace = String(this.data[index].alarm_temp_tablespace)
      this.formData.alarm_process = String(this.data[index].alarm_process)
      this.formData.alarm_pga = String(this.data[index].alarm_pga)
      this.formData.alarm_archive = String(this.data[index].alarm_archive)
      this.formData.alarm_adg = String(this.data[index].alarm_adg)
      this.formData.alarm_alert_log = String(this.data[index].alarm_alert_log)
      this.formData.alarm_invalid_index = String(this.data[index].alarm_invalid_index)
      this.formData.alarm_expired_password = String(this.data[index].alarm_expired_password)
      this.formData.alarm_wait_events = String(this.data[index].alarm_wait_events)
      this.formData.alarm_lock = String(this.data[index].alarm_lock)
      this.updateId = this.data[index].id
    }
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
</style>
