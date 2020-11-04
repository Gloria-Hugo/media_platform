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
        <div class="reject" v-if="detailsBox.is_perfect==0">
          <span>需求不完善：</span>
          <p>{{ detailsBox.annex_explain==0 }}</p>
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
          <!-- <div class="contact hover">联系管理员</div> -->
          <div
            class="status2 hover"
            v-if="detailsBox.demand_state == 1||detailsBox.is_perfect==0"
            @click="uploadDialogVisible = true"
          >
            更新附件
          </div>
          <div
            class="btns hover"
            v-if="
              detailsBox.manuscript_state == 2 && detailsBox.demand_state == 4
            "
            @click="examine()"
          >
            审核需求
          </div>
        </div>
      </div>
    </div>
    <!-- 需求附件更新 -->
    <el-dialog title="更新附件" :visible.sync="uploadDialogVisible" width="50%">
      <el-upload
        class="upload-demo"
        multiple
        :headers="{ 'Content-Type': 'multipart/form-data;charset=UTF-8' }"
        :limit="3"
        action="string"
        :http-request="UploadFiles"
        accept=".mp4,.png,.jpg,.doc,docx,.ppt,.txt"
        :file-list="fileList"
        :data="fileData"
        ref="upload"
        v-loading="fileLoding"
      >
        <div class="title-name addFiles" style="color: #2c6ef5">
          <i class="iconfont icon-fujian"></i>
          <span>上传</span>
        </div>
        <div slot="tip" class="el-upload__tip">
          只能上传以.mp4/.png/.jpg/.doc/.docx/.ppt/.txt为后缀的文件
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer" v-if="showFoot">
        <el-button @click="uploadDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeFile">确定修改</el-button>
      </span>
    </el-dialog>
    <!-- 稿件审核 -->
    <el-dialog
      title="稿件审核"
      :visible.sync="examineDialogVisible"
      width="50%"
    >
      <div style="margin-bottom: 15px; font-weight: bold">
        稿件能否通过审核？
      </div>
      <el-radio v-model="manuscript_state" label="3" @change="choose()"
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
      progress: [],
      optionsBox: false,
      examineDialogVisible: false,
      manuscript_state: "3",
      audit_opinion: "",
      uploadDialogVisible: false,
      fileList: [],
      fileData: {
        files: this.fileList,
      },
      fileLoding: false,
      form: {
        demand_annex: "",
        demand_id: "",
        annex_name: "",
      },
      showFoot: false,
      annexList: [],
      Scriptlinks: "", // 稿件地址
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
    this.form.demand_id = this.$route.query.id;
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
    choose() {
      if (this.manuscript_state == 4) {
        this.optionsBox = true;
      } else {
        this.optionsBox = false;
      }
    },

    // 审核稿件
    examine() {
      this.examineDialogVisible = true;
    },
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
    UploadFiles(files) {
      this.fileList.push({
        name: files.file.name,
      });
      var fileList = [];
      fileList.push(files);
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("files", file.file);
      });
      let fileName = files.file.name;
      var TypeOF = fileName
        .substring(fileName.lastIndexOf(".") + 1)
        .toLowerCase();
      var uploadUrl;
      if (TypeOF == "png" || TypeOF == "jpg" || TypeOF == "mp4") {
        uploadUrl = "/demandMobileAction/addDemandImg";
      } else {
        uploadUrl = "/demandMobileAction/addDemandDoc";
      }
      this.fileLoding = true;
      this.$http.post(uploadUrl, formData).then((res) => {
        if ((res.netCode = 200)) {
          this.$message.success("附件上传成功！");
          // 拼接文件地址
          if (this.form.demand_annex == "") {
            this.form.demand_annex = res.data.data;
          } else {
            this.form.demand_annex += `,` + res.data.data;
          }
          // 拼接文件名称
          if (this.form.annex_name == "") {
            this.form.annex_name = res.data.subMessage;
          } else {
            this.form.annex_name += `,` + res.data.subMessage;
          }
          this.showFoot = true;
        } else {
          this.$message.error("附件上传失败，请稍后重试！");
        }
        this.fileLoding = false;
      });
    },
    changeFile() {
      this.$http
        .post(`/demandMobileAction/submitComment`, this.form)
        .then((res) => {
          if (res.data) {
            this.$message.success("附件修改成功！");
            this.getDemandById();
          } else {
            this.$message.error("附件修改失败，请稍后重试！");
          }
          this.uploadDialogVisible = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>