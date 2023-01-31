import React from 'react';
import { useState } from 'react';
import { Timeline as ATimeline } from 'antd';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';

export const WrapBox = styled.div`
  margin: 1.85vh 0;
  height:100%;
  box-shadow: ${(props) => (props.border ? `0 0 0 1px #ccc` : `0`)};

  .merge-title-tbale-box {
    width: 100%;
    border: 1px solid #ccc;
    height: 100%;
    // display: flex;
    // flex-flow: column;
    .merge-title-tbale-title-box {
      display: flex;
      // height: 60px;
      height: 7vh;
      box-shadow: 0 1px 1px #ccc;:1px solid #ccc;
    }
    .column-item {
      white-space: nowrap;
      padding: 0 5px;
      display: flex;
      align-items: center;
      box-shadow: 1px 0 1px #ccc;
      width: 50px;
      justify-content:center;
    }
    .title-width-line {
      width: 140px;
      height: 100%;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      position: relative;
      box-shadow: 1px 0 1px #ccc;
      overflow: hidden;
      padding: 0 5px;
      .line-item {
        border: 1px solid #ccc;
        position: absolute;
        width: 200px;
        height: 80px;
        transform-origin: 200px 80px;
        right: 0;
        bottom: 0;
      }
      .line-item-01 {
        transform: rotate(37deg);
      }
      .line-item-02 {
        transform: rotate(12deg);
      }
      .title-width-text {
        flex: 1;
      }
      .title-width-text-01 {
        position: absolute;
        bottom: 0;
        left: 10px;
      }
      .title-width-text-02 {
        position: absolute;
        top: 15px;
        left: 40px;
      }
      .title-width-text-03 {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
    .column-more-item {
      display: flex;
      flex-flow: column;
      // flex: 1;
      width:120px;
      padding: 0 5px;
      box-shadow: 1px 0 1px #ccc;
      justify-content: center;
      &::last-child {
        border: none;
      }
    }
    .row-big-text {
      font-size: 18px;
      white-space: nowrap;
      text-align: center;
    }
    .row-one-box {
      display: flex;
      justify-content:space-between;
      margin: 0;
      padding: 0;
      .row-one-item {
        margin-right: 0.5vw;
        white-space: nowrap;
        font-size: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .merge-title-tbale-title-main {
      display: flex;
      width: 100%;
      background-color: #343957;
    color: #fff;
    }
  }

  .merge-title-tbale-main-box {
    flex:1;
    display: flex;
    flex-flow: column;
    .merge-title-tbale-item {
      display: flex;
      /* border-top: 1px solid #ccc; */
      box-shadow: 0 1px 1px #ccc;:1px solid #ccc;
    }
    .text-with-line {
      width: 140px;
      padding: 0 5px;
      box-shadow: 1px 0 1px #ccc;
    }
    .table-item-text {
      // flex: 1;
      width:120px;
      padding: 0 5px;
      display: flex;
      box-shadow: 1px 0 1px #ccc;
      align-items: center;
      justify-content: center;
      .left-text {
        margin-right: 0.5vw;
        box-shadow: 1px 0 1px #ccc;
      }
      .left-text,
      .right-text {
        flex: 1;
        margin:0;
        align-items: center;
        display: flex;
        justify-content: center;
        height:100%;
      }
    }
    .table-item-text-column {
      width: 50px;
      padding: 0 5px;
      box-shadow: 1px 0 1px #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .big-text {
      width: 190px;
      text-align: center;
      box-shadow: 1px 0 1px #ccc;
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const ScrollTableBox = styled(Scrollbars) <{ minHeight?: string; itemWidth?: string }>`
  box-shadow: 0 1px 1px #ccc;
  .merge-title-tbale-item {
    &:last-child {
      /* box-shadow:none; */
    }
  }
`;

interface Props {
  list: any;
  onClick: Function;
}
const MergeTitleTbale: React.FC<Props> = (props) => {
  const { titleList, listData } = props;




  const settlementList = [
    { name: '事件总数', key: 'totalNum' },
    { name: 'SGI指数', key: 'sgiScore' },
    { name: '预警等级', key: 'warningLevel' },
  ];

  return (
    <WrapBox style={{ overflow: 'auto' }}>
      <table className="merge-title-tbale-box">
        <thead className="merge-title-tbale-title-box">
          <tr className="merge-title-tbale-title-main">
            <th className="column-item">等级</th>
            <th className="title-width-line">
              <span className="title-width-text title-width-text-01">指标</span>
              <div className="line-item line-item-01"></div>
              <span className="title-width-text title-width-text-02">事件数</span>
              <div className="line-item line-item-02"></div>
              <span className="title-width-text title-width-text-03">街道</span>
            </th>
            {Array.isArray(titleList)
              ? titleList.map((item: any, index: number) => {
                return (
                  <th className="column-more-item">
                    <div className="row-big-text">{item.name}</div>
                    <ul className="row-one-box" >
                      <li className="row-one-item">事件数</li>
                      <li className="row-one-item">处置数</li>
                    </ul>
                  </th>
                );
              })
              : null}
          </tr>
        </thead>
        <tbody className="merge-title-tbale-main-box">
          <ScrollTableBox style={{ height: '50vh' }}>
            {Array.isArray(listData)
              ? listData.map((item01: any, index01: number) => {
                return (
                  <tr className="merge-title-tbale-item" key={index01.toString()}>
                    <td className="table-item-text-column">{item01.level}</td>
                    <td className="text-with-line">{item01.sgiTypeName}</td>
                    {Array.isArray(titleList)
                      ? titleList.map((item02: any, index02: number) => {
                        return (
                          <td className="table-item-text" key={index02.toString()}>
                            <div className="left-text">
                              {item01[item02.name] ? item01[item02.name].eventNum : 0}
                            </div>
                            <div className="right-text">
                              {item01[item02.name].handleNum ? item01[item02.name].handleNum : 0}
                            </div>
                          </td>
                        );
                      })
                      : null}
                  </tr>
                );
              })
              : null}
          </ScrollTableBox>

          {Array.isArray(settlementList)
            ? settlementList.map((item01: any, index01: number) => {
              return (
                <tr className="merge-title-tbale-item" key={index01.toString()}>
                  <td className="big-text">{item01.name}</td>
                  {Array.isArray(titleList)
                    ? titleList.map((item02: any, index02: number) => {
                      return <td className="table-item-text" key={index02.toString()}>{item02[item01.key]}</td>;
                    })
                    : null}
                </tr>
              );
            })
            : null}
        </tbody>
      </table>
    </WrapBox>
  );
};

export default MergeTitleTbale;
