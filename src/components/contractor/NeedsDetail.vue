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
          <div class="status">{{ manuscript_demand_state }}</div>
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
          <div class="profits">预计收益：￥{{ detailsBox.demand_money }}</div>
          <div class="status3 hover" @click="problemDialogVisible = true" v-if="detailsBox.is_perfect==1">帮助</div>
          <div
            class="btns hover"
            v-if="detailsBox.demand_state == 2"
            @click="takeThis"
          >
            立即接单
          </div>
          <div
            class="btns hover"
            v-if="
              detailsBox.demand_state == 3 && detailsBox.manuscript_state == 0
            "
            @click="addFiles"
          >
            上传稿件
          </div>
          <div
            class="status2 hover"
            v-else-if="
              detailsBox.demand_state == 3 && detailsBox.manuscript_state == 4
            "
            @click="addFiles"
          >
            重新上传
          </div>
        </div>
      </div>
    </div>
    <!-- 上传稿件的弹窗 -->
    <el-dialog title="上传稿件" :visible.sync="dialogVisible" width="50%">
      <!-- <span class="tip">注意：请上传一个{{ detailsBox.type_name }}</span> -->
      <el-upload
        class="upload-demo"
        action="string"
        :multiple="false"
        :headers="{ 'Content-Type': 'multipart/form-data;charset=UTF-8' }"
        :limit="1"
        :http-request="UploadFiles"
        accept=".mp4,.png,.jpg,.doc,.ppt,.txt,.mp3"
        :file-list="fileList"
        :data="fileData"
        v-loading="fileLoding"
      >
        <div class="title-name addFiles">
          <i class="iconfont icon-fujian"></i>
          <span>上传稿件</span>
        </div>
        <div slot="tip" class="el-upload__tip">
          只能上传以.mp4/.png/.jpg/.doc/.ppt/.txt为后缀的文件
        </div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="close">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 帮助的弹窗 -->
    <el-dialog title="提示"
               :visible.sync="problemDialogVisible"
               width="30%">
       <span>有问题?及时反馈在下方吧！</span>
       <el-input v-model="annex_explain" placeholder="请输入容" ></el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="problemDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="helpBtn">确 定</el-button>
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
// 稿件状态（0未审核，1待审核，2管理员审核通过，3需求方审核通过，4审核未通过，5已结算）

const MANUSCRIPT_STATE = {
  0: "未审核",
  1: "待审核",
  2: "管理员审核通过",
  3: "需求方审核通过",
  4: "审核未通过",
  5: "已结算",
};
export default {
  data() {
    return {
      id: "",
      detailsBox: [],
      downLoads: "",
      fullUrl: "",
      progress: [],
      dialogVisible: false,
      accept: "",
      fileList: [],
      fileData: {
        files: this.fileList,
      },
      fileLoding: false,
      Scriptlinks: "",
      annexList: [],
      problemDialogVisible:false,
      annex_explain:"", // 稿件问题描述
    };
  },
  computed: {
    // 直接当做普通属性调用不加括号
    // 任何data中数据变化立即重新计算
    // 计算属性会缓存
    manuscript_demand_state() {
      return MANUSCRIPT_STATE[this.detailsBox.manuscript_state];
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
    // 上传稿件
    addFiles() {
      this.dialogVisible = true;
    },
    UploadFiles(files) {
      //
      const formData = new FormData();
      formData.append("files", files.file);
      formData.append("demand_id", this.id);
      let fileName = files.file.name;
      var TypeOF = fileName
        .substring(fileName.lastIndexOf(".") + 1)
        .toLowerCase();
      var uploadUrl;
      if (TypeOF == "png" || TypeOF == "jpg" || TypeOF == "mp4") {
        uploadUrl = "/manuscriptMobileAction/addManuscriptImg";
      } else {
        uploadUrl = "/manuscriptMobileAction/addManuscriptDoc";
      }
      this.$http.post(uploadUrl, formData).then((res) => {
        if ((res.data.netCode = 200)) {
          this.$message.success("稿件上传成功！");
          this.form.demand_annex = res.data.data;
        } else {
          this.$message.error("稿件上传失败，请稍后重试！");
        }
        this.fileLoding = false;
      });
    },
    close() {
      this.dialogVisible = false;
      this.getDemandById();
    },
    // 素材缺失的问题
    helpBtn() {
      if(this.annex_explain.trim()==""){
        this.$message.error("请输入问题！")
        return false
      }
      this.$http.get(`/demandMobileAction/isPerfectDemand?demand_id=${this.id}&annex_explain=${this.annex_explain}`).then(res=>{
        if(res.data.netCode==200){
          this.$message.success("反馈已提交！")
        }
        this.problemDialogVisible = false;
        this.getDemandById()
      })
    },
    // 立即接单
    async takeThis() {
      let token = sessionStorage.getItem("userName");
      const { data: res } = await this.$http.get(
        `/demandMobileAction/acceptDemand?demand_id=${this.id}&user_code=${token}`
      );
      if (res.netCode == 200) {
        this.$message.success(res.subMessage);
        this.$router.push("/contractor/mymanuscript");
      } else {
        this.$message.error("服务异常！");
        this.drawer = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>