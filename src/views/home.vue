<template>
     <div>
          <div class="notice" v-if="false">
                    <div class="topic">最新通知：</div>
                    <div class="box">
                         <div class="marquee" :style="{ animation: 'marquee '+ Math.ceil(notice.length/4) + 's linear infinite normal'}">
                              {{notice}}
                         </div>
                    </div>
                    <div class="detail">详情</div>
         </div>
         <div class="container">
               <div class="section summary">
                    <div class="title">
                         <div>新型冠状肺炎疫情</div>
                         <div class="select">枣庄</div>
                    </div>
                    <div class="ts">
                         <div>实时动态追踪</div>
                         <div>数据更新至 {{new Date().Format("yyyy-MM-dd HH:mm:ss")}}</div>
                    </div>
                    <div class="line">
                         <div class="dot dt"></div>
                         <div class="dot db"></div>
                    </div>
                    <div class="epis">
                         <div class="data">
                              <div class="a">
                                   <span>
                                        <b><span>{{totleNum}}</span>例</b></br>
                                        <span>确诊</span>
                                   </span>
                              </div>
                              <div class="b">
                                   <span>
                                        <b><span>{{suspectNum}}</span>例</b></br>
                                        <span>疑似</span>
                                   </span>
                              </div>
                              <div class="c">
                                   <span>
                                        <b><span>{{cureNum}}</span>例</b></br>
                                        <span>治愈</span>
                                   </span>
                              </div>
                              <div class="d">
                                   <span>
                                        <b><span>{{dieNum}}</span>例</b></br>
                                        <span>死亡</span>
                                   </span>
                              </div>
                         </div>
                         <div class="fei"></div>
                    </div>
               </div>
               <div class="section map">
                    <div class="title">
                         <div>枣庄疫情分布图</div>
                    </div>
                    <div class="ts">
                         <div>数据来源：国家及各省级市地区卫健委</div>
                    </div>
                    <div id="map"></div>
               </div>
               <!-- <div class="section makeimg" @click="getImg">
                    生成枣庄疫情数据海报图
               </div> -->
               <div class="section map">
                    <div class="title">
                         <div>社区疫情热力图</div>
                         <div class="mode" @click="changeMode">热力图</div>
                    </div>
                    <div class="ts">
                         <div>数据来源：国家及各省级市地区卫健委</div>
                    </div>
                    <baidu-map  :center="myCoord" :zoom="zoom" :scroll-wheel-zoom="true" class="bm-view" ak="AGP7btYH81QDvcAWYyQtib8gLcaWxkiv" @ready="handler"> 
                         <template v-if="!showHeatMap">
                              <bm-marker  v-for="(item,index) in heatMap" :key="index"  :position="item"  @click="clickHandler(itm,index)" 
                              :icon="{url: 'https://feiyan.jutatech.top:20443/point.png', size: {width: 36, height: 36}}">
                              </bm-marker>
                              <!-- <bm-marker  v-for="(item,index) in heatMap" :key="index"  :position="item">
                              </bm-marker> -->
                         </template>
                         <bml-heatmap v-else :data="heatMap" :max="100" :radius="20">
                         </bml-heatmap>
                    </baidu-map>
               </div>
               <div class="section trend">
                    <div class="title">
                         <div>枣庄疫情趋势</div>
                    </div>
                    <div id="trend">

                    </div>
               </div>
               <div class="section case">
                    <div class="title">
                         <div>枣庄社区病例<span style="font-size:0.2667rem">(展开查看社区详情)</span></div>
                    </div>
                    <div class="ts">
                         <div>数据来源：国家及各省级市地区卫健委</div>
                    </div>
                    <div class="casetable">
                         <a-table :columns="columns" :dataSource="esData" class="components-table-demo-nested" :pagination="false">
                                   <a-table
                                        slot="expandedRowRender"
                                        slot-scope="text"
                                        :columns="innerColumns"
                                        :dataSource="text.communityItem"
                                        :pagination="false"
                                        :customRow="click"
                                   >
                                        <a href="javascript:;" slot="detail" slot-scope="text">查看</a>
                                   </a-table>
                         </a-table>
                    </div>
               </div>
               <div class="section case">
                    <div class="title">
                         <div>疫情新闻</div>
                    </div>
                    <div class="news">
                         <div class="item" v-for="(item,index) in news" :key="index">
                             <!-- <div class="info"> -->
                                                                 <a :href="item.url"><div class="theme">{{item.content}}</div></a>

                                  <div class="from">
                                      <!-- <div class="comment">3</div> -->
                                      <div>{{item.fromName}}</div>
                                      <div style="margin-left:0.4rem">{{item.sendTime}}</div>
                                  </div>
                             <!-- </div> -->
                             <!-- <img src=""/> -->
                         </div>
                    </div>
               </div>
         </div>
     </div>
