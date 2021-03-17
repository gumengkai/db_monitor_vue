<template>
  <Row>
    <Card>
      <Row>
        <Drawer
          title="安装日志"
          v-model="showlog"
          width="720"
          :mask-closable="this.close"
          :styles="styles"
        >
          <Table size="small" :columns="columns" :data="data"> </Table>
        </Drawer>
        <Form ref="formData" :model="formData" :rules="ruleValidate">
          <Alert show-icon> MySQL安装配置 </Alert>
          <Row :gutter="32">
            <Col span="6">
              <FormItem label="MySQL安装路径" label-position="top" prop="mysql_path">
                <Input v-model="formData.mysql_path" placeholder="如/u01/my3306" />
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="数据文件路径" label-position="top" prop="data_path">
                <Input v-model="formData.data_path" placeholder="如/data/my3306" />
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="端口号" label-position="top" prop="port">
                <Input v-model="formData.port" placeholder="如3306"> </Input>
              </FormItem>
            </Col>
             <Col span="6">
              <FormItem label="MySQL版本"
                        label-position="top"
                        prop="version">
                <Select v-model="formData.version"
                        placeholder="">
                  <Option value="MySQL5.7">MySQL5.7</Option>
                  <Option value="MySQL8.0">MySQL8.0</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="4">
              <FormItem label="IP地址" label-position="top" prop="ip">
                <Input
                  v-model="formData.ip"
                  placeholder="如192.168.48.11"
                />
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem
                label="root密码"
                label-position="top"
                prop="password"
              >
                <Input type="password" v-model="formData.password" />
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="服务器物理内存(GB)" label-position="top" prop="memory">
                <Input
                  v-model="formData.memory"
                  placeholder="如32"
                />
              </FormItem>
            </Col>
          </Row>
          <FormItem>
            <Button
              type="primary"
              style="margin-right: 16px"
              @click="handleSubmit('formData', 'mysql')"
            >
              开始安装
            </Button>
            <Button
              type="info"
              ghost
              style="margin-right: 16px"
              @click="showLog"
            >
              查看安装日志
            </Button>
            <Tooltip placement="top">
            </Tooltip>
          </FormItem>
        </Form>
      </Row>
    </Card>
  </Row>
</template>

<script>
import { getSetupLog, setupMysql } from '@/api/system'
import { formatDate } from '@/libs/tools'

export default {
  data () {
    return {
      columns: [
        {
          title: '序号',
          key: 'id',
          width: 80
        },
        {
          title: '时间',
          key: 'log_time',
          width: 140,
          render: (h, params) => {
            return h(
              'div',
              formatDate(new Date(params.row.log_time), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '日志内容',
          key: 'log_content'
        }
      ],
      data: [],
      showlog: false,
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
        version: 'MySQL5.7'

      },
      ruleValidate: {
        mysql_path: [{ required: true, message: '此项目必填', trigger: 'blur' }],
        data_path: [{ required: true, message: '此项目必填', trigger: 'blur' }],
        port: [{ required: true, message: '此项目必填', trigger: 'blur' }],
        version: [{ required: true, message: '此项目必填', trigger: 'blur' }],
        ip: [{ required: true, message: '此项目必填', trigger: 'blur' }],
        password: [{ required: true, message: '此项目必填', trigger: 'blur' }],
        memory: [{ required: true, message: '此项目必填', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.get_setup_log()
    this.timer = setInterval(() => {
      this.get_setup_log()
    }, 1000 * 5)
  },
  computed: {
    access () {
      return this.$store.state.user.access
    }
  },
  methods: {
    get_setup_log () {
      getSetupLog()
        .then((res) => {
          this.data = res.data
          console.log(this.data)
        })
        .catch((err) => {
          this.$Message.error(`获取日志信息错误 ${err}`)
        })
    },
    handleSubmit (name, module) {
      this.showlog = true
      this.$refs[name].validate((valid) => {
        console.log()
        if (valid) {
          setupMysql(this.formData)
            .then((res) => {
              console.log(res)
              this.$Message.success('MySQL安装已启动!')
            })
            .catch((err) => {
              console.log(err.response)
              this.$Message.error({
                content: `MySQL安装启动失败 ${Object.entries(
                  err.response.data
                )}`,
                duration: 10,
                closable: true
              })
            })
        } else {
          this.$Message.error('异常错误!')
        }
      })
    },
    showLog () {
      this.showlog = true
    },
    destroyed () {
      clearInterval(this.timer)
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
