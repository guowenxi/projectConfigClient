import React, { useState, useEffect,useMemo } from 'react';
import styled from 'styled-components';

import eachrts from "echarts";

import { getFontSize,getChartsCurrentData,dealAreaColorList,chartsIntervalIds,calculteArray } from '@/utils/utils';




const ContentBox = styled.div`
  width:100;
  height:100%;
`;


interface props {
  dispatch: any,
  className?: string,
  data: {
    xAxis: any[],
    series: any[],
    legends?: (string | number)[]
  },
  title: string,
  color?: string | any[],
  dataLabelColor?: string | any[],
  lineType?: 'solid' | 'dashed' | 'dotted',
  dataLabelState?: boolean,
  moduleId?: string | number,
  showNum?: number,
  barGap?: string | number,
  tooltipType?: "item" | "axis" | "none",
  ifZoom?: boolean
}


interface CHARTSDATA{
  xAxis: any[],
  series: any[],
  legends?: (string | number)[]
}




const BarCharts: React.FC<props> = (props: any) => {

  const {data,className,title,color,dataLabelState,dataLabelColor,showNum,barGap,tooltipType,moduleId,ifZoom} = props;

  const [chartsDom,setChartsDom]=useState();

  const [chartsData,setChartsData]=useState({})




  useMemo(() => {

  }, []);

  useEffect(() => {
    if(data!=chartsData&&data&&chartsDom){
      setChartsData(data);
      drawCharts();
    }
  }, [chartsDom,data])




  const  drawCharts=()=>{
    if(!chartsDom){
      return
    }
    const fontSize=getFontSize();
   chartsIntervalIds.map((item,idx)=>{
     if(moduleId===item.moduleId){
       clearInterval(item.chartsItem);
       chartsIntervalIds.splice(idx,1)
     }
   })
   let dataObjact: CHARTSDATA=data;
   let userDate: CHARTSDATA=getChartsCurrentData(data,showNum);

   let countNum=0;
    if(!Array.isArray(userDate.series[0])){
      data.series.map((item01: any,index01: number)=>{
        countNum+=item01;
      })
    }
    const barChart=eachrts.getInstanceByDom(chartsDom) || eachrts.init(chartsDom);
    // let width:number | null | undefined=chartsDom.offsetWidth;
    const domHeight: number | null | undefined=chartsDom.offsetHeight;
    const series=[];
    if(data.series.length){
      if(Array.isArray(data.series[0])){
        userDate.series.map(function (item01: any,index01: number) {
          series.push({
            name:data.legends?data.legends[index01]:"",
            label:{
              show:dataLabelState,
              position:'top',
              color:dataLabelColor || ""
            },
            type:'bar',
            stack: '',
            barMaxWidth:fontSize*3,
            data:item01,
            itemStyle:{
              color:dealAreaColorList(color,index01),
              opacity:color?1:0,
              borderWidth:1,
              barBorderRadius:fontSize*0.5,
            },
            barMinHeight:fontSize,
            barGap:barGap || '30%'
          })
        })
      }else {
        series.push({
          name:data.legends&&data.legends.length?`${data.legends[0]} ${countNum}`:'',
          type:'bar',
          stack: '',
          label:{
            show:dataLabelState,
            position:'top',
            color:dataLabelColor || ""
          },
          barMaxWidth:fontSize*5,
          barMinHeight:fontSize,
          data:userDate.series,
          itemStyle:{
            color:dealAreaColorList(color,0),
            opacity:color?1:0,
            borderWidth:1,
            barBorderRadius:fontSize*0.5
          }
        })
      }
    }
    const option = {
      legend:{
        show:!!(Array.isArray(data.legends)&&data.legends.length),
        data:Array.isArray(data.legends)&&data.legends.length?data.legends.map((item: string | number,index: number)=>{
          return {
            name:countNum?`${item} ${countNum}`:item,
          }
        }):"",
        right:0,
        textStyle:{
          fontSize:fontSize*1.67,
        },
        itemWidth:fontSize*1.67,
        itemHeight:fontSize*1.67,
        icon:"roundRect",
      },
      title:{
        text:title,
        top:0,
        textStyle:{
          fontSize:fontSize*1.56,
          color:"#50576a",
          fontWeight:"normal"
        },
      },
      tooltip:{
        trigger:tooltipType || "item",
        formatter:tooltipType?'':`{b}<br/>{c}`,
        // backgroundColor:Array.isArray(color[0])?color[0][1]:'rgba(50,50,50,0.7)'
      },
      grid: {
        left: '0',
        right: '0',
        bottom: ifZoom?'20%':'0%',
        containLabel: true,
        top:fontSize*6.4,
        width:'100%',
      },
      xAxis : [
        {
          type : 'category',
          data : userDate.xAxis.map((value: string | number)=>{
            if(value){
              return value
            }
          }),
          axisLabel:{
            interval:0,
            color:"#42484e",
            fontSize:fontSize*1.3
            // rotate:45,
          },
          axisTick:{
            show:false,
          },
          axisLine:{
            show:false,
            lineStyle:{
              color:'#999'
            }
          },
        }
      ],
      yAxis : [
        {
          type : 'value',
          nameTextStyle:{
            color:'#9192c5'
          },
          axisLine:{
            show:false
          },
          axisTick:{
            show:false,
            lineStyle:{
              normal:{
                color:'#999'
              }
            }
          },
          splitLine:{
            show:false,
            lineStyle:{
              color:'#999'
            }
          },
          axisLabel:{
            show:false,
            verticalAlign:'middle',
            color:'#999'
          },
        }
      ],
      dataZoom:ifZoom? [{
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        left: 0,
        bottom: 0,
        right:0,
        start: 0,
        end: 30 // 初始化滚动条
      }]:[],
      series
    };
   if(data.xAxis.length>showNum){
     chartsIntervalIds.push({
       moduleId,
       chartsItem:setInterval(function (){
        dataObjact=calculteArray(dataObjact);
         userDate=getChartsCurrentData(dataObjact,showNum)
         option.xAxis[0].data=userDate.xAxis;
         if(Array.isArray(userDate.series[0])){
           userDate.series.map((item: any,idx: number)=>{
             option.series[idx].data=item;
           })
         }else {
           option.series[0].data=userDate.series;
         }
         barChart.setOption(option,true);
       }, 5000)
     });
   }
    barChart.setOption(option,true)
  }



  return (
    <ContentBox className={className || ""} ref={dom=>{
      setChartsDom(dom);
    }}>

    </ContentBox>
  );
};

export default BarCharts;
