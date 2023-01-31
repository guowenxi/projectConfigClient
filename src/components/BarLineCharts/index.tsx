import React, { useState, useEffect,useMemo } from 'react';
import styled from 'styled-components';

import eachrts from "echarts";

import { getFontSize,getChartsCurrentData,dealAreaColorList ,chartsIntervalIds,calculteArray } from '@/utils/utils';




const ContentBox = styled.div`
  width:100%;
  height:100%;
`;


interface props {
  dispatch: any,
  className: string,
  data: {
    xAxis: any[],
    series: any[],
    legends?: (string | number)[]
  },
  title: string,
  areaColor?: string | any[],
  lineColor?: string | any[],
  lineType?: 'solid' | 'dashed' | 'dotted',
  dataLabelState?: boolean,
  ifZoom?: boolean,
  lineSeriesTitleState?: boolean
}

interface CHARTSDATA{
  xAxis: any[],
  series: any[],
  legends?: (string | number)[]
}




const BarLineCharts: React.FC<props> = (props: any) => {

  const {data,className,title,barColor,showNum,lineAreaColor,lineColor,legendAlign,moduleId,ifZoom,lineSeriesTitleState} = props;

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

    const barLineCharts: any=eachrts.getInstanceByDom(chartsDom) || eachrts.init(chartsDom);
    let dataObjact: CHARTSDATA=data;
    let userDate: CHARTSDATA=getChartsCurrentData(data,showNum);
    const countNumArray: number[]=[];
    data.legends.map(function (item01: any,index01: number) {
      let  num=0;
      data.series[index01].map(function (item01: any,index01: number) {
        num+=Number(item01)
      })
      countNumArray.push(num)
    })
    let leftLegendSeries=0;
    if(data.series[0][0]){
      leftLegendSeries=data.series[0][0]
    }
    const option = {
      title:{
        text:title,
        top:0,
        textStyle:{
          fontSize:fontSize*1.67,
          color:"#50576a",
          fontWeight:"normal"
        },
      },
      tooltip:{
        trigger:"axis",
        formatter:Array.isArray(userDate.series[0])?function (params: any) {
          let  htmlStr="";
          for(let i=0;i<params.length;i++) {
            const param = params[i];
            const xName = param.name;// x轴的名称
            const {value} = param;// y轴值
            if(i==0){
              htmlStr=`${htmlStr+xName}<br/>`;
            }
            htmlStr=`${htmlStr+param.seriesName.split(' ')[0]} ${value}<br/>`
          }
          return htmlStr;
        }:`{b}<br/>{c}`
      },
      legend:{
        orient:"horizontal",
        top:0,
        formatter (params: any) {
          const text=params?params.split(' '):[]
          if(text.length==1){
            return `{b|${text[0]} }`;
          }
            return `{b|${text[0]} } {c|${text[1]}}`;

        },
        textStyle:{
          fontSize:fontSize*1.67,
          rich: {
            b: {
                fontSize:fontSize*1.67,
            },
            c: {
                color:'red',
                fontSize:fontSize*1.67,
            },

         },
        },
        itemGap:fontSize*3,
        itemWidth:fontSize*1.67,
        itemHeight:fontSize*1.67,
        icon:"roundRect",
        data:data.legends.map((item: string,index: number)=>{
          return {
            name:index===0?`${item} ${leftLegendSeries}`:item
          }
        }),
        width:'100%',
        right:0
        // selectedMode:"single"
      },
      grid: {
        left: '3%',
        right: '5%',
        bottom: ifZoom?'20%':fontSize,
        containLabel: true,
        top:fontSize*10.4
      },
      xAxis: [
        {
          type: 'category',
          data:userDate.xAxis.map(function (item01: any,index01: number) {
            return {
              value:item01
            }
          }),
          axisTick:{
            show:false,
          },
          axisLabel:{
            color:" #50576a",
            fontSize:fontSize*1.3,
            interval:0
          },
          axisLine:{
            lineStyle:{
              color:"#f0f0f0"
            }
          }
        }],
      yAxis: [
        {
          type: 'value',
          axisLine:{
            show:false
          },
          axisTick:{
            show:false
          },
          splitLine:{
            show:false,
            lineStyle:{
              color:"#f0f0f0"
            }
          },
          axisLabel:{
            fontSize:fontSize*1.48,
            show:false
          },
        },
        {
          type: 'value',
          position:"right",
          axisLine:{
            show:false
          },
          axisTick:{
            show:false
          },
          splitLine:{
            show:false,
            lineStyle:{
              color:"#f0f0f0"
            }
          },
          axisLabel:{
            fontSize:fontSize*1.48,
            show:false
          }
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
      series: [
        {
          name:`${data.legends[0]} ${leftLegendSeries}`,
          data: userDate.series[0],
          yAxisIndex:0,
          type: 'line',
          smooth: true,
          symbol:'circle',
          lineStyle:{
            color:lineColor
          },
          itemStyle:{
            color:lineColor
          },
          areaStyle:{
            color:dealAreaColorList(lineAreaColor,0),
            opacity:lineAreaColor?1:0,
          },
          label:{
            show:lineSeriesTitleState,
            color:lineColor[1]
          }
        },
        {
          name: data.legends[1],
          yAxisIndex:1,
          type: 'bar',
          stack: '',
          barMaxWidth: fontSize * 2,
          data: userDate.series[1].map((item: string | number)=>{
            return {
              value:item,
              label:{
                show:true,
                position:"top",
                color:Number(item)<=Number(data.series[0][0])?'red':barColor[1]
              }
            }
          }),
          barMinHeight: fontSize,
          itemStyle: {
            color:dealAreaColorList(barColor,0),
            opacity:barColor?1:0,
            borderWidth: 1,
            barBorderRadius: fontSize * 0.25,
          },
        }
      ]
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
          barLineCharts.setOption(option,true);
        }, 5000)
      });
    }
    barLineCharts.setOption(option,true);
  }



  return (
    <ContentBox className={className || ""} ref={dom=>{
      setChartsDom(dom);
    }}>

    </ContentBox>
  );
};

export default BarLineCharts;
