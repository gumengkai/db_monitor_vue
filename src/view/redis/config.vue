<template>
  <div class="layout">
     <Layout>
       <redis-menu :value="'4'" :tags="this.Tags"></redis-menu>
       <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
    <Card>
      <Row>
        <Input v-model="paramName"
               placeholder="配置项"
               style="width: 150px" />&nbsp;

        <Button @click="search"
                type="primary">查询</Button>&nbsp;
        <Button @click="clear_search"
                type="success">刷新</Button>
      </Row>
      <br>
      <row>
        <Table stripe size="large"
               :columns="columns"
               :data="configData">
        </Table>
      </row>
    </Card>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { getRedisConfig } from '@/api/redis'
import { RedisMenu } from '_c/top-menu'
export default {
  components: {
    RedisMenu
  },
  data () {
    return {
      Tags: '',
      paramName: '',
      configData: [],
      columns: [
        {
          title: '配置项',
          key: 'keyName',
          width: 300,
          sortable: true
        },
        {
          title: '配置值',
          key: 'valueName',
          width: 600
        }
      ],
      data: {},
      count: 0,
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
    this.get_redis_config(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_redis_config(`tags=${this.$route.params.tags} `)
    }, 1000 * 2000)
  },
  methods: {
    search () {
      this.get_redis_config(`tags=${this.$route.params.tags}&paraname=${this.paramName} `)
    },
    clear_search () {
      this.paramName = ''
      this.get_redis_config(`tags=${this.$route.params.tags} `)
    },
    get_redis_config (parameter) {
      getRedisConfig(parameter).then(res => {
        this.configData = []
        const data1 = res.data
        for (const key in data1) {
          const value = data1[key]
          const map = {}
          map['keyName'] = key
          map['valueName'] = value
          this.configData.push(map)
        }
        this.count = res.data.count

        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取Redis配置信息错误 ${err}`)
      })
    },
    get_oracle_parameter (parameter) {
      console.log(parameter)
      this.get_redis_config(`tags=${this.$route.params.tags}&page=${parameter}`)
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
