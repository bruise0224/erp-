<template>
  <div class="container-part">
    <el-form id="form1" class="form-part" :inline="true" :model="formData1">
      <el-form-item label="用户名" label-width="70">
        <el-input id="txb_1e__user_name" v-model="formData1.txb_1e__user_name" placeholder="模糊查询" MaxLength="20"
                  clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button id="btn_SearchID1" type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button id="btn_Form1Reset" type="primary" @click="onReset">重置查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addData">新增数据</el-button>
      </el-form-item>
    </el-form>

    <el-table id="table1" class="table-part" :data="tableData1" border>
      <template v-for="col in colOptions">
        <el-table-column :prop="col.prop" :label="col.label" :width="col.width" v-if="col.isShow"
        ></el-table-column>
      </template>

      <el-table-column label="配置显示列" width="200">
        <template #header>
          <el-select
              v-model="showCols"
              multiple
              collapse-tags
              placeholder="选择显示列"
              style="width: 240px"
              @change="hideCol"
          >
            <el-option
                v-for="item in showColoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="170px">
        <template #default="{ row }">
          <el-button link size="small" type="primary" @click="editHandle(row)">编辑</el-button>
          <el-button link size="small" type="danger" @click.prevent="deleteHandle(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination id="pagination1" class="page-part" background v-model:current-page="currentPage1"
                   v-model:page-size="pageSize1" :page-sizes="[100, 200, 300]"
                   layout="total,sizes, prev, pager, next, jumper"
                   :total="totalCount1" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>

    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="dialogForm" label-width="150px">
        <el-form-item v-for="col in colList" :label="col.label">
          <el-input v-model="dialogForm[col.prop]" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogCancel">取消</el-button>
          <el-button type="primary" @click="dialogCommit">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="deleteDialogFormVisible" title="是否删除数据?">
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="deleteDialogFormVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteCommit">确认</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from "vue";
import axios from "axios";
//默认显示列
const showCols = ref(['user_id', 'user_name', 'password', 'email', 'sex', 'age',])
//数据列
const colOptions = ref([
  {prop: 'seq', label: 'seq', isShow: false, width: '', formatter: ''},
  {prop: 'user_id', label: '账号', isShow: true, width: '', formatter: ''},
  {prop: 'user_name', label: '用户名', isShow: true, width: '', formatter: ''},
  {prop: 'password', label: '密码', isShow: true, width: '', formatter: ''},
  {prop: 'email', label: '邮箱', isShow: true, width: '170', formatter: ''},
  {prop: 'phone_num', label: '手机号', isShow: false, width: '', formatter: ''},
  {prop: 'sex', label: '性别', isShow: true, width: '170', formatter: ''},
  {prop: 'birthday', label: '生日', isShow: false, width: '', formatter: ''},
  {prop: 'address', label: '地址', isShow: false, width: '', formatter: ''},
  {prop: 'created_time', label: '创建时间', isShow: false, width: '170', formatter: 'formatCellDate'},
  {prop: 'updated_time', label: '更新时间', isShow: false, width: '', formatter: 'formatCellDate'},
  {prop: 'age', label: '年龄', isShow: true, width: '', formatter: ''},
  {prop: 'id', label: '身份证号', isShow: false, width: 'false', formatter: ''},
  {prop: 'deposit', label: '存款', isShow: false, width: 'false', formatter: ''},
])
//下拉框被备选项  ★★★
const showColoptions = [
  {value: 'seq', label: 'seq',},
  {value: 'user_id', label: '账号',},
  {value: 'user_name', label: '用户名',},
  {value: 'password', label: '密码',},
  {value: 'email', label: '邮箱',},
  {value: 'phone_num', label: '手机号',},
  {value: 'sex', label: '性别',},
  {value: 'birthday', label: '生日',},
  {value: 'address', label: '地址',},
  {value: 'created_time', label: '创建时间',},
  {value: 'updated_time', label: '更新时间',},
  {value: 'age', label: '年龄',},
  {value: 'id', label: '身份证号',},
  {value: 'deposit', label: '存款',},
]
//配置显示列★★★
const hideCol = (value) => {
  //先都隐藏, 选中的值展示;
  for (let i = 0, len = colOptions.value.length; i < len; i++) {
    colOptions.value[i].isShow = false
  }
  if (value.length > 0) {
    for (let j = 0, lenj = value.length; j < lenj; j++) {
      for (let i = 0, len = colOptions.value.length; i < len; i++) {
        if (colOptions.value[i].prop == value[j]) {
          colOptions.value[i].isShow = true
        }
      }
    }
  }
}

