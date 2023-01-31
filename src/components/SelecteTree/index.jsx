import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { Button, Icon, Spin, Table, Divider, Tree, Drawer, Modal } from 'antd';


import TreeBox from "../TreeDetailBox/TreeBox";
import TreeSelectBox from "../TreeDetailBox/TreeSelectBox";
import BtnTreeTableModelBox from '@/components/BtnTreeTableModelBox/index'


import { connect } from "dva";




class SelecteTree extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
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
      selectIndexList: [],/* 选中的数据 */
      treelistData: [
        {
          name: 'parent 1',
          id: '0-0',
          children: [
            {
              name: 'parent 1-1',
              id: '0-0-0',
            },
            {
              name: 'parent 1-2',
              id: '0-0-1',
            },
          ],
        },
      ],/* 树形数据 */
      visible: false

    };
  }

  componentDidMount() {

  }
  closeDetail() {
    this.props.dispatch({
      type: 'common/close',
      payload: {
      },
    })
  }


  /* 打开弹框 */
  openTreeModel = () => {
    this.setState({
      visible: true
    })
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

  render() {
    const { columns } = this.state;

    const { TableDetailsBoxState } = this.props.common;

    const { list, total, pagination } = this.state;
    pagination.total = total;

    const rowSelection = {
      selectedRowKeys: this.state.selectIndexList,
      onChange: this.onSelectChange,
    }

    return (
      <div className={styles['btn-tree-table-box']}>
        <div className='bottomBox'>
          <Button className='marginBtn' onClick={this.openTreeModel.bind(this)} type="primary">添加</Button>
        </div>

        <div className={styles['modal-box']}>
          <Drawer visible={this.state.visible} width={"53.23vw"} className={['modal-main']} getContainer={false} style={{ position: 'absolute' }}  >
            <BtnTreeTableModelBox treelistData={this.state.treelistData}></BtnTreeTableModelBox>
          </Drawer>
        </div>



      </div>
    );
  }
}
export default connect(({ common, list, tableDetails }) => ({
  common, list, tableDetails
}))(SelecteTree);
