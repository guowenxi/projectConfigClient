import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import styles from './index.less';
import {Button, Icon, message, Select, Spin, Table, Upload} from 'antd';

import {Map, Marker} from 'react-amap';


import bt_close from "@/assets/imgs/bt_close.png";
import {connect} from "dva";


import { G } from "@/global"

const {rootUrl } = G;

class RightDetailBox extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      editState:"edit",
    };
  }

  componentWillReceiveProps(props) {
    
  }

  componentDidMount() {

  }


  closeDetail() {
    this.props.dispatch({
      type: 'common/save',
      payload: {
        rightDetailBoxState: false
      },
    })
    this.props.closeDetail && this.props.closeDetail()
  }

  render() {
    return (
      <div className={styles.wrapBox}>
        {/* <img onClick={this.closeDetail.bind(this)} className={styles.closeBtn} src={bt_close}/> */}
        {/* <ul className={styles.titleBar}>
          {
            list.map((item,idx) => {
              return <li key={idx} className={item.name == checkTitleIte ? styles['check'] : ''}
                         onClick={this.checkTitle.bind(this, item.name)}>{item.name}</li>
            })
          }
        </ul> */}
        {/* <div onClick={this.changeEdit.bind(this,'default')}>default</div>
        <div onClick={this.changeEdit.bind(this,'edit')}>edit</div>
        <div onClick={this.changeEdit.bind(this,'disabled')}>disabled</div> */}

        {
          this.props.children
        }

      </div>
    );
  }
}

export default connect(({common}) => ({
  common
}))(RightDetailBox);
