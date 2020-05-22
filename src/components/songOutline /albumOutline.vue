<template>
  <div class="img-item">
    <div :style="{width:newLength, height:newHeight}" class="imgs" @mouseenter="enter" @mouseleave="leave">
      <slot name="img"></slot>
      <transition name="icon">
        <i class="el-icon-video-play" v-if="newActive" :style="{'font-size':newFont, top:yCenter, left:xCenter}"></i>
      </transition>
    </div>
    <div class="sentence" :style="{width:newLength}">
      <slot name="sentence"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'albumOutline',
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
      return `${parseInt(this.newHeight) * 0.4}px`
    },
    xCenter () {
      return `${(parseInt(this.newLength) - parseInt(this.newHeight) * 0.4) / 2}px`
    },
    yCenter () {
      return `${parseInt(this.newHeight) * 0.6 / 2}px`
    }
  }
}
</script>

<style lang="stylus" scoped>
  .img-item
    display inline-block
    margin 20px
    .imgs
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
  i
    position absolute
    margin 5px
  .imgs:hover
    img
      width 110%
      height 110%
      border 1px solid red
      box-shadow 0 0 10px red
    +.sentence
      visibility hidden
</style>
