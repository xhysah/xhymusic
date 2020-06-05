<template>
  <div>
    <el-container>
      <!--      页面主体-->
      <el-main>
        <div  class="main">
          <div class="language">
            <span>语种:</span>
            <div>
              <span :class="{actives: currentId === -1}" @click="show('area',-1)">全部</span>
              <template v-for="(item, index) in singerArea">
                <el-divider :key="item.areaId" direction="vertical"></el-divider>
                <span :key="index" :class="{actives: currentId === item.areaId}" @click="show('area', item.areaId)">{{item.name}}</span>
              </template>
            </div>
          </div>
          <div class="cate">
            <span>分类:</span>
            <div>
              <span :class="{actives: currentId2 === -1}" @click="show('cate',-1)">全部</span>
              <template v-for="(item, index) in singerType">
                <el-divider :key="item.typeId" direction="vertical"></el-divider>
                <span :key="index" :class="{actives: currentId2 === item.typeId}" @click="show('cate', item.typeId)">{{item.name}}</span>
              </template>
            </div>
          </div>
          <!--        循环字母-->
          <div class="spells">
            <span>筛选:</span>
            <div class="spell">
              <span :class="{actives: currentId3 === -1}" @click="searchSinger(-1)">热门</span>
              <template v-for="n in 26">
                <el-divider :key="n" direction="vertical"></el-divider>
                <span :key="n" :class="{actives: currentId3=== String.fromCharCode(n+96)}" class="spell-item"
                      @click="searchSinger(String.fromCharCode(n+96))">{{String.fromCharCode(n+64)}}</span>
              </template>
              <el-divider direction="vertical"></el-divider>
              <span class="last" :class="{actives: currentId3 === 0}" @click="searchSinger(0)">#</span>
            </div>
          </div>
        </div>
      <!--        歌手信息-->
        <div class="grid-5">
          <template v-for="item in singers">
            <singer-outline :key="item.id">
              <template v-slot:img>
                <img :src="item.img1v1Url" alt="" @click="showInformation(item.id)">
              </template>
              <template v-slot:sentence>
                <div @click="showInformation(item.id)">{{item.name}}</div>
              </template>
            </singer-outline>
          </template>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import singerOutline from '../../components/songOutline /singerOutline'
export default {
  name: 'singer',
  created () {
    this.firstShow()
    this.$store.commit('editActiveName', 'singer')
  },
  components: {
    singerOutline
  },
  data () {
    return {
      // 歌手类型
      singerType: [
        {
          name: '男歌手',
          typeId: 1
        },
        {
          name: '女歌手',
          typeId: 2
        },
        {
          name: '组合乐队',
          typeId: 3
        }
      ],
      // 歌手地区
      singerArea: [
        {
          name: '华语',
          areaId: 7
        },
        {
          name: '欧美',
          areaId: 96
        },
        {
          name: '日本',
          areaId: 8
        },
        {
          name: '韩国',
          areaId: 16
        },
        {
          name: '其他',
          areaId: 0
        }
      ],
      singers: {},
      // 记录此时的typeId,areaId
      activeId: {
        typeId: 0,
        areaId: 0,
        initial: -1
      },
      currentId: -1,
      currentId2: -1,
      currentId3: -1
    }
  },
  methods: {
    // 获取歌手的种类
    show (type, name) {
      if (type === 'cate') {
        this.currentId2 = name
        this.activeId.typeId = name
        this.$http.get(`/artist/list?type=${name}&area=${this.activeId.areaId}&initial=${this.activeId.initial}`).then(data => {
          this.singers = data.artists
        })
      } else {
        this.currentId = name
        this.activeId.areaId = name
        this.$http.get(`/artist/list?type=${this.activeId.typeId}&area=${name}&initial=${this.activeId.initial}`).then(data => {
          this.singers = data.artists
        })
      }
    },
    // 根据字母获取歌手信息
    searchSinger (value) {
      this.currentId3 = value
      this.activeId.initial = value
      this.$http.get(`/artist/list?type=${this.activeId.typeId}&area=${this.activeId.areaId}&initial=${value}`).then(data => {
        console.log(data)
        this.singers = data.artists
      })
    },
    // 显示热门歌手
    firstShow () {
      this.activeId.typeId = -1
      this.activeId.areaId = -1
      this.$http.get('/artist/list?type=-1&area=-1').then(data => {
        this.singers = data.artists
      })
    },
    // 根据id，去往歌手详细信息页面
    showInformation (id) {
      this.$router.push({ name: 'singerInformation', params: { sid: id } })
    }
  },
  computed: {}
}
</script>

<style lang="stylus" scoped>
  .actives
    background-color #262626
    border-radius 5px
    color red
  .el-main
    padding 0
    .main
      margin  0 20px
      color #5f5d5d
      div
        margin 4px 10px
        font-size 14px
        div
          cursor pointer
          display inline-block
          span
            padding 2px 10px
          span:hover
            color red
        span:first-child
          margin-right 5px
      .spells
        .spell
          display inline
        .spell-item,.last
          margin 0 10px
          padding 2px 20px
</style>
