<template>
  <div id="admin">
    <my-header></my-header>
    <el-container>
      <el-container>
        <el-aside width="260px" height="1015px">
          <el-menu
            :router="true"
            :default-active="$route.path"
            active-text-color="#F5472C"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-s-tools "></i>
                用户管理</template
              >
              <el-menu-item-group>
                <el-menu-item index="/admin/demandusermanager">
                  <template slot="title">
                    <i class="el-icon-s-custom"></i>需求方管理
                  </template>
                </el-menu-item>
                <el-menu-item index="/admin/canalusermanager">
                  <template slot="title">
                    <i class="el-icon-s-custom"></i>渠道方管理
                  </template>
                </el-menu-item>
                <el-menu-item index="/admin/contractorcsermanager">
                  <template slot="title">
                    <i class="el-icon-s-custom"></i>承接方管理
                  </template>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- <el-menu-item index="/admin/usermanager">
              <template slot="title">
                <i class="el-icon-message"></i>用户管理
              </template>
            </el-menu-item> -->

            <el-menu-item index="/admin/contentmanager">
              <template slot="title">
                <i class="el-icon-s-platform"></i>需求管理
              </template>
            </el-menu-item>

            <el-menu-item index="/admin/projectmanager">
              <template slot="title">
                <i class="el-icon-s-order"></i>服务管理
              </template>
            </el-menu-item>

            <el-menu-item index="/admin/sectionmanager">
              <template slot="title">
                <i class="el-icon-s-cooperation"></i>单位管理
              </template>
            </el-menu-item>

            <el-menu-item index="/admin/typemanager">
              <template slot="title">
                <i class="el-icon-s-open"></i>类型管理
              </template>
            </el-menu-item>

            <el-menu-item index="/admin/sourcemanager">
              <template slot="title">
                <i class="el-icon-s-flag"></i>渠道管理
              </template>
            </el-menu-item>

            <el-menu-item index="/admin/balancemanager">
              <template slot="title">
                <i class="el-icon-s-management"></i>结算管理
              </template>
            </el-menu-item>

            <el-menu-item index="/admin/mymessages">
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
import myHeader from "../components/common/Header";
export default {
  data() {
    return {};
  },
  mounted() {},
  watch: {},
  methods: {},
  components: {
    myHeader,
  },
};
</script>
<style lang="less" scoped>
.el-menu-item {
  padding-left: 20px !important;
}
.el-menu-item-group {
  .el-menu-item {
    padding-left: 40px !important;
  }
}
</style>
