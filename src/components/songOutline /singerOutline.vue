<template>
  <div class="img-item">
    <div :style="{width:newLength, height:newHeight}" class="img">
      <slot name="img"></slot>
    </div>
    <div class="sentence" :style="{width:newLength}">
      <slot name="sentence"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'singerOutline',
  props: {
    length: {
      type: String,
      default: '150px'
    },
    height: {
      type: String,
      default: 'auto'
    }
  },
  data () {
    return {
      newLength: this.length,
      newHeight: this.height
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style lang="stylus" scoped>
  .img-item
    display inline-block
    margin 20px
    .img
      position relative
    .sentence
      color white
      font-size 10px
      cursor pointer
      div
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
  .icon-enter-active, .icon-leave-active
    transition opacity 0.5s
  .icon-enter, .icon-leave-to
    opacity 0
  .hover
    div
      width 100%
      padding 6px 0 6px 0
      position absolute
      left 0
      top 0
      font-size 10px
      text-indent 2em
      background: rgba(0,0,0,0.6)
  i
    position absolute
    bottom 0
    right 0
    margin 5px
  .creator-enter-active, .creator-leave-active
    transition all 0.5s
  .creator-enter, .creator-leave-to
    opacity 0
    transform translateY(-7px)
</style>
