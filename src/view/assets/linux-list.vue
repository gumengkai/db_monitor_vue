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
              @on-change="get_linux_parameter"
              show-elevator
              show-total />
      </Row>
      <Row>
        <Drawer title="Linux主机配置"
                v-model="create"
                width="720"
                :mask-closable="this.close"
                :styles="styles">
          <Form ref="formData"
                :model="formData"
                :rules="ruleValidate">
            <Alert show-icon>Linux主机配置</Alert>
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
              <FormItem label="主机名"
                        label-position="top"
                        prop="port">
                <Input v-model="formData.hostname"
                       placeholder="主机名">
                </Input>
              </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
              <Col span="8">
              <FormItem label="Linux版本"
                        label-position="top"
                        prop="db_version">
                <Select v-model="formData.linux_version"
                        placeholder="">
                  <Option value="Linux6">Linux6</Option>
                  <Option value="Linux7">Linux7</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="内核版本"
                        label-position="top"
                        prop="db_version">
                <Input v-model="formData.linux_kernel"
                       placeholder="内核">
                </Input>
              </FormItem>
              </Col>
            </Row>
            <Alert show-icon>操作系统配置</Alert>
            <Row :gutter="32">
              <Col span="6">
              <FormItem label="操作系统用户名"
                        label-position="top"
                        prop="user">
                <Input v-model="formData.user"
                             placeholder="操作系统用户名">
                </Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="操作系统用户密码"
                        label-position="top"
                        prop="password">
                <Input type="password" v-model="formData.password"
                             placeholder="操作系统用户密码">
                </Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="操作系统ssh端口号"
                        label-position="top"
                        prop="sshport">
                <InputNumber v-model="formData.sshport"
                             placeholder="操作系统ssh端口号">
                </InputNumber>
              </FormItem>
              </Col>
            </Row>
            <Alert show-icon>机房信息</Alert>
            <Row :gutter="32">
              <Col span="6">
              <FormItem label="序列号"
                        label-position="top"
                        prop="serialno">
                <Input v-model="formData.serialno"
                       placeholder="序列号">
                </Input>
              </FormItem>
              </Col>
              <Col span="4">
              <FormItem label="状态"
                        label-position="top"
                        prop="status">
                <Select v-model="formData.status"
                        placeholder="">
                  <Option value="0">在线</Option>
                  <Option value="1">备用</Option>
                  <Option value="2">下线</Option>
                  <Option value="3">待用</Option>
                  <Option value="4">维修</Option>
                  <Option value="5">重装</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="机柜"
                        label-position="top"
                        prop="cabinet">
                <Input v-model="formData.cabinet"
                       placeholder="机柜">
                </Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="服务器厂家"
                        label-position="top"
                        prop="factory">
                <Input v-model="formData.factory"
                       placeholder="服务器厂家">
                </Input>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="采购日期"
                        label-position="top"
                        prop="purchase_date">
                <DatePicker v-model="formData.purchase_date" value="yyyymmdd" type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="保修开始日期"
                        label-position="top"
                        prop="beginprotection_date">
                <DatePicker v-model="formData.beginprotection_date"  type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="过保日期"
                        label-position="top"
                        prop="overprotection_date">
                <DatePicker v-model="formData.overprotection_date" type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
              </FormItem>
              </Col>
            </Row>
            <Alert show-icon>服务器描述</Alert>
            <Row :gutter="32">
              <Col span="4">
              <FormItem label="业务系统"
                        label-position="top"
                        prop="bussiness_system">
                <Input v-model="formData.bussiness_system"
                       placeholder="归属系统">
                </Input>
              </FormItem>
              </Col>
              <Col span="4">
              <FormItem label="系统等级"
                        label-position="top"
                        prop="db_version">
                <Select v-model="formData.system_level"
                        placeholder="">
                  <Option value="0">核心系统</Option>
                  <Option value="1">重要系统</Option>
                  <Option value="2">一般系统</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="服务器描述"
                        label-position="top"
                        prop="res_description">
                <Input v-model="formData.res_description"
                       placeholder="服务器描述">
                </Input>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="主要部署软件"
                        label-position="top"
                        prop="main_software">
                <Input v-model="formData.main_software"
                       placeholder="主要部署软件">
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
                  <Checkbox v-model="formData.alarm_connect" true-value="1" false-value="0" label="Linux主机通断告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_cpu" true-value="1" false-value="0" label="cpu使用率告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_mem" true-value="1" false-value="0" label="内存使用率告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_swap" true-value="1" false-value="0"  label="swap使用率告警"></Checkbox>
                  <Checkbox v-model="formData.alarm_disk" true-value="1" false-value="0"  label="磁盘使用率告警"></Checkbox>
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

      <Modal width="80"
        v-model="webssh"
        title="Common Modal dialog box title"
        @on-ok="ok_webssh"
        @on-cancel="cancel_webssh">
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
              <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
              <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
    </Modal>
    </Card>
  </Row>
</template>

