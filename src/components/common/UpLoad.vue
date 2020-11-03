<template>
  <div id="paperBox">
    <div class="headBox flex-box">
      <div>新建需求</div>
      <div>×</div>
    </div>
    <el-form :model="form" :rules="rules" ref="formRules" label-width="80px">
      <div class="ipt-needName">
        <el-form-item prop="demand_name">
          <el-input
            v-model="form.demand_name"
            placeholder="请输入需求标题"
            id="titleName"
            placeholder-class="plc-tn"
          ></el-input>
        </el-form-item>
        <!-- <div class="wordTip">{{ maxlength }}</div> -->
      </div>
      <div class="title-name">需求补充说明</div>
      <el-form-item prop="demand_content">
        <el-input
          type="textarea"
          id="needs-textarea"
          v-model="form.demand_content"
          placeholder="需求的详细说明填写在这儿呢~"
        ></el-input>
      </el-form-item>

      <div class="title-name">需求类型</div>
      <el-form-item prop="demand_type">
        <el-select v-model="form.demand_type" placeholder="请选择需求类型">
          <el-option
            v-for="(item, index) in type"
            :key="index"
            :label="item.type_name"
            :value="item.type_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <div class="title-name">意向发布平台</div>
      <el-form-item prop="release_platform_id">
        <el-select v-model="form.release_platform_id" placeholder="请选择">
          <el-option
            v-for="(item, index) in type1"
            :key="index"
            :label="item.channel_name"
            :value="item.channel_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <div class="title-name">交稿截止时间</div>
      <el-form-item required>
        <el-col>
          <el-form-item prop="end_date">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.end_date"
              format="yyyy-MM-dd"
              value-format="timestamp"
              style="width: 100%"
              :picker-options="expireTimeOption"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="2">
          <div class="pad"></div>
        </el-col> -->
        <!-- <el-col :span="11">
          <el-form-item prop="time">
            <el-time-picker
              placeholder="选择时间"
              v-model="form.time"
              style="width: 100%"
            ></el-time-picker>
          </el-form-item>
        </el-col> -->
      </el-form-item>
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
      >
        <div class="title-name addFiles">
          <i class="iconfont icon-fujian"></i>
          <span>添加附件</span>
        </div>
        <div slot="tip" class="el-upload__tip">
          只能上传以.mp4/.png/.jpg/.doc/.ppt/.txt为后缀的文件
        </div>
      </el-upload>

      <uploader
        :options="options"
        @file-added="onFileAdded"
        :autoStart="false"
        class="uploader-example"
      >
        <uploader-unsupport></uploader-unsupport>
        <uploader-btn id="global-uploader-btn" :attrs="attrs" ref="uploadBtn"
          >选择文件</uploader-btn
        >
        <!-- <uploader-drop> -->
        <!-- <p>Drop files here to upload or</p> -->
        <!-- <uploader-btn @click="onUploadChange">select files</uploader-btn> -->
        <!-- <uploader-btn :attrs="attrs">select images</uploader-btn> -->
        <!-- <uploader-btn :directory="true">select folder</uploader-btn> -->
        <!-- </uploader-drop> -->
        <uploader-list></uploader-list>
      </uploader>
      <div class="btns submit" @click="submitForm('formRules')">发布</div>
    </el-form>
  </div>
