<template>
  <div class="flex-box detailsBox" id="needs-details">
    <!-- 左边盒子 -->
    <div class="sideBox leftBox">
      <div class="flex-box topBox">
        <div>需求编号: {{ detailsBox.demand_code }}</div>
        <div>{{ detailsBox.created_date }}发布</div>
      </div>
      <div class="block-box">
        <div class="flex-box block-head">
          <div class="number">{{ detailsBox.demand_name }}</div>
          <div class="status">{{ details_demand_state }}</div>
        </div>
        <div id="progress-box">
          <el-timeline style="padding-left: 30px; padding-top: 30px">
            <el-timeline-item
              placement="top"
              v-for="(item, i) in progress"
              :key="i"
            >
              <el-card shadow="hover" style="border: none">
                <h4 :class="i == 0 ? 'active' : 'unactive'">
                  {{ item.stream_title }}
                </h4>
                <p :class="i == 0 ? 'active' : 'unactive'">
                  {{ item.created_date }}
                </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="option-btns">
          <div class="profits">预计收益：￥{{ detailsBox.channel_money }}</div>
          <!-- <div class="status3 hover">联系管理员</div> -->

          <div
            class="btns hover"
            v-if="detailsBox.channel_state == 1"
            @click="dialogVisible = true"
          >
            稿件上线
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span style="color: red;">是否将{{ detailsBox.demand_name }}上线？</span>
      <el-input style="margin-top:15px" v-model="online_link" placeholder="请输入线上链接，以供查阅"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="upToDate()">确 定</el-button>
      </span>
    </el-dialog>
    <div class="sideBox rightBox">
      <div class="topBox">
        <div style="font-size: 18px; font-weight: 500; color: #222222">
          需求详情
        </div>
      </div>
      <div class="scripts-name">{{ detailsBox.demand_name }}</div>
      <div class="more-details">{{ detailsBox.demand_content }}</div>
      <div class="subtitle" v-if="detailsBox.demand_annex">附件下载:</div>
      <div class="links hover" v-if="detailsBox.demand_annex">
        <a
          v-for="(item, i) in annexList"
          :key="i"
          :href="fullUrl + item.demand_annex"
          :download="fullUrl + detailsBox.demand_annex"
        >
          <span
            ><i class="iconfont icon-fujian"></i
            >{{ item.annex_name ? item.annex_name : "下载附件" }}
          </span>
        </a>
        <!-- <el-link icon="iconfont icon-fujian">编辑</el-link> -->
        <!-- <span class="update">更新附件</span> -->
      </div>
      <div class="subtitle">需求类型:</div>
      <div class="context">{{ detailsBox.type_name }}</div>
      <div class="subtitle">意向发布平台:</div>
      <div class="context">
        {{ detailsBox.release_platform_name }}
      </div>
      <div class="subtitle">交稿截止日期:</div>
      <div class="context">{{ detailsBox.end_date }}</div>
      <div class="subtitle" v-if="Scriptlinks">查看稿件:</div>
      <div class="links hover" v-if="Scriptlinks">
        <a :href="fullUrl + Scriptlinks" download>
          <span><i class="iconfont icon-gaojianku"></i>点击下载稿件 </span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
//0未分配渠道方，1已分配，2已完成，3已结算
const DEMAND_STATE = {
  0: "未分配渠道方",
  1: "已分配",
  2: "已完成",
  3: "已结算",
};
export default {
  data() {
    return {
      id: "",
      dialogVisible: false,
      detailsBox: [],
      downLoads: "",
      fullUrl: "",
      progress: [],
      Scriptlinks: "",
      annexList: [],
      online_link:''
    };
  },
  computed: {
    // 直接当做普通属性调用不加括号
    // 任何data中数据变化立即重新计算
    // 计算属性会缓存
    details_demand_state() {
      return DEMAND_STATE[this.detailsBox.channel_state];
    },
  },
  created() {
    this.id = this.$route.query.id;
    this.getDemandById();
  },
  methods: {
    // 获取需求详情
    getDemandById() {
      const that = this;
      that.$http
        .get(`/demandMobileAction/getDemandById?demand_id=${that.id}`)
        .then((res) => {
          console.log(res.data.standbyParams);
          if (res.data.netCode == 200) {
            let templist = res.data.data;
            templist.created_date = templist.created_date.substr(0, 10);
            templist.end_date = templist.end_date.substr(0, 10);

            var strUrl;
            var strName;
            if (templist.demand_annex || templist.annex_name) {
              if (templist.demand_annex) {
                strUrl = templist.demand_annex.split(",");
              } else {
                strUrl = "";
              }
              if (templist.annex_name) {
                strName = templist.annex_name.split(",");
              } else {
                strName = "";
              }
              this.annexList = strUrl.map((demand_annex, i) => ({
                demand_annex,
                annex_name: strName[i],
              }));
            }

            that.detailsBox = templist;
            var listDemandStream = res.data.standbyParams.listDemandStream;
            for (var i = 0; i < listDemandStream.length; i++) {
              listDemandStream[i].created_date = listDemandStream[
                i
              ].created_date.substr(0, 16);
            }
            that.progress = listDemandStream;
            that.fullUrl =
              res.data.standbyParams.ipUrl + res.data.standbyParams.resUrl;
            if (res.data.standbyParams.listManuscript) {
              that.Scriptlinks =
                res.data.standbyParams.listManuscript[0].manuscript_url;
            }
          } else {
            that.detailsBox = [];
          }
        });
    },
    downLoad(src) {
      this.downLoads = this.fullUrl + src;
    },
    // 上线
    async upToDate() {
      // 校验表单链接是否为url地址
    var reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/

      if(this.online_link.trim()==""){
        this.$message.error("请填写链接地址！")
        return false
      }
      if(!reg.test(this.online_link)){
        this.$message.error("请填写正确的链接地址！")
        return false
      }
      const { data: res } = await this.$http.get(
        `/demandMobileAction/onlineChannelDemand?demand_id=${this.id}&online_link=${this.online_link}`
      );
      console.log(res.data);
      if (res.netCode == 200) {
        this.$message.success(res.subMessage);
        this.getDemandById()
      } else {
        this.$message.error("操作失败，请稍后重试！");
      }
      this.dialogVisible = false
    },
  },
};
</script>

<style lang="less" scoped>
</style>