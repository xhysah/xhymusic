<template>
  <div class="img-item">
    <div :style="{width:newLength, height:newHeight}" class="img" @mouseenter="enter" @mouseleave="leave">
      <transition name="creator">
        <div v-if="newActive" class="hover">
          <div><slot name="creator"></slot></div>
        </div>
      </transition>
      <slot name="img"></slot>
      <transition name="icon">
          <i class="el-icon-video-play" v-if="newActive" :style="{'font-size':newFont}"></i>
      </transition>
    </div>
    <div class="sentence" :style="{width:newLength}">
      <slot name="sentence"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'songOutline',
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
      newHeight: this.height,
      newActive: false
    }
  },
  methods: {
    enter () {
      this.newActive = true
    },
    leave () {
      this.newActive = false
    }
  },
  computed: {
    newFont () {
      return `${parseInt(this.newLength) * 0.25}px`
    }
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
        text-align justify
        overflow: hidden
        display: -webkit-box
        -webkit-box-orient: vertical
        -webkit-line-clamp 2
  .icon-enter-active, .icon-leave-active
    transition opacity 0.5s
  .icon-enter, .icon-leave-to
    opacity 0
  .hover
    div
      width 100%
      padding 4px
      position absolute
      left 0
      top 0
      font-size 10px
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
