import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import {connect} from "dva";
import { Input } from 'antd';
import { Map, Marker, Markers, InfoWindow } from 'react-amap';
import { filterStr } from '@/utils/utils';
import Heatmap from 'react-amap-plugin-heatmap';

import { G } from '@/global';

const { mapCenter, amapkey } = G;

const WrapBox = styled.div<{ width?: string | number; height?: string | number }>`
  position: relative;
  min-width: ${(props) => (props.width ? props.width : '100%')};
  max-width: ${(props) => (props.width ? props.width : '100%')};
  min-height: ${(props) => (props.height ? props.height : '30vh')};
  max-height: ${(props) => (props.height ? props.height : '30vh')};
  display: flex;
`;
const WrapMap = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;

`;
const MainMap = styled(Map)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;

`;

const CompleteInput = styled(Input)`
  z-index: 100;
  left: 1vh;
  top: 1vh;

  && {
    position: absolute;
    width: 300px;
    padding: 1vh;
  }
`;

interface IreactAMap {
  width? : string;
  height?: string;
  dispatch: Dispatch;
  name: string;
  search: any;
  mapClick: any;
  markersOption: any;
  heatOption: any;
  infoWindowOption: any;
}

let map: any;
const ReactAMap: React.FC<IreactAMap> = (props) => {
  const { dispatch, search, mapClick, markersOption, heatOption, infoWindowOption } = props;
  const [POINT, setPOINT] = useState<any>([]);
  const [HEATPOINTS, setHEATPOINTS] = useState<any>([]);
  const [MARKERS, setMARKERS] = useState<any>([]);
  const [SENTER, setSENTER] = useState(mapCenter);
  const [ADDRESS, setADDRESS] = useState('');
  const [geocoder, setgeocoder] = useState<any>();
  const [SELITEM, setSELITEM] = useState({});
  const [INFOWINDOWPOINT, setINFOWINDOWPOINT] = useState({ longitude: 120, latitude: 30 });
  const [INFOWINDOWVISIBLE, setINFOWINDOWVISIBLE] = useState(false);

  const loadData = async (url: any, params: any, fn: ((data: []) => void) )=> {
    const data = await dispatch({
      type: 'common/requestData',
      url,
      method: 'GET',
      payload: {
        ...params,
      },
    });
    fn(data.list ? data.list : data.data);
  };

  useEffect(() => {
    markersOption &&
      markersOption.url &&
      loadData(markersOption.url, markersOption.params, filterData);
    heatOption && heatOption.url && loadData(heatOption.url, heatOption.params, filterData_heat);
  }, []);

  function filterData(data: []) {
    let _list: any[] = [] ;
    data.length>0 ?
    data.map(function (item: any) {
      _list.push({
        ...item,
        position: {
          longitude: item.longitude && item.x && '',
          latitude: item.latitude && item.y && '',
        },
      });
    })
    : _list = [];
    setMARKERS(_list);
  }
  function filterData_heat(data: []) {
    const _list: any[] = [] ;
        data.map(function (item: any) {
      _list.push({
        lng: item.x,
        lat: item.y,
        count: item.count,
      });
    });
    setHEATPOINTS(_list);
  }

  const mapEvents = {
    created: (ins: {}) => {
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
    },
    click: (e: { lnglat: { lng: number; lat: number; }; }) => {
      mapClick &&
        geocoder &&
        geocoder.getAddress(e.lnglat, (status: any, result: { regeocode: { formattedAddress: string; }; }) => {
          console.log(result.regeocode);
          switch (mapClick.type) {
            case 'setPoint':
              setADDRESS(filterStr(result.regeocode.formattedAddress, '浙江省温州市'));
              setPOINT([e.lnglat.lng, e.lnglat.lat]);
              break;
            default:
            case 'click':
              break;
          }
          mapClick.event(e, result.regeocode);

          // 默认居中显示
          setSENTER([e.lnglat.lng, e.lnglat.lat]);
        });
    },
  };

  const markersEvents = {
    created: (allMarkers: any) => {
      console.log('All Markers Instance Are Below');
      console.log(allMarkers);
    },
    click: (e: { lnglat: { lng: any; lat: any; }; }, marker: { getExtData: () => React.SetStateAction<{}>; }) => {
      setINFOWINDOWPOINT({ longitude: e.lnglat.lng, latitude: e.lnglat.lat });
      markersOption.showInfo &&
        (setSELITEM(marker.getExtData()), setINFOWINDOWVISIBLE(!INFOWINDOWVISIBLE));
      markersOption.event && markersOption.event(e, marker.getExtData());
    },
    mouseover: (e: any, marker: { getExtData: () => any; }) => {
      markersOption.mouseover && markersOption.mouseover(e, marker.getExtData());
    },
    mouseout: (e: any, marker: { getExtData: () => any; }) => {
      markersOption.mouseout && markersOption.mouseout(e, marker.getExtData());
    },
    dragend: () => {
      /* ... */
    },
  };

  return (
    <WrapBox width={props.width} height={props.height}>
      {search && (
        <CompleteInput
          autoComplete="off"
          id="amapInput"
          placeholder={'查询地址'}
          value={ADDRESS}
          onChange={(e) => {
            setADDRESS(e.target.value);
          }}
        ></CompleteInput>
      )}
      <WrapMap>
        <MainMap events={mapEvents} center={SENTER} zoom={13} amapkey={amapkey}>
          {POINT[0] ? <Marker position={POINT}></Marker> : null}
          {MARKERS && MARKERS.length > 0 && (
            <Markers
              markers={MARKERS}
              events={markersEvents}
              useCluster={markersOption.useCluster}
              render={markersOption.render ? markersOption.render : false}
            />
          )}
          {heatOption && (
            <Heatmap
              {...heatOption}
              dataSet={{
                data: HEATPOINTS,
                max: heatOption.max,
              }}
            />
          )}
          <InfoWindow
            {...infoWindowOption}
            content={infoWindowOption.content(SELITEM)}
            position={INFOWINDOWPOINT}
            visible={INFOWINDOWVISIBLE}
            events={{
              click: () => {
                infoWindowOption.events;
              },
              close: () => {
                setINFOWINDOWVISIBLE(false);
              },
            }}
          >
            <h3>Window 3</h3>
          </InfoWindow>
        </MainMap>
      </WrapMap>
    </WrapBox>
  );
};

export default connect(({}) => ({}))(ReactAMap);
