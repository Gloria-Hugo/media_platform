<template>
  <div id="admin">
    <my-header></my-header>
    <el-container>
      <el-container>
        <el-aside width="260px" height="1015px">
          <el-menu :router="true" :default-active="$route.path" active-text-color="#F5472C">
              <el-menu-item index="/contractor/mymanuscript">
                <template slot="title">
                  <i class="el-icon-message"></i>我的稿件
                </template>
              </el-menu-item>

              <!-- <el-menu-item index="">
                <template slot="title">
                  <i class="el-icon-menu"></i>我的团队
                </template>
              </el-menu-item> -->

              <el-menu-item index="/contractor/countingmanager">
                <template slot="title">
                  <i class="el-icon-s-finance"></i>结算管理
                </template>
              </el-menu-item>

              <el-menu-item index="/contractor/mymessages">
                <template slot="title">
                  <i class="el-icon-s-comment"></i>消息中心
                </template>
              </el-menu-item>

          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import myHeader from "../components/common/Header"
export default {
  components: {
    myHeader
  },
};
</script>
<style lang="less" scoped>

</style>
