<template>
  <div>

  </div>
</template>

<script>
export default {
  name: 'detail',
  created () {
    this.getDetail()
  },
  data () {
    return {}
  },
  methods: {
    getDetail () {
      this.$http.get(`${this.path}${this.did}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取歌单详细信息失败')
        }
        console.log(data)
      })
    }
  },
  computed: {
    did () {
      return this.$route.query.id
    },
    path () {
      return this.$route.query.path
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
