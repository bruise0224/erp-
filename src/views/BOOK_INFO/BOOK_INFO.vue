<template>
  <div class="container-part"> <!--//HTML代码、定义页面的区域-->
    <el-form id="form1" class="form-part" :inline="true" :model="formData1"><!--//定义表ID，表格样式和数据对象，Vue绑定指令-->
      <el-form-item label="地区" label-width="70"><!--//定义表中的标签，标签的宽度（像素）-->
        <el-cascader id="ddl_1e__book_class" v-model="ddl_1e__book_class" :options="ddlOptions" clearable />
        <!--//创建地区选择器，定义ID，v-model将el-cascader和ID进行双向绑定，options将ddlOptions变量和el-cascader绑定，clearable可以进行清除-->
      </el-form-item>
      <el-form-item label="团号" label-width="70">
        <el-input id="tbx_1e__book_name" v-model="formData1.tbx_1e__book_name" placeholder="模糊查询" MaxLength="20"
          clearable></el-input><!--//为输入框组件进行定义，placeholder为输入框为空时显示一段提示性的灰色占位文字，MaxLength表示最大输入字数-->
      </el-form-item>
      <el-form-item label="到达日期" label-width="70">
        <el-input id="tbx_1e__author" v-model="formData1.tbx_1e__author" placeholder="模糊查询" MaxLength="20"
          clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button id="btn_SearchID1" type="primary" @click="onSubmit">查询</el-button>
      </el-form-item><!--//按钮功能，定义按钮ID和样式，@click表示事件绑定语法-->
      <el-form-item>
        <el-button type="primary" @click="addData">新增数据</el-button>
      </el-form-item>
    </el-form>

    <!--    动态表格  //20231215★★★-->
    <el-table id="table1" class="table-part" :data="tableData1" border>
      <el-table-column prop="cover_url" label="图片"><!--//prop 用于指定该表格列对应的数据字段名称，cover_url代表图片-->
        <template #default="scope"><!--//具名插槽，通过 scope 参数接收包含当前行数据等相关信息的对象-->
          <div style="display: flex; align-items: center"><!--//内部的元素在水平和垂直方向上实现居中对齐-->
            <el-image style="width: 100px; height: 100px" :src="(scope.row.cover_url == '' || scope.row.cover_url == null) ?
              '' : require('@/assets/img/' + scope.row.cover_url)" fit="fit" />
              <!--//条件判断表达式结合函数，首先判断当前行数据scope.row中的 cover_url 属性是否为空字符串或者 null，如果是，
                则将图片的 src 属性设置为空，也就是不显示图片，如果 cover_url 属性有值，就通过 require 函数引入位于 @/assets/img/ 目录下
                对应的图片文件作为图片的 src 来源，fit=fit用来控制大小-->
          </div>
        </template>
      </el-table-column>
      <template v-for="col in colOptions">
        <el-table-column :prop="col.prop" :label="col.label" :width="col.width" v-if="col.isShow"></el-table-column>
      </template> 

      <el-table-column label="配置显示列" width="200">
        <template #header><!--//具名插槽，定义表头-->
          <el-input v-model="search" size="small" placeholder="Type to search" />
          <el-select v-model="showCols" multiple collapse-tags placeholder="Select" style="width: 240px"
            @change="hideCol">
            <el-option v-for="item in showColoptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>

      <!--//link type为链接以及风格，@click="borrowHandle(row)"：这是 Vue 的事件绑定语法，将按钮的点击事件与名为 borrowHandle 的方法进行绑定。
        当用户点击这个 “借阅” 按钮时，会触发 borrowHandle 方法，并且会将当前行的数据对象 row 作为参数传递给该方法，-->
      <el-table-column fixed="right" label="操作" width="120"><!--//表格列始终固定在右侧-->
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="borrowHandle(row)">借阅</el-button>
          <el-button link type="primary" size="small" @click="collectHandle(row)">收藏</el-button>
          <el-button link type="primary" size="small" @click="editHandle(row)">编辑</el-button>
          <el-button link type="danger"  size="small" @click.prevent="deleteHandle(row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!--//实现分页功能-->
    <el-pagination id="pagination1" class="page-part" v-model:current-page="currentPage1" background
      v-model:page-size="pageSize1" :page-sizes="[100, 200, 300]" layout="total,sizes, prev, pager, next, jumper"
      :total="totalCount1" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!--//实现新增数据页面功能-->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="dialogForm" label-width="150px">
        <el-form-item v-for="col in colList" :label="col.label"> 
          <el-input v-model="dialogForm[col.prop]" autocomplete="off" /><!--//关闭浏览器自动完成的功能-->
        </el-form-item> 
      </el-form>
      <template #footer><!--//具名插槽，定义对话框底部的信息-->
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

    <el-dialog v-model="borrowDialogVisible" title="借阅信息" @close="borrowClose">
      <el-form v-model="borrowDFModel" label-width="150px">
        <el-form-item label="借阅天数:">
          <el-row>
            <el-col :span="12">
              <el-input v-model="borrow_days" />
            </el-col>
            <el-col :span="6" :offset="6">
              <el-button type="primary" @click="borrowCommit">借阅</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"; //从Vue核心库中导入函数-->
