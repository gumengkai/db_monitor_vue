<template>
  <div class="layout">
     <Layout>
       <redis-menu :value="'5'" :tags="this.Tags"></redis-menu>
       <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
    <Card>
      <br>
      <row>
        <Table
               :columns="columns"
               :data="clientlistData">
        </Table>
      </row>
    </Card>
            </Content>
        </Layout>
  </div>
</template>

<script>
import { getRedisClientList } from '@/api/redis'
import { RedisMenu } from '_c/top-menu'
export default {
  components: {
    RedisMenu
  },
  data () {
    return {
      Tags: '',
      data: '',
      clientlistData: [],
      columns: [
        {
          title: 'id',
          key: 'id',
          width: 100,
          sortable: true
        },
        {
          title: 'addr',
          key: 'addr',
          width: 150
        },
        {
          title: 'age',
          key: 'age',
          width: 100
        },
        {
          title: 'idle',
          key: 'idle',
          width: 100
        },
        {
          title: 'flags',
          key: 'flags',
          width: 80
        },
        {
          title: 'db',
          key: 'db',
          width: 80
        },
        {
          title: 'sub',
          key: 'sub',
          width: 80
        },
        {
          title: 'psub',
          key: 'psub',
          width: 80
        },
        {
          title: 'multi',
          key: 'multi',
          width: 80
        },
        {
          title: 'qbuf',
          key: 'qbuf',
          width: 80
        },
        {
          title: 'qbuf-free',
          key: 'qbuf-free',
          width: 100
        },
        {
          title: 'obl',
          key: 'obl',
          width: 80
        },
        {
          title: 'oll',
          key: 'oll',
          width: 80
        },
        {
          title: 'omem',
          key: 'omem',
          width: 80
        },
        {
          title: 'events',
          key: 'events',
          width: 80
        },
        {
          title: 'cmd',
          key: 'cmd',
          width: 100
        }
      ],
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
    this.get_redis_clientlist(`tags=${this.$route.params.tags} `)
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      this.get_redis_clientlist(`tags=${this.$route.params.tags} `)
    }, 1000 * 2000)
  },
  methods: {
    search () {
      this.get_redis_clientlist(`tags=${this.$route.params.tags} `)
    },
    clear_search () {
      this.get_redis_clientlist(`tags=${this.$route.params.tags} `)
    },
    get_redis_clientlist (parameter) {
      getRedisClientList(parameter).then(res => {
        this.data = res.data
        for (let i in this.data) {
          this.clientlistData.push(this.data[i])
        }
        console.log(this.clientlistData)
      }).catch(err => {
        this.$Message.error(`获取redis慢查询信息错误 ${err}`)
      })
    },
    get_oracle_parameter (parameter) {
      console.log(parameter)
      this.get_redis_clientlist(`tags=${this.$route.params.tags}&page=${parameter}`)
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
