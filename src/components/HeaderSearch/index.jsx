import {AutoComplete, Icon, Input, Select, DatePicker, LocaleProvider, Button} from 'antd';
import moment from 'moment'
import zhCn from 'antd/es/date-picker/locale/zh_CN';

// import zh_CN from 'antd/lib/locale-provider/zh_CN';
// import '@/node_modules/moment/locale/zh-cn'

// moment.locale('zh-cn')
import React, {Component} from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import styles from './index.less';
import {connect} from "dva/index";

const {Option} = Select;
const {RangePicker} = DatePicker;

class HeaderSearch extends Component {
  static defaultProps = {
    defaultActiveFirstOption: false,
    onPressEnter: () => {
    },
    onSearch: () => {
    },
    onChange: () => {
    },
    className: '',
    placeholder: '',
    dataSource: [],
    defaultOpen: false,
    onVisibleChange: () => {
    },
  };

  static getDerivedStateFromProps(props) {
    if ('open' in props) {
      return {
        searchMode: props.open,
      };
    }

    return null;
  }

  timeout = undefined;
  inputRef = null;

  constructor(props) {
    super(props);
    this.state = {
      searchMode: props.defaultOpen,
      keyword: "",
      centerId: undefined,
      dealTypeId: undefined,
      beginDate: "",
      endDate: "",
      peopleName: "",// 来访人姓名
      cardId: "",// 身份证号
      phone: "",// 联系电话
      title: "",// 受理编号
      handleStatus: undefined,// 事件状态(处理中=1,  已办结=2)
      getTypeListByPIdList: [],
      centrelList: [],
      searchMoreStatus: 'less',// 展开搜索装填 less/more
    };
  }


  componentDidMount() {
    return ;
    if (this.props.nolimit) {
      this.props.dispatch({
        type: 'select/getCentrelList',
        payload: {},
      }).then(() => {
        const {getCentrelList} = this.props.select;
        this.setState({centrelList: getCentrelList})
      });
      return
    }
    const {userInfo} = this.props.reception;
    if (userInfo.id) {
      this.getCentrelList(userInfo);
    } else {
      this.props.dispatch({
        type: 'reception/getUserByToken',
        payload: {},
      }).then(() => {
        const {userInfo} = this.props.reception;
        this.getCentrelList(userInfo);
      })
    }

    console.log(this.props);
  }

  componentWillUnmount() {

  }


  /* 中心列表数据 */
  getCentrelList = (v) => {
    if (v.id == 1) {
      this.props.dispatch({
        type: 'select/getCentrelList',
        payload: {},
      }).then(() => {
        const {getCentrelList} = this.props.select;
        this.setState({centrelList: getCentrelList})
      })
    } else {
      this.props.dispatch({
        type: 'select/getCentrelAndTypeList',
        payload: {},
      }).then(() => {
        const {getCentrelList} = this.props.select;
        this.setState({
          centerId: getCentrelList[0].id, centrelList: getCentrelList || [],
          getTypeListByPIdList: getCentrelList[0].typeList
        })

      });
    }
  }

  /* 窗口数据 */
  getTypeListByPId = () => {
    const that = this;
    if (!that.state.centerId) {
      that.setState({
        getTypeListByPIdList: [],
      })
      return;
    }
    that.props.dispatch({
      type: 'select/getTypeListByPId',
      payload: {
        platformId: that.state.centerId
      },
    }).then(() => {
      that.setState({
        getTypeListByPIdList: that.props.select.getTypeListByPIdList,
      })
    });
  }

  /* 选择条件 */

  selectChange = (type, value, _) => {
    if (type === 'centerId') {
      this.setState({
        [type]: value,
        dealTypeId: undefined
      }, () => {
        this.getTypeListByPId();
        this.props.getData && this.props.getData(this.realTimeSearchData())
      })
    } else {
      this.setState({
        [type]: value
      }, () => {
        this.props.getData && this.props.getData(this.realTimeSearchData())
      })
    }
  }

  handleSearch = (value) => {
    const {getCentrelList} = this.props.select;
    const arr = [];
    const reg = new RegExp(value)
    if (value) {
      getCentrelList.map((item, idx) => {
        if (item.dealName.match(reg)) {
          arr.push(item)
        }
      })
      this.setState({
        centrelList: arr
      })
    } else {
      this.setState({
        centrelList: getCentrelList
      })
    }
  };

  timeChange = (type, v, dateString) => {
    this.setState({
      [type]: dateString
    }, () => {
      this.props.getData && this.props.getData(this.realTimeSearchData())
    })
  }
  search = () => {
    this.props.search(this.realTimeSearchData())
  }
  reset = () => {
    const {userInfo} = this.props.reception;
    let centerId
    if (userInfo.id != 1 && !this.props.nolimit) {
      centerId = this.state.centerId
    }
    console.log(centerId);
    this.setState({
      keyword: "",
      centerId,
      dealTypeId: undefined,
      beginDate: "",
      endDate: "",
      peopleName: "",
      cardId: "",
      phone: "",// 联系电话
      title: "",// 受理编号
      handleStatus: undefined,// 事件状态(处理中=1,  已办结=2)
    }, () => {
      this.props.reset({
        keyword: "",
        centerId,
        dealTypeId: undefined,
        beginDate: "",
        endDate: "",
        peopleName: "",
        cardId: "",
        phone: "",// 联系电话
        title: "",// 受理编号
        handleStatus: undefined,
      })
      this.getTypeListByPId();
    })

  }

