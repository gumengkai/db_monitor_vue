<template>
  <Menu mode="horizontal" theme="light" :active-name="this.value" ref="oracle">
    <div class="layout-nav">
      <MenuItem name="1" :to="this.view" >
        <Icon type="ios-navigate"></Icon>
        概览
      </MenuItem>
      <MenuItem name="2" :to="this.io" >
        <Icon type="ios-keypad"></Icon>
        磁盘IO
      </MenuItem>
      <MenuItem name="3" :to="this.memory">
        <Icon type="ios-analytics"></Icon>
        内存&虚拟内存
      </MenuItem>
    </div>
  </Menu>
</template>

<script>
export default {
  name: 'linux-menu',
  props: {
    value: String,
    tags: String
  },
  data () {
    return {
      view: '',
      io: '',
      memory: ''
    }
  },
  methods: {
    init () {
      this.view = '/linux/' + this.tags + '/view'
      this.io = '/linux/' + this.tags + '/io'
      this.memory = '/linux/' + this.tags + '/memory'
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
