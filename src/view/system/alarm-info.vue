<template>
  <div class="layout">
     <Layout>
       <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
    <Card>
        <Table size="small"
               :columns="columns"
               :data="data">
        </Table>
        <br>
        <Page :total="count"
              :page_size='page_size'
              @on-change="get_alarm_info_parameter"
              show-elevator
              show-total />
    </Card>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { getAlarmInfo } from '@/api/system'
import { hasOneOf, formatDate } from '@/libs/tools'
import { Button, Table, Modal, Message, Tag } from 'iview'
export default {
  data () {
    return {
      show: false,
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '标签',
          key: 'tags',
          width: 80
        },
        {
          title: '告警名称',
          key: 'alarm_type',
          width: 150
        },
        {
          title: '服务地址',
          key: 'url',
          width: 120
        },
        {
          title: '告警内容',
          key: 'alarm_content',
          width: 400
        },
        {
          title: '告警时间',
          key: 'alarm_time',
          width: 140,
          sortable: true,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.alarm_time), 'yyyy-MM-dd hh:mm')
            )
          }
        }
      ],
      data: [],
      count: 0,
      page_size: 10,
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
    this.get_alarm_info()
  },
  methods: {
    get_alarm_info (parameter) {
      getAlarmInfo(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取告警信息错误 ${err}`)
      })
    },
    get_alarm_info_parameter (parameter) {
      console.log(parameter)
      this.get_alarm_info(`page=${parameter}`)
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
.ivu-table .demo-table-info-cell-danger {
  background-color: #d40f35;
  color: #fff;
}
.ivu-table .demo-table-info-cell-mormal {
  background-color: #22d489;
  color: #fff;
}
</style>
