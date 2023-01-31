export interface AProps {
  /**
   * 全局状态保存仓库
   */
  common?: any;
  /**
   * 选择框请求来的数据保存仓库
   */
  select?: any;
}
export interface AColumns {
  /**
   * 标题
   */
  title: string;
  /**
   * 绑定的key
   */
  key: string;
  /**
   * 对齐方式
   */
  align?: 'left' | 'center' | 'right' | undefined;
  /**
   * 索引值
   */
  dataIndex: string;
  /**
   * 绑定的className
   */
  className: string;
  /**
   * 当前Item的宽度
   */
  width: string;
  /**
   * 自定义渲染函数
   */
  render: any;
}
export interface ASocket {
  /**
   * sokect请求类型
   */
  type: string | 'webSocket_init';
  /**
   * sokect请求
   */
  data: {
    /**
     * sokect请求名
     */
    name: string;
    /**
     * sokect请求地址
     */
    ws: string;
  };
}
