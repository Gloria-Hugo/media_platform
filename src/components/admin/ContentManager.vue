<template>
  <div id="content-box">
    <div class="changeBar flex-box">
      <div>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          text-color="#666666"
          active-text-color="#333333"
          active="1"
        >
          <el-menu-item
            :index="item.status"
            v-for="(item, index) in tabItem"
            :key="index"
            @click="clickTab(item.status)"
            >{{ item.value }}</el-menu-item
          >
        </el-menu>
      </div>
      <div class="searchBox">
        <div class="queryIpt">
          <span>需求编号 :</span>
          <input
            type="text"
            placeholder="请输入需求编号"
            placeholder-class="placehoder"
            v-model="demand_code"
            @keyup.enter="search"
          />
        </div>
        <div class="btns querybtn" @click="search">查询</div>
      </div>
    </div>
    <div class="centerBox clearfix" v-loading="blocksLoading">
      <div v-if="blocks.length">
        <div
          class="blocks"
          v-for="(item, i) in blocks"
          :key="i"
          @click="toDeatils(item.demand_id)"
        >
          <h5>{{ item.demand_name }}</h5>
          <p>
            {{ item.demand_content }}
          </p>
          <div class="mini-box">
            <span>{{ item.release_platform_name }}</span>
            <span class="line"></span>
            <span>截至{{ item.end_date }}</span>
            <span class="line"></span>
            <span class="shangxian">{{ item.type_name }}</span>
            <span class="fujian" v-if="item.demand_annex">
              <i class="iconfont icon-fujian"></i>
              附件
            </span>
          </div>
          <div class="launch-status flex-box">
            <span>{{ item.created_date }}</span>
            <span class="status" v-if="item.demand_state == 1">待分派</span>
            <span class="status" v-else-if="item.demand_state == 2"
              >待接单</span
            >
            <span class="status" v-else-if="item.demand_state == 3"
              >待交稿</span
            >
            <span class="status" v-else-if="item.demand_state == 4"
              >待审核</span
            >
            <span class="status" v-else-if="item.demand_state == 5"
              >待上线</span
            >
            <span class="status" v-else-if="item.demand_state == 6"
              >待确认</span
            >
            <span class="status" v-else-if="item.demand_state == 7"
              >已完成</span
            >
          </div>
          <div class="options-box">
            <div
              class="btns"
              v-if="item.demand_state == 1"
              @click.stop="dispatch(1, item)"
            >
              分派承接
            </div>
            <div
              class="btns"
              v-else-if="item.demand_state == 5"
              @click.stop="dispatch(2, item)"
            >
              分派渠道
            </div>
            <div class="btns-text" v-else-if="item.demand_state == 4">
              等待客户审稿确认中
            </div>
            <div class="btns-text" v-else-if="item.demand_state == 2">
              等待承接方接单
            </div>
            <div class="btns-text" v-else-if="item.demand_state == 3">
              等待承接方交稿
            </div>
            <div
              class="btns"
              v-else-if="item.demand_state == 6"
              @click.stop="endDemand(item.demand_id)"
            >
              确认完成
            </div>
            <div class="btns-text" v-else-if="item.demand_state==7">需求结束</div>
            <div class="btns-text" v-else></div>
          </div>
        </div>
      </div>
      <p class="nodata" v-else>暂无数据</p>
    </div>
    <!-- 搜索结果区域 -->
    <el-dialog title="查询结果" :visible.sync="dialogVisible" width="50%">
      <p v-if="loading">正在查询...</p>
      <p class="tips" v-else>
        共查询到了<strong>{{ infoCount }}</strong
        >条结果。
      </p>
      <el-table
        :data="searchInfo"
        stripe
        style="width: 100%"
        height="300"
        v-loading="loading"
      >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="demand_code" label="需求编号" width="180">
        </el-table-column>
        <el-table-column prop="demand_name" label="需求名称"> </el-table-column>
        <el-table-column prop="type_name" label="需求类型"> </el-table-column>
        <el-table-column prop="release_platform_name" label="发布平台">
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="toDeatils(scope.row.demand_id)"
              style="color: #01d59a"
              type="text"
              size="small"
              title="查看详情"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="分派" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="服务等级" v-if="demand_state == 1">
          <el-radio v-model="form.radio" @change="changeRadio" label=""
            >全部</el-radio
          >
          <el-radio v-model="form.radio" @change="changeRadio" label="A"
            >高级</el-radio
          >
          <el-radio v-model="form.radio" @change="changeRadio" label="B"
            >中级</el-radio
          >
          <el-radio v-model="form.radio" @change="changeRadio" label="C"
            >初级</el-radio
          >
        </el-form-item>
        <el-form-item label="上线平台：" v-if="demand_state == 5">
          <el-radio
            v-model="form.radio"
            v-for="(item, i) in channelList"
            :key="i"
            :label="item.id"
            @change="changeBox"
            >{{ item.name }}</el-radio
          >
        </el-form-item>
        <el-form-item label="选择承接方" v-if="demand_state == 1">
          <el-select v-model="form.demands" multiple placeholder="请选择">
            <el-option
              v-for="(item, i) in checkList"
              :key="i"
              :label="item.user_name + item.price_grade + '类'"
              :value="item.created_by"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择渠道方" v-else-if="demand_state == 5">
          <el-select v-model="form.demands" placeholder="请选择">
            <el-option
              v-for="(item, i) in checkList"
              :key="i"
              :label="item.user_name"
              :value="item.user_code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计报价">
          <el-input v-model="form.price" placeholder="请输入价格"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="totalCount"
      v-if="totalCount !== 0"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      blocks: [],
      activeIndex: "",
      channel_name: "",
      tabItem: [
        { status: "", value: "全部" },
        { status: "1", value: "待分派" },
        { status: "2", value: "待接单" },
        { status: "3", value: "待交稿" },
        { status: "4", value: "待审核" },
        { status: "5", value: "待上线" },
        { status: "6", value: "待确认" },
        { status: "7", value: "已完成" },
      ],
      dialogVisible: false,
      demand_code: "",
      searchInfo: [],
      loading: false,
      infoCount: 0,
      page: 1,
      pageSize: 12,
      totalCount: 0,
      blocksLoading: false,
      demand_state: "",
      // 分派承接方or渠道方的弹窗
      dialogFormVisible: false,
      channelList: [],
      form: {
        name: "",
        radio: "",
        demands: [],
        price: "",
      },
    };
  },
  created() {
    this.fetchList(this.page);
    this.getType2();
  },
  methods: {
    clickTab(status) {
      this.activeIndex = status;
      this.fetchList(this.page);
    },
    // 获取需求列表
    fetchList(page) {
      const that = this;
      this.blocksLoading = true;
      let status = sessionStorage.getItem("statusCode");
      let token = sessionStorage.getItem("userName");
      that.$http.get(
          `/demandMobileAction/getDemandList?type=${status}&user_code=${token}&demand_state=${this.activeIndex}&offset=${page}&limit=${this.pageSize}`
        )
        .then(
          (res) => {
            if (res.data.netCode == 200){
              this.totalCount = res.data.standbyParams.count;
              var templist = res.data.data;
              if (templist) {
                for (let i = 0; i < templist.length; i++) {
                  templist[i].end_date = templist[i].end_date.substr(0, 10);
                  templist[i].created_date = this.utils.getDateDiff(
                    templist[i].created_date
                  );
                }
                that.blocks = templist;
              }
            }
            this.blocksLoading = false;
          },
          (err) => {
            console.log(err);
            that.blocks = [];
          }
        );
    },
    // 当用户点击查询的时候
    search() {
      if (this.demand_code.trim() == "") {
        return false;
      }
      this.dialogVisible = true;
      this.loading = true;
      let status = sessionStorage.getItem("statusCode");
      let dcode = sessionStorage.getItem("userName");
      this.$http
        .get(
          `/demandMobileAction/searchDemandList?type=${status}&user_code=${dcode}&demand_code=${this.demand_code}`
        )
        .then((res) => {
          if (res.data.netCode == 200) {
            let templist = res.data.data;
            this.infoCount = res.data.standbyParams.count;
            if (templist) {
              this.searchInfo = templist;
            }
          } else {
            this.searchInfo = [];
          }
          this.loading = false;
        });
    },
    toDeatils(id) {
      this.$router.push({
        path: "/admin/contentmanager/details",
        query: {
          id: id,
        },
      });
    },
    // 确认需求完成上线 流程结束
    endDemand(id) {
      this.$confirm("该需求已完成上线了吗？", "提示", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning",
      }).then(()=>{
        this.$http.get(`/demandMobileAction/endDemand?demand_id=${id}`).then(res=>{
          if(res.data.netCode==200){
            this.$message.success("操作成功！")
            this.fetchList(this.page)
          }else{
            this.$message.error(res.data.subMessage)
          }
        })
      }).catch(()=>{
      });
    },
    // 分派承接方
    dispatch(num, item) {
      const that = this;
      console.log(item)
      const code = sessionStorage.getItem("userName");
      that.form.price = "";
      that.demand_state = item.demand_state;
      let httpurl;
      if (num == 1) {
        httpurl = `/priceGradeMobileAction/getPriceGradeList?type_id=${item.demand_type}&price_grade=${this.form.radio}&user_code=`;
      } else {
        httpurl = `/channelMobileAction/getChannelUserList?channel_id=${this.form.radio}`;
      }
      that.dialogFormVisible = true;
      that.$http.get(httpurl).then((res) => {
        if (res.data.data) {
          this.checkList = res.data.data;
        }
      });
    },
    // 触发选择框按钮时
    changeBox() {
      this.form.demands = [];
      this.dispatch(2);
    },
    changeRadio() {
      this.form.demands = [];
      this.dispatch(1);
    },
    // 获取渠道
    getType2() {
      this.$http.get(`/channelMobileAction/getChannelList`).then((res) => {
        var tempList = res.data.data;
        var arr = [];
        if (tempList) {
          for (var i = 0; i < tempList.length; i++) {
            var obj = {};
            obj["name"] = tempList[i].channel_name;
            obj["id"] = tempList[i].channel_id;
            arr.push(obj);
          }
          this.channelList = arr;
        } else {
          this.channelList = [];
        }
      });
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
    },
    //  currentPage 改变时会触发
    handleCurrentChange(val) {
      this.page = val;
      this.fetchList(this.page);
    },
  },
};
</script>
<style lang="less" scoped>
.el-menu-item {
  border-bottom: transparent;
}
.el-menu-item.is-active {
  border-bottom: #f5482c !important;
}
#content-box {
  padding: 0;
}
</style>