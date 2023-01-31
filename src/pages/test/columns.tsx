import React from "react";

const columns = {
    "url": "/fyHome/dws-ppl-particular-baseinfo/selectDwsPplParticularBaseinfoPage",
    "params": {},
    "checkBox": false,
    "operation": [
        // {"name": "修改", "type": "disabled", "drawerWidth": "50"},
        {"name": "详情", "type": "disabled", "drawerWidth": "50"},
        // {"name": "删除", "type": "disabled", "drawerWidth": "50"},
    ],
    "searchListType": "multipleQuery",
    "searchList": [
        {"title": "姓名", "type": "input", "key": "name", "placeholder": "请输入姓名"},
        {"title": "身份证号", "type": "input", "key": "cardId", "placeholder": "请输入身份证号"},
     ],
    "tableColumns": (props: any, tableProps: any, sorter: any) => {
        let current: number = tableProps.pagination.current;
        let pageSize: number = tableProps.pagination.pageSize;
        return [
            {
                title: '序号',
                dataIndex: 'a',
                key: 'a',
                align: 'center',
                width: '10%',
                render: (text: any, record: { eventTypes: string; }, index: any) => {
                    return (current - 1) * pageSize + (index + 1)
                },
                fixed: 'left',
            },
            {
                title: '姓名',
                key: 'name',
                dataIndex: 'name',
                width: "10%",
                align: 'center',
            },
            {
                title: '性别',
                key: 'sexValue',
                dataIndex: 'sexValue',
                width: "5%",
                align: 'center',
            },

            {
                title: '出生年月日',
                dataIndex: 'birthday',
                key: 'birthday',
                width: "10%",
                align: 'center',

                render: (text: any, record: { birthday: string; }, index: any) => {
                    if (record.birthday) {
                        return record.birthday.substring(0, 10)
                    } else {
                        return ""
                    }
                },
            },
            {
                title: '类别',
                key: 'category',
                dataIndex: 'category',
                width: "10%",
                align: 'center',

                render: (text: any, record: { birthday: string; }, index: any) => {
                    return record.categoryValue
                },
            },
            {
                title: '所属网格',
                key: 'orgGridValue',
                dataIndex: 'orgGridValue',
                className: 'no-flex',
                width: "10%",
                align: 'center',
            },
            {
                title: '参与时间',
                dataIndex: 'joinTime',
                key: 'joinTime',
                width: "10%",
                align: 'center',

                render: (text: any, record: { joinTime: string; }, index: any) => {
                    if (record.joinTime) {
                        return record.joinTime.substring(0, 10)
                    } else {
                        return ""
                    }
                },
            },
            {
                title: '关注程度',
                key: 'grade',
                dataIndex: 'grade',
                width: "10%",
                align: 'center',

                render: (text: any, record: any, index: any) => {
                    if (record.grade === 3) {
                        return (<span style={{color: '#DD1919'}}>{record.gradeValue}</span>)
                    }
                    if (record.grade === 2) {
                        return (<span style={{color: '#FFB045'}}>{record.gradeValue}</span>)
                    }
                    if (record.grade === 1) {
                        return (<span style={{color: '#61BEA5'}}>{record.gradeValue}</span>)
                    }
                }
            },
            {
                title: '最近更新时间',
                dataIndex: 'updateDate',
                key: 'updateDate',
                width: "10%",
                align: 'center',
                render: (text: any, record: { joinTime: string; }, index: any) => {
                    if (record.joinTime) {
                        return record.joinTime.substring(0, 10)
                    } else {
                        return ""
                    }
                },
            },
            {
                title: '信息完整度',
                key: 'informationIntegrity',
                dataIndex: 'informationIntegrity',
                width: "10%",
                align: 'center',

            },
        ];
    }
}
export default columns
