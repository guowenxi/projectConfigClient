import React, { useState, useMemo,useContext } from 'react';
import styled from 'styled-components';

import {connect} from "dva";
import { Input as AInput } from 'antd';
import type { Iconf} from '../TableInfo';
import { wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Modal } from 'antd';
import { Map, Marker } from 'react-amap';
import { EnvironmentFilled } from '@ant-design/icons';
import { Form } from 'antd';
import { filterStr } from '@/utils/utils';


import { G } from '@/global';

const { amapkey, mapCenter } = G;

const Minput = styled(AInput)`
  position: relative;
  && {
    padding: 1vh;
  }
`;
const CompleteInput = styled<any>(AInput)`
  position: relative;
  && {
    padding: 1vh;
  }
`;
const AModal = styled(Modal)`
  && {
    width: 70vw !important;
    .ant-modal {
    }
  }
`;
const WrapMap = styled.div`
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
const MapIcon = styled(EnvironmentFilled)`
  color: #ccc;
  cursor: pointer;
  position: absolute;
  right: 10px;
  font-size: 20px;
  top: 10px;
`;

interface IconfInput extends Iconf {
  placeholder?: string;
}
interface ImapSelect {
  dispatch?: any;
  conf: IconfInput;
  name: string;
  rules: any;
}

let map: any= {};
const MapSelect: React.FC<ImapSelect> = (props) => {
  const _: any = props.conf;
  const {name} = props;
  const theme: any = useContext(wrapContext);
  const [VISIBLE, setVISIBLE] = useState(false);
  const [POINT, setPOINT] = useState<any>([]);
  const [SENTER, setSENTER] = useState(mapCenter);
  const [ADDRESS, setADDRESS] = useState('');
  const [geocoder, setgeocoder] = useState<any>({});
  const [] = useState({});

  // 默认加载?
  useMemo(() => {
  }, []);
  const mapEvents: any = {
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
      AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.CitySearch'], () => {
        const placeSearch = new AMap.PlaceSearch({
          pageSize: 10, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: '温州', // 兴趣点城市
          citylimit: true, // 是否强制限制在设置的城市内搜索
          map, // 展现结果的地图实例
          // autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });

        AMap.event.addListener(
          new AMap.Autocomplete({
            // city 限定城市，默认全国
            city: '温州',
            // input 为绑定输入提示功能的input的DOM ID
            input: 'amapInput',
          }),
          'select',
          (e) => {
            // TODO 针对选中的poi实现自己的功能
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);
            setADDRESS(e.poi.name);
            setPOINT([e.poi.location.lng, e.poi.location.lat]);
            map.setZoomAndCenter([e.poi.location.lng, e.poi.location.lat]);
          },
        );
      });


      // console.log(ins.Geocoder());
    },
    click: (e: any) => {
      geocoder &&
        geocoder.getAddress(e.lnglat, (status: any, result: any) => {
          console.log(result.regeocode);
          setADDRESS(filterStr(result.regeocode.formattedAddress,"浙江省温州市"));
          setPOINT([e.lnglat.lng, e.lnglat.lat]);
          // 地图上的数据操作;
          // state.info.address=filterAddress(result.regeocode.formattedAddress);
          // _this.state.info.longitude=e.lnglat.lng;
          // _this.state.info.latitude=e.lnglat.lat;
          // _this.setState({
          //   center:{
          //     longitude:e.lnglat.lng,
          //     latitude:e.lnglat.lat,
          //   },
          //   info:_this.state.info
          // });
        });
    },
  };

  const selAddress = () => {

    const data =  theme.form.getFieldsValue();
    if(data[name] !='' && data.lnglat){
      setPOINT(data.lnglat);
      setADDRESS(data[name])
      setSENTER(data.lnglat);
    }
    setVISIBLE(true);
  };

  const handleOk = () => {
    theme.form.setFieldsValue({
      [name]:ADDRESS,
    });
    // 如果没有lnglat 则创建这个字段
    theme.form.setFields([{
      name:"lnglat",
      value:POINT
    }])
    setVISIBLE(false);
  };

  const handleCancel = () => {
    setVISIBLE(false);
  };

  return (
    <wrapContext.Consumer>
      {(_data): any => {
        switch (_data.state) {
          case 'default':
            return (
              <ShowData>
                {_.defaultValue || '　'}
                <MapIcon onClick={selAddress} />
              </ShowData>
            );
            break;
          case 'edit':
          case 'new':
          case 'disabled':
            return <div>
              <Form.Item name={name}
              rules={props.rules}>
                <Minput
                  autoComplete="off"
                  disabled={_data.state === 'disabled'}
                  placeholder={_.placeholder}
                  size={_.size}
                />
              </Form.Item>
              <Form.Item name={"lnglat"} noStyle></Form.Item>
              <MapIcon onClick={selAddress} />
              <AModal title="地址" visible={VISIBLE} onOk={handleOk} onCancel={handleCancel}>
                <CompleteInput
                  autocomplete="off"
                  id="amapInput"
                  disabled={_data.state === 'disabled'}
                  placeholder={'请选择地址'}
                  value={ADDRESS}
                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => {
                    setADDRESS(e.target.value);
                  }}
                  size={_.size}
                />
                <WrapMap>
                  <MainMap
                    events={mapEvents}
                    center={SENTER}
                    zoom={13}
                    amapkey={amapkey}
                  >
                    {POINT[0] ? <Marker position={POINT}></Marker> : null}
                  </MainMap>
                </WrapMap>
              </AModal>
            </div>
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(MapSelect);
