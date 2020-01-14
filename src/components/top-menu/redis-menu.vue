<template>
  <Menu mode="horizontal" theme="light" :active-name="this.value" ref="redis">
    <div class="layout-nav">
      <MenuItem name="1" :to="this.view" >
        <Icon type="ios-navigate"></Icon>
        概览
      </MenuItem>
      <MenuItem name="2" :to="this.immediatestats" >
        <Icon type="ios-body"></Icon>
        实时状态
      </MenuItem>
      <MenuItem name="3" :to="this.slowlog" >
        <Icon type="md-sad"></Icon>
        慢查询分析
      </MenuItem>
      <MenuItem name="4" :to="this.config">
        <Icon type="ios-settings-outline"></Icon>
        配置查询
      </MenuItem>
      <MenuItem name="5" :to="this.clientlist">
        <Icon type="ios-contacts"></Icon>
        连接信息
      </MenuItem>
      <MenuItem name="6" :to="this.commandstats">
        <Icon type="ios-pulse"></Icon>
        命令曲线
      </MenuItem>
      <MenuItem name="7" :to="this.alertlog">
        <Icon type="ios-paper"></Icon>
        后台日志
      </MenuItem>
    </div>
  </Menu>
</template>

<script>
export default {
  name: 'redis-menu',
  props: {
    value: String,
    tags: String
  },
  data () {
    return {
      view: '',
      immediatestats: '',
      slowlog: '',
      clientlist: '',
      config: '',
      alertlog: '',
      slowquerylog: '',
      commandstats: ''
    }
  },
  methods: {
    init () {
      this.view = '/redis/' + this.tags + '/view'
      this.immediatestats = '/redis/' + this.tags + '/immediate-stats'
      this.slowlog = '/redis/' + this.tags + '/slowlog'
      this.config = '/redis/' + this.tags + '/config'
      this.clientlist = '/redis/' + this.tags + '/clientlist'
      this.slowquerylog = '/redis/' + this.tags + '/slowquery-log'
      this.commandstats = '/redis/' + this.tags + '/commandstats'
      this.alertlog = '/redis/' + this.tags + '/alert-log'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  }
}
</script>

<style scoped>

</style>\