onMounted(() => {
  onSubmit()
})

const colList = ref(
    [
      {prop: 'seq', label: 'seq'},
      {prop: 'user_id', label: '账号'},
      {prop: 'user_name', label: '用户名'},
      {prop: 'password', label: '密码'},
      {prop: 'email', label: '邮箱'},
      {prop: 'phone_num', label: '手机号'},
      {prop: 'sex', label: '性别'},
      {prop: 'birthday', label: '生日'},
      {prop: 'address', label: '地址'},
      {prop: 'created_time', label: '创建时间'},
      {prop: 'updated_time', label: '更新时间'},
      {prop: 'age', label: '年龄'},
      {prop: 'id', label: '身份证号'},
      {prop: 'deposit', label: '存款'},

    ]
)

const formData1 = reactive({
  txb_1e__user_name: '',
})
const emptyDialogForm = {
  seq: '',
  user_id: '',
  user_name: '',
  password: '',
  email: '',
  phone_num: '',
  sex: '',
  birthday: new Date(),
  address: '',
  created_time: new Date(),
  updated_time: new Date(),
  age: '',
  id: '',
  deposit: '',

}
const dialogForm = ref(emptyDialogForm)
const tableData1 = ref();
const currentPage1 = ref(1);
const pageSize1 = ref(100);
const totalCount1 = ref(0);

const dialogVisible = ref(false)
const dialogTitle = ref('')


const handleSizeChange = (val) => {
  onSubmit()
}

const handleCurrentChange = (val) => {
  onSubmit()
}

const onSubmit = () => {
  let params = {
    tableName: 'user_info',
    formData: formData1,
    pageSize: pageSize1.value,
    currentPage: currentPage1.value,
  }
  axios.post('/queryTable1', params)
      .then(res => {
        if (res.status == 200) {
          //console.log("res:", res);
          if (res.data.code == 200) {
            tableData1.value = res.data.data.tableList;
            totalCount1.value = res.data.data.tableCount;
            // ElMessage({
            //   showClose: false,
            //   message: '查询成功',
            //   type: 'success',
            // })
          } else if (
              res.data.code == "500"
          ) {
            ElMessage({
              showClose: true,
              message: '查询失败' + res.data.msg,
              type: 'error',
            })
          }
        } else if (res.status == 500) {
          ElMessage({
            showClose: true,
            message: '查询失败' + res.data.msg,
            type: 'error',
          })
        }
      })
}
const formatCellDate = (row, column) => {
  let data = row[column.property]
  return formatDate(data)
}
const formatDate = (data) => {
  if (data == null) {
    return null
  }
  let dt = new Date(data)
  return dt.getFullYear() + '-' + (dt.getMonth() + 1).toString().padStart(2, '0') + '-' + dt.getDate().toString().padStart(2, '0')
      + ' ' + dt.getHours().toString().padStart(2, '0') + ':' + dt.getMinutes().toString().padStart(2, '0') + ':'
      + dt.getSeconds().toString().padStart(2, '0');
}

// const onReset = () => {
//   form1.resetFields() // 调用 resetFields 方法重置表单
//     }


const addData = () => {
  dialogTitle.value = '新增数据'
  dialogVisible.value = true
  dialogForm.value = emptyDialogForm
}

const dialogCommit = () => {
  if (dialogTitle.value == '新增数据') {
    addCommit()
  } else if (dialogTitle.value == '编辑数据') {
    editCommit()
  }
}
const dialogCancel = () => {
  if (dialogTitle.value = '新增数据') {
    dialogVisible.value = false
    dialogTitle.value = ''
  } else if (dialogTitle.value = '编辑数据') {
    onSubmit()
    dialogVisible.value = false
    dialogTitle.value = ''
  }
}

