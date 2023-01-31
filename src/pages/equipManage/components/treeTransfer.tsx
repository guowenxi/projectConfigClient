import { connect } from "dva";
import React, { useEffect, useRef, useState } from "react";

import { Transfer, Tree } from 'antd';
import type { TransferDirection, TransferItem } from 'antd/es/transfer';
import Search from "antd/lib/transfer/search";

interface TreeTransferProps {
  dataSource: any[];
  getAllPointListMeth: any
  targetKeys: string[];
  setTargetKeys: any,
  onChange: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
}

// Customize Table Transfer
const isChecked = (selectedKeys: (string | number)[], eventKey: string | number) =>
  selectedKeys.includes(eventKey);

// 转化为key 和 value
const generateTree = (treeNodes: any[] = [], checkedKeys: string[] = [], fatherName?: any): any[] => {
  return treeNodes.map(({ pointList, ...props }) => {
    let key = props['id']
    let title = !!fatherName ? fatherName + '-' + props['name'] : props['name']
    return {
      key,
      title,
      disabled: checkedKeys.includes(props.key as string),
      children: generateTree(pointList, checkedKeys, title),
    }
  }
  );
}


const TreeTransfer = ({ dataSource, targetKeys, setTargetKeys, getAllPointListMeth, ...restProps }: TreeTransferProps) => {

  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [transferDataSource, set_transferDataSource] = useState<any>([])

  const flatten = (list: any[] = []) => {
    let dataList: any = []
    list.map((res1, idx1) => {
      if (!(!!res1.children)) {
        dataList.push(res1 as TransferItem);
      } else {
        res1.children.map((res2: any, idx2: any) => {
          dataList.push(res2 as TransferItem);
        })
      }
    })
    if (transferDataSource.length == 0) {
      set_transferDataSource(dataList)
    }
  }

  useEffect(() => {
    flatten(generateTree(dataSource))
  }, [dataSource])


  return (
    <Transfer
      {...restProps}
      onScroll={() => { }}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={(item) => item.title!}
      // showSearch
      // onSearch={(e1, e2) => {
      //   if (e1 == 'left') {
      //     getAllPointListMeth(e2)
      //   }
      // }}
      oneWay={true}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <>
              <div style={{ padding: '8px 5px' }}>
                <Search
                  onChange={(e1: any) => {
                    getAllPointListMeth(e1.currentTarget.value)
                    // flatten(generateTree(dataSource))
                  }}
                ></Search>
              </div>
              <div style={{ overflowY: 'auto', maxHeight: '40vh', margin: '0px 8px 0px 0px' }}>
                <Tree
                  blockNode
                  checkable
                  // checkStrictly
                  // defaultExpandAll
                  autoExpandParent={autoExpandParent}
                  checkedKeys={checkedKeys}
                  treeData={generateTree(dataSource, targetKeys)}
                  onCheck={(e1, e2: any) => {
                    const { node } = e2
                    if (node.children.length != 0) {
                      let newArry: any = []
                      node.children.map((res: any, idx: any) => {
                        if (!isChecked(checkedKeys, res?.key)) {
                          newArry.push(res?.key)
                        }
                        // onItemSelect(res?.key, !isChecked(checkedKeys, res?.key));
                      })
                      setTargetKeys([...targetKeys, ...newArry])
                    } else {
                      onItemSelect(node?.key, !isChecked(checkedKeys, node?.key));
                    }
                  }}
                  onSelect={(_, { node: { key } }) => {
                    onItemSelect(key as string, !isChecked(checkedKeys, key));
                  }}
                />
              </div>
            </>
          );
        }
      }}
    </Transfer>
  );
};

export default connect(({ common, select }) => ({
  common,
  select
}))(TreeTransfer);