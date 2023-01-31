import React, {useEffect, useState} from "react";
import {connect} from "dva";
import {PaginatedParams} from "ahooks/lib/useAntdTable/";
import {useAntdTable} from "ahooks";

import {Table, Space, Drawer, Form} from "antd";

const {Column} = Table;

import columns from './columns';
import TABLEJSON from './TABLEJSON.tsx';
import TableInfo from '@/components/TableInfo/TableInfo';
import SearchMore from "@/components/SearchMore/SearchMore";

const Test = (props: any) => {
    const {dispatch} = props;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [DETAIL, setDETAIL] = useState({}); /* 表格详情 */

    // 获取对应的TABLEJSON
    const getTABLEJSON = (idx: number) => {
        return TABLEJSON(DETAIL)[idx];
    };

    // 列表加载数据的方法
    //---------------
    const getTableData = (
        {current, pageSize}: PaginatedParams[0],
        formData: Object,
    ): Promise<any> => {
        return new Promise((resolve) => {
            dispatch({
                type: 'common/getRequestData',
                method: 'GET',
                url: columns.url,
                payload: {
                    pageNo: current,
                    pageSize,
                    'rbacToken': '6efbaa2291424d3287ef550a9b855dc1',
                    ...formData
                },
                callback: (res: any) => {
                    let list = res.data.data;
                    console.log('test2 ',res)
                    let total = res.data.total;
                    resolve({
                        list: list,
                        total: total,
                    });
                },
            });
        });
    };
    const {tableProps, search} = useAntdTable(getTableData, {
        defaultPageSize: 10,
        form
    });
    const {submit, reset} = search;
    return (<div>
        <SearchMore
            type={columns.searchListType}
            form={form}
            searchList={columns.searchList}
            submit={submit}
            reset={reset}
        ></SearchMore>

        <Table
            rowKey="id"
            scroll={{x: 1600}}
            {...tableProps}
        >
            {columns.tableColumns
                ? columns.tableColumns(props, tableProps).map((i: any, idx: number) => {
                    return (
                        <Column
                            key={idx}
                            {...i}
                            onCell={(): any => ({width: i.width})}
                            onHeaderCell={(): any => ({width: i.width})}
                        ></Column>
                    );
                })
                : null}
            {columns.operation && !!columns.operation.length ? (
                <Column
                    title="操作"
                    width={'10%'}
                    align="center"
                    fixed='right'
                    render={(text: any, record: any) => {
                        return (
                            <Space>
                                {!!columns.operation.length &&
                                columns.operation.map((item: any, idx: number) => {
                                    return (
                                        <a
                                            key={idx}
                                            onClick={() => {
                                                console.log(record);
                                                setDETAIL(record)
                                                setVisible(true)
                                            }}
                                        >
                                            {item.name}
                                        </a>
                                    );
                                })}
                            </Space>
                        );
                    }}
                ></Column>
            ) : null}
        </Table>

        <Drawer title="Basic Drawer" placement="right" onClose={() => {
            setVisible(false)
        }} visible={visible} width={'56vw'}>

            <div style={{height: '80vh', display: 'flex'}}>
                <TableInfo
                    border="true"
                    height="50vh"
                    data={getTABLEJSON(0)}
                    detail={DETAIL}
                    state={'disabled'}
                ></TableInfo>
            </div>
        </Drawer>

    </div>);
};

export default connect(({common, select}) => ({
    common,
    select
}))(Test);
