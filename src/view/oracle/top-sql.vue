<template>
  <div class="layout">
     <Layout>
       <oracle-menu :value="'5'" :tags="this.Tags"></oracle-menu>
       <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
        <Tabs type="line" @on-click="changeTab" value="cpu">
 <TabPane label=" CPU time" name="cpu">
    <Card>
        <Table size="small"
               border
               :columns="Columns"
               :data="Data"
               >
        </Table>
    </Card>
 </TabPane>
  <TabPane label="Physical Read Bytes" name="phys">
    <Card>
        <Table size="small"
               border
               :columns="Columns"
               :data="Data">
        </Table>
    </Card>
 </TabPane>
  <TabPane label="Logic Read" name="logic">
    <Card>
        <Table size="small"
               border
               :columns="Columns"
               :data="Data">
        </Table>
    </Card>
 </TabPane>
           </Tabs>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { getOracleTopSql } from '@/api/oracle'
import { Tag } from 'iview'
import { OracleMenu } from '_c/top-menu'
export default {
  components: {
    OracleMenu
  },
  data () {
    return {
      Tags: '',
      Type: 'cpu',
      titleData: '',
      Columns: [],
      Data: [],
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
    this.get_oracle_top_sql(`tags=${this.$route.params.tags}&type=cpu `)
    this.Tags = this.$route.params.tags
  },
  methods: {
    get_oracle_top_sql (parameter) {
      getOracleTopSql(parameter).then(res => {
        this.Data = res.data
        this.titleData = res.data[0]
        this.Data.shift()
        this.Columns = [
          {
            title: this.titleData['COL1'],
            width: 120,
            render: (h, params) => {
              return h(Tag, params.row.COL1)
            }
          },
          {
            title: this.titleData['COL2'],
            key: 'COL2',
            width: 130
          },
          {
            title: this.titleData['COL3'],
            key: 'COL3',
            width: 130
          },
          {
            title: this.titleData['COL4'],
            key: 'COL4',
            width: 100
          },
          {
            title: this.titleData['COL5'],
            key: 'COL5',
            width: 100
          },
          {
            title: this.titleData['COL6'],
            key: 'COL6',
            width: 100
          },
          {
            title: this.titleData['COL7'],
            key: 'COL7',
            width: 100
          },
          {
            title: this.titleData['COL8'],
            key: 'COL8',
            width: 100
          },
          {
            title: this.titleData['COL9'],
            key: 'COL9',
            width: 100
          },
          {
            title: this.titleData['COL10'],
            key: 'COL10',
            width: 100
          },
          {
            title: this.titleData['COL11'],
            key: 'COL11',
            width: 100
          },
          {
            title: this.titleData['COL12'],
            key: 'COL12',
            width: 150
          }
        ]
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取日志信息错误 ${err}`)
      })
    },
    changeTab (value) {
      if (value === 'cpu') {
        this.Type = 'cpu'
      }
      if (value === 'phys') {
        this.Type = 'phys'
      }
      if (value === 'logic') {
        this.Type = 'logic'
      }
      this.Columns = []
      this.Data = []
      this.get_oracle_top_sql(`tags=${this.$route.params.tags}&type=${this.Type} `)
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
