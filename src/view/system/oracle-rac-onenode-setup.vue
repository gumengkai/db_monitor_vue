<template>
  <Row>
    <Card>
      <Row>
        <Drawer title="安装日志" v-model="showlog" width="720" :mask-closable="this.close"
                :styles="styles">
          <Table size="small" :columns="columns" :data="data">
          </Table>
        </Drawer>
        <Form ref="formData" :model="formData" :rules="ruleValidate">
          <Alert show-icon>
            Oracle集群基础配置
          </Alert>
          <Row :gutter="32">
            <Col span="6">
              <FormItem label="数据库名" label-position="top" prop="dbname">
                <Input v-model="formData.dbname" placeholder="如orcl"/>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="主机名" label-position="top" prop="hostname">
                <Input v-model="formData.hostname" placeholder="如db"/>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="pdb名" label-position="top" prop="pdbname">
                <Input v-model="formData.pdbname" placeholder="如pdb1">
                </Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="4">
              <FormItem label="IP地址" label-position="top" prop="node_ip">
                <Input v-model="formData.node_ip" placeholder="如192.168.48.11"/>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="root密码" label-position="top" prop="node_password">
                <Input type="password" v-model="formData.node_password"/>
              </FormItem>
            </Col>
          </Row>
          <Alert show-icon>
            ASM磁盘配置
          </Alert>
          <Row :gutter="32">
            <Col span="6">
              <FormItem label="磁盘路径" label-position="top" prop="disk_path">
                <Input v-model="formData.disk_path" placeholder="如/dev/mapper/asm*"/>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="OCR磁盘" label-position="top" prop="ocr_disk">
                <Input v-model="formData.ocr_disk" placeholder="如asm-ocr"/>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="DATA磁盘" label-position="top" prop="data_disk">
                <Input v-model="formData.data_disk" placeholder="如asm-data">
                </Input>
              </FormItem>
            </Col>
          </Row>
          <FormItem>
            <Button type="primary" style="margin-right: 16px" @click="handleSubmit('formData','linux')">
              step1：linux基础配置
            </Button>
            <Button type="primary" style="margin-right: 16px" @click="handleSubmit('formData','rac')">
              step2：集群件安装
            </Button>
            <Button type="primary" style="margin-right: 16px" @click="handleSubmit('formData','oracle')">
              step3：Oracle软件安装
            </Button>
            <Button type="primary" style="margin-right: 32px" @click="handleSubmit('formData','dbca')">
              step4：DBCA建库
            </Button>
          </FormItem>
          <FormItem>
            <Button type="info" ghost style="margin-right: 16px" @click="showLog">
              查看安装日志
            </Button>
            <Tooltip placement="top">
              <Button type="error" style="margin-right: 16px" @click="handleSubmit('formData','clear')">
                慎用：Oracle RAC One Node安装清理
              </Button>
              <div slot="content">
                <p>
                  清理完成后会自动重启主机
                </p>
              </div>
            </Tooltip>
          </FormItem>
        </Form>
      </Row>
    </Card>
  </Row>
</template>

<script>
import { getSetupLog, setupOracleRacOneNode } from '@/api/system'
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
        module: '',
        dbname: '',
        hostname: '',
        pdbname: '',
        disk_path: '',
        ocr_disk: '',
        data_disk: '',
        node_ip: '',
        node_password: ''
      },
      ruleValidate: {
        dbname: [{ required: true, message: '此项目必填', trigger: 'blur' }],
        hostname: [{ required: true, message: '此项目必填', trigger: 'blur' }],
        pdbname: [{ required: true, message: '此项目必填', trigger: 'blur' }],
        disk_path: [{ required: true, message: '此项目必填', trigger: 'blur' }],
        ocr_disk: [{ required: true, message: '此项目必填', trigger: 'blur' }],
        data_disk: [{ required: true, message: '此项目必填', trigger: 'blur' }],
        node_ip: [{ required: true, message: '此项目必填', trigger: 'blur' }],
        node_password: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ]
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
      this.formData.module = module
      this.$refs[name].validate((valid) => {
        console.log()
        if (valid) {
          setupOracleRacOneNode(this.formData)
            .then((res) => {
              console.log(res)
              this.$Message.success('Oracle RAC One Node安装已启动!')
            })
            .catch((err) => {
              console.log(err.response)
              this.$Message.error({
                content: `Oracle RAC One Node安装启动失败 ${Object.entries(
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
