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
        <div class="reject" v-if="detailsBox.manuscript_state == 4">
          <span>驳回理由：</span>
          <p>{{ detailsBox.audit_opinion }}</p>
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
          <div style="width: 60%" class="pad"></div>
          <div
            class="status1 btns hover"
            v-if="detailsBox.demand_state == 1"
            @click="dispatch(1)"
          >
            分派承接方
          </div>
          <div
            class="status1 btns hover"
            v-else-if="detailsBox.demand_state == 5"
            @click="dispatch(2)"
          >
            分派渠道方
          </div>
          <div
            class="status1 btns hover"
            v-else-if="detailsBox.demand_state == 6"
            @click="endDemand"
          >确认完成</div>
          <div
            class="btns hover"
            v-if="detailsBox.manuscript_state == 1 && detailsBox.demand_state == 4"
            @click="examine">
            立即审核
          </div>

          <!-- <div class="status3 hover" v-else-if="detailsBox.demand_state == 3">
            提醒交稿
          </div> -->
          <!-- <div class="status3 hover" v-else-if="detailsBox.demand_state == 4">
            提醒确认
          </div> -->
        </div>
      </div>
    </div>
    <el-dialog title="分派" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="价格等级" v-if="detailsBox.demand_state == 1">
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
        <el-form-item label="上线平台：" v-if="detailsBox.demand_state == 5">
          <el-radio
            v-model="form.radio"
            v-for="(item, i) in channelList"
            :key="i"
            :label="item.id"
            @change="changeBox"
            >{{ item.name }}</el-radio
          >
        </el-form-item>
        <el-form-item label="选择承接方" v-if="detailsBox.demand_state == 1">
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
        <el-form-item
          label="选择渠道方"
          v-else-if="detailsBox.demand_state == 5"
        >
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="稿件审核"
      :visible.sync="examineDialogVisible"
      width="50%"
    >
      <div style="margin-bottom: 15px; font-weight: bold">
        稿件能否通过审核？
      </div>
      <el-radio v-model="manuscript_state" label="2" @change="choose()"
        >同意</el-radio
      >
      <el-radio v-model="manuscript_state" label="4" @change="choose()"
        >不同意</el-radio
      >
      <div style="margin: 15px 0; font-weight: bold" v-if="optionsBox">
        请将整改意见填至下方
      </div>
      <el-input
        type="textarea"
        style="width: 70%"
        v-if="optionsBox"
        v-model="audit_opinion"
        placeholder="请输入..."
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="examineDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
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
      <div class="subtitle" v-if="detailsBox.online_link">上线地址:</div>
      <div class="links hover" v-if="detailsBox.online_link">
        <a :href="detailsBox.online_link" download="" target="blank">
          <span>{{ detailsBox.online_link }}</span>
        </a>
        <span style="color: grey; font-size: 12px"
          >复制链接可在其他窗口打开</span
        >
      </div>
    </div>
  </div>
