<template>
  <div>
    <mybreadxie second="权限管理^_^" third="角色列表(*^__^*)"></mybreadxie>
    <el-button type="primary">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="tableData5" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-row v-for="(level1,index1) in props.row.children">
              <el-col :span="6">
                <el-tag
                  closable
                  :key="index1.id"
                  @close="handleClose(level1,props.row)"
                >>{{level1.authName}}</el-tag>
              </el-col>
              <el-col :span="18">
                <el-row v-for="level2 in level1.children">
                  <el-col :span="6">
                    <div class="grid-content bg-purple">
                      <el-tag
                        :key="level2.id"
                        closable
                        type="danger"
                        @close="handleClose(level2,props.row)"
                      >>{{level2.authName}}</el-tag>
                    </div>
                  </el-col>
                  <el-col :span="18">
                    <div class="grid-content bg-purple-light">
                      <el-tag
                        v-for="level3 in level2.children"
                        :key="level3.id"
                        closable
                        type="warning"
                        @close="handleClose(level3,props.row)"
                      >>{{level3.authName}}</el-tag>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 编辑角色 -->
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <!-- 删除角色 -->
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
          <!-- 分配权限 给角色分配权限-->
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="distOne(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑 对话框 editFormVisible = true-->
    <el-dialog title="权限分配" :visible.sync="treeFormVisible">
      <!-- tree -->
      <el-tree
        :props="defaultProps"
        :default-checked-keys='checkedKeys'
        default-expand-all
        :data="treedata"
        show-checkbox
        node-key="id"
        ref="tree"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="treeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData5: [],
      tags: [{ name: "标签一", type: "" }],
      // 是否显示属性菜单
      treeFormVisible: false,
      editform: "",
      formLabelWidth: "120px",
      defaultProps: {
        children: "children",
        label: "authName"
      },
      treedata: [
      ],
      // 默认选中的
      checkedKeys:[],
      // 当前编辑的角色
      // editItem:{}
    };
  },
  methods: {
    // 角色列表（表格）
    async getRoles() {
      // 获取所有角色，每个角色里面包含了每个角色的权限信息
      let res = await this.$http.get("roles");
      //  console.log(res);
      // 获取到整个对象，在HTML结构里面，将数据渲染出来
      this.tableData5 = res.data.data;
    },

    // 删除角色指定权限  每个角色展开，显示的权限，
    async handleClose(item, rol) {
      //  console.log(item)//权限
      //  console.log(rol)//角色
      let res = await this.$http.delete(`roles/${rol.id}/rights/${item.id}`);
      // console.log(res);
      this.$message(res.data.meta.msg);
      //  this.getRoles();不能这样重新获取数据
      // 应该这样局部‘刷新’
      rol.children = res.data.data;
    },
    // 分配角色，角色授权
    async distOne(item) {
      // 弹出对话框
      this.treeFormVisible = true;
      // console.log(item);
      // 所有权限列表（显示在tree上）
      let res = await this.$http.get("rights/tree");
      // console.log(res);
      // 将三个children渲染到树型图上
      this.treedata = res.data.data;
      // 计算被选中的key
      // console.log(item);
      // 准备一个空数组，设置选中的值
      // 这个角色有这个权限的id，就代表这个角色拥有这个权限
      
      let checkIds = [];
      item.children.forEach(v => {
        checkIds.push(v.id);
        v.children.forEach( v2 => {
          checkIds.push(v2.id);
          v.children.forEach(v3 => {
            checkIds.push(v3.id);
          })
        })
      })
      // console.log(checkIds);
      this.checkedKeys = checkIds;
    },
    submit(){
      console.log(this.$refs.tree.getCheckedNodes());
      this.treeFormVisible = false;
      // 保存当前编辑的项
      // this.editItem = item;
    }
   
   
  },
  created() {
    // 渲染表格数据
    this.getRoles();
  }
};
</script>

<style>
</style>
