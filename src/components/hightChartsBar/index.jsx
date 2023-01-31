import React, {Component} from 'react';
import classNames from 'classnames';

import styles from './index.less';

import Highcharts from 'highcharts/highstock';
import Highcharts3D from 'highcharts/highcharts-3d';

Highcharts3D(Highcharts);

const data = {
	"success":1,
	"errorCode":null,
	"message":"",
	"data":{
		"seies":[
			[
				0,
				52,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			],
			[
				0,
				6,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			],
			[
				0,
				16,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			],
			[
				0,
				16,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			],
			[
				0,
				16,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			]
		],
		"legends":[
			"分享数",
			"隐患上报数",
			"隐患上报2数",
			"隐患上报3数",
			"微填表数"
		],
		"xAxis":[
			"三垟街道",
			"丽岙街道",
			"仙岩街道",
			"南白象街道",
			"娄桥街道",
			"新桥街道",
			"景山街道",
			"梧田街道",
			"泽雅镇",
			"潘桥街道",
			"瓯海经济开发区",
			"瞿溪街道",
			"茶山街道",
			"郭溪街道"
		]
	}
}
export default class HightCharts extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }


  componentDidMount() {
   this.setOption(data.data);
  }

  componentWillUnmount() {

  }

  setOption(data){
    const _data = [];
    const color_0 = ["#58252d","#96581f","#7d6213","#053468","#26611f"];
    const color = ["#db4f50","#dc9d2c","#dac60f","#064e88","#1e9b29"];

        // 初始化设置颜色
    data.legends.map(function(item,idx){
      _data.push({
        color:{
          linearGradient: { x1: 0, y1: 1, x2: 0, y2: 0 },
          stops: [
            [0,color_0[idx]],
            [1, color[idx]]
         ],
        },
        name:data.legends[idx],
        data:data.seies[idx],
      })
    })
    
    const chart = new Highcharts.Chart(this.props.id,{
      legend:{
        enabled:false,
      },
      title:"",
      credits: {
        enabled: false
	  },
	  tooltip:{

	  },
      chart: {
        renderTo: 'container',
        type: 'column',
        options3d: {
          enabled: true,
          // 内旋转角
          alpha: 0,
          // 外旋转角
          beta: 0,
          // 深度
          depth: 50,
          viewDistance: 25
        }
      },
      plotOptions: {
        column: {
          depth: 55
        },
        series: {
          stacking: 'normal'
        }
      },
      xAxis: {
		labels:{
			style:{
				color:'#0B85B5',
				opacity:'0.8'
			}
		},
        gridLineColor:"rgba(255,255,255,0.1)",
        categories: data.xAxis
      },
      yAxis: {
		labels:{
			style:{
				color:'#0B85B5',
				opacity:'0.8'
			}
		},
		lineColor:"#6CAABE",
		lineWidth:1,
		gridLineColor:"rgba(255,255,255,0.1)",
        min: 0,
        title: {
          text: ''
        }
      },
      series: _data
    });
  }


  render() {
    return (
      <div className={this.props.className} >
        <div className={styles.charts} id={this.props.id} ></div>
      </div>
    );
  }
}

