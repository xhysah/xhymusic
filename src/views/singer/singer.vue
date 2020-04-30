<template>
  <div>
    <el-container>
      <!--      侧边栏-->
      <el-aside width="240px">
        <div class="header">推荐</div>
        <div class="main" :class="{active: currentId === 0}" @click="firstShow()"><div class="point"></div>热门歌手</div>
        <!--        循环地区分类-->
        <template v-for="(item1, index1) in singerArea">
          <div :key="index1">
            <el-divider></el-divider>
            <div class="header">{{item1.name}}</div>
            <!--            循环歌手分类-->
            <template v-for="(item2, index2) in singerType">
              <div :key="index2">
                <div class="main" :class="{active: currentId === ''+item2.typeId+item1.areaId}" @click="show(item2.typeId,item1.areaId,item1.name+item2.name)"><div class="point"></div>{{item1.name+item2.name}}</div>
              </div>
            </template>
          </div>
          </template>
      </el-aside>
      <!--      页面主体-->
      <el-main>
        <div class="header">{{activeId.headerName}}</div>
        <div class="line"></div>
      <!--        循环字母-->
        <div class="spell" v-if="activeId.typeId !== 0">
          <span class="red" :class="{active: currentId2 === 0}" @click="show(activeId.typeId, activeId.areaId, activeId.headerName)">热门</span>
          <template v-for="n in 26">
            <span :key="n" :class="{active: currentId2 === String.fromCharCode(n+96)}" class="spell-item" @click="searchSinger(String.fromCharCode(n+96))">{{String.fromCharCode(n+64)}}</span>
           </template>
        </div>
      <!--        歌手信息-->
        <div class="flex">
          <template v-for="item in singers">
            <song-outline :key="item.id" length="100px">
              <template v-slot:img>
                <img :src="item.img1v1Url" alt="" @click="showInformation(item.id)">
              </template>
              <template v-slot:sentence>
                <div @click="showInformation(item.id)">{{item.name}}</div>
              </template>
            </song-outline>
          </template>
        </div>
        <div class="line"></div>
        <div  class="rest">
          <template v-for="(item, index) in restSingers">
            <span @click="showInformation(item.id)" :key="index" class="rest-item">{{item.name}}</span>
          </template>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import songOutline from '../../components/songOutline /songOutline'
export default {
  name: 'singer',
  created () {
    this.firstShow()
  },
  components: {
    songOutline
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
          name: '乐队',
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
      // 显示图片的歌手
      singers: {},
      // 不显示图片的其他歌手
      restSingers: {},
      // 记录此时的typeId,areaId
      activeId: {
        typeId: 0,
        areaId: 0,
        headerName: '热门歌手'
      },
      currentId: 0,
      currentId2: 0
    }
  },
  methods: {
    // 获取歌手的种类
    show (typeId, areaId, headerName) {
      this.currentId2 = 0
      this.activeId.typeId = typeId
      this.activeId.areaId = areaId
      this.activeId.headerName = headerName
      this.currentId = '' + typeId + areaId
      this.$http.get(`/artist/list?type=${typeId}&area=${areaId}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取歌手信息失败')
        }
        this.singers = data.artists.slice(0, 8)
        this.restSingers = data.artists.slice(8)
        // console.log(this.restSingers)
      })
    },
    // 根据字母获取歌手信息
    searchSinger (value) {
      this.currentId2 = value
      this.$http.get(`/artist/list?type=${this.activeId.typeId}&area=${this.activeId.areaId}&initial=${value}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('搜索歌手信息失败')
        }
        this.singers = data.artists.slice(0, 8)
        this.restSingers = data.artists.slice(8)
      })
    },
    // 显示热门歌手
    firstShow () {
      this.activeId.headerName = '热门歌手'
      this.activeId.typeId = 0
      this.currentId = 0
      this.$http.get('/top/artists').then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取歌手信息失败')
        }
        this.singers = data.artists.slice(0, 8)
        this.restSingers = data.artists.slice(8)
      })
    },
    showInformation (id) {
      this.$router.push({ name: 'singerInformation', params: { sid: id } })
    }
  },
  computed: {}
}
</script>

<style lang="stylus" scoped>
  .el-container
    width 70%
    margin 0 auto
    .el-aside
      padding 20px
      border 1px solid #353535
      .header
        font-size 20px
      .main
        font-size 12px
        padding 2px 0
        cursor pointer
  .spell-item:hover,.main:hover
    text-decoration underline
  .point
    display inline-block
    width 5px
    height 5px
    border-radius 50%
    background-color white
    margin 0 10px
    margin-top -4px
  .rest
    display grid
    grid-template-columns: repeat(5, 20%);
    margin-left 20px
  .rest-item
    font-size 10px
    display inline-block
    margin 10px
    cursor pointer
  .rest-item:hover
    text-decoration underline
    color red
  .spell
    margin 2px auto
  .spell-item
    display inline-block
    padding  0 7px
    cursor pointer
  .red
    padding 3px 6px
    display inline-block
    margin 5px 5px 5px 15px
    cursor pointer
  .header
    font-size 25px
    margin 10px
  .active
    background-color red
    box-shadow 0px 0 3px yellow
  img:hover
    border 1px solid red
    box-shadow 0 0 20px red
</style>
