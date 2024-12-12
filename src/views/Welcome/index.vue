<template>
  <el-carousel :interval="4000" type="card" height="250px">
    <el-carousel-item v-for="item in 3" :key="item">
      <el-image :src="require('@/assets/img/' + item + '.jpg')" fit="fit" />
      <!-- <h3 text="2xl" justify="center">{{ item }}</h3> -->
    </el-carousel-item>
  </el-carousel>
  <div class="search">
    <el-form id="form1" class="form-part" :inline="true" :model="formData1">
      <el-form-item label="团名" label-width="70">
        <el-input id="book_name" v-model="formData1.book_name" placeholder="模糊查询" MaxLength="20" clearable></el-input>
      </el-form-item>
      <el-form-item label="团号" label-width="70">
        <el-input id="author" v-model="formData1.author" placeholder="模糊查询" MaxLength="20" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button id="btn_SearchID1" type="primary" @click="onGoto()">
          <el-icon>
            <Search />
          </el-icon>
          搜索
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from 'vue-router';
const router = useRouter();

const formData1 = reactive({
  book_name: '',
  author: '',
})

const onGoto=()=>{
  router.push({ path: '/BOOK_INFO/BOOK_INFO', query: { book_name: formData1.book_name, author:formData1.author } })
}

</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.search {
  margin-top: 15px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: aqua;
}
</style>