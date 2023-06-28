<template>
  <div id="card">
    <header>
      <!--  		<img class="avatar" :src="user.userProfile" :alt="user.nickname">-->
      <!--  		<p class="name">{{user.nickname}}</p>-->
    </header>
    <footer></footer>
    <el-input
      class="search"
      type="text"
      size="mini"
      v-model="$store.state.filterKey"
      placeholder="搜索"
      prefix-icon="el-icon-search"
      @keyup.enter="search"
    ></el-input>
    <el-button class="searchBtn" size="mini" @click="showAddFriendDialog">
      <i class="fa fa-plus" aria-hidden="true"></i>
    </el-button>
    <!-- <el-dialog title="添加好友" :visible.sync="addFriendDialogVisible" @close="resetAddFriendForm" class="round-dialog">
        <el-form ref="addFriendForm" :model="addFriendForm" label-width="80px">
          <el-form-item label="用户账号">
            <el-input v-model="addFriendForm.account" placeholder="请输入用户账号"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAddFriend">取消</el-button>
          <el-button type="primary" @click="sendFriendRequest">发送申请</el-button>
        </span>
        
     </el-dialog> -->
     <el-dialog title="操作" :visible.sync="dialogVisible" @close="resetForm" class="round-dialog">
        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane label="添加好友" name="addFriend">
            <el-form ref="addFriendForm" :model="addFriendForm" label-width="80px">
              <el-form-item label="用户账号">
                <el-input v-model="addFriendForm.account" placeholder="请输入用户账号"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="创建群聊" name="createGroup">
            <el-form ref="createGroupForm" :model="createGroupForm" label-width="80px">
              <el-form-item label="群聊名称">
                <el-input v-model="createGroupForm.groupName" placeholder="请输入群聊名称"></el-input>
              </el-form-item>
              <el-form-item label="群聊等级">
                <el-input v-model="createGroupForm.groupLevel" placeholder="请输入群聊等级"></el-input>
              </el-form-item>
              
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

            </el-form>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit">提交</el-button>
          </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: "card",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem("user")),
      dialogVisible: false,
      activeTab: 'addFriend', // 当前活动的标签页
      addFriendForm: {
        account: '' // 用户输入的账号
      },
      //上传的文件信息列表
      fileList: [],
      uploadDisabled: false,
      createGroupForm: {
        groupName: '', // 用户输入的群聊名称
        groupLevel:'',
        userProfile:''
      }
    };
  },
  methods:{
    // 图片上传失败
    imgError(err, file, fileList) {
      this.$message.error("上传失败");
      this.uploadDisabled = false;
    },
    //移除图片
    imgRemove(file, fileList) {
      this.uploadDisabled = false;
    },
    // 图片上传成功
    imgSuccess(response, file, fileList) {
      this.uploadDisabled = true;
      this.createGroupForm.userProfile = response; //将返回的路径给表单的头像属性
      console.log("图片url为: " + this.createGroupForm.userProfile);
    },
    // 上传中
    onProgress(event, file, fileList) {
      this.uploadDisabled = true;
    },
    submit () {
      if (this.activeTab === 'addFriend') {
        // 获取输入的用户账号
      const currentUserId = this.user.id; // 当前用户的 ID
      const friendAccount = this.addFriendForm.account; // 输入的好友账号
      console.log(friendAccount);
      this.getRequest("/user/addFriendRequest?fromId="+currentUserId+"&toId="+friendAccount).then(resp => {
        //?fromId=1&toId=2
        console.log(resp);    
        if (resp) {
                state.FriendRequests = resp;
                this.resetAddFriendForm();
            }
      })
      .catch(error => {
          console.error(error);
      });
      this.dialogVisible = false;
      } else if (this.activeTab === 'createGroup') {
        const groupData = {
          groupName: this.createGroupForm.groupName,
          id : 3,
          groupProfile: null,
          groupLevel : this.createGroupForm.groupLevel
          // 其他群组的属性
        };
        const userid = this.$store.state.currentUser.id;
        // this.getRequest("/newGroup?groupName="+this.createGroupForm.groupName+"&userid="+this.$store.state.currentUser.id)
        //   .then(resp => {
        //     console.log("success");
        //   })
        //   .catch(error => {
        //     console.error(error)
        //   })
        this.postRequest('/user/newGroup?userid='+userid , groupData)
        .then(response => {
            if (response > 0) {
              console.log("success");
            } else {
              console.log("success");
            }
          })
        .catch(error => {
          console.error(error)
        })
      }
      this.dialogVisible = false
    },
    //上传前
    beforeAvatarUpload(file) {
      let isLt4M = file.size / 1024 / 1024 < 4;

      if (!isLt4M) {
        this.$message.error("上传头像图片大小不能超过 4MB!");
      }
      return isLt4M;
    },
    cancel () {
      this.dialogVisible = false
    },
    resetForm () {
      this.addFriendForm.account = ''
      this.createGroupForm.groupName = ''
      this.dialogVisible = false
    },
    search() {
      // 获取搜索关键字
      const keyword = this.$store.state.filterKey;
      console.log(keyword);

    },
    showAddFriendDialog() {
      this.dialogVisible = true;
    },
    resetAddFriendForm() {
      this.$refs.addFriendForm.resetFields();
    },
    cancelAddFriend() {
      this.dialogVisible = false;
      this.resetAddFriendForm();
    },
    sendFriendRequest() {
      // 获取输入的用户账号
      const currentUserId = this.user.id; // 当前用户的 ID
      const friendAccount = this.addFriendForm.account; // 输入的好友账号
      console.log(friendAccount);
      this.getRequest("/user/addFriendRequest?fromId="+currentUserId+"&toId="+friendAccount).then(resp => {
        //?fromId=1&toId=2
        console.log(resp);    
        if (resp) {
                state.FriendRequests = resp;
                this.resetAddFriendForm();
            }
      })
      .catch(error => {
          console.error(error);
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
#card {
  padding: 12px;
  margin-bottom: 5px;
  .avatar {
    width: 40px;
    height: 40px;
    vertical-align: middle; /*这个是图片和文字居中对齐*/
  }
  .name {
    display: inline-block;
    padding: 10px;
    margin-bottom: 15px;
    font-size: 16px;
  }
  .search {
    background-color: #dbd9d8;
    width: 150px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border: 0;
    border-radius: 4px;
    outline: none; /*鼠标点击后不会出现蓝色边框*/
    color: #fff;
  }
  .searchBtn {
    background-color: #dbd9d8;
    border: 0;
    margin-left: 3px;
  }
}
</style>
<style>
/*当前组件的el-input样式设置*/
#card .el-input__inner {
  background-color: #dbd9d8;
  outline: none; /*鼠标点击后不会出现蓝色边框*/
}
</style>
