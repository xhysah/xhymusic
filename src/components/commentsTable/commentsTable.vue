<template>
  <div class="comment">
    <div class="img">
      <img :src="singleComment.user.avatarUrl" alt="">
    </div>
    <span class="nickname">{{singleComment.user.nickname}}</span>
    <span class="content" :style="{width:newWidth}">{{singleComment.content}}</span>
    <span class="time">{{commentTime}}</span>
  </div>
</template>

<script>
export default {
  name: 'commentsTable',
  props: {
    comment: {
      type: Object
    },
    width: {
      type: String,
      default: '530px'
    }
  },
  data () {
    return {
      singleComment: this.comment,
      newWidth: this.width
    }
  },
  methods: {},
  computed: {
    commentTime () {
      const time = new Date()
      time.setTime(this.singleComment.time)
      console.log(time.toLocaleDateString())
      return time.toLocaleDateString()
    }
  }
}
</script>

<style lang="stylus" scoped>
  .comment
    position relative
  .img
    margin 10px
    img
      width 50px
      height 50px
  .nickname
    font-size 12px
    color #8cd9ee
    position absolute
    left 70px
    top -1px
  .content
    font-size 14px
    position absolute
    top 30px
    left 70px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  .time
    font-size 10px
    color #888888
    position absolute
    right 20px
    top 20px
</style>