import axios from "axios";
import dataStore from '@/store/storeData';
import { useRoute } from 'vue-router'

const route = new useRoute()


const ddlOptions = [
  {
    value: '欧洲地区',
    label: '欧洲地区',
    //子选项的功能-->
    children: [
      {
        value: '德法意瑞',
        label: '德法意瑞',
      },
      {
        value: '巴黎罗马',
        label: '巴黎罗马',
      },
      {
        value: '欧洲十四国',
        label: '欧洲十四国',
      },
    ],
  },
  {
    value: '澳洲地区',
    label: '澳洲地区',
    children: [
      {
        value: '澳大利亚',
        label: '澳大利亚',
      },
      {
        value: '新西兰',
        label: '新西兰',
      },
    ],
  },
]


const showCols = ref(['book_name', 'author', 'press', 'book_class', 'margin_num', 'collect_num',])

//数据列  //20231215★★★
const colOptions = ref([
  { prop: 'seq', label: 'seq', isShow: false, width: '', formatter: '' },
  { prop: 'book_id', label: '团ID', isShow: false, width: '', formatter: '' },
  { prop: 'cover_url', label: '图片', isShow: false, width: '', formatter: '' },
  { prop: 'book_name', label: '团名', isShow: true, width: '', formatter: '' },
  { prop: 'author', label: '团号', isShow: true, width: '', formatter: '' },
  { prop: 'press', label: '领队', isShow: true, width: '', formatter: '' },
  { prop: 'book_class', label: '地区', isShow: true, width: '170', formatter: '' },
  { prop: 'margin_num', label: '到达日期', isShow: true, width: '', formatter: '' },
  { prop: 'collect_num', label: '离开日期', isShow: true, width: '', formatter: '' },
  { prop: 'borrow_num', label: '借阅量', isShow: false, width: '', formatter: '' },
])

//下拉框被备选项  //20231215★★★
const showColoptions = [
  {
    value: 'seq',
    label: 'seq',
    // isShow: true,
  },
  { value: 'book_id', label: '团ID', },
  { value: 'cover_url', label: '图片', },
  { value: 'book_name', label: '团名', },
  { value: 'author', label: '团号', },
  { value: 'press', label: '领队', },
  { value: 'book_class', label: '地区', },
  { value: 'margin_num', label: '到达日期', },
  { value: 'collect_num', label: '离开日期', },
  { value: 'borrow_num', label: '借阅量', },
]

