<template>
  <div class="messageBox">
    <h5>消息中心</h5>
    <div v-loading="loading" class="msgContainer">
      <div v-if="messageList.length">
        <div
          class="messages-item"
          v-for="(item, index) in messageList"
          :key="index"
          @click="toDetails(item.demand_id)"
        >
          <div class="msgBg">
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              alt=""
            />
          </div>
          <div class="right">
            <div class="top">
              <span>系统消息</span>
              <span>{{ item.created_date }}</span>
            </div>
            <p class="tips" :class="item.is_read == 1 ? 'read' : 'unread'">
              {{ item.message_title }}
            </p>
          </div>
        </div>
      </div>
      <div class="nodata" v-else>
        <span>暂无消息哦</span>
      </div>
    </div>
  </div>
</template>
<script>
const DETAILSBOXCONTENT = {
  1: "视频稿件",
  2: "图片稿件",
  3: "PPT稿件",
  4: "文档稿件",
};
export default {
  data() {
    return {
      messageList: [],
      detailsBox: [],
      fullUrl: "",
      demand_id: "",
      loading:false
    };
  },
  computed: {
    // 直接当做普通属性调用不加括号
    // 任何data中数据变化立即重新计算
    // 计算属性会缓存
    detailsBoxContent() {
      return DETAILSBOXCONTENT[this.detailsBox.demand_type];
    },
  },
  created() {
    this.loading=true;
    this.fetchMyMsg();
  },
  methods: {
    fetchMyMsg() {
      var token = sessionStorage.getItem("userName");
      if (sessionStorage.getItem("statusCode") == 2) {
        token = sessionStorage.getItem("departmentCode");
      }
      this.$http
        .get(`/messageMobileAction/getMessageList?user_code=${token}`)
        .then((res) => {
          if (res.data.data) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].created_date = res.data.data[
                i
              ].created_date.substr(0, 16);
            }
            this.messageList = res.data.data;
          } else {
            this.messageList = [];
          }
        });
        this.loading = false
    },
    toDetails(id) {
      this.demand_id = id;
      let statusCode = sessionStorage.getItem("statusCode");
      if (statusCode == 2) {
        this.$router.push({
          path: "/demand/needsdetail",
          query: {
            id: id,
          },
        });
      } else if (statusCode == 3) {
        this.$router.push({
          path: "/contractor/needsdetail",
          query: {
            id: id,
          },
        });
      } else if (statusCode == 4) {
        this.$router.push({
          path: "/canal/needsdetails",
          query: {
            id: id,
          },
        });
      } else {
        return false;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.messageBox {
  margin: 30px;
  padding: 30px;
  height: 92%;
  background: #fff;
  h5 {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
  }
  .msgContainer{
    height: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar{
      display: none;
    }
  }
  .messages-item {
    height: 100px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    flex-direction: row;
    align-items: center;
    .msgBg {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #d5e9ff;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      .top {
        :first-child {
          color: #222222;
          font-size: 14px;
          font-weight: 400;
        }
        :last-child {
          display: inline-block;
          margin-left: 18px;
          color: #949494;
          font-size: 14px;
          font-weight: 400;
        }
      }
      p {
        font-size: 16px;
        font-weight: 400;
      }
      .unread {
        color: #2c6ef5;
      }
      .read {
        color: #949aa6;
      }
    }
  }
  .drawerBox {
    height: 100vh;
    box-sizing: border-box;
    width: 100vw;
    margin: 0 !important;
    .rightBox {
      padding-left: 30px !important;
    }
  }
}
.nodata {
  text-align: center;
}
</style>