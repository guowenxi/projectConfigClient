// 默认运行时配置
import {getUrlParams} from '@/utils/utils';

let rbacToken = "";
(function () {
    rbacToken =
        window.location.href.indexOf('rbacToken') > 0 ?
            getUrlParams('rbacToken')
            : import.meta.env.VITE_ENV;
})()

export class G {
    /**
     * 高德地图的key
     */
    public static amapkey: string = import.meta.env.VITE_ENV || '';
    /**
     * 全局地图中心点
     */
    public static mapCenter: any =import.meta.env.VITE_ENV;
    /**
     * 请求地址根目录,会根据环境配置
     */
    public static rootUrl: string = import.meta.env.VITE_ENV;
    /**
     * 调试环境token
     */
    public static rbacToken: string = rbacToken;
    /**
     * 登录跟登出导向的地址
     */
    public static loginUrl: string = import.meta.env.VITE_ENV
}

// 初始化记载数据层面也在此
