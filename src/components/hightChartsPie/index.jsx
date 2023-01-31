import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './index.less';

import dizuo_yuan from './dizuo_yuan.svg';
import guang from './guang.svg';
import Highcharts from 'highcharts/highstock';
import Highcharts3D from 'highcharts/highcharts-3d';

Highcharts3D(Highcharts);

const data ={
  "xAxis":[
    "答题总人数",
    "答题总人数",
    "答题总人数",
    "答题总数",
    "今日荣誉值最高"
  ],
  "series":[
    "2692",
    "2692",
    "2692",
    "3022",
    "1231"
  ]
}
const color_0=["#3afbed","#38f2ce","#0dd3b2","#04a5a5","#40c0ed","#2071d3","#0245a7"];
const color=["#3afbed","#38f2ce","#0dd3b2","#04a5a5","#40c0ed","#2071d3","#0245a7"];
export default class HightCharts extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }


  componentDidMount() {
   this.setOption(data);
  }

  componentWillUnmount() {

  }

  setOption(data){
    const _data = [];

    // 初始化设置颜色
    data.xAxis.map(function(item,idx){
      _data.push({
        name: item,
        y:Number(data.series[idx]),
        color:{
          linearGradient: { x1: 0, y1: 1, x2: 0, y2: 0 },
          stops: [
            [0,color_0[idx]],
            [1,color[idx]]
          ],
        },
      })
    })

    const chart = Highcharts.chart(this.props.id, {
      credits: {
        enabled: false
      },
      // legend:{
      //   layout:"horizontal",

      //   align:"left"
      // },
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 55,
          beta: 0
        }
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 45,
          // showInLegend: true,
          dataLabels: {
            enabled: false,
          }
        }
      },
      series: [{
        type: 'pie',
        name: '',
        data:_data
      }]
    });
  }


  render() {
    return (
      <div className={this.props.className} style={{display:'flex'}}>
        <div className={styles.charts} >
         <div className={styles.chartsInner} id={this.props.id} ></div>
         <div className={styles.bg}>
         <img className={styles.bgInner} src={dizuo_yuan}></img>
         </div>
         <img className={styles.guang} src={guang}></img>
         
        </div>

        <ul  className={styles.legend}>
          {
            data.xAxis.map((item,idx)=>{
              return <li className={styles.item}>
                <div className={styles.cir} style={{background:color[idx]}}></div>
                <div className={styles.text}>{`${item}`}</div>
                <div className={`${styles.text} ${styles.text2}`}>{`${data.series[idx]}`}</div>
              </li>
            })
          }

        </ul>
      </div>
    );
  }
}

