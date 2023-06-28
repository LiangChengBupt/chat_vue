<template>
  <el-container>
    <el-header>
      <el-button
        @click="gotoAdminLogin"
        icon="el-icon-d-arrow-right"
        style="float: right; border: none"
        >管理端登录</el-button
      >
    </el-header>
    <el-main>
      <div class="loginContainer">
        <el-form
          ref="loginForm"
          :rules="rules"
          :model="loginForm"
          label-width="80px"
        >
          <h3 class="loginTitle">微言SubtleChat~</h3>
          <el-form-item label="用户名:" prop="username">
            <el-input
              type="text"
              v-model="loginForm.username"
              auto-complete="off"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              auto-complete="off"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="验证码:" prop="code">
            <el-input
              type="text"
              @keydown.enter.native="submitLogin"
              v-model="loginForm.code"
              auto-complete="off"
              placeholder="请输入验证码"
              style="width: 150px"
            ></el-input>
            <img
              :src="verifyCode"
              title="点击切换验证码"
              @click="changeverifyCode"
            />
          </el-form-item>
          <el-checkbox v-model="checked" class="loginRemember"></el-checkbox
          ><span> 记住我一周</span>
          <div>
            <el-button
              @click="showRegistryDialog"
              style="width: 45%; margin-right: 15px"
              >注册</el-button
            >
            <el-button
              type="primary"
              style="width: 45%"
              @click="submitLogin"
              v-loading.fullscreen.lock="fullscreenLoading"
              >登录</el-button
            >
          </div>
          <div style="height: 10px;"></div>
          <div>
            <el-button
              type="primary"
              style="width: 97%"
              @click="openCamera"
              v-loading.fullscreen.lock="fullscreenLoading"
              >人脸识别登录</el-button>
              
          </div>
        </el-form>
      </div>
    </el-main>


    <el-dialog 
      title="人脸识别登录"
      :before-close="closeCamera"
      :visible.sync="showCamera"
      width="100%"
      >
      <div class="box">
        <video id="videoCamera" class="canvas" :width="videoWidth" :height="videoHeight" autoPlay></video>
        <canvas id="canvasCamera" class="canvas" :width="videoWidth" :height="videoHeight"></canvas>
      </div>
      <div slot="footer">
        <el-button
          @click="drawImage"
          icon="el-icon-camera"
          size="small">
          拍照
        </el-button>
        <el-button
          v-if="os"
          @click="getCompetence"
          icon="el-icon-video-camera"
          size="small">
          打开摄像头
        </el-button>
        <el-button
          v-else
          @click="stopNavigator"
          icon="el-icon-switch-button"
          size="small">
          关闭摄像头
        </el-button>
        <el-button
          @click="resetCanvas"
          icon="el-icon-refresh"
          size="small">
          重置
        </el-button>
        <el-button
          @click="LoginWithFace"
          icon="el-icon-circle-close"
          size="small">
          上传
        </el-button>
      </div>      
    </el-dialog>


    <el-dialog
      title="新用户注册"
      :before-close="closeRegisterDialog"
      :visible.sync="registerDialogVisible"
      width="30%"
    >
      <el-form
        :model="registerForm"
        status-icon
        :rules="registerRules"
        ref="registerForm"
      >
        <el-form-item
          label="用户昵称："
          :label-width="formLabelWidth"
          prop="nickname"
        >
          <el-input
            v-model="registerForm.nickname"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="登录用户名："
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input
            v-model="registerForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码："
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input
            type="password"
            v-model="registerForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码："
          :label-width="formLabelWidth"
          prop="checkPass"
        >
          <el-input
            type="password"
            v-model="registerForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户头像：" :label-width="formLabelWidth">
          <el-upload
            action="/file?module=group-chat"
            ref="upload"
            list-type="picture-card"
            :class="{ disabled: uploadDisabled }"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            :on-progress="onProgress"
            :on-success="imgSuccess"
            :on-error="imgError"
            :on-remove="imgRemove"
          >
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传不超过4MB的图片(可使用默认头像！)
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitRegisterForm('registerForm')"
          style="width: 100%"
          >注册</el-button
        >
      </div>
    </el-dialog>

    <el-dialog 
      title="人脸上传"
      :before-close="closeSubmitface"
      :visible.sync="showSubmitface"
      width="100%"
      >
      <div class="box">
        <video id="videoCamera" class="canvas" :width="videoWidth" :height="videoHeight" autoPlay></video>
        <canvas id="canvasCamera" class="canvas" :width="videoWidth" :height="videoHeight"></canvas>
      </div>
      <div slot="footer">
        <el-button
          @click="drawImage"
          icon="el-icon-camera"
          size="small">
          拍照
        </el-button>
        <el-button
          v-if="os"
          @click="getCompetence"
          icon="el-icon-video-camera"
          size="small">
          打开摄像头
        </el-button>
        <el-button
          v-else
          @click="stopNavigator"
          icon="el-icon-switch-button"
          size="small">
          关闭摄像头
        </el-button>
        <el-button
          @click="resetCanvas"
          icon="el-icon-refresh"
          size="small">
          重置
        </el-button>
        <el-button
          @click="submitFace"
          icon="el-icon-circle-close"
          size="small">
          上传
        </el-button>
      </div>      
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: "Login",
  data() {
    
    var validateNickname = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入昵称"));
      }
      //检查昵称是否重复
      this.getRequest("user/checkNickname?nickname=" + value).then((resp) => {
        if (resp != 0) {
          callback(new Error("该昵称已被注册"));
        } else {
          callback();
        }
      });
    };
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      }
      //检查用户名是否重复
      this.getRequest("/user/checkUsername?username=" + value).then((resp) => {
        if (resp != 0) {
          callback(new Error("该用户名已被注册"));
        } else {
          callback();
        }
      });
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.checkPass !== "") {
          this.$refs.registerForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        code: "",
      },
      verifyCode: "/verifyCode",
      checked: true,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      fullscreenLoading: false,
      //注册表单相关
      registerDialogVisible: false,
      formLabelWidth: "120px",
      registerForm: {
        nickname: "",
        username: "",
        password: "",
        checkPass: "",
        userProfile: "default_head.jpg",
      },
      registerRules: {
        nickname: [{ validator: validateNickname, trigger: "blur" }],
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
      uploadDisabled: false,
      //上传的文件信息列表
      fileList: [],
      showCamera: false,
      showSubmitface: false,
      os: false,//控制摄像头开关
      thisVideo: null,
      thisContext: null,
      thisCancas: null,
      videoWidth: 500,
      videoHeight: 400,
      postOptions:[],
      CertCtl:'',
      // 遮罩层
      loading: true,
      
    };
  },
  create() {
    this.getCompetence();
  },
  mount() {
    this.getCompetence();
  },
  methods: {
    submitLogin() {
        console.log("login!");
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.fullscreenLoading = true;
          this.postKeyValueRequest("/doLogin", this.loginForm).then((resp) => {
            setTimeout(() => {
              this.fullscreenLoading = false;
            }, 1000);
            if (resp) {
              //保存当前用户到vuex
              this.$store.state.currentUser = resp.obj;
              //保存登录用户到sessionStorage中
              window.sessionStorage.setItem("user", JSON.stringify(resp.obj));
              let path = this.$route.query.redirect;
              this.$router.replace(
                path == "/" || path == undefined ? "/chatroom" : path
              );
            } else {
              this.changeverifyCode();
            }
          });
        } else {
          this.$message.error("用户名,密码和验证码都不能为空！");
          return false;
        }
      });
    },
    changeverifyCode() {
      this.verifyCode = "/verifyCode?time=" + new Date();
    },
    gotoAdminLogin() {
      this.$router.replace("/adminlogin");
    },
    showRegistryDialog() {
      this.registerDialogVisible = true;
    },
    openCamera() {
        console.log("face!");
        this.showCamera=true;
        this.getCompetence();
    },
    closeCamera() {
        this.showCamera=false;
        this.stopNavigator();
    },
    LoginWithFace() {  //人脸识别登录
        this.fullscreenLoading = true;
        this.postKeyValueRequest("/doLoginWithFace", this.imgSrc).then((resp) => {
            console.log(resp);
            console.log("postFace success");
            setTimeout(() => {
              this.fullscreenLoading = false;
            }, 1000);
            if (resp) {
              //保存当前用户到vuex
              this.$store.state.currentUser = resp.obj;
              //保存登录用户到sessionStorage中
              window.sessionStorage.setItem("user", JSON.stringify(resp.obj));
              let path = this.$route.query.redirect;
              this.$router.replace(
                path == "/" || path == undefined ? "/chatroom" : path
              );
            } else {
              this.changeverifyCode();
              this.closeCamera();
            }
          }
        );
    },
    // 调用摄像头权限
    getCompetence() {
        //必须在model中render后才可获取到dom节点,直接获取无法获取到model中的dom节点
        this.$nextTick(() => {
          const _this = this;
          this.os = false;//切换成关闭摄像头
          this.thisCancas = document.getElementById('canvasCamera');
          this.thisContext = this.thisCancas.getContext('2d');
          this.thisVideo = document.getElementById('videoCamera');
          // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
          if (navigator.mediaDevices === undefined) {
            navigator.menavigatordiaDevices = {}
          }
          // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
          // 使用getUserMedia，因为它会覆盖现有的属性。
          // 这里，如果缺少getUserMedia属性，就添加它。
          if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {
              // 首先获取现存的getUserMedia(如果存在)
              let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia;
              // 有些浏览器不支持，会返回错误信息
              // 保持接口一致
              if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
              }
              // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
              return new Promise(function (resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject)
              })
            }
          }
          const constraints = {
            audio: false,
            video: {width: _this.videoWidth, height: _this.videoHeight, transform: 'scaleX(-1)'}
          };
          navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            // 旧的浏览器可能没有srcObject
            if ('srcObject' in _this.thisVideo) {
              _this.thisVideo.srcObject = stream
            } else {
              // 避免在新的浏览器中使用它，因为它正在被弃用。
              _this.thisVideo.src = window.URL.createObjectURL(stream)
            }
            _this.thisVideo.onloadedmetadata = function (e) {
              _this.thisVideo.play()
            }
          }).catch(err => {
            this.$notify({
              title: '警告',
              message: '没有开启摄像头权限或浏览器版本不兼容.',
              type: 'warning'
            });
          });
        });
      },
      //绘制图片
      drawImage() {
        // 点击，canvas画图
        this.thisContext.drawImage(this.thisVideo, 0, 0, this.videoWidth, this.videoHeight);
        // 获取图片base64链接
        this.imgSrc = this.thisCancas.toDataURL('image/png');
        /*const imgSrc=this.imgSrc;*/
      },
      //清空画布
      clearCanvas(id) {
        let c = document.getElementById(id);
        let cxt = c.getContext("2d");
        cxt.clearRect(0, 0, c.width, c.height);
      },
      //重置画布
      resetCanvas() {
        this.imgSrc = "";
        this.clearCanvas('canvasCamera');
      },
      //关闭摄像头
      stopNavigator() {
        if (this.thisVideo && this.thisVideo !== null) {
          this.thisVideo.srcObject.getTracks()[0].stop();
          this.os = true;//切换成打开摄像头
        }
      },
      /*调用摄像头拍照结束*/
    /**
     *       图片上传的方法
     */
    //上传前
    beforeAvatarUpload(file) {
      let isLt4M = file.size / 1024 / 1024 < 4;

      if (!isLt4M) {
        this.$message.error("上传头像图片大小不能超过 4MB!");
      }
      return isLt4M;
    },
    // 上传中
    onProgress(event, file, fileList) {
      this.uploadDisabled = true;
    },
    // 图片上传成功
    imgSuccess(response, file, fileList) {
      this.uploadDisabled = true;
      this.registerForm.userProfile = response; //将返回的路径给表单的头像属性
      console.log("图片url为: " + this.registerForm.userProfile);
    },
    // 图片上传失败
    imgError(err, file, fileList) {
      this.$message.error("上传失败");
      this.uploadDisabled = false;
    },
    //移除图片
    imgRemove(file, fileList) {
      this.uploadDisabled = false;
    },
    closeRegisterDialog(done) {
      this.registerForm = {
        //清空表单
        nickname: "",
        username: "",
        password: "",
        checkPass: "",
        userProfile: "",
      };
      //this.$refs.upload.clearFiles();//清除上传组件的图片
      done(); //关闭对话框
    },
    //提交注册操作
    submitRegisterForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postRequest("/user/register", this.registerForm).then((resp) => {
            if (resp) {
              this.openSubmitface();
            }
          });
        } else {
          this.$message.error("请正确填写信息！");
          console.log("error submit!!");
          return false;
        }
      });
    },
    openSubmitface() {
        console.log("Submitface!");
        this.showSubmitface=true;
        this.getCompetence();
    },
    closeSubmitface() {
        this.showSubmitface=false;
        this.stopNavigator();
        this.registerDialogVisible = false;
        location.reload(); //刷新页面，清空注册界面的上传组件中的图片
    },
    submitFace() {
        this.showSubmitface=false;
        this.postKeyValueRequest("/user/personImg/upload", 
            {
                "img": this.imgSrc,
                "personName": this.registerForm.nickname,
                "personId": this.registerForm.username,
            }
        ).then((resp) => {
            if (resp) {
              console.log("success");
            }
            this.closeSubmitface();
         });
    }
  },
};
</script>


<style>
.disabled .el-upload--picture-card {
  display: none;
}
.loginContainer {
  width: 350px;
  margin: 100px auto;
  border-radius: 15px;
  border: 1px solid #eaeaea;
  /*添加阴影 h-shadow(水平阴影位置)，v-shadow(垂直阴影位置)，blur(阴影大小)，color(颜色)*/
  box-shadow: 10px 10px 35px #cac6c6;
  background: #fff;
  /*background-clip——规定背景的绘制区域*/
  /*border-box：背景被裁剪到边框盒*/
  /*padding-box：背景被裁剪到内边距框*/
  /*content-box：背景被裁剪到内容框*/
  background-clip: padding-box;
  padding: 25px 35px 25px 35px;
}
.loginTitle {
  margin: 10px auto 30px auto;
  text-align: center;
  color: #505458;
}
.loginRemember {
  margin: 5px auto 35px 80px;
}
/*.el-form-item__content{*/
/* display: flex;*/
/*  align-items: center*/
/*}*/
</style>