const addCommit = () => {
  let params = {
    tableName: 'user_info',

    formData: formData1,
    modelData: dialogForm.value,
    pageSize: pageSize1.value,
    currentPage: currentPage1.value,
  }
  axios.post('/addHandel', params)
      .then(res => {
        if (res.status == 200) {
          //console.log("res:", res);
          if (res.data.code == 200) {
            tableData1.value = res.data.data.tableList;
            totalCount1.value = res.data.data.tableCount;
            ElMessage({
              showClose: false,
              message: '新增成功',
              type: 'success',
            })
          } else if (
              res.data.code == "500"
          ) {
            ElMessage({
              showClose: true,
              message: '新增失败' + res.data.msg,
              type: 'error',
            })
          }
        } else if (res.status == 500) {
          ElMessage({
            showClose: true,
            message: '新增失败' + res.data.msg,
            type: 'error',
          })
        }
      })
}

const editHandle = (row) => {
  dialogTitle.value = '编辑数据'
  dialogVisible.value = true
  const rowStr = JSON.stringify(row);
  dialogForm.value = JSON.parse(rowStr);
}
const editCommit = () => {
  let params = {
    tableName: 'user_info',

    formData: formData1,
    modelData: dialogForm.value,
    pageSize: pageSize1.value,
    currentPage: currentPage1.value,
  }
  axios.post('/editHandel', params)
      .then(res => {
        if (res.status == 200) {
          //console.log("res:", res);
          if (res.data.code == 200) {
            tableData1.value = res.data.data.tableList;
            totalCount1.value = res.data.data.tableCount;
            ElMessage({
              showClose: false,
              message: '执行成功',
              type: 'success',
            })
          } else if (
              res.data.code == "500"
          ) {
            ElMessage({
              showClose: true,
              message: '执行失败' + res.data.msg,
              type: 'error',
            })
          }
        } else if (res.status == 500) {
          ElMessage({
            showClose: true,
            message: '执行失败' + res.data.msg,
            type: 'error',
          })
        }
      })
}

const deleteDialogFormVisible = ref(false)
const deleteDialogForm = ref({});

const deleteHandle = (row) => {
  deleteDialogFormVisible.value = true
  deleteDialogForm.value = row
}
const deleteCancel = () => {
  deleteDialogFormVisible.value = false
}
const deleteCommit = () => {
  let params = {
    tableName: 'user_info',

    formData: formData1,
    modelData: deleteDialogForm.value,
    pageSize: pageSize1.value,
    currentPage: currentPage1.value,
  }
  axios.post('/deleteHandel', params)
      .then(res => {
        if (res.status == 200) {
          //console.log("res:", res);
          if (res.data.code == 200) {
            tableData1.value = res.data.data.tableList;
            totalCount1.value = res.data.data.tableCount;
            ElMessage({
              showClose: false,
              message: '删除成功',
              type: 'success',
            })
          } else if (
              res.data.code == "500"
          ) {
            ElMessage({
              showClose: true,
              message: '删除失败' + res.data.msg,
              type: 'error',
            })
          }
        } else if (res.status == 500) {
          ElMessage({
            showClose: true,
            message: '删除失败' + res.data.msg,
            type: 'error',
          })
        }
      })
  deleteDialogFormVisible.value = false
}


</script>

<style scoped>
.container-part {
  height: 100%;

  /* height: 100vh; */
  display: flex;
  flex-direction: column;
}

.form-part {
  display: flex;
  justify-content: space-between;
  height: 40px;
  padding: 8px;
  margin: 4px 0;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 3px -3px 4px -3px rgb(157, 154, 154);
  /*倒角*/

}

.table-part {
  flex: 1;
  box-shadow: 3px -3px 4px -3px rgb(157, 155, 155);
  padding: 8px;
  margin: 4px 0;
  border-radius: 8px;
}

.page-part {
  height: 10px;

  padding: 10px;
  border-radius: 6px;
  background-color: #ffffff;
}
</style>