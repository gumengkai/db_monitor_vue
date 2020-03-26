<template>
  <Menu mode="horizontal" theme="light" :active-name="this.value" ref="oracle">
    <div class="layout-nav">
      <MenuItem name="1" :to="this.view">
        <Icon type="ios-navigate"></Icon>
        概览
      </MenuItem>
      <MenuItem name="2" :to="this.resource">
        <Icon type="ios-keypad"></Icon>
        资源
      </MenuItem>
      <MenuItem name="3" :to="this.activesession">
        <Icon type="ios-play"></Icon>
        会话
      </MenuItem>
      <MenuItem name="4" :to="this.performance">
        <Icon type="ios-pulse"></Icon>
        性能
      </MenuItem>
      <MenuItem name="5" :to="this.topsql">
        <Icon type="md-sad"></Icon>
        TOP SQL
      </MenuItem>
      <MenuItem name="6" :to="this.tablestats">
        <Icon type="ios-albums"></Icon>
        统计信息
      </MenuItem>
      <MenuItem name="7" :to="this.alertlog">
        <Icon type="ios-paper"></Icon>
        日志解析
      </MenuItem>
    </div>
  </Menu>
</template>

<script>
export default {
  name: 'oracle-menu',
  props: {
    value: String,
    tags: String
  },
  data () {
    return {
      view: '',
      resource: '',
      activesession: '',
      performance: '',
      topsql: '',
      alertlog: '',
      tablestats: ''
    }
  },
  methods: {
    init () {
      this.view = '/oracle/' + this.tags + '/view'
      this.resource = '/oracle/' + this.tags + '/resource'
      this.activesession = '/oracle/' + this.tags + '/active-session'
      this.performance = '/oracle/' + this.tags + '/performance'
      this.topsql = '/oracle/' + this.tags + '/top-sql'
      this.alertlog = '/oracle/' + this.tags + '/alert-log'
      this.tablestats = '/oracle/' + this.tags + '/table-stats'
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

</style>
