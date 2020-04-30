<template>
  <div class="img-item">
    <div :style="{width:newLength, height:newLength}">
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
    }
  },
  data () {
    return {
      newLength: this.length
    }
  },
  methods: {},
  computed: {}
}
</script>

<style lang="stylus" scoped>
  .img-item
    display inline-block
    margin 30px
    .sentence
      color white
      font-size 10px
      cursor pointer
  .sentence:hover
    text-decoration underline
</style>
