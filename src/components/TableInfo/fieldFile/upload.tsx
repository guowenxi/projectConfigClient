import React, {useState, useEffect, useMemo, useContext} from 'react';
import styled, {ThemeProvider} from 'styled-components';

import {connect} from "dva";
import {Upload as AUpload, Button, message} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import type {Iconf} from '../TableInfo';
import {wrapContext} from '../TableInfo';
import {ShowData} from './_css_comm';
import {Form} from 'antd';
import {G} from '@/global';

const {rootUrl, rbacToken} = G;

const MUpload = styled(AUpload)``;
const WrapBox = styled.div`
  && {
    border: 1px solid #d9d9d9;
    padding: 1vh;
    height: 100%;
  }
`;

interface IconfInput extends Iconf {
  placeholder?: string;
}

interface Iinput {
  dispatch?: any;
  conf: IconfInput;
  name: string;
  rules: any;
}

const Input: React.FC<Iinput> = (props) => {
  const _: any = props.conf;
  const {name} = props;
  const [FILELIST, setFILELIST] = useState<any>([]);
  const [PROPS, setPROPS] = useState({});
  const [uploadStatus, setUploadStatus] = useState();
  const theme: any = useContext(wrapContext);
  const filterData = function (data: any) {
    let _data: any = [];
    switch (typeof data) {
      case 'string':
        data == '' ? _data = [] : _data = data.split(',');
        break;
      case 'object':
        _data = data;
        break;
      default:
        _data = [];
        break;
    }

    if(_data === null){
      return [];
    }
    if (_data.length > 0) {

      return _data.map(function (item: any, idx: number) {
        return {
          ...item,
          uid: item.fileId ? item.fileId : item,
          fileId: item.fileId ? item.fileId:'',
          name: item.fileName ? item.fileName : '',
          status: 'done',
          fileType: item.contentType ? item.contentType : "",
          url: `${rootUrl}/fyHome/file/download?id=${item.fileId ? item.fileId : item}&rbacToken=${rbacToken}`,
        }
      })
    }
    return _data;
  };

  // 用 useEffect 父组件更新，子组件也会更新（性能很差）
  // 需要用 useMemo 来解决
  useMemo(() => {
    const formData = theme.form.getFieldValue(name);
    const data = filterData(formData);
    // 暂时因为数据会回显 导致这个获取到的data是文件的data, 所以暂时这样做判断


    setFILELIST(data);
    setPROPS({
      name: 'file',
      action: rootUrl + _.uploadUrl,
      // listType: 'picture-card',
      headers: {
        // authorization: 'authorization-text',
      },
      data: {
        rbacToken: rbacToken
      },
      onRemove(item: any) {
      },
      onChange(info: any) {

        const formData = theme.form.getFieldValue(name);
        console.log(formData);

        const files: any = info.fileList;
        let arr: any[] = [];
        if (info.file.status === 'uploading') {
          // message.error(`${info.file.name} uploading`);

          setUploadStatus(info.file.status)
        }
        if (info.file.status === 'done' || info.file.status === 'removed') {

          console.log(info.fileList)
          info.fileList.map(item => {
            arr.push({
              fileName: item.fileName ? item.fileName : item.response.data.fileName,
              fileId: item.fileId ? item.fileId : item.response.data.fileId,
              fileUrl: item.fileUrl ? item.fileUrl : item.response.data.fileUrl
            });
          })

          theme.form.setFieldsValue({
            [name]: arr,
          });
          setUploadStatus('');

        } else if (info.file.status === 'error') {
          // message.error(`${info.file.name} error`);
          setUploadStatus('');
        }


        setFILELIST([...files]);
      },
      progress: {
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068',
        },
        strokeWidth: 3,
        format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
      },
    });
  }, []);

  return (
    <wrapContext.Consumer>
      {(_data) => {
        return (
          <Form.Item name={name} rules={props.rules}>
            <WrapBox>
              <MUpload {...PROPS} fileList={FILELIST} maxCount={_.maxCount}
                       accept={_.accept}
                       disabled={_data.state === 'disabled'}
              >
                {_data.state == 'edit' || _data.state == 'new' ? (
                  <Button
                    disabled={FILELIST.length === _.maxCount ? true : (uploadStatus === 'uploading' ? true : false)}>
                    <UploadOutlined/> {uploadStatus === 'uploading' ? '上传中' : '点击上传文件'}
                  </Button>
                ) : null}
              </MUpload>


            </WrapBox>

          </Form.Item>
        );
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(Input);
