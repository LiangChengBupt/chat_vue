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
    <el-button class="searchBtn" size="mini" @click="showAddFriendDialog"
      ><i class="fa fa-plus" aria-hidden="true"></i
    ></el-button>
    <el-dialog title="添加好友" :visible.sync="addFriendDialogVisible" @close="resetAddFriendForm" class="round-dialog">
        <el-form ref="addFriendForm" :model="addFriendForm" label-width="80px">
          <el-form-item label="用户账号">
            <el-input v-model="addFriendForm.account" placeholder="请输入用户账号"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAddFriend">取消</el-button>
          <el-button type="primary" @click="sendFriendRequest">发送申请</el-button>
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
      addFriendDialogVisible: false,
      addFriendForm: {
        account: ''
      }
    };
  },
  methods:{
    search() {
      // 获取搜索关键字
      const keyword = this.$store.state.filterKey;
      console.log(keyword);

    },
    showAddFriendDialog() {
      this.addFriendDialogVisible = true;
    },
    resetAddFriendForm() {
      this.$refs.addFriendForm.resetFields();
    },
    cancelAddFriend() {
      this.addFriendDialogVisible = false;
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
      this.addFriendDialogVisible = false;
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
