<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            :clearable="true"
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格展示 -->
      <el-table :data="userInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="110"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="80">
          <!-- 插槽填充
          获取每个用户的状态信息 el-table-column是子组件 的插槽传递过来了
          -->
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            @change="changeStart(info.row.id, info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[2, 4, 8]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="querycdt.tot"
      ></el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form :rules="editFormRules" ref="editFormRef" :model="editForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getUserInfos()
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      // 手机号码规则：1开始,后接3|5|8|9|7,再后边跟9位数字
      // 正则表达式校验
      if (!/^1[35789]\d{9}$/.test(value)) {
        // 校验失败(请给页面提示错误信息)
        return callback(new Error('手机号码格式不正确'))
      }

      // 校验成功，继续执行
      callback()
    }
    return {
      //修改用户
      editDialogVisible: false,
      //添加用户from表单的数据
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      //对表单域进行校验
      editFormRules: {
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          //自定义校验手机号规则
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      //添加用户
      addDialogVisible: false,
      //添加y用户from表单的数据
      editForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addForm: {},
      //对表单域进行校验
      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          //自定义校验手机号规则
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //用户数据
      userInfos: [],
      //给获取用户数据设置查询条件
      querycdt: {
        //查询关键字
        query: '',
        //首页
        pagenum: 1,
        //每页数据
        pagesize: 2,
        //总条数
        tot: 0
      },
      is_flag: true
    }
  },
  //获取真实的数据
  methods: {
    //修改用户，收集数据存储
    editUser() {
      // 校验表单
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          // 校验成功处理
          // 收集数据存储入库
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )

          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }

          // 修改成功：关闭对话框、成功提示、页面数据更新
          this.editDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户
    async showEditDialog(id) {
      //显示对话框
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      //获得到的用户信息赋予给editFrom 表单数据对象
      this.editForm = res.data
    },
    //删除用户
    delUser(id) {
      // 确认
      this.$confirm('确定要删除该用户么?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // axios调用api删除数据
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }

          // 删除成功：消息提示、刷新数据
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        })
        .catch(() => {})
    },
    //收集数据存储入库（执行后端aqi接口）
    addUser() {
      // 先校验form表单，validate
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // 表单校验成功
          const { data: res } = await this.$http.post('users', this.addForm)

          // 添加失败
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }

          // 添加成功:关闭对话框、成功提示、显示新添加用户
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    // 对话框关闭回调
    addDialogClose() {
      // 重置form表单
      this.$refs.addFormRef.resetFields()
    },
    //修改用户状态
    async changeStart(uid, state) {
      // console.log(uid, state)
      const { data: res } = await this.$http.put(
        'users/' + uid + '/state/' + state
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },

    async getUserInfos() {
      const { data: res } = await this.$http.get('/users', {
        params: this.querycdt
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.querycdt.tot = res.data.total
      //数据赋
      this.userInfos = res.data.users
      // console.log(this.userInfos)
    },
    //数据分页
    //1.每页条数的回调
    handleSizeChange(arg) {
      // arg 变化后的记录条数
      this.querycdt.pagesize = arg
      this.getUserInfos()
    },
    //当前页码
    handleCurrentChange(arg) {
      // arg 变化后的当前页码值
      this.querycdt.pagenum = arg
      this.getUserInfos()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
