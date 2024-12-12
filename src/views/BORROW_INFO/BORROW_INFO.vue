<template>
  <div class="container-part">
    <el-form id="form1" class="form-part" :inline="true" :model="formData1">
      <el-form-item label="酒店名称" label-width="70">
        <el-input id="txb_1L__book_name" v-model="formData1.txb_1L__book_name" placeholder="模糊查询" MaxLength="20"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="所在城市" label-width="70">
        <el-input id="txb_1L__reader_name" v-model="formData1.txb_1L__reader_name" placeholder="模糊查询" MaxLength="20"
          clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button id="btn_SearchID1" type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addData">新增数据</el-button>
      </el-form-item>
    </el-form>

    <el-table id="table1" class="table-part" :data="tableData1" border>
      <el-table-column label='图片'>
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-image style="width: 100px; height: 100px" :src="(scope.row.book_name == '' || scope.row.book_name == null || scope.row.book_name == undefined || (!scope.row.book_name.toLowerCase().endsWith('.jpg') && !scope.row.book_name.toLowerCase().endsWith('.jpeg') && !scope.row.book_name.toLowerCase().endsWith('.png') && !scope.row.book_name.toLowerCase().endsWith('.jif') && !scope.row.book_name.toLowerCase().endsWith('.bmp'))) ?
              '' : require('@/assets/img/' + scope.row.book_name)" fit="fit" />
          </div>
        </template>
      </el-table-column>

      <!-- v-for展示表格列↓ -->
      <template v-for="col in colList">
        <!--        时间格式-->
        <el-table-column :prop="col.prop" :label="col.label" :width="col.width" v-if="col.isShow"
          :formatter="col.formatter == '' ? false : formatCellDate"></el-table-column>
      </template>
      <!-- 操作按钮列↓ -->
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="returnHandle(row)">修改</el-button>
          <el-button link type="primary" size="small" @click="payHandle(row)">删除</el-button>
          <!-- <el-button link type="primary" size="small" @click="editHandle(row)">编辑</el-button> -->
          <!-- <el-button link type="danger" size="small" @click.prevent="deleteHandle(row)">删除</el-button> -->
        </template>
      </el-table-column>
      <!-- 配置显示列↓ -->
      <el-table-column label="配置列" width="200">
        <template #header>
          <el-select v-model="showCols" multiple collapse-tags placeholder="选择显示列" style="width: 240px" @change="hideCol">
            <el-option v-for="item in showColoptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination id="pagination1" class="page-part" v-model:current-page="currentPage1" background
      v-model:page-size="pageSize1" :page-sizes="[100, 200, 300]" layout="total,sizes, prev, pager, next, jumper"
      :total="totalCount1" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="dialogForm" label-width="150px">
        <el-form-item v-for="col in colList" :label="col.label">
          <el-input v-model="dialogForm[col.prop]" autocomplete="off" />
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
import { ref, reactive, onMounted } from "vue";
import axios from "axios";


const showCols = ref([
  'seq', 'book_name', 'reader_name', 'borrow_time', 'return_time', 'borrow_days', 'returned', 'is_delayed', 'delayed_hour', 'delayed_cost', 'remark', 'book_id', 'reader_id',
])

//表格列  展示之前按no排序;
const colList = ref([
  { no: 0, prop: 'seq', label: '酒店名称', isShow: false, width: '', formatter: '', },
  { no: 0, prop: 'book_name', label: '所在城市', isShow: true, width: '', formatter: '', },
  { no: 0, prop: 'reader_name', label: '单房价', isShow: true, width: '', formatter: '', },
  { no: 0, prop: 'borrow_time', label: '双房价', isShow: true, width: 170, formatter: 'formatCellDate', },
  { no: 0, prop: 'return_time', label: '星级', isShow: true, width: 170, formatter: 'formatCellDate', },
  { no: 0, prop: 'borrow_days', label: '联系电话', isShow: true, width: '', formatter: '', },
  { no: 0, prop: 'returned', label: '联系传真', isShow: true, width: '', formatter: '', },
  { no: 0, prop: 'is_delayed', label: '邮箱', isShow: true, width: '', formatter: '', },
  { no: 0, prop: 'delayed_hour', label: '酒店地址', isShow: true, width: '', formatter: '', },
  { no: 0, prop: 'delayed_cost', label: '网址', isShow: true, width: '', formatter: '', },
  { no: 0, prop: 'remark', label: '备注', isShow: false, width: '', formatter: '', },
  { no: 0, prop: 'book_id', label: 'ID', isShow: false, width: '', formatter: '', },
  { no: 0, prop: 'reader_id', label: '其他信息', isShow: false, width: '', formatter: '', },

])

