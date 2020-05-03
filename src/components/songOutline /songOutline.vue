<template>
  <div class="img-item">
    <div :style="{width:newLength, height:newHeight}">
      <slot name="img"></slot>
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
      newHeight: this.height
    }
  },
  methods: {},
  computed: {}
}
</script>

<style lang="stylus" scoped>
  .img-item
    display inline-block
    margin 20px
    .sentence
      color white
      font-size 10px
      cursor pointer
      white-space nowrap
      overflow hidden
  .sentence:hover
    text-decoration underline
</style>