</template>

<script>
const  echarts = require('echarts');
const  geoJson = require('./geojson/zaozhuang.json');
const axios = require('axios');
import { BaiduMap,BmMarker,BmLabel,BmlHeatmap,BmOverlay  } from 'vue-baidu-map'

const columns = [
          { title: '区/县', dataIndex: 'county', key: 'county', align:'center'},
          { title: '确诊人数',dataIndex: 'totleNum', key: 'totleNum' , align:'center'},
          { title: '治愈', dataIndex: 'cureNum', key: 'cureNum', align:'center' }
  ];

const innerColumns = [
          { title: '所属社区', dataIndex: 'community', key: 'community', align:'center' },
          { title: '确诊', dataIndex: 'totleNum', key: 'totleNum', align:'center' },
          { title: '距我', dataIndex: 'distance', key: 'distance', align:'center' }
  ];
Date.prototype.Format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "H+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export default {
     name:'Home',
     components: {
          BaiduMap,
          BmMarker,
          BmLabel,
          BmlHeatmap,
          BmOverlay
     },
     data(){
          return {
               notice:'4日，中国工程院院士、国家卫健委高级别专家组成员李兰娟团队，在武汉公布治疗新型冠状病毒感染的肺炎的最新研究成果。',
               news:[],
               columns,
               innerColumns,
               totleNum:0,
               suspectNum:0,
               cureNum:0,
               dieNum:0,
               zoom:12,
               showHeatMap:false,
               data:[],
               marker:{},
               esData:[],
               myCoord:null,
               heatMap:[],
               myCharts:null,
               active: false
          }
     },
     watch:{
          data(){
               if(!this.myCoord) return;
               this.data.forEach(item=>{
                    if(item.communityItem.length>0){
                        item.communityItem.forEach(c=>{
                             c.distance=this.getDistance(c.lng,c.lat)
                        })
                    }
               })
               this.esData=this.data;
          },
          myCoord(){
               if(this.data.length==0) return;
               this.data.forEach(item=>{
                    if(item.communityItem.length>0){
                        item.communityItem.forEach(c=>{
                             c.distance=this.getDistance(c.lng,c.lat)
                        })
                    }
               })
               this.esData=this.data;
          }
     },
     methods:{
          clickHandler(){

          },
          getImg(){
                 let a = document.createElement("a"); // 生成一个a元素
                 let event = new MouseEvent("click"); // 创建一个单击事件
                    a.download = name || "photo"; // 设置图片名称 
                    a.href = this.myChart.getDataURL(); // 将生成的URL设置为a.href属性
                    a.dispatchEvent(event); // 触发a的单击事件
          },
          click(record, index){
               return {
                    on: {
                         click: () => {
                              this.$router.push({
                                   name:'map',
                                   query:{
                                      lng:record.lng,
                                      lat:record.lat
                                   }
                              })
                         }
                    }
               }
          },
          changeMode(){
               this.showHeatMap=!this.showHeatMap;
          },
          handler({ BMap, map }) {
               const that = this;
               var geolocation = new BMap.Geolocation();
                   geolocation.getCurrentPosition(function(r) {
                         if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                              that.myCoord=new BMap.Point(r.longitude,r.latitude);

                              var ggPoint = new BMap.Point(r.longitude,r.latitude);
                              var convertor = new BMap.Convertor();
                    
                              var pointArr = [];
                              pointArr.push(ggPoint);
                              console.log(convertor);
                              convertor.translate(pointArr, 1, 5, this.translateCallback)
                         } else {
                              alert("failed" + this.getStatus());
                         }
                   });
          },
          getDistance (lng,lat) {
               var map = new BMap.Map('');
               var pointB = new BMap.Point(lng,lat)  // 店铺的经纬度
               var distance = parseFloat((map.getDistance(this.myCoord, pointB) / 1000).toFixed(2)) // 保留小数点后两位
               return distance + 'km'
          }
     },
     mounted(){
          
          var _this=this;

           //获取枣庄社区疫情
          axios.get('https://feiyan.jutatech.top:20443/api/zaozhuang/zaozhuangpneumonia/getNewsJson').then(function (response) {
               let _d=response.data.result.list;
               _this.news=_d;
          }).catch(function (error) {
               console.log(error);
          }).then(function () {
          });

     

          //获取枣庄社区疫情
          axios.get('https://feiyan.jutatech.top:20443/api/zaozhuang/zaozhuangpneumonia/getPneumoniaCommunityList').then(function (response) {
               let _d=response.data.data;
               _this.data=_d;
               let heat=[];
               _d.forEach(item=>{
                     if(item.communityItem.length>0){
                          item.communityItem.forEach(c=>{
                               heat.push({
                                    lng:c.lng,
                                    lat:c.lat,
                                    count:50
                               }) 
                          }) 
                     }
               })
               _this.heatMap=heat;

          }).catch(function (error) {
               console.log(error);
          }).then(function () {
          });
          
         // 基于准备好的dom，初始化echarts图表
         this.myChart = echarts.init(document.getElementById('map'),'mint');
             echarts.registerMap("zaozhuang",geoJson);

             var option={
                    visualMap: {
                         left:30,
                         bottom:30,
                         pieces: [
                              {min: 11, label: '≥11人', color: '#bf2121'},
                              {min: 4, max:10, label: '4-10人', color: '#ff7b69'},
                              {min:1, max: 3,label:'1-3人', color: '#ffaa85'}
                         ],
                         textStyle: {
                              color: '#8a8a8a'
                         }
                    },
                    tooltip: {
                         trigger: 'item',
                         showDelay: 0,
                         transitionDuration: 0.2,
                         formatter: function (params) {
                              var value = (params.value + '').split('.');

                              return '地区：' + params.name + '<br/>'  + '确诊：' + value;
                         }
                    },
                    series: [
                         {
                              type:'map',
                              map:'zaozhuang',
                              roam:false,
                              zoom:1,
                              label:{
                                   show:true,
                                   textStyle:{
                                   color:'#000',
                                   fontSize:10
                                   }
                              },
                              itemStyle:{
                                   borderWidth:.5,
                                   fontSize:10,
                                   borderColor:'#000',
                                   emphasis:{
                                   areaColor:'#50b1b7'
                                   }
                              },
                              data:[]
                         }
                    ]
             }

          let addr=[{
                 name:'山亭区',
                 value:0
          },{
                 name:'峄城区',
                 value:0
          },{
                 name:'市中区',
                 value:0
          },{
                 name:'薛城区',
                 value:0
          },{
                 name:'台儿庄区',
                 value:0
          },{
                 name:'滕州市',
                 value:0
          }];

          let  totleNum=0,
               suspectNum=0,
               cureNum=0,
               dieNum=0;
          //
          axios.get('https://feiyan.jutatech.top:20443/api/zaozhuang/zaozhuangpneumonia/getPneumoniaList').then(function (response) {


               addr.forEach(a=>{
                    response.data.data.forEach(d=>{
                         if(a.name == d.county){
                             a.value=d.totleNum;
                             totleNum+=d.totleNum;
                             suspectNum+=d.suspectNum;
                             cureNum+=d.cureNum;
                             dieNum+=d.dieNum;

                         }           
                    })
               })

               _this.totleNum=totleNum;
               _this.suspectNum=suspectNum;
               _this.cureNum=cureNum;
               _this.dieNum=dieNum;

               option.series[0].data=addr;
               _this.myChart.setOption(option,true)
          }).catch(function (error) {
               console.log(error);
          }).then(function () {
          });
      

     //  trend
        var trend = echarts.init(document.getElementById('trend'),'');

        var optn = {
             grid: {
                  top:40,
                  left:30,
                  right: 20,
                  height: 150
            },
            legend: {
                  left:80,
                  top:10,
                  itemWidth: 20,
                  itemHeight: 10,
                  itemGap:10
              },
              tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'line',
                        color:'red'       // 默认为直线，可选为：'line' | 'shadow'
                    },
                    textStyle:{
                      fontSize:9
                    }
              },
              xAxis: {
                  data : [],
                  axisTick: {
                      show:true
                  },
                  axisLine: {
                      lineStyle: {
                          color: '#cdcdcd',
                          width:1
                      }
                  },
                  axisLabel: {
                      fontSize:9,
                      color:'#8a8a8a'
                  }
              },
              yAxis: {
                  type: 'value',
                  name:'单位：例',
                  nameTextStyle:{
                      color:'#515151'
                  },
                  minInterval: 1,
                  axisTick: {
                      show:false
                  },
                  axisLine: {
                      lineStyle: {
                          color: '#cdcdcd',
                          width:1
                      }
                  },
                  splitLine: {
                      show: true,
                      lineStyle: {
                          color: '#e6e6e6',
                          width:0.5
                      }
                  },
                  axisLabel: {
                      color:'#8a8a8a'
                  }
              },
              series: [
                  {
                      name:'新增',
                      type:'line',
                      smooth: true,
                      symbolSize: 5,
                      lineStyle:{
                        width:.5
                      },
                      itemStyle:{
                           color:'#f13824'
                      },
                      data: []
                   },
                   { 
                      name:'疑似',
                      type:'line',
                      smooth: true,
                      symbolSize: 5,
                      lineStyle:{
                        width:.5
                      },
                      itemStyle:{
                           color:'#eb862a'
                      },
                      data: []
                   },
                   {
                      name:'治愈',
                      type:'line',
                      smooth: true,
                      symbolSize: 5,
                      lineStyle:{
                        width:.5
                      },
                      itemStyle:{
                           color:'#50b1b7'
                      },
                      data: []
                   },
                    {
                      name:'死亡',
                      type:'line',
                      smooth: true,
                      symbolSize: 5,
                      lineStyle:{
                        width:.5
                      },
                      itemStyle:{
                           color:'#54595d'
                      },
                      data: []
                  }
              ]
        };
        

          //疫情趋势图
          axios.get('https://feiyan.jutatech.top:20443/api/zaozhuang/zaozhuangpneumonia/getDaySeriesList').then(function (response) {
               let _d=response.data.data;
                
               optn.series[0].data=_d.addNumItem;
               optn.series[1].data=_d.suspectNumItem;
               optn.series[2].data=_d.cureNumItem;
               optn.series[3].data=_d.dieNumItem;

               optn.xAxis.data=_d.dateTimeItem;

               trend.setOption(optn,'true');


          }).catch(function (error) {
               console.log(error);
          }).then(function () {
          });

        
     }
}
</script>

