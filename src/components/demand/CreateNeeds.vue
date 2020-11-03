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

      <div class="title-name">意向发布渠道</div>
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
      <el-form-item>
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
      <!-- <el-upload
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
        <div class="title-name addFiles">
          <i class="iconfont icon-fujian"></i>
          <span>添加附件</span>
        </div>
        <div slot="tip" class="el-upload__tip">
          只能上传以.mp4/.png/.jpg/.doc/.docx/.ppt/.txt为后缀的文件
        </div>
      </el-upload> -->
      <!-- <uploader
        :options="options"
        @file-added="onFileAdded"
        :autoStart="false"
        class="uploader-example"
        :file-status-text="statusText"
      >
        <uploader-unsupport></uploader-unsupport>
        <uploader-btn id="global-uploader-btn" :attrs="attrs" ref="uploadBtn"
          >选择文件</uploader-btn
        >
        <uploader-list></uploader-list>
      </uploader> -->

      <uploader
        :options="options"
        :file-status-text="statusText"
        class="uploader-example"
        ref="uploader"
        @file-complete="fileComplete"
        @complete="complete"
        :autoStart="false"
        @file-added="onFileAdded"
      >
        <uploader-unsupport></uploader-unsupport>
        <uploader-btn id="global-uploader-btn" :attrs="attrs" ref="uploadBtn"
          >选择文件</uploader-btn
        >
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
      options: {
        target: "/api/demandMobileAction/addDemandVideo",
        testChunks: true,
        testMethod: 'POST',
        chunkSize: 5 * 1024 * 1024,
        singleFile: true,
        query: {
          files: "",
          chunks: "",
          chunk: "",
          md5: "",
          name: ""
        },
        processParams(params) {
          return {
            chunk: params.totalChunks,
            name: params.filename
          };
        }
      },
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now();
        }
      },
      attrs: {
        accept: [
          "image/png",
          "image/jpg",
          "application/*",
          "text/plain",
          "audio/mp3",
          "video/mp4"
        ]
      },
      statusText: {
        success: "成功了",
        error: "出错了",
        uploading: "上传中",
        paused: "暂停中",
        waiting: "等待中"
      },
      form: {
        demand_name: "",
        end_date: "",
        time: "",
        demand_type: "",
        release_platform_id: "",
        demand_content: "",
        created_by: sessionStorage.getItem("departmentCode"),
        demand_annex: "",
        annex_name: ""
      },
      fileList: [],
      fileData: {
        files: this.fileList
      },
      type: [],
      type1: [],
      rules: {
        demand_name: [
          { required: true, message: "请输入需求标题", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "标题长度在2到20个字符之间",
            trigger: "blur"
          }
        ],
        demand_content: [
          { required: true, message: "请补充需求内容", trigger: "blur" }
        ],
        demand_type: [
          { required: true, message: "请选择需求类型", trigger: "change" }
        ],
        release_platform_id: [
          { required: true, message: "请选择意向发布平台", trigger: "change" }
        ],
        end_date: [
          {
            type: "date",
            required: true,
            message: "请选择交稿日期",
            trigger: "change"
          }
        ],
        time: [
          {
            type: "date",
            required: true,
            message: "请选择交稿具体时间",
            trigger: "change"
          }
        ]
      },
      progressFlag: false,
      loadProgress: 0,
      maxlength: 20,
      WorkPlace: [],
      fileLoding: false
    };
  },
  created() {
    this.getType1();
    this.getType2();
  },
  mounted() {},
  methods: {
    // 提交需求
    submitForm() {
      this.$refs.formRules.validate(valid => {
        if (valid) {
          var ary = {
            demand_name: this.form.demand_name,
            end_date: this.utils.formatDate11(this.form.end_date),
            demand_type: this.form.demand_type,
            release_platform_id: this.form.release_platform_id,
            demand_content: this.form.demand_content,
            created_by: this.form.created_by,
            demand_annex: this.form.demand_annex ? this.form.demand_annex : "",
            annex_name: this.form.annex_name
          };
          this.$http
            .post(`/demandMobileAction/submitComment`, ary)
            .then(res => {
              if (res.data) {
                this.$message.success("提交成功！");
                this.$router.push("/demand/needs");
              } else {
                this.$message.error("提交失败！请稍后重试！");
              }
            });
        } else {
        }
      });
    },
    //获取需求类型
    getType1() {
      this.$http.get(`/typeMobileAction/getTypeList`).then(res => {
        if (res.data.data.length) {
          this.type = res.data.data;
        } else {
          this.type = [];
        }
      });
    },
    // 获取平台
    getType2() {
      this.$http.get(`/channelMobileAction/getChannelList`).then(res => {
        if (res.data.data.length) {
          this.type1 = res.data.data;
        } else {
          this.type1 = [];
        }
      });
    },
    UploadFiles(files) {
      this.fileList.push({
        name: files.file.name
      });
      var fileList = [];
      fileList.push(files);
      const formData = new FormData();
      fileList.forEach(file => {
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
      this.$http.post(uploadUrl, formData).then(res => {
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
        } else {
          this.$message.error("附件上传失败，请稍后重试！");
        }
        this.fileLoding = false;
      });
    },
    // 文件上传之前
    beforeUpload(file) {
      let fileName = file.name;
      var TypeOF = fileName
        .substring(fileName.lastIndexOf(".") + 1)
        .toLowerCase();
      if (TypeOF == "png" || TypeOF == "jpg" || TypeOF == "mp4") {
        return new Promise((resolve, reject) => {
          this.changeUrl();
          resolve();
        });
      }
    },
    changeUrl() {
      this.$nextTick(() => {
        this.actionUrl = "admin/demandMobileAction/addDemandImg";
      });
    },
    // 文件上传进度
    uploadFilesProcess(event, file, fileList) {
      this.progressFlag = true;
      setTimeout(() => {
        this.$refs["upload"].submit();
      }, 1000);
      this.loadProgress = parseInt(event.percent);
      const formData = new FormData();
      formData.append("files", file.raw);
      let fileName = file.name;
      var TypeOF = fileName
        .substring(fileName.lastIndexOf(".") + 1)
        .toLowerCase();
      if (this.loadProgress >= 100) {
        this.loadProgress = 100;
        setTimeout(() => {
          this.progressFlag = false;
        }, 1000); // 一秒后关闭进度条
      }
    },

    //--------------------------分割线------------------------------------------

    // 文件被添加时 还未进行上传操作
    onFileAdded(file) {
      this.computedMd5(file);
    },
    // md5转码 计算md5，实现断点续传及秒传
    computedMd5(file) {
      // debugger
      const that = this;
      let fileReaderText = new FileReader();
      let time = new Date().getTime();
      let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
      let currentChunk = 0;
      const chunkSize = 5 * 1024 * 1024;
      let chunks = Math.ceil(file.size / chunkSize);
      let spark = new SparkMD5.ArrayBuffer();
      // 通过 file.pause()暂停文件，然后通过H5的FileReader接口读取文件
      file.pause();
      loadNext();
      console.log(fileReaderText)
      fileReaderText.onload = function(event) {
        console.log(event)
         spark.append(event.target.result);
          if (currentChunk < chunks){
            currentChunk++;
            loadNext();
            console.log('校验MD5 '+ ((currentChunk/chunks)*100).toFixed(0)+'%')
          }else{
             let md5 = spark.end();
            that.computeMD5Success(md5, file);
            console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
          }
      }
      fileReaderText.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        file.cancel();
    };

    // fileReaderText.onload = function(event) {
    //     console.log(event)
    //      spark.append(event.target.result);
    //       if (currentChunk < chunks){
    //         currentChunk++;
    //         loadNext();
    //         console.log('校验MD5 '+ ((currentChunk/chunks)*100).toFixed(0)+'%')
    //       }else{
    //          let md5 = spark.end();
    //         this.computeMD5Success(md5, file);
    //         console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
    //       }
    //   }
      function loadNext() {
        // debugger
        let start = currentChunk * chunkSize;
        let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReaderText.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      }
    },
    computeMD5Success(md5, file) {
    // 将自定义参数直接加载uploader实例的opts上
     this.options.query.files = file.file;
      // this.options.query.chunks = chunks;
      this.options.query.md5 = md5;
    file.uniqueIdentifier = md5;
    file.resume();
    // this.statusRemove(file.id);
},


    complete() {
      console.log("complete", arguments);
    },
    // 一个根文件（文件夹）成功上传完成。
    fileComplete() {
      console.log("file complete", arguments);
      const file = arguments[0].file;
      this.$http
        .post("/demandMobileAction/addDemandVideo")
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
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
