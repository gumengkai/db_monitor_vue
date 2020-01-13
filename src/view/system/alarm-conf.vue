<template>
  <Row>
    <Card>
      <Row>
        <Button @click="add"
                v-if="addAccessAll"
                type="primary">添加</Button>&nbsp;
        <Input v-model="alarm_name_search"
               placeholder="告警名称"
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
              @on-change="get_alert_conf_parameter"
              show-elevator
              show-total />
      </Row>
      <Row>
        <Drawer title="告警配置"
                v-model="create"
                width="720"
                :mask-closable="this.close"
                :styles="styles">
          <Form ref="formData"
                :model="formData"
                :rules="ruleValidate">
            <Alert show-icon>基础信息</Alert>
            <Row :gutter="32">
              <Col span="6">
              <FormItem label="告警类型"
                        label-position="top"
                        prop="type">
                <Select v-model="formData.type"
                        placeholder="">
                  <Option value='1'>Oracle数据库</Option>
                  <Option value='2'>MySQL数据库</Option>
                  <Option value='3'>Redis</Option>
                  <Option value='4'>Linux主机</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="告警名称"
                        label-position="top"
                        prop="name">
                <Input v-model="formData.name"
                             placeholder="告警名称">
                </Input>
              </FormItem>
              </Col>
            </Row>
            <Alert show-icon>阈值&配置表</Alert>
            <Row :gutter="32">
              <Col span="4">
              <FormItem label="运算符"
                        label-position="top"
                        prop="judge">
                <Input v-model="formData.judge"
                             placeholder="运算符">
                </Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="告警阈值"
                        label-position="top"
                        prop="judge_value">
                <Input v-model="formData.judge_value"
                             placeholder="请输入数字">
                </Input>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="阈值描述"
                        label-position="top"
                        prop="judge_des">
                <Input v-model="formData.judge_des"
                             placeholder="阈值描述">
                </Input>
              </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
              <Col span="6">
              <FormItem label="告警采集数据表"
                        label-position="top"
                        prop="judge_table">
                <Input v-model="formData.judge_table"
                       placeholder="告警检查数据表">
                </Input>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="告警屏蔽配置表"
                        label-position="top"
                        prop="conf_table">
                <Input v-model="formData.conf_table"
                       placeholder="告警屏蔽配置表">
                </Input>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="告警屏蔽配置字段"
                        label-position="top"
                        prop="conf_column">
                <Input v-model="formData.conf_column"
                       placeholder="告警屏蔽配置字段">
                </Input>
              </FormItem>
              </Col>
            </Row>
            <Alert show-icon>告警判断SQL配置</Alert>
            <Row :gutter="32">
              <Col span="24">
              <FormItem prop="judge_sql">
                <Input type="textarea" :rows="10" v-model="formData.judge_sql"
                       >
                </Input>
              </FormItem>
              </Col>
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
import { getAlarmConf, updateAlarmConf } from '@/api/system'
import { hasOneOf } from '@/libs/tools'
export default {
  data () {
    return {
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          sortable: true
        },
        {
          title: '告警类型',
          key: 'type',
          width: 120,
          render: (h, params) => {
            const typeMap = {
              1: { desc: 'Oracle数据库' },
              2: { desc: 'MySQL数据库' },
              3: { desc: 'Redis' },
              4: { desc: 'Linux主机' }
            }
            const type = params.row.type
            return h('div', typeMap[type]['desc'])
          }
        },
        {
          title: '告警名称',
          key: 'name',
          width: 220
        },
        {
          title: '运算符',
          key: 'judge',
          width: 80
        },
        {
          title: '阈值',
          key: 'judge_value',
          width: 100
        },
        {
          title: '阈值说明',
          key: 'judge_des',
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
              }
              )
            ])
          }
        }
      ],
      data: [],
      count: 0,
      page_size: 10,
      alarm_name_search: '',
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
        type: '',
        name: '',
        judge: '',
        judge_value: '',
        judge_des: '',
        password: '',
        judge_table: '',
        judge_sql: '',
        conf_table: '',
        conf_column: ''
      },
      ruleValidate: {
        type: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        judge_table: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        judge_sql: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.get_alarm_conf_list()
  },
  computed: {
    access () {
      return this.$store.state.user.access
    },
    addAccessAll () {
      return hasOneOf(['system.add_alarmconf'], this.access)
    },
    updateAccessAll () {
      return hasOneOf(['system.change_alarmconf'], this.access)
    },
    deleteAccessAll () {
      return hasOneOf(['system.delete_alarmconf'], this.access)
    }
  },
  methods: {
    get_alert_conf_parameter (parameter) {
      console.log(parameter)
      this.get_alarm_conf_list(`page=${parameter}`)
    },
    search () {
      console.log(this.alarm_name_search)
      this.get_alarm_conf_list(`name=${this.alarm_name_search}`)
    },
    clear_search () {
      this.alarm_name_search = ''
      this.get_alarm_conf_list()
    },
    get_alarm_conf_list (parameter) {
      getAlarmConf(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取告警配置信息错误 ${err}`)
      })
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
            createAlarmConf(this.formData).then(res => {
              console.log(res)
              this.$Message.success('新增告警配置成功!')
              this.get_alarm_conf_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `新增告警配置错误 ${Object.entries(err.response.data)}`,
                duration: 10,
                closable: true
              })
            })
          } else {
            console.log(this.updateId)
            updateAlarmConf(this.updateId, this.formData).then(res => {
              console.log(res)
              this.$Message.success('更新告警配置成功!')
              this.get_alarm_conf_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `更新告警配置错误 ${Object.entries(err.response.data)}`,
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
      this.formData.type = '1'
      this.formData.name = ''
      this.formData.judge = ''
      this.formData.judge_value = ''
      this.formData.judge_des = ''
      this.formData.judge_table = ''
      this.formData.judge_sql = ''
      this.formData.conf_table = ''
      this.formData.conf_column = ''
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
      this.formData.type = String(this.data[index].type)
      this.formData.name = this.data[index].name
      this.formData.judge = this.data[index].judge
      this.formData.judge_value = this.data[index].judge_value
      this.formData.judge_des = this.data[index].judge_des
      this.formData.judge_table = this.data[index].judge_table
      this.formData.judge_sql = this.data[index].judge_sql
      this.formData.conf_table = this.data[index].conf_table
      this.formData.conf_column = this.data[index].conf_column
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