<script>
import { getLinuxList, createLinux, updateLinux, deleteLinux } from '@/api/assets'
import { hasOneOf } from '@/libs/tools'
import { Tag } from 'iview'
export default {
  data () {
    return {
      webssh: false,
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
          title: '主机名',
          key: 'hostname',
          width: 160
        },
        {
          title: 'linux版本',
          key: 'linux_version',
          width: 100
        },
        {
          title: '连接用户名',
          key: 'user',
          width: 110
        },
        {
          title: '状态',
          key: 'status',
          width: 90,
          render: (h, params) => {
            const statusMap = {
              0: { color: 'green', desc: '在线' },
              1: { color: 'gray', desc: '备用' },
              2: { color: 'gray', desc: '下线' },
              3: { color: 'gray', desc: '待用' },
              4: { color: 'gray', desc: '维修' },
              5: { color: 'gray', desc: '重装' }
            }
            const status = params.row.status
            return h(Tag, { props: { color: statusMap[status]['color'] } }, statusMap[status]['desc'])
          }
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
      count: 0,
      page_size: 10,
      host_search: '',
      create: false,
      showfooter: true,
      close: false,
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
        linux_version: 'Linux6',
        user: '',
        password: '',
        sshport: 22,
        serialno: '',
        status: '0',
        cabinet: '',
        factory: '',
        purchase_date: '',
        beginprotection_date: '',
        overprotection_date: '',
        bussiness_system: '',
        system_level: '0',
        res_description: '',
        main_software: '',
        alarm_connect: '',
        alarm_cpu: '',
        alarm_mem: '',
        alarm_swap: '',
        alarm_disk: '',
        alarm_alert_log: ''
      },
      ruleValidate: {
        tags: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        host: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        hostname: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        user: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.get_linux_list()
  },
  computed: {
    access () {
      return this.$store.state.user.access
    },
    addAccessAll () {
      return hasOneOf(['assets.add_linuxlist'], this.access)
    },
    updateAccessAll () {
      return hasOneOf(['assets.change_linuxlist'], this.access)
    },
    deleteAccessAll () {
      return hasOneOf(['assets.delete_linuxlist'], this.access)
    }
  },
  methods: {
    ok_webssh () {
      this.$Message.info('确认操作')
    },
    cancel_webssh () {
      this.$Message.info('取消操作')
    },
    search () {
      console.log(this.host_search)
      this.get_linux_list(`host=${this.host_search}`)
    },
    clear_search () {
      this.host_search = ''
      this.get_linux_list()
    },
    get_linux_list (parameter) {
      getLinuxList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取linux资源信息错误 ${err}`)
      })
    },
    get_linux_parameter (parameter) {
      console.log(parameter)
      this.get_linux_list(`page=${parameter}`)
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
            createLinux(this.formData).then(res => {
              console.log(res)
              this.$Message.success('新增linux配置成功!')
              this.get_linux_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `新增linux配置错误 ${Object.entries(err.response.data)}`,
                duration: 10,
                closable: true
              })
            })
          } else {
            console.log(this.updateId)
            updateLinux(this.updateId, this.formData).then(res => {
              console.log(res)
              this.$Message.success('更新linux配置成功!')
              this.get_linux_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `更新linux配置错误 ${Object.entries(err.response.data)}`,
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
      this.create = true
      this.showfooter = true
      this.close = false
      this.updateId = null
      this.formData.tags = ''
      this.formData.host = ''
      this.formData.hostname = ''
      this.formData.db_version = 'Linux6'
      this.formData.linux_kernel = ''
      this.formData.user = ''
      this.formData.password = ''
      this.formData.sshport = 22
      this.formData.serialno = ''
      this.formData.status = '0'
      this.formData.cabinet = ''
      this.formData.factory = ''
      this.formData.purchase_date = ''
      this.formData.beginprotection_date = ''
      this.formData.overprotection_date = ''
      this.formData.bussiness_system = ''
      this.formData.system_level = '0'
      this.formData.res_description = ''
      this.formData.main_software = ''
      this.formData.alarm_connect = '1'
      this.formData.alarm_cpu = '1'
      this.formData.alarm_mem = '1'
      this.formData.alarm_swap = '1'
      this.formData.alarm_disk = '1'
      this.formData.alarm_alert_log = '1'
    },
    remove (index, id) {
      console.log(index, id)
      deleteLinux(id).then(res => {
        console.log(res)
        this.$Message.success('删除linux配置成功!')
        this.data.splice(index, 1)
      }).catch(err => {
        console.log(err.response)
        this.$Message.error({
          content: `删除linux配置错误 ${Object.entries(err.response.data)}`,
          duration: 10,
          closable: true
        })
      })
    },
    update (index) {
      this.create = true
      this.showfooter = true
      this.close = false
      this.formData.tags = this.data[index].tags
      this.formData.host = this.data[index].host
      this.formData.hostname = this.data[index].hostname
      this.formData.linux_version = this.data[index].linux_version
      this.formData.linux_kernel = this.data[index].linux_kernel
      this.formData.user = this.data[index].user
      this.formData.password = this.data[index].password
      this.formData.sshport = this.data[index].sshport
      this.formData.serialno = this.data[index].serialno
      this.formData.status = String(this.data[index].status)
      this.formData.cabinet = this.data[index].cabinet
      this.formData.factory = this.data[index].factory
      this.formData.purchase_date = this.data[index].purchase_date
      this.formData.beginprotection_date = this.data[index].beginprotection_date
      this.formData.overprotection_date = this.data[index].overprotection_date
      this.formData.bussiness_system = this.data[index].bussiness_system
      this.formData.system_level = String(this.data[index].system_level)
      this.formData.res_description = this.data[index].res_description
      this.formData.main_software = this.data[index].main_software
      this.formData.alarm_connect = String(this.data[index].alarm_connect)
      this.formData.alarm_cpu = String(this.data[index].alarm_cpu)
      this.formData.alarm_mem = String(this.data[index].alarm_mem)
      this.formData.alarm_swap = String(this.data[index].alarm_swap)
      this.formData.alarm_disk = String(this.data[index].alarm_disk)
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
