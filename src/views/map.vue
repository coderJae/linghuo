<template>
    <div id="map">
          <baidu-map :center="{lng:lng,lat:lat}" :zoom="zoom" :scroll-wheel-zoom="true" class="bm-view" ak="AGP7btYH81QDvcAWYyQtib8gLcaWxkiv"  @ready="handler"> 
                <bm-marker  animation="BMAP_ANIMATION_BOUNCE" :position="{lng:lng,lat:lat}">
                </bm-marker>
          </baidu-map>
    </div>
</template>
    
<script>
import { BaiduMap,BmMarker,BmLabel,BmInfoWindow } from 'vue-baidu-map'
export default {
     name:'Map',
     components: {
          BaiduMap,
          BmMarker
     },
     data(){
         return {
              zoom:18,
              center:{},
              lng:'',
              lat:''
         }
     },
     methods:{
         handler({ BMap, map }) {

                // var ggPoint = new BMap.Point(this.lng,this.lat);

                // var convertor = new BMap.Convertor();
                // var pointArr = [];
                // pointArr.push(ggPoint);

                // convertor.translate(pointArr, 1, 5, this.translateCallback)

                //   this.marker={lng:query.lng,lat:query.lat}           
          }
     },
     mounted(){
          let query=this.$route.query;

          this.lng=query.lng;
          this.lat=query.lat;
     }
}
</script>

<style scoped>
#map{
    width:10rem;
}
.bm-view{
    width:10rem;
    height:100%;
}
</style>