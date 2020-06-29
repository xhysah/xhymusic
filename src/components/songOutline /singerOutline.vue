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
      default: '100%'
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
    padding 0 20px
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
  .img:hover
    img
      box-shadow 0 0 10px red
    +.sentence
      visibility hidden
</style>