////20231215★★★
const hideCol = (value) => {
  //先都隐藏, 选中的值展示;
  for (let i = 0, len = colOptions.value.length; i < len; i++) {
    colOptions.value[i].isShow = false
  }
  // console.log(colOptions.value)
  if (value.length > 0) {
    //console.log(value)

    for (let j = 0, lenj = value.length; j < lenj; j++) {
      for (let i = 0, len = colOptions.value.length; i < len; i++) {
        if (colOptions.value[i].prop == value[j]) {
          //console.log(value[j])
          //console.log(colOptions.value[i])
          colOptions.value[i].isShow = true
        }
      }
    }
    // value.forEach((index, item) => {
    //   // colOptions.value.forEach((index1, item1) => {
    //   //   if (item1.prop == item) {
    //   //     item1.isShow =true
    //   //   }
    //   // })
    // })
  }
  // console.log(colOptions.value)
}
const pulicStore = dataStore()

onMounted(() => {
  onSubmit()
})
const ddl_1e__book_class =ref()
const colList = ref(
  [
    { prop: 'seq', label: 'seq' },
    { prop: 'book_id', label: '团ID' },
    { prop: 'book_name', label: '团名' },
    { prop: 'author', label: '团号' },
    { prop: 'no', label: '版本号' },
    { prop: 'press', label: '领队' },
    { prop: 'publication_date', label: '到达日期' },
    { prop: 'book_class', label: '地区' },
    { prop: 'loc', label: '位置' },
    { prop: 'cover_url', label: '图片url' },
    { prop: 'stock_num', label: '存量' },
    { prop: 'margin_num', label: '余量' },

  ]
)
const borrowDialogVisible = ref(false)
const borrow_days = ref()
const borrowDFModel = ref()
//收藏
const collectHandle = (row) => {
  const rowData = JSON.parse(JSON.stringify(row))
  let params = {
    user_id: pulicStore.user_id,
    user_name: pulicStore.user_name,
    book_id: rowData.book_id,
    book_name: rowData.book_name,
  }
  axios.post('/BOOK_INFO/collectHandle', params)
    .then(res => {
      if (res.status == 200) {
        //console.log("res:", res);
        if (res.data.code == 200) {
          ElMessage({
            showClose: false,
            message: res.data.data,
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
const borrowHandle = (row) => {
  if (row.margin_num <= 1) {
    ElMessage({
      showClose: false,
      message: '馆中只剩一本,不能借阅',
      type: 'info',
    })
    return
  }
  borrowDialogVisible.value = true
  borrowDFModel.value = row
}
const borrowCommit = () => {
  let params = {
    user_id: pulicStore.user_id,
    user_name: pulicStore.user_name,
    book_id: borrowDFModel.value.book_id,
    book_name: borrowDFModel.value.book_name,
    borrow_days: borrow_days.value,
  }
  axios.post('/BOOK_INFO/borrowHandel', params)
    .then(res => {
      if (res.status == 200) {
        //console.log("res:", res);
        if (res.data.code == 200) {
          ElMessage({
            showClose: false,
            message: res.data.data,
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
const borrowClose = () => {
  //刷新画面
  onSubmit()
}

const formData1 = ref({
  tbx_1e__book_name: '',
  tbx_1e__author: '',
})

const emptyDialogForm = {
  seq: '',
  book_id: '',
  book_name: '',
  author: '',
  no: '',
  press: '',
  publication_date: new Date(),
  book_class: '',
  loc: '',
  cover_url: new Date(),
  cover_url: '',
  stock_num: '',
  margin_num: '',
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
    tableName: 'book_info',
    formData: formData1.value,
    pageSize: pageSize1.value,
    currentPage: currentPage1.value,
  }
  axios.post('/queryTable1', params)
    .then(res => {
      if (res.status == 200) {
        console.log("res:", res);
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
    tableName: 'book_info',
    formData: formData1.value,
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
    tableName: 'book_info',
    formData: formData1.value,
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
    tableName: 'book_info',
    formData: formData1.value,
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


formData1.value.tbx_1e__book_name = route.query.book_name;
formData1.value.tbx_1e__author = route.query.author;

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