<style>
.container{
     padding:3.5rem 0.32rem 0 0.32rem;
     background:url(../assets/banner.png) no-repeat top center;
     background-size:10rem 6.3733rem;
}
.notice{
     width:9.36rem;
     height:1.0667rem;
     line-height:1.0667rem;
     padding:0 0.32rem;
     background:#fff9e9 url(../assets/notice.png) no-repeat 0.32rem center;
     background-size:0.5333rem 0.5333rem;
     color:#d0021b;
     display:flex;
}
.notice .topic{
     margin-left:0.7rem;
}
.notice .box{
     flex:1;
     overflow: hidden;
     position: relative;
}
.marquee{
    position: absolute;
    white-space: nowrap;
}
.notice .detail{
    padding:0 0.08rem;
}
 @keyframes marquee {
     0% {
          transform: translateX(2.6667rem);
          -webkit-transform: translateX(2.6667rem);
     }
     100% {
          transform: translateX(-100%);
          -webkit-transform: translateX(-100%);
     }
 }
.section{
     border-radius:0.2rem;
     background:rgba(255,255,255,1);
     box-shadow:0px 0px 6px 4px rgba(0,0,0,0.03);
     padding-top:0.24rem;
     position: relative;
}
.summary,.map,.case,.trend,.makeimg{
     margin-top:0.32rem;
}
.section .title{
     position: relative;
     padding:0 0 0 0.24rem;
     display:flex;
     height:0.64rem;
     line-height:0.64rem;
     font-size:0.4267rem;
     font-weight:bold;
     justify-content: space-between;
}
.section .title::before{
     content:'';
     width:0.08rem;
     height:0.4267rem;
     background:rgba(92,105,253,1);
     position:absolute;
     top:0.1067rem;
     left:0;
}
.section .select{
     width:1.72rem;
     height:0.64rem;
     background:linear-gradient(90deg,rgba(92,105,253,1) 0%,rgba(81,144,254,1) 100%);
     border-radius:24px;
     text-align: center;
     color:#fff;
     margin-right:0.2rem;
}

