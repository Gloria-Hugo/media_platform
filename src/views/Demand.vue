<template>
  <div id="workshop">
    <my-header></my-header>
    <el-container>
      <el-container>
        <el-aside width="260px" height="1015px">
          <router-link to="/demand/createneeds">
            <div class="mainColor creat_needs">+ 新建需求</div>
          </router-link>
          <el-menu
            :router="true"
            :default-active="$route.path"
            active-text-color="#F5472C"
          >
            <el-menu-item index="/demand/needs">
              <template slot="title">
                <i class="el-icon-s-platform"></i>我的需求
              </template>
            </el-menu-item>
            <el-menu-item index="/demand/statistics">
              <template slot="title">
                <i class="el-icon-menu"></i>数据统计
              </template>
            </el-menu-item>

            <el-menu-item index="/demand/myservice">
              <template slot="title">
                <i class="el-icon-setting"></i>我的服务
              </template>
            </el-menu-item>

            <el-menu-item index="/demand/mymessages">
              <template slot="title">
                <i class="el-icon-s-comment"></i>消息中心
              </template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- <div style="width:1660px"> -->
          <router-view></router-view>
          <!-- </div> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import myHeader from "../components/common/Header";
export default {
  components: {
    myHeader
  }
};
</script>

<style lang="less" scoped>
.creat_needs {
  color: #fff;
  margin: 0px 0 40px 25px;
  height: 45px;
  width: 160px;
  line-height: 45px;
  text-align: center;
}
</style>
