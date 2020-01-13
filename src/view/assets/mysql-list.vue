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
              @on-change="get_mysql_parameter"
              show-elevator
              show-total />
      </Row>
      <Row>
        <Drawer title="MySQL数据库配置"
                v-model="create"
                width="720"
                :mask-closable="this.close"
                :styles="styles">
          <Form ref="formData"
                :model="formData"
                :rules="ruleValidate">
            <Alert show-icon>数据库配置</Alert>
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
              <FormItem label="vip地址"
                        label-position="top"
                        prop="vip">
                <Input v-model="formData.vip"
                       placeholder="vip地址" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="linux主机"
                        label-position="top"
                        prop="linux_tags">
                <Select v-model="formData.linux_tags"
                        placeholder="选择linux主机">
                 <Option v-for="item in linuxdata" :value="item.tags" :key="item.tags" :label="item.tags"></Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="数据库版本"
                        label-position="top"
                        prop="db_version">
                <Select v-model="formData.db_version"
                        placeholder="">
                  <Option value="MySQL5.6">MySQL5.6</Option>
                  <Option value="MySQL5.7">MySQL5.7</Option>
                  <Option value="MySQL8.0">MySQL8.0</Option>
                </Select>
              </FormItem>
              </Col>
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
            <Alert show-icon>数据库描述</Alert>
            <Row :gutter="32">
              <Col span="6">
              <FormItem label="数据库角色"
                        label-position="top"
                        prop="db_role">
                <Input v-model="formData.db_role"
                       placeholder="master/slave" />
              </FormItem>
              </Col>
              <Col span="16">
              <FormItem label="启动方式"
                        label-position="top"
                        prop="start_method">
                <Input v-model="formData.start_method"
                       placeholder="启动方式" />
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="应用目录"
                        label-position="top"
                        prop="appdir">
                <Input v-model="formData.appdir"
                       placeholder="应用目录" />
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="数据目录"
                        label-position="top"
                        prop="datadir">
                <Input v-model="formData.datadir"
                       placeholder="数据目录" />
              </FormItem>
              </Col>
               <Col span="8">
              <FormItem label="配置文件"
                        label-position="top"
                        prop="profile">
                <Input v-model="formData.profile"
                       placeholder="配置文件" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="备份方式"
                        label-position="top"
                        prop="backup_type">
                <Input v-model="formData.backup_type"
                       placeholder="备份方式">
                </Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="数据库架构"
                        label-position="top"
                        prop="architecture">
                <Input v-model="formData.architecture"
                       placeholder="数据库架构" />
              </FormItem>
              </Col>
              <Col span="4">
              <FormItem label="只读"
                        label-position="top"
                        prop="readonly">
                <Select v-model="formData.readonly"
                        placeholder="">
                  <Option value="0">ON</Option>
                  <Option value="1">OFF</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="4">
              <FormItem label="GTID"
                        label-position="top"
                        prop="gtid">
                <Select v-model="formData.gtid"
                        placeholder="">
                  <Option value="0">ON</Option>
                  <Option value="1">OFF</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
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
                  <Checkbox v-model="formData.alarm_connections" true-value="1" false-value="0" label="连接数告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_repl" true-value="1" false-value="0" label="复制延迟告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_alert_log" true-value="1" false-value="0"  label="后台日志告警"></Checkbox>
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
import { getMysqlList, getLinuxList, createMysql, updateMysql, deleteMysql } from '@/api/assets'
import { hasOneOf } from '@/libs/tools'
import { Tag } from 'iview'
export default {
  data () {
    return {
      columns: [
        {
          title: '标签',
          key: 'tags',
          width: 120
        },
        {
          title: 'IP地址',
          key: 'host',
          width: 150
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
          title: '角色',
          key: 'db_role',
          width: 90
        },
        {
          title: '只读',
          key: 'readonly',
          width: 120,
          render: (h, params) => {
            const Map = {
              0: { desc: 'ON' },
              1: { desc: 'OFF' } }
            const readonly = params.row.readonly
            return h(Tag, Map[readonly]['desc'])
          }
        },
        {
          title: '架构',
          key: 'architecture',
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
        port: 3306,
        db_version: 'MySQL5.7',
        db_user: '',
        db_password: '',
        linux_tags: '',
        vip: '',
        db_role: '',
        readonly: '1',
        gtid: '1',
        start_method: '',
        datadir: '',
        appdir: '',
        profile: '',
        backup_type: '',
        architecture: '',
        bussiness_system: '',
        system_level: '0',
        res_description: '',
        main_dbuser: '',
        alarm_connect: '',
        alarm_connections: '',
        alarm_repl: ''
      },
      ruleValidate: {
        tags: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        host: [
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
    this.get_mysql_list()
  },
  computed: {
    access () {
      return this.$store.state.user.access
    },
    addAccessAll () {
      return hasOneOf(['assets.add_mysqllist'], this.access)
    },
    updateAccessAll () {
      return hasOneOf(['assets.change_mysqllist'], this.access)
    },
    deleteAccessAll () {
      return hasOneOf(['assets.delete_mysqllist'], this.access)
    }
  },
  methods: {
    search () {
      console.log(this.host_search)
      this.get_mysql_list(`host=${this.host_search}`)
    },
    clear_search () {
      this.host_search = ''
      this.get_mysql_list()
    },
    get_mysql_list (parameter) {
      getMysqlList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取mysql资源信息错误 ${err}`)
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
    get_mysql_parameter (parameter) {
      console.log(parameter)
      this.get_mysql_list(`page=${parameter}`)
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
          if (!this.updateId) {
            createMysql(this.formData).then(res => {
              console.log(res)
              this.$Message.success('新增MySQL配置成功!')
              this.get_mysql_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `新增MySQL配置错误 ${Object.entries(err.response.data)}`,
                duration: 10,
                closable: true
              })
            })
          } else {
            console.log(this.updateId)
            updateMysql(this.updateId, this.formData).then(res => {
              console.log(res)
              this.$Message.success('更新MySQL配置成功!')
              this.get_mysql_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `更新MySQL配置错误 ${Object.entries(err.response.data)}`,
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
      this.formData.port = 3306
      this.formData.db_version = 'MySQL5.7'
      this.formData.db_user = ''
      this.formData.db_password = ''
      this.formData.linux_tags = ''
      this.formData.vip = ''
      this.formData.db_role = ''
      this.formData.readonly = '1'
      this.formData.gtid = '1'
      this.formData.start_method = ''
      this.formData.datadir = ''
      this.formData.appdir = ''
      this.formData.profile = ''
      this.formData.backup_type = ''
      this.formData.architecture = ''
      this.formData.bussiness_system = ''
      this.formData.system_level = '0'
      this.formData.res_description = ''
      this.formData.main_dbuser = ''
      this.formData.alarm_connect = '1'
      this.formData.alarm_connections = '1'
      this.formData.alarm_repl = '1'
      this.formData.alarm_alert_log = '1'
    },
    remove (index, id) {
      console.log(index, id)
      deleteMysql(id).then(res => {
        console.log(res)
        this.$Message.success('删除MySQL配置成功!')
        this.data.splice(index, 1)
      }).catch(err => {
        console.log(err.response)
        this.$Message.error({
          content: `删除MySQL配置错误 ${Object.entries(err.response.data)}`,
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
      this.formData.port = this.data[index].port
      this.formData.db_version = this.data[index].db_version
      this.formData.db_user = this.data[index].db_user
      this.formData.db_password = this.data[index].db_password
      this.formData.linux_tags = this.data[index].linux_tags
      this.formData.vip = this.data[index].vip
      this.formData.db_role = this.data[index].db_role
      this.formData.readonly = String(this.data[index].readonly)
      this.formData.gtid = String(this.data[index].gtid)
      this.formData.start_method = this.data[index].start_method
      this.formData.datadir = this.data[index].datadir
      this.formData.appdir = this.data[index].appdir
      this.formData.profile = this.data[index].profile
      this.formData.backup_type = this.data[index].backup_type
      this.formData.architecture = this.data[index].architecture
      this.formData.bussiness_system = this.data[index].bussiness_system
      this.formData.system_level = String(this.data[index].system_level)
      this.formData.res_description = this.data[index].res_description
      this.formData.main_dbuser = this.data[index].main_dbuser
      this.formData.alarm_connect = String(this.data[index].alarm_connect)
      this.formData.alarm_connections = String(this.data[index].alarm_connections)
      this.formData.alarm_repl = String(this.data[index].alarm_repl)
      this.formData.alarm_alert_log = String(this.data[index].alarm_alert_log)
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