  // 返回实时的搜索条件，务必在setState回调中使用
  realTimeSearchData() {
    const {keyword, beginDate, endDate, dealTypeId, centerId, peopleName, cardId, phone, title, handleStatus} = this.state;
    return {
      keyword: keyword,
      centerId,
      dealTypeId,
      beginDate,
      endDate,
      peopleName,
      cardId,
      phone,
      title,
      handleStatus,
      // 这里兼容以前的代码，页面导出的参数取的值不一样；
      dealType: dealTypeId,
      startDate: beginDate,
    }
  }

// 显示更多筛选项
  changeShowMore(status) {
    this.setState({
      searchMoreStatus: status
    })
  }

// input通用change事件
  inputChange = (type, e) => {
    this.setState({
      [type]: e.target.value
    }, () => {
      this.props.getData && this.props.getData(this.realTimeSearchData())
    });
  }

  render() {
    const {className, placeholder, open, ...restProps} = this.props;
    const {searchMode, centerId, keyword, peopleName, cardId, phone, beginDate, dealTypeId, endDate, getTypeListByPIdList, centrelList, title, handleStatus} = this.state;
    // const {getCentrelList}=this.props.select;
    const {searchMoreStatus} = this.state;
    const inputClass = classNames(styles.input, {
      [styles.show]: searchMode,
    });
    return (
      <div
        className={classNames(className, styles.headerSearch)}
        // onClick={this.enterSearchMode}
        // onTransitionEnd={({ propertyName }) => {
        //   if (propertyName === 'width' && !searchMode) {
        //     const { onVisibleChange } = this.props;
        //     onVisibleChange(searchMode);
        //   }
        // }}
      >
        <div className={styles.searchPart}>
          <div className={styles.searchItemWrap}>
            <span className={styles.itemTitle}>来访人姓名</span>
            <Input className={styles.itemSearch}
                   placeholder='请输入来访人姓名'
                   value={peopleName}
                   allowClear
                   onChange={this.inputChange.bind(this, 'peopleName')}></Input>
          </div>
          <div className={styles.searchItemWrap}>
            <span className={styles.itemTitle}>身份证号</span>
            <Input className={styles.itemSearch}
                   placeholder='请输入身份证号'
                   value={cardId}
                   allowClear
                   onChange={this.inputChange.bind(this, 'cardId')}></Input>
          </div>
          <div className={styles.searchItemWrap}>
            <span className={styles.itemTitle}>联系电话</span>
            <Input className={styles.itemSearch}
                   placeholder='请输入联系电话'
                   value={phone}
                   allowClear
                   onChange={this.inputChange.bind(this, 'phone')}></Input>
          </div>
          <div className={styles.searchItemWrap}>
            <span className={styles.itemTitle}>受理中心</span>
            <Select
              showSearch
              allowClear
              value={centerId}
              placeholder="请选择事发街道/中心"
              className={styles.itemSearch}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleSearch.bind(this)}
              onChange={this.selectChange.bind(this, 'centerId')}
              notFoundContent={null}
            >
              {
                centrelList && centrelList.map((item, idx) => {
                  return <Option key={idx.toString()} value={item.id}>{item.dealName}</Option>
                })
              }
            </Select>
          </div>
          {searchMoreStatus === 'less' && <div className={styles.searchMore_less}>
            <span className={styles.searchMoreText}
                  onClick={this.changeShowMore.bind(this, 'more')}>更多搜索</span>
          </div>}
          {searchMoreStatus === 'more' &&
          <>
            <div className={styles.searchItemWrap}>
              <span className={styles.itemTitle}>受理业务</span>
              <Select value={dealTypeId}
                      allowClear
                      placeholder="请选择受理业务"
                      onChange={this.selectChange.bind(this, 'dealTypeId')}
                      className={styles.itemSearch}>
                {
                  getTypeListByPIdList ? getTypeListByPIdList.map((item, idx) => {
                    return <Option key={idx.toString()} value={item.id}>{item.name}</Option>
                  }) : ""
                }
              </Select>
            </div>
            <div className={styles.searchItemWrap}>
              <span className={styles.itemTitle}>开始日期</span>
              <DatePicker locale={zhCn} value={beginDate ? moment(beginDate) : ''}
                          className={styles.itemSearch}
                          onChange={this.timeChange.bind(this, 'beginDate')}/>
            </div>
            <div className={styles.searchItemWrap}>
              <span className={styles.itemTitle}>结束日期</span>
              <DatePicker locale={zhCn} value={endDate ? moment(endDate) : ''}
                          className={styles.itemSearch}
                          onChange={this.timeChange.bind(this, 'endDate')}/>
            </div>
            <div className={styles.searchItemWrap}>
              <span className={styles.itemTitle}>受理编号</span>
              <Input className={styles.itemSearch}
                     placeholder='请输入受理编号'
                     value={title}
                     allowClear
                     onChange={this.inputChange.bind(this, 'title')}></Input>
            </div>
            {/* <div className={styles.searchItemWrap}>
              <span className={styles.itemTitle}>事件状态</span>
              <Select value={handleStatus}
                      placeholder="请选择事件状态"
                      allowClear
                      onChange={this.selectChange.bind(this, 'handleStatus')}
                      className={styles.itemSearch}>
                <Option key={1} value={1}>处理中</Option>
                <Option key={2} value={2}>已办结</Option>
              </Select>
            </div> */}
          </>
          }
          {searchMoreStatus === 'more' && <div className={styles.searchMore_more}>
            <span className={styles.searchMoreText}
                  onClick={this.changeShowMore.bind(this, 'less')}>收起</span>
          </div>}
        </div>

        <div className={styles.btnPart}>
          <Button className={styles.searchBtn} type='primary' onClick={this.search}>搜索</Button>
          <Button className={styles.resetBtn} onClick={this.reset}>重置</Button>
        </div>
      </div>
    );
  }
}

export default connect(({common, select, reception}) => ({
  common, select, reception
}))(HeaderSearch);
