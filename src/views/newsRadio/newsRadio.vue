<template>
  <div>
    <div>
      <div v-for="(item, index) in djCategories" :key="index" class="box">
        <i class="el-icon-edit"></i>
        <span>{{item.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'newsRadio',
  created () {
    this.$store.commit('editActiveName', 'newsRadio')
    this.getDjCateList()
  },
  data () {
    return {
      djCategories: {}
    }
  },
  methods: {
    getDjCateList () {
      this.$http.get('/dj/catelist').then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取电台分类失败')
        }
        this.djCategories = data.categories
        console.log(data)
      })
    }
  },
  computed: {}
}
</script>

<style lang="stylus" scoped>
  .box
    border 1px solid red
    width 80px
    height 80px
</style>
