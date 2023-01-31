import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './index.less';
import {Button, Icon, Spin, Table,Divider,Tree} from 'antd';


import TreeBox from "../TreeDetailBox/TreeBox";
import TreeSelectBox from "../TreeDetailBox/TreeSelectBox";


import {connect} from "dva";
import bt_close from '@/assets/imgs/bt_close.png';



class BtnTreeTableModelBox extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      pagination: {
        total: 0,
        size: 'small',
        showQuickJumper: false,
        pageSize: 14,
        current: 1,
        showTotal: (total, range) => {
          return `共${total}条`
        },
        onChange: this.changPageSize.bind(this, 'pagination')
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
          render: (text, record,index) => (
            <span>{index+1}</span>
          ),
          onCell: () => {
            return { width: '30%' }
          },
          onHeaderCell: () => {
            return { width: '30%' }
          }
        },
        {
          title: '监控名称',
          dataIndex: 'name',
          onCell: () => {
            return { width: '60%' }
          },
          onHeaderCell: () => {
            return { width: '60%' }
          }
        },
      ],
      selectIndexList:[],
      list:[],
      total:0,
      selTreeListData:[],/* 选中的树节点id数组 */
      tableList:[],/* 表格数据 */
    };
  }

  componentDidMount() {

  }




  /* 切换页数 */
  changPageSize(type, page, pageSize) {
    this.state.pagination.current = page;
    this.setState({
      pagination: this.state.pagination
    }, () => {
      this.loadTableData();
    })
  }




  closeDetail(){

  }





/* 表格上的选择框事件 */
  onSelectChange=(selectedRowKeys)=>{
    this.setState({ selectIndexList:selectedRowKeys });
    const {list}=this.state;
    const   {selTableList} = this.props.common;
    let listArray=[];
    /* 先将所有选中的数据中该页表格的数据清空 */
    list.map((item01,index01)=>{
      if(selTableList.length){
        selTableList.map((item02,index02)=>{
          if(item01.id==item02.id){
            selTableList.splice(index02,1)
          }
        })
      }
    })
    /* 添加该页表格的选中数据 */
    if(selectedRowKeys.length){
      selectedRowKeys.map((item01,index01)=>{
        list.map((item02,index02)=>{
          if(item01==index02){
            listArray.push(item02)
          }
        })
      })
    }
    listArray=MergeArray(listArray,selTableList);
    this.props.dispatch({
      type: 'common/save',
      payload: {
        selTableList:listArray
      },
    })
  }



  /* 树形图选中 */
  onCheck=(data)=>{
    const {treelistData}=this.props;/* 树形图数据 */
    let tableList=[];
    tableList=this.dealTableData(treelistData,data.list,tableList)
    this.setState({
      selTreeListData:data.list,
      tableList
    })
  }

  /* 处理数据 */
  dealTableData=(data,selectData,tableList)=>{
    if(Array.isArray(selectData)){
      data.map((item01,index01)=>{
        selectData.map((item02,index02)=>{
          if(item01.id==item02){
            tableList.push(item01)
          }
        })
        if(item01.children){
          this.dealData(item01.children,selectData,tableList)
        }
      })
    }
    return tableList;
  }

  /* 处理数据 */
  dealData=(data,selectData,tableList)=>{
    this.dealTableData(data,selectData,tableList)
  }


  /* 关闭弹框 */
  cancel=()=>{

  }

  /* 保存数据 */
  saveData=()=>{

  }

  render() {
    const {columns} = this.state;

    const { TableDetailsBoxState } = this.props.common;

    const { tableList,total,pagination } = this.state;
    pagination.total=total;

    const rowSelection={
      selectedRowKeys:this.state.selectIndexList,
      onChange: this.onSelectChange,
    }

    return (
      // style={{'display':TreeDetailBoxState? 'block' :'none'}}
      <div >
        <div className={styles.BtnTreeTableModelBox}>
          <img onClick={this.closeDetail.bind(this)} className={styles.closeBtn} src={ bt_close} />
          <div className='goBackBtn' onClick={this.cancel.bind(this,'cancel')}><Icon type="arrow-left" />返回上一级</div>
          <div className={styles.content}>
            <div className={styles.treeBox}>
              <TreeBox data={this.props.treelistData} onCheck={this.onCheck} userListIds={this.state.selTreeListData} ></TreeBox>
            </div>

            <div className={styles.tableBox}>
              <Table columns={columns}
                     className={`${styles.table} ${'details-table-box'}`}
                     pagination={pagination}
                     dataSource={tableList}
                     rowSelection={rowSelection}
              />
            </div>
          </div>
          <div className='bottomBox'>
            <Button className='marginBtn' onClick={this.saveData.bind(this)} type="primary">确定</Button>
            <Button className='marginBtn' onClick={this.cancel.bind(this,'cancel')}>取消</Button>
          </div>
        </div>


      </div>
    );
  }
}
export default connect(({ common ,list,tableDetails}) => ({
  common,list,tableDetails
}))(BtnTreeTableModelBox);
