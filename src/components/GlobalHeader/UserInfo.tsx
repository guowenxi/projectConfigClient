import {Modal, Input, message} from 'antd';
import React, {useState, useEffect, useRef} from 'react';
import type {ConnectProps, Dispatch} from 'umi';

import {connect} from "dva";
import {ConnectState} from '@/models/connect';
import styled, {ThemeProvider} from 'styled-components';
import {EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';
import styles from './index.less';
import icon_photo from '@/assets/imgs/icon_photo.png';
import {G} from "@/global"

export type SiderTheme = 'light' | 'dark';

export type GlobalHeaderRightProps = Partial<ConnectProps>

interface Props {
  dispatch: Dispatch;
  common: any;
}

const {rootUrl} = G;


const UserInfo: React.SFC<GlobalHeaderRightProps> = (props) => {
  const {dispatch, common} = props;
  const {userInfo} = common;
  const [VISIBLE, setVISIBLE] = useState(false);

  const oldPassword = useRef(null);
  const newPassword = useRef(null);
  const checkPassword = useRef(null);


  const className = styles.right;
  const RightInfo = styled.div`
    display: flex;
    align-items: center;

    .name {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    img {
      height: 60%;;
    }

    span {
      display: inline-block;
      margin: 0 1vh;
      font-size: 1.8vh;
    }

    .tx-color {
      cursor: pointer;
      color: red;
    }
  `;
  const ModalContent = styled.div`
    display: flex;
    flex-direction: column;

    .item {
      display: flex;
      margin: 1vh 0;

      label {
        display: inline-block;
        width: 15%;
        text-align: justify;
        text-align-last: justify;
        margin-right: 2vh;
        color: #497ea2;
        padding: 4px 0;
      }

      input {
        flex: 1;
        // text-indent: 1vh;
        border: 0;
        border-radius: 3px;
      }
    }

    p {
      color: red;
      margin-top: 2vh;
      margin-bottom: 0;
    }
  `;
  useEffect(() => {

  }, [VISIBLE])

  const handleOk = () => {

    let oldPass = oldPassword.current.state.value
    let newPass = newPassword.current.state.value
    let checkPass = checkPassword.current.state.value

    const reg: RegExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
    if (!reg.test(newPass) || !reg.test(checkPass)) {
      message.error('密码必须包含1位数字，1位大写字母，1位小写字母，且长度为8-16位');
      return;
    }
    if (newPass !== checkPass) {
      message.error('兩次输入的密码不一致');
      return;
    }
    dispatch({
      type: `common/requestData`,
      method: "POST",
      url: "/rbac/fyUser/updatePassword.do",
      payload: {
        oldPassword: oldPass,
        newPassword: newPass,
        checkPassword: checkPass
      },
      callback: (res: string) => {
        if (res === "success") {
          message.success('修改成功');
          setVISIBLE(false);
        } else {
          message.error(res);
        }
      }
    });
  };

  return (
    <div className={className}>
      <RightInfo>
        <div className='name' onClick={() => (setVISIBLE(true))}>
          <img src={icon_photo}/>
          <span>{userInfo.userName}</span>
        </div>
        <span>|</span>
        <span className='tx-color' onClick={() => {
          // location.href =`http://10.49.182.67:8013/fyRbac/index.html`;
          var params = rootUrl.split('/loveHome');
          location.href = params[0] + '/rbac/login.html';
        }}>退出系统</span>
      </RightInfo>

      <Modal
        title="修改密码"
        visible={VISIBLE}
        onOk={handleOk}
        onCancel={() => (setVISIBLE(false))}
        maskClosable={false}
      >
        <ModalContent>
          <div className='item'>
            <label htmlFor="">旧密码</label>
            <Input.Password
              placeholder="请输入旧密码"
              ref={oldPassword}
              // value={oldPassword}
              // onBlur={(e) => (setOldPassword(e.target.value))}
              iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
            />
          </div>
          <div className='item'>
            <label htmlFor="">新密码</label>
            <Input.Password
              placeholder="请输入新密码"
              ref={newPassword}
              // value={newPassword}
              // onBlur={(e) => (setNewPassword(e.target.value))}
              iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
            />
          </div>
          <div className='item'>
            <label htmlFor="">确认密码</label>
            <Input.Password
              placeholder="请再次输入新密码"
              ref={checkPassword}
              // value={checkPassword}
              // onBlur={(e) => (setCheckPassword(e.target.value))}
              iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
            />
          </div>
          <p>规则：密码必须包含1位数字，1位大写字母，1位小写字母，且长度为8-16位</p>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default connect(({common}) => ({
  common
}))(UserInfo);