</template>
<script>
const DEMAND_STATE = {
  1: "待分配",
  2: "待接单",
  3: "待交稿",
  4: "待审核",
  5: "待上线",
  6: "已上线",
  7: "已完成",
};
export default {
  data() {
    return {
      id: "",
      detailsBox: [],
      downLoads: "",
      fullUrl: "",
      demand_type: "",
      progress: [],
      checkList: [],
      checked: false,
      form: {
        name: "",
        radio: "",
        demands: [],
        price: "",
      },
      optionsBox: false,
      dialogFormVisible: false,
      examineDialogVisible: false,
      manuscript_state: "2",
      audit_opinion: "",
      difID: null,
      channelList: [],
      scripts: "",
      Scriptlinks: "",
      annexList: [],
    };
  },
  computed: {
    // 直接当做普通属性调用不加括号
    // 任何data中数据变化立即重新计算
    // 计算属性会缓存
    details_demand_state() {
      return DEMAND_STATE[this.detailsBox.demand_state];
    },
  },
  created() {
    this.id = this.$route.query.id;
    this.getDemandById();
    this.getType2();
  },
  methods: {
    // 获取需求详情
    getDemandById() {
      const that = this;
      that.$http
        .get(`/demandMobileAction/getDemandById?demand_id=${that.id}`)
        .then((res) => {
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
            that.demand_type = templist.demand_type;
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
    // 分派给承接需求 /priceGradeMobileAction/getPriceGradeList
    dispatch(num) {
      this.difID = num;
      const that = this;
      var code = sessionStorage.getItem("userName");
      that.dialogFormVisible = true;
      let httpurl;
      //num=1承接方 num=2是渠道方
      if (num == 1) {
        httpurl = `/priceGradeMobileAction/getPriceGradeList?type_id=${that.demand_type}&price_grade=${this.form.radio}&user_code=`;
      } else {
        httpurl = `/channelMobileAction/getChannelUserList?channel_id=${this.form.radio}`;
      }
      that.$http.get(httpurl).then(
        (res) => {
          if (res.data.data) {
            this.checkList = res.data.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    choose() {
      if (this.manuscript_state == 4) {
        this.optionsBox = true;
      } else {
        this.optionsBox = false;
      }
    },
    changeBox() {
      (this.form.demands = []), this.dispatch(2);
    },
    changeRadio() {
      (this.form.demands = []), this.dispatch(1);
    },
    // 确认提交
    confirm() {
      const that = this;
      if (!this.form.demands.length) {
        if (this.detailsBox.demand_state == 1) {
          this.$message.error("请选择承接方！");
          return false;
        }
        if (this.detailsBox.demand_state == 5) {
          this.$message.error("请选择渠道方！");
          return false;
        }
      }
      if (this.form.price.trim() == "") {
        this.$message.error("请填写价格！");
        return false;
      }
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      var url;
      if (this.detailsBox.demand_state == 1) {
        url = `/messageMobileAction/addMessage?demand_id=${that.id}&demand_money=${that.form.price}&receive_by=${that.form.demands}`;
      } else {
        url = `/messageMobileAction/addChannelMessage?demand_id=${that.id}&channel_money=${that.form.price}&channel_by=${that.form.demands}`;
      }
      this.$http.get(url).then(
        (res) => {
          if ((res.data.netCode = 200)) {
            loading.close();
            this.$message.success("操作成功！");
            this.dialogFormVisible = false;
            this.$router.go(-1);
          }
        },
        (err) => {
          this.$message.success("服务异常！");
          loading.close();
          this.dialogFormVisible = false;
        }
      );
    },
    // 确认结束
    endDemand() {
      this.$confirm(
        `"${this.detailsBox.demand_name}"需求已完成上线了吗？`,
        "提示",
        {
          confirmButtonText: "是的",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$http
            .get(`/demandMobileAction/endDemand?demand_id=${this.id}`)
            .then((res) => {
              if (res.data.netCode == 200) {
                this.$message.success("操作成功！");
                this.getDemandById()
              } else {
                this.$message.error(res.data.subMessage);
              }
            });
        })
        .catch(() => {});
    },
    // 获取渠道
    getType2() {
      this.$http.get(`/channelMobileAction/getChannelList`).then((res) => {
        var tempList = res.data.data;
        var arr = [];
        if (tempList.length) {
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
    // 审核稿件
    examine() {
      this.examineDialogVisible = true;
    },
    // 审核中
    submit() {
      if (this.manuscript_state == 4 && this.audit_opinion.trim() == "") {
        this.$message.error("请填写理由！");
        return false;
      }
      this.$http
        .get(
          `/demandMobileAction/examineDemand?audit_opinion=${this.audit_opinion}&manuscript_state=${this.manuscript_state}&demand_id=${this.id}`
        )
        .then((res) => {
          if (res.data.netCode == 200) {
            this.$message.success("操作成功！");
            this.examineDialogVisible = false;
            this.getDemandById();
          } else {
            this.$message.error("操作失败,请稍后重试");
            this.examineDialogVisible = false;
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.inforBox {
  padding-left: 32px;
  padding-bottom: 32px;
  h6 {
    color: #222222;
    font-size: 16px;
    font-weight: bold;
  }
  .el-row {
    margin: 20px 0;
  }
  .ttname {
    display: inline-block;
    width: 30%;
    color: #949494;
    font-size: 14px;
    font-weight: 400;
  }
  .value {
    font-size: 14px;
    font-weight: 500;
    color: #222222;
  }
}
</style>