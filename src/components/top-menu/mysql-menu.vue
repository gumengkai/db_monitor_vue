<template>
  <Menu mode="horizontal" theme="light" :active-name="this.value" ref="oracle">
    <div class="layout-nav">
      <MenuItem name="1" :to="this.view" >
        <Icon type="ios-navigate"></Icon>
        概览
      </MenuItem>
      <MenuItem name="2" :to="this.myisam" >
        <Icon type="ios-analytics"></Icon>
        MyISAM
      </MenuItem>
      <MenuItem name="3" :to="this.innodb">
        <Icon type="ios-pulse"></Icon>
        Innodb
      </MenuItem>
      <MenuItem name="4" :to="this.alertlog">
        <Icon type="ios-paper"></Icon>
        日志解析
      </MenuItem>
      <MenuItem name="5" :to="this.slowquerylog">
        <Icon type="md-sad"></Icon>
        慢查询
      </MenuItem>
      <MenuItem name="6" :to="this.view">
        <Icon type="ios-sync"></Icon>
        复制
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
      myisam: '',
      innodb: '',
      alertlog: '',
      slowquerylog: ''
    }
  },
  methods: {
    init () {
      this.view = '/mysql/' + this.tags + '/view'
      this.myisam = '/mysql/' + this.tags + '/myisam'
      this.innodb = '/mysql/' + this.tags + '/innodb'
      this.alertlog = '/mysql/' + this.tags + '/alert-log'
      this.slowquerylog = '/mysql/' + this.tags + '/slowquery-log'
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
