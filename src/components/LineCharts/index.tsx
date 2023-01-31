import React, { useState, useEffect,useMemo } from 'react';
import styled from 'styled-components';

import eachrts from "echarts";

import { getFontSize,dealItemColorList,dealAreaColorList,chartsIntervalIds,getChartsCurrentData,calculteArray  } from '@/utils/utils';




const ContentBox = styled.div`
  width:100;
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
  moduleId?: string,
  showNum?: number,
  ifZoom?: boolean
}




interface CHARTSDATA{
  xAxis: any[],
  series: any[],
  legends?: (string | number)[]
}





const LineCharts: React.FC<props> = (props: any) => {

  const {data,className,title,areaColor,lineColor,lineType,dataLabelState,moduleId,showNum,ifZoom} = props;

  const [lineChartsDom,setLineChartsDom]=useState();

  const [chartsData,setChartsData]=useState({})




  useMemo(() => {

  }, []);

  useEffect(() => {
    if(data!=chartsData&&data&&lineChartsDom){
      setChartsData(data);
      drawCharts();
    }
  }, [lineChartsDom,data])




  const  drawCharts=()=>{
    if(!lineChartsDom){
      return
    }

    chartsIntervalIds.map((item,idx)=>{
      if(moduleId===item.moduleId){
        clearInterval(item.chartsItem);
        chartsIntervalIds.splice(idx,1)
      }
    })
    let userDate: CHARTSDATA=getChartsCurrentData(data,showNum);
    let dataObjact: CHARTSDATA=data;

    const fontSize=getFontSize();
    const lineChart=eachrts.getInstanceByDom(lineChartsDom) || eachrts.init(lineChartsDom);
    const series=[];
    const countNumArray: (string | number)[]=[];
    let countNum=0;
    if(Array.isArray(userDate.series[0])){
      /* 计算总量 */
      data.legends.map(function (item01: any[],index01: number) {
        let  num=0;
        data.series[index01].map(function (item01: string | number,index01: number) {
          num+=Number(item01)
        })
        countNumArray.push(num)
      })
      data.legends.map(function (item01: any,index01: number) {
        series.push({
          name:`${item01} ${countNumArray[index01]}`,
          data: userDate.series[index01],
          type: 'line',
          label:{
            show:dataLabelState,
            position:'top'
          },
          smooth: true,
          symbol:'circle',
          lineStyle:{
            color:dealItemColorList(lineColor,index01),
            type:lineType?lineType[index01]:''
          },
          itemStyle:{
            color:dealItemColorList(areaColor,index01)
          },
          areaStyle:{
            color:dealAreaColorList(areaColor,index01),
            opacity:areaColor?1:0
          }
        })
      })
    }else {
      data.series.map((item01: any,index01: number)=>{
        countNum+=item01;
      })
      series.push({
        name:`${data.legends[0]} ${countNum}`,
        data: userDate.series,
        type: 'line',
        label:{
          show:dataLabelState,
          position:'top'
        },
        smooth: true,
        symbol:'circle',
        lineStyle:{
          color:dealItemColorList(lineColor,0)
        },
        itemStyle:{
          color:dealItemColorList(areaColor,0)
        },
        areaStyle:{
          color:dealAreaColorList(areaColor,0),
          opacity:areaColor?1:0
        }
      })
    }
    const option = {
      title:{
        text:title,
        textStyle:{
          fontSize:fontSize*1.67,
          color:"#50576a",
          fontWeight:"normal"
        }
      },
      tooltip:{
        trigger:"axis",
        formatter:Array.isArray(userDate.series[0])?function (params: any[]) {
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
        }:`{c}`
      },
      legend:{
        data:data.legends?data.legends.map(function (item01: string | number,index01: number) {
          return {
            name:Array.isArray(userDate.series[0])?`${item01} ${countNumArray[index01]}`:`${item01} ${countNum}`,
          }
        }):"",
        left:"right",
        textStyle:{
          fontSize:fontSize*2,
        },
      },
      grid: {
        left: '3%',
        right: '5%',
        bottom: ifZoom?'20%':fontSize,
        containLabel: true,
        top:fontSize*6.4,
      },
      xAxis: {
        type: 'category',
        data:userDate.xAxis.map(function (item01: string | number | null,index01: number) {
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
      },
      yAxis: {
        type: 'value',
        axisLine:{
          show:false
        },
        axisTick:{
          show:false
        },
        splitLine:{
          lineStyle:{
            color:"#f0f0f0"
          }
        },
        axisLabel:{
          fontSize:fontSize*1.48
        }
      },
      dataZoom:ifZoom? [{
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        left: '9%',
        bottom: -5,
        start: 10,
        end: 90 // 初始化滚动条
      }]:[],
      series
    };


    if(data.xAxis.length>showNum){
      chartsIntervalIds.push({
        moduleId,
        chartsItem:setInterval(function (){
          dataObjact=calculteArray(dataObjact);
          userDate=getChartsCurrentData(dataObjact,showNum)
          option.xAxis.data=userDate.xAxis;
          if(Array.isArray(userDate.series[0])){
            userDate.series.map((item: any,idx: number)=>{
              option.series[idx].data=item;
            })
          }else {
            option.series[0].data=userDate.series;
          }
          lineChart.setOption(option,true);
        }, 5000)
      });
    }
    lineChart.setOption(option)
  }



  return (
    <ContentBox className={className || ""} ref={dom=>{
      setLineChartsDom(dom);
    }}>

    </ContentBox>
  );
};

export default LineCharts;
