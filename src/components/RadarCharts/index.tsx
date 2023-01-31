import React, { useState, useEffect,useMemo } from 'react';
import styled from 'styled-components';

import eachrts from "echarts";

import { getFontSize,dealItemColorList,dealAreaColorList  } from '@/utils/utils';




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
}








const RadarCharts: React.FC<props> = (props: any) => {

  const {data,className,title} = props;

  const [lineChartsDom,setLineChartsDom]=useState();

  const [chartsData,setChartsData]=useState({})




  useMemo(() => {

  }, []);

  useEffect(() => {
    if(data!=chartsData&&data&&lineChartsDom){
      setChartsData(data);
      drawCharts();
    }
  }, [lineChartsDom])




  const  drawCharts=()=>{
    if(!lineChartsDom){
      return
    }
    const fontSize=getFontSize();
    const lineChart=eachrts.getInstanceByDom(lineChartsDom) || eachrts.init(lineChartsDom);
    const series: (string | number)[]=[];
    if(Array.isArray(data.legends)&&data.legends.length){
      data.legends.map(function (item01: any,index01: number) {
        series.push({
          name:item01,
          type: 'radar',
          data: data.series[index01],
        })
      })
    }else {
      series.push({
        type: 'radar',
        data: data.series,
      })
    }
    const option = {
      title:{
        text:title,
        textStyle:{
          fontSize:fontSize*2,
          color:"#50576a",
          fontWeight:"normal"
        }
      },
      tooltip:{
        trigger:"axis",
        // formatter:Array.isArray(data.series[0])?function (params:Array<any>) {
        //   let  htmlStr="";

        //   for(var i=0;i<params.length;i++) {
        //     var param = params[i];
        //     var xName = param.name;//x轴的名称
        //     var value = param.value;//y轴值
        //     if(i==0){
        //       htmlStr=htmlStr+xName+"<br/>";
        //     }
        //     htmlStr=htmlStr+param.seriesName.split(' ')[0]+' '+value+'<br/>'
        //   }

        //   return htmlStr;
        // }:`{c}`
      },
      legend:{
        show:!!data.legends,
        data:data.legends?data.legends:null,
        left:"right",
        textStyle:{
          fontSize:fontSize*2,
        },
      },
      grid: {
        left: '3%',
        right: '5%',
        bottom: fontSize,
        containLabel: true,
        top:fontSize*6.4,
      },
      radar:{
        indicator:data.xAxis.map((item01: string | number,index01: number)=>{
          return {
            name:item01,
          }
        }),
        shape: 'circle',
        splitNumber: 5,
        name: {
            textStyle: {
                // color: 'rgb(238, 197, 102)'
            }
        },
        splitLine: {
            lineStyle: {
                // color: [
                //     'rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)',
                //     'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)',
                //     'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'
                // ].reverse()
            }
        },
        splitArea: {
            show: false
        },
        axisLine: {
            lineStyle: {
                // color: 'rgba(238, 197, 102, 0.5)'
            }
        }
      },
      series
    };
    lineChart.setOption(option)
  }



  return (
    <ContentBox className={className || ""} ref={dom=>{
      setLineChartsDom(dom);
    }}>

    </ContentBox>
  );
};

export default RadarCharts;
