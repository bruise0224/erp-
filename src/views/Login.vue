<template>
  <div id="htmlDiv">
    <div class="bodyDiv">
      <div id="loginDiv" :style="loginHidden">
        <el-form :model="loginUser" :rules="rules" ref="loginForm">
          <h1 style="text-align: center;color: #475669; ">飞扬假期国际旅行社ERP管理系统</h1>
          <el-form-item label="账号" prop="user_id">
            <el-input placeholder="请输入账号..." v-model="loginUser.user_id"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="请输入密码..." v-model="loginUser.password"></el-input>
          </el-form-item>
          <div style="text-align: center;margin-top: 20px;">
            <el-button @click="handleLogin('loginForm')" class="button" type="primary">登录</el-button>
            <el-button @click="handleReset()" class="button" type="primary">重置</el-button>
            <el-button @click="goRegist()" class="button" type="primary">注册</el-button>
          </div>
          <div style="margin-top: 10px">
            <el-radio-group v-model="role_id_Radio">
              <el-radio :label="1" border>管理员</el-radio>
              <el-radio :label="2" border>管理员1</el-radio>
            </el-radio-group>
          </div>
        </el-form>
      </div>

      <div id="registerDiv" :style="registerHidden">
        <el-form :model="registerUser" :rules="rules" ref="registerForm">
          <h1 style="text-align: center;color: #475669;">REGISTER</h1>
          <el-form-item label="账号" prop="user_id">
            <el-input placeholder="请输入账号..." v-model="registerUser.user_id"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="请输入密码..." v-model="registerUser.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input type="password" placeholder="请再次输入密码..." v-model="registerUser.password2"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" placeholder="请输入邮箱..." v-model="registerUser.email"></el-input>
          </el-form-item>
          <div style="text-align: center;margin-top: 30px;">
            <el-button @click="handleRegister" class="button" type="primary">点击注册</el-button>
            <el-button @click="goLogin()" class="button" type="primary">去登录</el-button>
          </div>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";
import useMain from '@/store/storeData';
import { storeToRefs } from 'pinia';
const pulicStore = useMain()
let  {user_info } = storeToRefs(pulicStore)

console.log(new Date(), pulicStore)

const role_id_Radio = ref()
const router = new useRouter()
const loginHidden = ref("display: ;")
const loginUser = ref({
  user_id: '',
  password: '',
})
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再输入一遍密码'))
  } else if (value !== registerUser.value.password) {
    callback(new Error("两次密码不一样!"))
  } else {
    callback()
  }
}
const rules = ref({
  user_id: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度需要在6-30之間.', trigger: 'blur' }
  ],
  password2: [
    { validator: validatePass2, required: true, trigger: 'blur' },
  ],
  email: [
    { type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'change' },
  ],
})
const loginForm = ref(null)
const handleLogin = (formName) => {
  if (!role_id_Radio.value) {
    ElMessage({
      showClose: false,
      message: '请选择用户的角色',
      type: 'info',
    })
    return
  }
  loginForm.value.validate((valid) => {
    if (valid) {
      let params = {
        user_id: loginUser.value.user_id,
        password: loginUser.value.password,
      }
      //用mock获取数据;
      axios.post('/USER_INFO/login', params)
        .then(res => {
          if (res.status == 200) {
            //console.log("1res:", res);
            if (res.data.code == "200") {
              user_info.value.user_id = loginUser.value.user_id //保存公共状态
              user_info.value.user_name = loginUser.value.user_name
              user_info.value.role_id = role_id_Radio.value

              if (res.data.data.type == "0") {
                ElMessage({
                  showClose: false,
                  message: res.data.data.msg,
                  type: 'success',
                })
                //router.push('/welcome?role_id=' + role_id_Radio.value+'&role_name=admin')
                //0表示用户密码都正确,跳转首页 带入用户id参数
                router.push('/welcome')
              } else if (res.data.data.type == "1") {
                //1表示账户存在,但密码错误
                ElMessage({
                  showClose: false,
                  message: res.data.data.msg,
                  type: 'error',
                })
              } else if (res.data.data.type == "2") {
                //2表示账户不存在
                ElMessage({
                  showClose: false,
                  message: res.data.data.msg,
                  type: 'error',
                })
              }
            } else if (res.data.code == "500") {
              ElMessage({
                showClose: false,
                message: res.data.data.msg,
                type: 'error',
              })
            }
          }
        })
    } else {
      //console.log('表单验证失败');
    }
  });
}
const handleReset = () => {

}
const goRegist = () => {
  registerHidden.value = "display: ;"
  loginHidden.value = "display: none;"
}


const registerHidden = ref("display: none;")
const registerUser = ref({
  user_id: '',
  password: '',
  password2: '',
  email: '',
})
const registerForm = ref(null)
const handleRegister = () => {
  registerForm.value.validate((valid) => {
    if (valid) {
      let params = {
        modelData: registerUser.value,
      }
      axios.post('/USER_INFO/addHandel', params)
        .then(res => {
          if (res.status == 200) {
            //console.log("res:", res);
            if (res.data.code == "200") {
              ElMessage({
                showClose: false,
                message: "注册成功,请返回登录页面登录",
                type: 'success',
              })
            } else if (res.data.code == "500") {
              ElMessage({
                showClose: false,
                message: "注册失败:" + res.data.msg,
                type: 'error',
              })
            }
          } else if (res.status == 500) {
            ElMessage({
              showClose: false,
              message: "注册失败:" + res.data.msg,
              type: 'error',
            })
          }
        })
    }
  })
}
const goLogin = () => {
  registerHidden.value = "display: none;"
  loginHidden.value = "display: ;"
}


</script>

<style>
#htmlDiv {
  font-family: "宋体";
  font-size: large;
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: url('~@/assets/img/hsl.jpg') no-repeat 0px 0px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.bodyDiv {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

#loginDiv {
  width: 37%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.6);
  /*rgba(75, 81, 95, 0.6)*/
  box-shadow: 7px 7px 17px rgba(52, 56, 56, 0.8);
  border-radius: 5px;
}

#registerDiv {
  width: 37%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  /*background-color: rgba(75, 81, 95, 0.3);*/
  background-color: rgba(255, 255, 255, 0.6);

  box-shadow: 7px 7px 17px rgba(52, 56, 66, 0.5);
  border-radius: 5px;
}

p {
  margin-top: 30px;
  margin-left: 20px;
  color: azure;
}

input {
  margin-left: 15px;
  border-radius: 5px;
  border-style: hidden;
  height: 30px;
  width: 140px;
  background-color: rgba(216, 191, 216, 0.5);
  outline: none;
  color: #f0edf3;
  padding-left: 10px;
}

.button {
  border-color: cornsilk;
  background-color: rgba(100, 149, 237, .7);
  color: aliceblue;
  border-style: hidden;
  border-radius: 5px;
  width: 100px;
  height: 31px;
  font-size: 16px;
}
</style>