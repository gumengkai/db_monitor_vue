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
              @on-change="get_redis_parameter"
              show-elevator
              show-total />
      </Row>
      <Row>

        <Drawer title="Redis配置"
                v-model="create"
                width="720"
                :mask-closable="this.close"
                :styles="styles">
          <Form ref="formData"
                :model="formData"
                :rules="ruleValidate">
            <Alert show-icon>redis连接配置</Alert>
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
              <FormItem label="端口"
                        label-position="top"
                        prop="port">
                <InputNumber v-model="formData.port"
                       placeholder="Redis端口" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="密码(可选)"
                        label-position="top"
                        prop="password">
                <Input type="password" v-model="formData.password"
                       placeholder="Redis密码" />
              </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
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
              <Col span="4">
              <FormItem label="Redis版本"
                        label-position="top"
                        prop="redis_version">
                <Select v-model="formData.redis_version"
                        placeholder="">
                  <Option value="Redis3">Redis3</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="Redis架构"
                        label-position="top"
                        prop="architecture">
                <Input v-model="formData.architecture"
                       placeholder="数据库架构" />
              </FormItem>
              </Col>
              <Col span="4">
                <FormItem label="角色"
                        label-position="top"
                        prop="role">
                <Select v-model="formData.role"
                        placeholder="">
                  <Option value="master">master</Option>
                  <Option value="slave">slave</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Alert show-icon>Redis描述</Alert>
            <Row :gutter="32">
              <Col span="8">
              <FormItem label="配置文件"
                        label-position="top"
                        prop="start_method">
                <Input v-model="formData.profile"
                       placeholder="配置文件" />
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
            </Row>
            <Row :gutter="32">
                 <Col span="6">
              <FormItem label="业务系统"
                        label-position="top"
                        prop="bussiness_system">
                <Input v-model="formData.bussiness_system"
                       placeholder="归属业务系统，如客户服务">
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
                       placeholder="资源描述">
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
                  <Checkbox v-model="formData.alarm_connect" true-value="1" false-value="0" label="Redis通断告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_alert_log" true-value="1" false-value="0" label="Redis后台日志告警"></Checkbox>
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
import { getRedisList, getLinuxList, createRedis, updateRedis, deleteRedis } from '@/api/assets'
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
          title: '端口',
          key: 'port',
          width: 80
        },
        {
          title: 'Redis版本',
          key: 'redis_version',
          width: 100
        },
        {
          title: '角色',
          key: 'role',
          width: 90
        },
        {
          title: '架构',
          key: 'architecture',
          width: 120
        },
        {
          title: '业务系统',
          key: 'bussiness_system',
          width: 120
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
        port: 6379,
        password: '',
        linux_tags: '',
        redis_version: 'Redis3',
        architecture: '',
        role: 'master',
        profile: '',
        appdir: '',
        bussiness_system: '',
        system_level: '0',
        res_description: '',
        alarm_connect: '',
        alarm_alert_log: ''
      },
      ruleValidate: {
        tags: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        host: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        linux_tags: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.get_redis_list()
  },
  computed: {
    access () {
      return this.$store.state.user.access
    },
    addAccessAll () {
      return hasOneOf(['assets.add_redislist'], this.access)
    },
    updateAccessAll () {
      return hasOneOf(['assets.change_redislist'], this.access)
    },
    deleteAccessAll () {
      return hasOneOf(['assets.delete_redislist'], this.access)
    }
  },
  methods: {
    search () {
      console.log(this.host_search)
      this.get_redis_list(`host=${this.host_search}`)
    },
    clear_search () {
      this.host_search = ''
      this.get_redis_list()
    },
    get_redis_list (parameter) {
      getRedisList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取redis资源信息错误 ${err}`)
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
    get_redis_parameter (parameter) {
      console.log(parameter)
      this.get_redis_list(`page=${parameter}`)
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
            createRedis(this.formData).then(res => {
              console.log(res)
              this.$Message.success('新增Redis配置成功!')
              this.get_redis_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `新增Redis配置错误 ${Object.entries(err.response.data)}`,
                duration: 10,
                closable: true
              })
            })
          } else {
            console.log(this.updateId)
            updateRedis(this.updateId, this.formData).then(res => {
              console.log(res)
              this.$Message.success('更新Redis配置成功!')
              this.get_redis_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `更新Redis配置错误 ${Object.entries(err.response.data)}`,
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
      this.formData.port = 6379
      this.formData.password = ''
      this.formData.linux_tags = ''
      this.formData.redis_version = 'Redis3'
      this.formData.role = 'master'
      this.formData.profile = ''
      this.formData.appdir = ''
      this.formData.architecture = ''
      this.formData.bussiness_system = ''
      this.formData.system_level = '0'
      this.formData.res_description = ''
      this.formData.alarm_connect = '1'
      this.formData.alarm_alert_log = '1'
    },
    remove (index, id) {
      console.log(index, id)
      deleteRedis(id).then(res => {
        console.log(res)
        this.$Message.success('删除Redis配置成功!')
        this.data.splice(index, 1)
      }).catch(err => {
        console.log(err.response)
        this.$Message.error({
          content: `删除Redis配置错误 ${Object.entries(err.response.data)}`,
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
      this.formData.password = this.data[index].password
      this.formData.linux_tags = this.data[index].linux_tags
      this.formData.redis_version = this.data[index].redis_version
      this.formData.role = this.data[index].role
      this.formData.profile = this.data[index].profile
      this.formData.appdir = this.data[index].appdir
      this.formData.architecture = this.data[index].architecture
      this.formData.bussiness_system = this.data[index].bussiness_system
      this.formData.system_level = String(this.data[index].system_level)
      this.formData.res_description = this.data[index].res_description
      this.formData.alarm_connect = String(this.data[index].alarm_connect)
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