</template>
<script>
// https://www.cnblogs.com/xiahj/p/vue-simple-uploader.html
// https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md
import SparkMD5 from "spark-md5";
export default {
  data() {
    return {
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now();
        },
      },
      options: {
        target: "/admin/demandMobileAction/addDemandVideo",
        testChunks: false,
        chunkSize: 5 * 1024 * 1024,
        singleFile: true,
        query: {
          files: "",
          chunks: "",
          chunk: "",
          md5: "",
          name: "",
        },
        processParams(params) {
          return {
            chunk: params.totalChunks,
            name: params.filename,
          };
        },
      },
      attrs: {
        accept: [
          "image/png",
          "image/jpg",
          "application/*",
          "text/plain",
          "audio/mp3",
          "video/mp4",
        ],
      },
      form: {
        demand_name: "",
        end_date: "",
        time: "",
        demand_type: "",
        release_platform_id: "",
        demand_content: "",
        created_by: sessionStorage.getItem("userName"),
        demand_annex: "",
      },
      fileList: [],
      fileData: {
        files: this.fileList,
      },
      actionURL: "/adminc",
      type: [],
      type1: [],
      rules: {
        demand_name: [
          { required: true, message: "请输入需求标题", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "标题长度在2到20个字符之间",
            trigger: "blur",
          },
        ],
        demand_content: [
          { required: true, message: "请补充需求内容", trigger: "blur" },
        ],
        demand_type: [
          { required: true, message: "请选择需求类型", trigger: "change" },
        ],
        release_platform_id: [
          { required: true, message: "请选择意向发布平台", trigger: "change" },
        ],
        end_date: [
          {
            type: "date",
            required: true,
            message: "请选择交稿日期",
            trigger: "change",
          },
        ],
        time: [
          {
            type: "date",
            required: true,
            message: "请选择交稿具体时间",
            trigger: "change",
          },
        ],
      },
      maxlength: 20,
    };
  },
  created() {
    this.getType1();
    this.getType2();
  },
  methods: {
    // 提交需求
    submitForm() {
      this.$refs.formRules.validate((valid) => {
        if (valid) {
          var ary = {
            demand_name: this.form.demand_name,
            end_date: this.utils.formatDate11(this.form.end_date),
            demand_type: this.form.demand_type,
            release_platform_id: this.form.release_platform_id,
            demand_content: this.form.demand_content,
            created_by: this.form.created_by,
            demand_annex: this.form.demand_annex ? this.form.demand_annex : "",
          };
          this.$http
            .post(`/demandMobileAction/submitComment`, ary)
            .then((res) => {
              if (res.data) {
                this.$message.success("提交成功！");
                this.$router.push("/demand/needs");
              } else {
                this.$message.error("提交失败！请稍后重试！");
              }
            });
        } else {
          console.log("false");
        }
      });
    },
    //获取需求类型
    getType1() {
      this.$http.get(`/typeMobileAction/getTypeList`).then((res) => {
        if (res.data.data.length) {
          this.type = res.data.data;
        } else {
          this.type = [];
        }
      });
    },
    // 获取平台
    getType2() {
      this.$http.get(`/channelMobileAction/getChannelList`).then((res) => {
        if (res.data.data.length) {
          this.type1 = res.data.data;
        } else {
          this.type1 = [];
        }
      });
    },
    onFileAdded(file) {
      if (file.fileType == "video/mp4") {
        // this.options.target = "/demandMobileAction/addDemandVideo";
        this.computedMd5(file);
      }
    },
    // MD5转码
    computedMd5(file) {
      // debugger
      let fileReader = new FileReader();
      let time = new Date().getTime();
      let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
      let currentChunk = 0;
      const chunkSize = 5 * 1024 * 1024;
      let chunks = Math.ceil(file.size / chunkSize);
      let spark = new SparkMD5.ArrayBuffer();
      file.pause();
      loadNext();
      fileReader.onload = (e) => {
        spark.append(e.target.result);
        if (currentChunk < chunks) {
          currentChunk++;
          loadNext();
          // 实时展示MD5的计算进度
          this.$nextTick(() => {
            $(`.myStatus_${file.id}`).text(
              "校验MD5 " + ((currentChunk / chunks) * 100).toFixed(0) + "%"
            );
          });
        } else {
          let md5 = spark.end();
          this.computeMD5Success(md5, file, chunks);
          console.log(
            `MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${
              file.size
            } 用时：${new Date().getTime() - time} ms`
          );
        }
      };
      function loadNext() {
        let start = currentChunk * chunkSize;
        let end =
          start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      }
    },
    computeMD5Success(md5, file1, chunks) {
      this.options.target = "/admin/demandMobileAction/addDemandVideo"
      console.log(file1.chunks);
      console.log(chunks);
      console.log(md5);
      console.log(this.options.query);
      this.options.query.files = file1.file;
      // this.options.query.chunks = JSON.stringify(file1.chunks);
      this.options.query.chunks = chunks;
      this.options.query.md5 = md5;
      //  const formData = new FormData();
      //  formData.append("files", file.file);
      //  formData.append("chunks",JSON.stringify(file.chunks));
      //  formData.append("chunk",chunks);
      //  formData.append("md5",md5);
      //  formData.append("name",file.name)
      // this.$http
      //   .post(
      //     `/demandMobileAction/addDemandVideo`,
      //     formData
      //   )
      //   .then((res) => {
      //     console.log(res);
      //   });
      // 将自定义参数直接加载uploader实例的opts上
      // Object.assign(this.options, {
      //   query: {
      //     ...this.params,
      //   },
      // });
      file1.uniqueIdentifier = md5;
      file1.resume();

      // this.statusRemove(file.id);
    },
    UploadFiles(files) {
      console.log(files);
      const formData = new FormData();
      // let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      formData.append("files", files.file);
      if (files.file.type == "video/mp4") {
        this.$http.post(`/demandMobileAction/addDemandVideo`, {});
      } else {
        this.$http
          .post(`/demandMobileAction/addDemandImg`, formData)
          .then((res) => {
            if ((res.netCode = 200)) {
              this.$message.success("文件上传成功！");
              this.form.demand_annex = res.data.data;
            } else {
              this.$message.error("文件上传失败，请稍后重试！");
            }
          });
      }
    },
  },
};
</script>
<style lang="less" scoped>
#paperBox {
  width: 800px;
  background-color: #fff;
  margin: 0 auto;
  margin-top: 30px;
  padding: 30px 77px;
  margin-bottom: 40px;
  .headBox {
    border-bottom: 1px dashed #ccc;
    padding-bottom: 25px;
    margin-bottom: 20px;
    :first-child {
      color: #222;
      font-size: 24px;
      font-weight: bold;
    }
    :last-child {
      color: #222;
      font-size: 26px;
    }
  }
}
.ipt-needName {
  position: relative;
  .wordTip {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 12px;
    color: #2c6ef5;
  }
}

#needs-textarea {
  height: 160px;
}
.el-select {
  width: 100% !important;
}
.pad {
  width: 30px;
  height: 30px;
}
.addFiles {
  color: #2c6ef5;
}
.submit {
  width: 320px;
  height: 56px;
  border-radius: 2px;
  line-height: 56px;
  margin: 0 auto;
  margin-top: 20px;
}
</style>