//配置显示列选择器
const showColoptions = [
  { no: 0, value: 'seq', label: '酒店名称', },
  { no: 0, value: 'book_name', label: '所在城市', },
  { no: 0, value: 'reader_name', label: '单房价', },
  { no: 0, value: 'borrow_time', label: '双房价', },
  { no: 0, value: 'return_time', label: '星级', },
  { no: 0, value: 'borrow_days', label: '联系电话', },
  { no: 0, value: 'returned', label: '联系传真', },
  { no: 0, value: 'is_delayed', label: '邮箱', },
  { no: 0, value: 'delayed_hour', label: '酒店地址', },
  { no: 0, value: 'delayed_cost', label: '网址', },
  { no: 0, value: 'remark', label: '备注', },
  { no: 0, value: 'book_id', label: 'ID', },
  { no: 0, value: 'reader_id', label: '其他信息', },

]

const hideCol = (value) => {
  //先都隐藏, 选中的值展示;
  for (let i = 0, len = colList.value.length; i < len; i++) {
    colList.value[i].isShow = false
  }
  if (value.length > 0) {
    for (let j = 0, lenj = value.length; j < lenj; j++) {
      for (let i = 0, len = colList.value.length; i < len; i++) {
        if (colList.value[i].prop == value[j]) {
          colList.value[i].isShow = true
        }
      }
    }
  }
}


onMounted(() => {
  onSubmit()
})


const formData1 = reactive({
  txb_1L__book_name: '',
  txb_1L__reader_name: '',

})
const emptyDialogForm = {
  seq: '',
  book_name: '',
  reader_name: '',
  borrow_time: new Date(),
  return_time: new Date(),
  borrow_days: '',
  returned: '',
  is_delayed: '',
  delayed_hour: '',
  delayed_cost: '',
  remark: '',
  book_id: '',
  reader_id: '',

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
    tableName: 'BORROW_INFO',
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
          //     showClose: false,
          //     message: '查询成功',
          //     type: 'success',
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
    tableName: 'BORROW_INFO',
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
  //console.log("行数据row", row);
  dialogTitle.value = '编辑数据'
  dialogVisible.value = true
  const rowStr = JSON.stringify(row);
  dialogForm.value = JSON.parse(rowStr);
}
const editCommit = () => {
  let params = {
    tableName: 'BORROW_INFO',
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
    tableName: 'BORROW_INFO',
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

//归还
const returnHandle = (row) => {
  var rowData = JSON.parse(JSON.stringify(row))
  //校验是否已经归还
  if (rowData.returned == '是') {
    ElMessage({
      showClose: false,
      message: '该书已经归还,请勿重复操作.',
      type: 'info',
    })
    return
  }

  let params = {
    modelData: rowData,
  }
  axios.post('/BORROW_INFO/returnHandle', params)
    .then(res => {
      console.log("🚀 ~ file: BORROW_INFO.vue:425 ~ returnHandle ~ res:", res)

      if (res.status == 200) {
        if (res.data.code == 200) {
          ElMessage({
            showClose: false,
            message: res.data.msg,
            type: 'success',
          })
        } else if (
          res.data.code == 500
        ) {
          ElMessage({
            showClose: true,
            message: res.data.msg,
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

  //查询 修改完以后的数据
  let queryParams = {
    tableName: 'BORROW_INFO',
    formData: formData1,
    pageSize: pageSize1.value,
    currentPage: currentPage1.value,
  }
  axios.post('/queryTable1', queryParams)
    .then(res => {
      if (res.status == 200) {
        if (res.data.code == 200) {
          tableData1.value = res.data.data.tableList;
          totalCount1.value = res.data.data.tableCount;
          // ElMessage({
          //   showClose: false,
          //   message: '更新后刷新页面成功',
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

//缴费
const payHandle = (row) => {
  var rowData = JSON.parse(JSON.stringify(row))
  rowData.is_delayed = '延期已结清' //延期状态

  let params = {
    tableName: 'BORROW_INFO',
    formData: formData1,
    modelData: rowData,
    pageSize: pageSize1.value,
    currentPage: currentPage1.value,
  }
  axios.post('/editHandel', params)
    .then(res => {
      if (res.status == 200) {
        if (res.data.code == 200) {
          tableData1.value = res.data.data.tableList;
          totalCount1.value = res.data.data.tableCount;
          ElMessage({
            showClose: false,
            message: '缴费成功',
            type: 'success',
          })
        } else if (
          res.data.code == "500"
        ) {
          ElMessage({
            showClose: true,
            message: '缴费失败' + res.data.msg,
            type: 'error',
          })
        }
      } else if (res.status == 500) {
        ElMessage({
          showClose: true,
          message: '缴费失败' + res.data.msg,
          type: 'error',
        })
      }
    })

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