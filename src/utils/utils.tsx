import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import type { Route } from '@/models/connect';
import { Modal } from 'antd';

// import c from '@/../config/config.json';

// 获取当前路由的方法
// window.location.href.split("#/")[1].split("/").pop().replace("_",":")

export const downLoadFile = function (file: any) {
  if (typeof file === 'string') {
  }
};

// 将文件类型转换成字符串数组
export const filesToStringArrary = function (list: any) {
  if (typeof list === 'string') return list;
  if (list === null) return [];
  const _list: { fileName: any; fileType: any; fileId: any }[] = [];
  const _ids_list: any[] = [];
  list.length > 0 &&
    list.map(function (
      item: { response: { data: any[] }; name: any; type: any; contentType: any; uid: any },
    ) {
      if (item.response) {
        _list.push({
          fileName: item.name,
          fileType: item.type,
          fileId: item.response.data[0],
        });
        _ids_list.push(item.response.data[0]);
      } else {
        _list.push({
          fileName: item.name,
          fileType: item.contentType,
          fileId: item.uid,
        });
        _ids_list.push(item.uid);
      }
    });

  return { _list, _ids_list };
};
// 获取数组的params字段默认用来获取rbacToken;
export const getUrlParams = function (name: string) {
  const url2 = window.location.href;
  const temp2 = url2.split('?')[1];
  const pram2 = new URLSearchParams(`?${temp2}`);
  let data = pram2.get(name);
  if (!data) return '';
  if (data.indexOf('#/') >= 0) {
    data = data.split('#/')[0];
  }
  return data;
};
// 将字符串数据转成数组类型
export const stringToArrary = function (data: never[], keys: any[]) {
  if (!keys) return;
  keys.map(function (key: string | number) {
    if (Array.isArray(data[key])) return;
    data[key] === null ? (data[key] = []) : (data[key] = data[key].split(','));
  });
  return data;
};

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

// 过滤指定字符串的方法
export const filterStr = function (str: string, ft: string): string {
  return str.indexOf(ft) >= 0 ? str.split(ft)[1] : str;
};

// 默认加载数据的方法 将方法放在初始化的地方,把数据存入全局
export const defaultLoadData = function (dispatch: any) {
  // 初始化加载的数据 默认name为记载之后赋值的命名, 不建议在没有声明时使用 最好在select内进行声明
  // 加载街道数据
  // if (!c.DEFAULTLOADLIST.length) return;
  // dispatch({
  //   type: `select/requestDataList`,
  //   list: c.DEFAULTLOADLIST,
  // });
};
// 将地址的参数拼接的方法
export const joinUrl = function (url: string, params: { [x: string]: any; }) {
  if (params) {
    const paramsArray: string[] = [];
    // 拼接参数
    Object.keys(params).forEach((key) => paramsArray.push(`${key}=${params[key]}`));
    if (url.search(/\?/) === -1) {
      url += `?${paramsArray.join('&')}`;
    } else {
      url += `&${paramsArray.join('&')}`;
    }
  }
  return url;
};
// 用于将列表里的多个字符串与保存的ids列表进行中文匹配
export const filterIdsToName = function (str: string, list: any[]) {
  if (!str && str !== '0') {
    return [];
  }
  const data: any[] = [];
  list.map(function (item: { id: { toString: () => string; }; name: any; }) {
    str.toString().split(',').indexOf(item.id.toString()) >= 0 ? data.push(item.name) : null;
  });
  // 返回一个数组
  return data;
};
// 将rangepick 时间选择的数据进行过滤
export const filterKeys = function (data: any) {
  const filterData = {};
  for (const key in data) {
    if (key.indexOf('-') >= 0) {
      key.split('-').map(function (item, idx) {
        if (!data[key]) {
          filterData[item] = undefined;
        } else if (typeof data[key][idx] === 'object') {
          // 目前只针对时间做了优化 未出现有其他是对象的值
          filterData[item] = data[key][idx].format('YYYY/MM/DD 00:00:00');
        } else {
          filterData[item] = data[key][idx];
        }
      });
    } else {
      filterData[key] = data[key];
    }
  }
  return filterData;
};

// 简略的弹出框方法
export const confirmModal = function () {
  const config = arguments[0];
  const func = arguments[1];
  let _: any = {};
  if (typeof config === 'string') {
    switch (config) {
      case 'delete':
        _ = {
          t: '删除',
          i: '',
          c: '是否删除选中的数据',
        };
        break;
      case 'add':
        _ = {
          t: '添加',
          i: '',
          c: '是否添加选中的数据',
        };
        break;
    }
  } else {
    _ = {
      t: config.title,
      i: config.icon,
      c: config.content,
    };
  }

  Modal.confirm({
    title: _.t,
    icon: _.i,
    content: _.c,
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      func;
    },
  });
};

export const $webSocket = {
  init(name: string | number, url: any) {
    if (this[name]) return;
    const ws = new WebSocket(`${url}`);
    Object.assign(this, { [name]: ws });
  },
};


// 图片压缩
export const compressImg = function (file: any, size?: any) {
  if (!size) size = 0.01;
  const img = new Image()
  const reader = new FileReader()// 读取文件资源
  reader.readAsDataURL(file)
  return new Promise((resolve) => {
    reader.onload = function (e) {
      img.src = e.target.result;
      img.onload = function () {
        const { width, height } = img;
        // 创建画布
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        // 设置宽高度为等同于要压缩图片的尺寸
        canvas.width = width * size;
        canvas.height = height * size;
        context.clearRect(0, 0, width * size, width * size)
        //将img绘制到画布上
        context.drawImage(img, 0, 0, width * size, width * size);
        canvas.toBlob(function (blob: any) {
          resolve(new window.File([blob], file.name, { type: file.type }))
        }, "png", "image/jpeg");
      }
    }
  })

}

// vite 导入图片 
export const getAssetsFile = (url: string) => {
  return new URL(`../assets${url}`, import.meta.url).href
}

                  // return new Promise(resolve => {
                  //   const reader = new FileReader();
                  //   reader.readAsDataURL(file);
                  //   reader.onload = () => {
                  //     const img = document.createElement('img');
                  //     img.src = reader.result;
                  //     img.onload = () => {
                  //       const canvas = document.createElement('canvas');
                  //       canvas.width = img.naturalWidth;
                  //       canvas.height = img.naturalHeight;
                  //       const ctx = canvas.getContext('2d');
                  //       ctx.drawImage(img, 0, 0);
                  //       ctx.fillStyle = 'red';
                  //       ctx.textBaseline = 'middle';
                  //       ctx.font = '33px Arial';
                  //       ctx.fillText('Ant Design', 20, 20);
                  //       canvas.toBlob(resolve);
                  //     };
                  //   };
                  // });
