import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import {connect} from "dva";
import { Input as AInput, Modal, Button } from 'antd';
import type { Iconf} from '../TableInfo';
import { wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { EnvironmentFilled } from '@ant-design/icons';
import { Map } from 'react-amap';
import type { AProps } from '@/globalTyping';

import { Form } from 'antd';
import { G } from '@/global';

const { amapkey, mapCenter } = G;
const Minput = styled(AInput)`
  && {
    height: 100%;
    padding: 1vh;
  }
`;

const MapIcon = styled(EnvironmentFilled)`
  color: #ccc;
  cursor: pointer;
  position: absolute;
  right: 10px;
  font-size: 20px;
  top: 10px;
`;

interface IconfInput extends Iconf {
  /**
   * 输入框的默认值
   */
  defaultValue: string;
  /**
   * 所选区域的名称
   */
  areaName: any;
  /**
   * 默认输入框的提示文字
   */
  placeholder?: string;
  /**
   * 输入框的大小
   */
  size: "small" | "large" | "middle" | undefined;
}
interface MProps extends AProps {
  dispatch?: any;
  /**
   * 一些配置
   */
  conf: IconfInput;
  /**
   * 名称
   */
  name: string;
  /**
   * 是否必填
   */
  rules: any;
}

const AModal = styled(Modal)`
  && {
    width: 70vw !important;
    .ant-modal {
    }
  }
`;

const NButton = styled(Button)`
  margin: 0 1vh;
`;
const Wrapmap = styled.div`
  position: relative;
  width: 100%;
  height: 60vh;
`;
const MainMap = styled<any>(Map)`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
`;


const RowBox = styled(Form.Item)`
  .ant-form-item-control-input-content {
    display: flex;
  }
  .row-item {
    width: 100%;
    position: absolute;
  }
  .row-map-item {
    position: absolute;
    width: 100px;
    right: 0;
  }
`;

let map: any = {};
/**
 * 线段编辑对象
 */
let polyEditor: any;
/**
 * 选择区域时暂存数据的变量
 */
let ts_polygon: any;

const InputWithSelectArea = (props: MProps) => {
  const _ = props.conf;
  const theme = useContext(wrapContext);
  const {name} = props;
  const [savePolygonData, setSavePolygonData] = useState<any>(''); /* 保存的当前地点数据 */
  const [VISIBLE, setVISIBLE] = useState(false);
  const [mapPolygonEditState, setMapPolygonEditState] = useState('edit'); /* 线路编辑状态 */
  const [polyginList, setPolyginList] = useState([]); /* 保存的数据 */
  const [SENTER] = useState(mapCenter);
  const [, setgeocoder] = useState({});

  /* 确定地址选择 */
  const mapEvents = (status: string) => {
    return {
      created: (ins: any) => {
        // setmap(ins)
        map = ins;
        AMap.plugin('AMap.Geocoder', () => {
          setgeocoder(
            new AMap.Geocoder({
              city: '010', // 城市，默认：“全国”
            }),
          );
        });
        AMap.plugin('AMap.PolygonEditor', () => {
          polyEditor = new AMap.PolygonEditor(map);

          // 只在初始化的时候加载
          const pointsList = theme.form.getFieldValue([_.areaName]);
          const list: number[][] | any = [];
          if (Array.isArray(pointsList)) {
            pointsList.map((item01: any) => {
              list.push([Number(item01.x), Number(item01.y)]);
            });
          }
          let polygon = new AMap.Polygon({
            path: list,
          });
          map.clearMap();
          map.add(polygon);
          if (status != 'disabled') {
            if (status === 'edit') {
              ts_polygon = polygon;
              setSavePolygonData(polygon);
              polyEditor.setTarget(polygon);
            } else {
              polyEditor.setTarget();
            }
            polyEditor.open();
          } else {
            setSavePolygonData(polygon);
            ts_polygon = polygon;
          }
          
          polyEditor.on('add', function (data: { target: any; }) {
            console.log(data);
            polygon = data.target;
            polyEditor.addAdsorbPolygons(polygon);
            //  polygon.on('dblclick', (data) => {
            //   setMapPolygonEditState('edit')
            //   polyEditor.setTarget(data.target);
            //   polyEditor.open();
            // })
            // 暂存数据 在弹框点击确定的时候进行保存
            ts_polygon = polygon;
          });

        });
      },
      click: () => {},
    };
  };

  const selAddress = async (status: string) => {
    // const data = theme.form.getFieldsValue();
    setVISIBLE(true);
    setMapPolygonEditState('edit');
    if (savePolygonData) {
      map.add(savePolygonData);
    }
    if (status === 'disabled') {
      return
    }
    if (polyEditor) {
      if (polyEditor) {
        // 如已有对象则编辑对象
        polyEditor.setTarget(savePolygonData);
      } else {
        // 在新设置多边形时先要将之前的编辑对象清空
        polyEditor.setTarget();
      }
      polyEditor.open();
    }
  };

  const handleOk = () => {
    // 保存数据
    const _savePolygonData = ts_polygon;
    if (_savePolygonData) {
      const path = _savePolygonData.getPath();
      const polygonList: { x: any; y: any; }[] = [];
      if (Array.isArray(path)) {
        path.map((item01: any) => {
          polygonList.push({
            x: item01.lng,
            y: item01.lat,
          });
        });
      }
      const _polyginList = polyginList;

      setPolyginList(_polyginList);
      theme.form.setFields([
        {
          name: [_.areaName],
          value: _polyginList,
        },
      ]);
    }
    setSavePolygonData(_savePolygonData);
    map.clearMap();
    setVISIBLE(false);
  };

  const handleCancel = () => {
    polyEditor.removeAdsorbPolygons(savePolygonData);
    map.clearMap();
    setVISIBLE(false);
  };

  /* 网格编辑 */
  const editPolygon = () => {
    if (!polyEditor) {
      return;
    }
    switch (mapPolygonEditState) {
      case 'edit':
        polyEditor.close();
        break;
      case 'disabled':
        polyEditor.open();
        break;
    }
    setMapPolygonEditState(mapPolygonEditState == 'edit' ? 'disabled' : 'edit');
  };

  /* 删除当前区域编辑的多边形 */
  const delPolygon = () => {
    ts_polygon = '';
    polyEditor.removeAdsorbPolygons(savePolygonData);
    map.clearMap();
    polyEditor.setTarget();
    polyEditor.open();
  };

  return (
    <wrapContext.Consumer>
      {(_data) => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{_.defaultValue || '　'}</ShowData>;
            break;
          case 'edit':
          case 'new':
          case 'disabled':
            return (
              <RowBox>
                <Form.Item name={name} rules={props.rules} className="row-item">
                  <Minput
                    style={_.style}
                    disabled={_data.state === 'disabled'}
                    placeholder={_.placeholder}
                    size={_.size}
                  />
                </Form.Item>
                <Form.Item
                  name={_.areaName}
                  rules={[
                    {
                      required: true,
                      message: '请选择区域',
                    },
                  ]}
                  className="row-map-item"
                >
                  <MapIcon
                    onClick={() => {
                      selAddress(_data.state);
                    }}
                    style={{
                      position: 'absolute',
                      color: ' #ccc',
                      cursor: 'pointer',
                      right: '10px',
                      fontSize: '20px',
                      top: '10px',
                    }}
                  />
                </Form.Item>
                <AModal title="区域" visible={VISIBLE} onOk={handleOk} onCancel={handleCancel}>
                  {_data.state === 'disabled' ? null : (
                    <NButton
                      type="primary"
                      onClick={() => {
                        editPolygon();
                      }}
                    >
                      {mapPolygonEditState === 'disabled' ? '开始编辑' : '结束编辑'}
                    </NButton>
                  )}

                  {_data.state === 'disabled' ? null : (
                    <NButton
                      type="primary"
                      onClick={() => {
                        delPolygon();
                      }}
                    >
                      删除
                    </NButton>
                  )}
                  {/* <MapBox id="container"></MapBox> */}
                  <Wrapmap>
                    <MainMap
                      version="2.0"
                      events={mapEvents(_data.state)}
                      center={SENTER}
                      zoom={13}
                      amapkey={amapkey}
                    ></MainMap>
                  </Wrapmap>
                </AModal>
              </RowBox>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(InputWithSelectArea);
