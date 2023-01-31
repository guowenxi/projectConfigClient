import React, {useState, useEffect, useContext, useMemo} from 'react';
import styled from 'styled-components';

import {connect} from "dva";
import {Upload as AUpload, Modal, message} from 'antd';
import type {Iconf} from '../TableInfo';
import {wrapContext} from '../TableInfo';
import {Form} from 'antd';
import {G} from '@/global';

const {rootUrl, rbacToken} = G;
const MUpload = styled(AUpload)<{ disabled?: boolean }>`
  .ant-upload-select-picture-card {
    display: ${(props) => (props.disabled ? 'none' : 'table')};
  }
`;
const WrapBox = styled.div`
  && {
    height: 100%;
    padding: 1vh;
    border: 1px solid #d9d9d9;
  }
`;

interface IconfInput extends Iconf {
  placeholder?: string;
  maxFileNum: number | string;
  uploadUrl: string;
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
  const [MODALSTATE, setMODALSTATE] = useState(false);
  const [PREVIEW, setPREVIEW] = useState<any>('');
  const theme: any = useContext(wrapContext);
  const filterData = function (data: any) {
    let _data: any = [];
    switch (typeof data) {
      case 'string':
        _data == '' ? (_data = []) : (_data = data.split(','));
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
      return _data.map(function (item: any) {
        return {
          ...item,
          uid: item.fileId ? item.fileId : item,
          fileId: item.fileId ? item.fileId : '',
          name: item.fileName ? item.fileName : '',
          status: 'done',
          fileType: item.contentType ? item.contentType : '',
          url: `${rootUrl}/fyHome/file/download?id=${item.fileId ? item.fileId : item}&rbacToken=${rbacToken}`,
        }
      });
    }
    return _data;
  };

  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  useMemo(() => {
    const formData = theme.form.getFieldValue(name);
    // 暂时因为数据会回显 导致这个获取到的data是文件的data, 所以暂时这样做判断
    const data = filterData(formData);
    setFILELIST(data);
    setPROPS({
      name: 'file',
      action: rootUrl + _.uploadUrl,
      listType: 'picture-card',
      headers: {
        // authorization: 'authorization-text',
      },
      data: {
        rbacToken: rbacToken
      },
      beforeUpload: file => {
        const isPNG = file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png";
        if (!isPNG) {
          message.warning(`只能上传jpg/png格式的图片`);
        }
        return isPNG || AUpload.LIST_IGNORE;
      },
      onRemove() {
      },
      onChange(info: any) {
        const files: any = info.fileList;
        let arr: any[] = [];
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
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

        } else if (info.file.status === 'error') {
          // message.error(`${info.file.name} file upload failed.`);
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
      {(_data: any): any => {
        return (
          <Form.Item name={name} rules={props.rules}>
            <WrapBox>
              <MUpload
                listType="picture"
                {...PROPS}
                fileList={FILELIST}
                disabled={_data.state === 'disabled'}
                accept="image/*"
                maxCount={_.maxCount}
                onPreview={async (file: any) => {
                  setMODALSTATE(true);
                  file.originFileObj
                    ? setPREVIEW(await getBase64(file.originFileObj))
                    : setPREVIEW(file.url);
                }}
              >
                {FILELIST.length >= _.maxCount ? null : "上传图片"}

                {/*{FILELIST.length < _.maxFileNum && '上传图片'}*/}
              </MUpload>
              <Modal
                visible={MODALSTATE}
                title={null}
                footer={null}
                onCancel={() => setMODALSTATE(false)}
              >
                <img alt="example" style={{width: '100%'}} src={PREVIEW}/>
              </Modal>
            </WrapBox>
          </Form.Item>
        );
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(Input);
