<template>
  <el-container>
    <el-header>
      <div id="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <el-aside :width="menushow ? '65px' : '200px'">
        <div
          style="background-color:rgb(74,80,100);
          height:25px;
          line-height:25px;
          font-size:12px;
          text-align:center;
          color:#ccc;
          letter-spacing:0.1em;
          user-select:none;"
          @click="menushow=!menushow"
        >|||</div>
        <el-menu
          default-active="2"
          :collapse-transition="false"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :style="menushow ? 'width:65px;' : 'width:200px;'"
          :collapse="menushow"
        >
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                index="item.id+'-'+item2.id"
                v-for="item2 in item.children"
                :key="item2.id"
              >{{item2.authName}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  //在生命周期中调用
  created() {
    this.getMenuList()
  },
  data() {
    return {
      menushow: false,
      //接收或得到的后端左侧按钮的权限信息
      menuList: []
    }
  },
  methods: {
    //获得用于左侧选择权限的信息
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      //吧权限数据赋予menulist
      this.menuList = res.data
    },
    logout() {
      //确认退出
      this.$confirm('确认退出系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          // 清除token
          window.sessionStorage.removeItem('token')
          // 跳转到页面
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    padding: 0;
    padding-right: 20px;
    background-color: rgba(55, 61, 65);
    display: flex;
    align-items: center;
    justify-content: space-between;
    #logo-box {
      color: #fff;
      font-size: 22px;
      display: flex;
      align-items: center;
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 20px;
        margin-left: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>

