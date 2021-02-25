<template>
   <div>
     <a-card :bordered="false" v-if="step===0" style="background:#f8f8f8">
          <div style="text-align: center;">
               <div  style="user-select:none"><img src="../assets/1594091382.png"/></div>
               
               <p>填写相关信息</p>
          </div>
          <a-form-model ref="form" :model="formData" :rules="rules">
               <a-form-model-item prop="name">
                    <a-input size="large" allowClear v-model="formData.name" placeholder="姓名" />
               </a-form-model-item>
               <a-form-model-item prop="idCard">
                    <a-input size="large" allowClear v-model="formData.idCard" placeholder="身份证号码" />
               </a-form-model-item>
               <a-form-model-item prop="bankNo">
                    <a-input size="large" allowClear v-model="formData.bankNo"  placeholder="银行卡号" />
               </a-form-model-item>
               <a-form-model-item prop="mobileNo">
                    <a-input size="large" allowClear v-model="formData.mobileNo"  placeholder="手机号" />
               </a-form-model-item>
               <!-- <a-form-model-item>
                         <a-row type="flex"  justify="space-between">
                         <a-col :span="15" >
                              <a-input size="large" placeholder="短信验证码" />
                         </a-col>
                         <a-col :span="8">
                              <a-button size="large" type="primary">
                                   获取验证码
                              </a-button>
                         </a-col>

                    </a-row>
               </a-form-model-item> -->
               <a-form-model-item prop="workTypeId">
                    <a-select size="large" v-model="formData.workTypeId"  placeholder="请选择工作技能">
                         <a-select-option v-for="(item,index) in skills" :key="index" :value="item.id">
                         {{item.value}}
                         </a-select-option>
                    </a-select>
               </a-form-model-item>
               <a-form-model-item style="text-align:left" prop="hasRead">
                      <a-checkbox-group v-model="formData.hasRead">
                              <a-checkbox value="1" name="type">
                                   阅读并同意 <a href="">《相关协议》</a>
                              </a-checkbox>
                      </a-checkbox-group>
               </a-form-model-item>
                    <a-form-model-item>
                         <a-button size="large" type="primary" block @click="submit(1)">
                              下一步
                         </a-button>
               </a-form-model-item>
          </a-form-model>
     </a-card>
     <a-card :bordered="false" v-if="step===1" style="background:#f8f8f8">
          <input type="file" name="img" id="front" required style="display:none">
          <input type="file" name="img" id="back" required style="display:none">
          <p>身份证照片上传</p>
          <div class="ident front" @click="upload('front')" :style="{background:'#fff url('+ front +') no-repeat center center','backgroundSize':'100% 100%'}">
               <a-spin v-if="uploading1" tip="上传中···" />
          </div>
          <div class="ident back"  @click="upload('back')" :style="{background:'#fff url('+ back +') no-repeat center center','backgroundSize':'100%  100%'}">
               <a-spin v-if="uploading2" tip="上传中···" />
          </div>
          <div style="text-align:left;margin-bottom:.2rem">
               <div>请将身份证及手机摆横拍摄</div>
               <div>请将身份证对焦拍摄，确保清晰</div>
               <div>请确保您的身份证在有效期内</div>
          </div>
          <a-button size="large" :loading="loading" type="primary" block @click="submit(2)">
               上传
          </a-button>
     </a-card>
      <a-card style="text-align:center" :bordered="false" v-if="step===2">
          <p>签约成功</p>
          <div class="tishi"></div>
          <div style="margin-top:.5rem">恭喜您，签约成功</div>
     </a-card>
   </div>
</template>

<script>
import Schema from 'async-validator';
export default {
     name:'Home',
     data(){
        return {
          step:1,
          skills:[],
          loading:false,
          uploading1:false,
          uploading2:false,
          front:require('../assets/front.svg'),
          back:require('../assets/back.svg'),
          formData:{
            name:'',
            idCard:'',
            bankNo:'',
            mobileNo:'',
            workTypeId:undefined,
            idImgBack:'',
            idImgFront:'',
            hasRead:[]
          },
          rules: {
               name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
               ],
               idCard: [
                   { required: true, message: '请输入身份证号',   trigger: 'blur' },
                   { pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确格式', trigger: 'blur'}
               ],
               bankNo: [
                    { required: true, message: '请输入银行卡号', trigger: 'blur' }
               ],
               mobileNo: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { pattern: /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/, message: '请输入正确格式', trigger: 'blur'}
               ],
               workTypeId:[
                    { required: true, message: '请选择工作技能', trigger: 'change' }
               ],
               hasRead: [
                    { required: true, type: 'array', message: '请阅读相关协议', trigger: 'change' }
               ]
          }

        }
     },
     methods:{
        upload(type){
             let _this=this

             document.getElementById(type).click()
             document.getElementById(type).onchange=function(e){
                 if(type == 'front'){
                    _this.uploading1 = true
                 }else{
                    _this.uploading2 = true
                 }
                 var file = this.files[0]
           
                 var formData = new window.FormData();
                 formData.append('file',file);

                 _this.axios({
                      method:'post',
                      url:'/api/sys/oss/upload',
                      headers: {
                         'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      data:formData
                 }).then(res=>{
                         var windowURL = window.URL || window.webkitURL;
                         var dataURL;
                         dataURL = windowURL.createObjectURL(file);
                         
                         _this[type]=dataURL
                      if(type == 'front'){
                          _this.uploading1 = false
                          _this.formData.idImgFront = res.data.url
                      }else{
                          _this.uploading2 = false
                          _this.formData.idImgBack = res.data.url 
                      }
                 })


             }
        },
        submit(step){
              switch (step) {
                   case 1 :
                         this.$refs.form.validate(valid => {
                              if (valid) {
                                   this.step=1
                              }
                         })
                         break;
                    case 2:
                         if(this.formData.idImgFront && this.formData.idImgBack){
                             this.loading = true
                             this.axios({
                                   method:'post',
                                   url:'/api/admin/flexcontractor/verify',
                                   data:this.formData
                              }).then(res => {
                                   this.step = 2
                                   this.loading = false
                              }).catch(err=>{
                                   this.loading = false
                              })
                         }else{
                              this.$message.warning('请上传图片')
                         }
                         break;
                    default:
                         break;
                    
              }
        },
        getSkill(){
             this.axios({
                  method:'get',
                  url:'/api/sys/dict/listAllByType?type=profession_ability'
             }).then(res=>{
                  this.skills = res.data.data
             })
        }
     },
     mounted(){
          this.getSkill()
     }
}
</script>

<style lang="scss">
body{
 background:#f8f8f8;
}
.ident{
     height:5.3rem;
     text-align:center;
     line-height:5.3rem;
     margin:0.4rem auto;
     background:#fff;
     border-radius:0.2rem;
     border:1px solid #cdcdcd;
     .ant-spin{
        margin:0 auto;
     }
}

.tishi{
     margin-top:3rem;
     height:1.5rem;
     background: url(../assets/right.svg) no-repeat center center;
     background-size:1.5rem 1.5rem;
}
</style>