.section  .mode{
     width:2.36rem;
     height:0.64rem;
     padding-left:0.64rem;
     background:url(../assets/change.png) no-repeat 0.1333rem center,linear-gradient(to right,rgba(92,105,253,1) 0%,rgba(81,144,254,1) 100%);
     background-size:contain;
     border-top-left-radius:0.32rem;
     border-bottom-left-radius: 0.32rem;
     text-align: center;
     color:#fff;
}
.section .ts{
     padding:0 0.24rem;
     display:flex;
     justify-content: space-between;
     margin-top:0.08rem;
     font-size:0.3467rem;
     color:rgba(102,102,102,1);
}

.section .line{
     width:100%;
     height:0.0133rem;
     border-top:0.0133rem dashed #D5D5D5;
     position:absolute;
     top:1.7rem;
}
.section .line .dot{
     width:0.2667rem;
     height:0.2667rem;
     border-radius:50%;
     background:#0e288e;
     position:absolute;
     top:-0.1333rem;
     box-shadow:0px 0px 0.04rem 0 rgba(0,0,0,0.03) inset;
}
.section .line .dt{
     left:-0.1333rem;
}
.section  .line .db{
     right:-0.1333rem;
}


.makeimg{
     height:1.04rem;
     padding-top:0;
     text-align: center;
     color:#fff;
     line-height: 1.04rem;
     font-size:0.3733rem;
     background:linear-gradient(90deg,rgba(92,105,253,1) 0%,rgba(81,144,254,1) 100%);
     border-radius:0.5467rem;
}

