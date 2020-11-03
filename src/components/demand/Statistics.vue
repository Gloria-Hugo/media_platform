<template>
  <div class="flex-box echarts-box">
    <div class="charts">
      <div class="top">
        <div class="title-name">需求类型统计</div>
        <div class="picker">
          <el-date-picker
            v-model="timeData.dateTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy - MM - dd "
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="changeFirstDate"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="total-monut">
        共
        <b>{{ firstTotalCount }}</b>
        条需求
      </div>
      <div id="firstChart" :style="{ width: '700px', height: '580px' }"></div>
    </div>
    <div class="charts">
      <div class="top">
        <div class="title-name">需求渠道统计</div>
        <div class="picker">
          <el-date-picker
            v-model="timeData1.dateTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy - MM - dd "
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="changeSecondDate"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="total-monut">
        共<b>{{ secondTotalCount }}</b
        >条需求
      </div>
      <div id="myChart" :style="{ width: '700px', height: '580px' }"></div>
      <div class="data-box"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      timeData: {
        dateTime: [],
        startTime: "",
        endTime: "",
      },
      timeData1: {
        dateTime: [],
        startTime: "",
        endTime: "",
      },
      xAxisData: [], // 这是第一个echart横轴的数据名称
      seriesData: [], // 这是第一个echart的数据量
      firstTotalCount: 0,

      xAxisData1: [], // 这是第二个echart横轴的数据名称
      seriesData1: [], // 这是第二个echart的数据量
      secondTotalCount: 0,
      dataList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    this.timeData.startTime = this.handleTimeNew(new Date());
    this.timeData.endTime = this.handleTimeOld(new Date());
    this.timeData.dateTime.push(this.timeData.endTime);
    this.timeData.dateTime.push(this.timeData.startTime);

    this.timeData1.startTime = this.handleTimeNew(new Date());
    this.timeData1.endTime = this.handleTimeOld(new Date());
    this.timeData1.dateTime.push(this.timeData1.endTime);
    this.timeData1.dateTime.push(this.timeData1.startTime);
  },
  mounted() {
    this.drawLine();
    this.getDemandTypeStatistics(
      this.timeData.dateTime[0],
      this.timeData.dateTime[1]
    );
    this.getDemandChannelStatistics(
      this.timeData1.dateTime[0],
      this.timeData1.dateTime[1]
    );
  },
  methods: {
    // 获取当前时间
    handleTimeNew() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    // 获取前一个月的时间
    handleTimeOld(time) {
      var date = new Date();
      var daysInMonth = new Array(
        [0],
        [31],
        [28],
        [31],
        [30],
        [31],
        [30],
        [31],
        [31],
        [30],
        [31],
        [30],
        [31]
      );

      var strYear = date.getFullYear();

      var strDay = date.getDate();

      var strMonth = date.getMonth() + 1;

      if (strYear % 4 == 0 && strYear % 100 != 0) {
        daysInMonth[2] = 29;
      }

      if (strMonth - 1 == 0) {
        strYear -= 1;

        strMonth = 12;
      } else {
        strMonth -= 1;
      }

      strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];

      if (strMonth < 10) {
        strMonth = "0" + strMonth;
      }

      if (strDay < 10) {
        strDay = "0" + strDay;
      }

      var datastr = strYear + "-" + strMonth + "-" + strDay;

      return datastr;
    },
    // 获取需求类型统计 pie-doughnut
    getDemandTypeStatistics(start, end) {
      var name = sessionStorage.getItem("departmentCode");
      this.$http
        .get(
          `/statisticsMobileAction/getDemandTypeStatistics?type=2&startTime=${start}&endTime=${end}&created_by=${name}`
        )
        .then(
          (res) => {
            if (res.data.netCode == 200) {
              var temp = res.data.data;
              var ary = [];
              var ary1 = [];
              var keyOne = "value";
              var keyTwo = "name";
              for (var i = 0; i < temp.length; i++) {
                var obj = {}
                 obj[keyOne] = temp[i].count
                obj[keyTwo] = temp[i].type_name
                // ary.push(temp[i].type_name);
                // ary1.push(temp[i].count);
                ary.push(obj)
                ary1.push( temp[i].type_name)
              }
              this.xAxisData = ary1;
              this.seriesData = ary;
              this.firstTotalCount = res.data.standbyParams.count;
              this.drawBar();
            } else {
            }
          },
          (err) => {
            console.log(err);
          }
        );
    },
    // 获取需求渠道统计
    getDemandChannelStatistics(start, end) {
      const that = this;
      var name = sessionStorage.getItem("departmentCode");
      this.$http
        .get(
          `/statisticsMobileAction/getDemandChannelStatistics?type=2&startTime=${start}&endTime=${end}&created_by=${name}`
        )
        .then((res) => {
          if (res.data.netCode == 200) {
            var temp = res.data.data;
            var ary = [];
            var ary1 = [];
            var keyOne = "value";
            var keyTwo = "name";
            var keyThree = "itemStyle";
            var colors = ["#AE80FA", "#FD9654", "#02D69A", "#22AAFF"];
            for (var i = 0; i < temp.length; i++) {
              var obj = {};
              obj[keyOne] = temp[i].count;
              obj[keyTwo] = temp[i].channel_name;
              obj[keyThree] = {
                normal: { color: colors[i] },
              };
              ary.push(obj);
              ary1.push(temp[i].channel_name);
            }
            this.dataList = ary;
            this.xAxisData1 = ary;
            this.secondTotalCount = res.data.standbyParams.count;
            this.drawLine();
          } else {
          }
        });
    },
    changeFirstDate() {
      this.getDemandTypeStatistics(
        this.timeData.dateTime[0],
        this.timeData.dateTime[1]
      );
    },
    changeSecondDate() {
      this.getDemandChannelStatistics(
        this.timeData1.dateTime[0],
        this.timeData1.dateTime[1]
      );
    },
    drawBar() {
      let firstChart = this.$echarts.init(
        document.getElementById("firstChart")
      );
      // 指定图表的配置项和数据
      // firstChart.setOption({
      //   tooltip: {
      //     triggerOn: "mousemove",
      //     trigger: "item",
      //     formatter: "{b}:{c}条",
      //   },
      //   xAxis: {
      //     data: this.xAxisData,
      //   },
      //   yAxis: {
      //     splitLine: { show: false },
      //   },
      //   series: [
      //     {
      //       name: "类型",
      //       type: "bar",
      //       data: this.seriesData,
      //       barWidth: 30,
      //       itemStyle: {
      //         normal: {
      //           color: function (params) {
      //             var colorList = ["#22AAFF", "#01D59B", "#FD9754", "#AE80FA"];
      //             return colorList[params.dataIndex];
      //           },
      //         },
      //       },
      //     },
      //   ],
      // });

      firstChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}:{c}条",
        },
        legend: {
          orient: "vertical",
          left: 10,
          bottom:120,
          itemGap: 20,
          data: this.xAxisData,
        },
        series: [
          {
            name: "需求类型",
            type: "pie",
            radius: ["40%", "65%"],
            center:["60%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.seriesData,
          },
        ],
      });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        tooltip: {
          triggerOn: "mousemove",
          trigger: "item",
          formatter: "{b}:{c}条",
          // formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: 10,
          itemGap: 40,
          bottom: 140,
          data: this.xAxisData1,
        },
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["32%", "50%"], //第一个值调整左右，第二个值调整上下，也可以设置具体数字像素值
            selectedMode: "single",
            label: {
              normal: {
                position: "inner",
                show: false,
              },
            },
            itemStyle: {
              borderWidth: 5, //设置border的宽度有多大
              borderColor: "#fff",
            },
            data: this.dataList,
          },
        ],
      });
    },
  },
};
</script>
<style lang="less" scoped>
.echarts-box .el-submenu__icon-arrow {
  display: inline-block !important;
}
.echarts-box .el-icon-arrow-down {
  display: inline-block !important;
}
.echarts-box .el-submenu__icon-arrow {
  display: inline-block !important;
}
.echarts-box .el-icon-arrow-down {
  display: inline-block !important;
}
.top {
  position: relative;
}
.picker {
  position: absolute;
  top: 0px;
  right: 32px;
}
.echarts-box {
  margin: 30px;
  .charts {
    width: 785px;
    // height: 660px;
    background: #ffffff;
    border-radius: 4px;
    padding: 30px;
    position: relative;
    .title-name {
      margin-top: 0;
    }
    .data-box {
      position: absolute;
    }
    .total-monut {
      color: #222;
      font-size: 14px;
      font-weight: 500;
      width: 100%;
      margin-top: 50px;
      text-align: center;
    }
  }
}
</style>
