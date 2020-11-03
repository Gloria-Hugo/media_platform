<template>
  <div id="userManagerBox" class="margin-box">
    <div class="queryBox flex-box">
      <div class="btns normal" @click="dialogVisible=true">+新增</div>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" v-loading="loading" :header-cell-style="{background:'#F0F2F5',color:'#222'}" stripe style="width: 100%">
      <el-table-column type="index" label="编号"></el-table-column>
      <el-table-column prop="type_name" label="类型名称"></el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-dialog title="添加"
               :visible.sync="dialogVisible"
               width="50%">
      <el-input v-model="form.type_name" placeholder="请填写类型名称" ></el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitType" >确 定</el-button>
      </span>
    </el-dialog>
      <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="totalCount"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        type_name: '',
        created_by: sessionStorage.getItem("userName"),
      },
      tableData: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      loading:false,
      dialogVisible:false
    }
  },
  created() {
    this.fetchList(this.page)
  },
  methods: {
    fetchList(page) {
      this.loading = true;
      this.$http.get(`/typeMobileAction/getTypeList?offset=${page}&limit=${this.pageSize}`).then((res)=>{
        this.loading = false
        if(res.data.netCode==200){
          this.tableData = res.data.data
          this.totalCount = res.data.standbyParams.count;
        }else{
          this.tableData = []
        }
        
      })
    },
    // 添加类型
    submitType(){
      if(this.form.type_name.trim()==""){
        this.$message.error("类型名称不能为空！")
        return false;
      }
      this.$http.post(`/typeMobileAction/submitType`,this.form).then(res=>{
        console.log(res)
        if(res.data.netCode==200){
          this.$message.success("类型添加成功！")
        }else{
          this.$message.error("操作失败，请稍后重试！")
        }
        this.dialogVisible = false;
        this.fetchList(this.page)
      })
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
}
</script>

<style lang="less" scoped>
.queryBox {
  position: relative;
  align-items: center;
  .normal {
    height: 48px;
    width: 120px;
    line-height: 48px;
    display: inline-block;
    background-color: #2d6ff5;
    top: 0;
  }
}
.color {
  color: #f5482c;
}
</style>