.epis {
    display:flex;
    padding:0.8rem 0;
    justify-content: space-around;
    -webkit-user-select:none;
}
.epis .data{
    display:flex;
    width:3.1733rem;
    height:3.1733rem;
    flex-wrap:wrap;
}
.epis .data  div{
   width:1.586rem;
   height:1.586rem;
   box-sizing:border-box;
   color:#666666;
}
.epis .data  div b {
     font-size:0.4rem;
}
.epis .data  div b span{
    color:#5C69FD;
    font-size:0.5067rem;
}
.epis .data  div.a{
   border-bottom:1px dashed #D5D5D5;
   text-align:left;
}
.epis .data  div.b{
   border-bottom:1px dashed #D5D5D5;
   border-left:1px dashed #D5D5D5;
   text-align:right;
}
.epis .data  div.c{
   padding-top:0.4rem;
   text-align:left;
}
.epis .data  div.d{
   border-left:1px dashed #D5D5D5;
   padding-top:0.4rem;
   text-align:right;
}
.epis .data  div.a span{
   text-align:center;
}

.epis .fei{
     width:3.1733rem;
     height:3.1733rem;
     background:url(../assets/img_fei.png) no-repeat center center;
     background-size:100% 100%;
}
#map{
   width:9.36rem;
   height:9.36rem;
}
.bm-view {
  width:9.36rem;
  height:9.36rem;
  margin-top:0.4rem;
  /* border: 1px solid red; */
}
#trend{
     width:100%;
     height:6rem;
}

.news {
     width:8.8267rem;
     margin:0.4rem auto;
     max-height:10.6667rem;
     overflow: scroll-y;
}
.news .item{ 
     padding:0.2667rem;
     border-bottom:1px solid #f1f1f1;
}

.news .item .info{
      flex:1;
      position: relative;
}
.news .item   a .theme{
      font-size:0.4rem;
      color:#515151;
      /* display: -webkit-box; */
      /* -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; */
      /* overflow: hidden; */
}
.news .item  img{
      margin-left:0.1333rem;
      height:2rem;
      width:3.3333rem;
      border:1px solid red;
      border-radius:0.1333rem;
}
.from{
     display:flex;
     width:100%;
     margin-top:0.2rem;
     color:#bfbfbf;
}
/* .from .comment{
     padding-left:0.5rem;
     margin-right:0.4rem;
     background:url(../assets/comment.png) no-repeat left center;
     background-size:0.4rem 0.4rem;
} */

.casetable{
     margin-top:0.4rem;
     background:#fff;
}
</style>