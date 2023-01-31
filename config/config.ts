import loadable from "@loadable/component";
const STATICLIST = [{
  displayName: '工程配置',
  name: "engineering",
  tempList: [
    // {
    //   displayName: '权限管理',
    //   name: "engineering:authorityManger",
    //   icon: '/svgs/u1.svg',
    // },
    {
      displayName: '参数管理',
      name: "engineering:parameterManger",
      icon: 'ProjectOutlined',
    },
    {
      displayName: '设备管理',
      name: "engineering:manger",
      icon: 'LaptopOutlined',
      tempList: [{
        displayName: '设备配置',
        name: "engineering:equipConfigure",
        icon: 'HddOutlined',
      },
      {
        displayName: '能耗表配置',
        name: "engineering:energyMeterConfigure",
        icon: 'DashboardOutlined',
      },
      ]
    },
    {
      displayName: '联动控制',
      name: "engineering:berelatedController",
      icon: 'NodeIndexOutlined',
    },
    {
      displayName: '告警管理',
      name: "engineering:manger",
      icon: 'TeamOutlined',
      tempList: [{
        displayName: '系统报警',
        name: "engineering:systemWarnManger",
        icon: 'BellOutlined',
      },
      {
        displayName: '告警推送',
        name: "engineering:messagePushManger",
        icon: 'MailOutlined',
      },
      ]
    },
    // {
    //   displayName: '日志管理',
    //   name: "engineering:manger",
    //   icon: '/svgs/u1.svg',
    //   tempList: [{
    //       displayName: '操作日志',
    //       name: "engineering:operateLog",
    //       icon: '',
    //     },
    //     {
    //       displayName: '设备日志',
    //       name: "engineering:equipmentLog",
    //       icon: '',
    //     },
    //   ]
    // },
  ]
}]
const ROUTERS = [
  // 权限管理
  {
    name: "engineering_authorityManger",
    path: "/engineering_authorityManger",
    component: loadable(() => import("@/pages/authorityManger")),
  },
  // 参数管理
  {
    name: "engineering_parameterManger",
    path: "/engineering_parameterManger",
    component: loadable(() => import("@/pages/parameterManger")),
  },
  // 联动控制
  // {
  //   name: "engineering_berelatedController",
  //   path: "/engineering_berelatedController",
  //   component: loadable(() => import("@/pages/berelatedController")),
  // }, //new
  {
    name: "engineering_berelatedController",
    path: "/engineering_berelatedController",
    component: loadable(() => import("@/pages/equipLinkage")),
  }, //old
  // 设备管理  - 设备配置
  {
    name: "engineering_equipConfigure",
    path: "/engineering_equipConfigure",
    component: loadable(() => import("@/pages/equipManage/equipConfigure")),
  },
  // 设备管理  - 能耗表配置
  {
    name: "engineering_energyMeterConfigure",
    path: "/engineering_energyMeterConfigure",
    component: loadable(() => import("@/pages/equipManage/energyMeterConfigure")),
  },
  // 警告管理 - 系统管理
  {
    name: "engineering_systemWarnManger",
    path: "/engineering_systemWarnManger",
    component: loadable(() => import("@/pages/warnManger/systemWarnManger")),
  },
  // 警告管理 - 警告推送
  {
    name: "engineering_messagePushManger",
    path: "/engineering_messagePushManger",
    component: loadable(() => import("@/pages/warnManger/messagePushManger")),
  },
  // 日志管理 - 操作日志
  {
    name: "engineering_operateLog",
    path: "/engineering_operateLog",
    component: loadable(() => import("@/pages/journalManger/operateLog")),
  },
  // 日志管理 - 设备日志
  {
    name: "engineering_equipmentLog",
    path: "/engineering_equipmentLog",
    component: loadable(() => import("@/pages/journalManger/equipmentLog")),
  },
]

const URL = "http://192.168.1.244:30002/enginConfigure"

// 我自己的接口
// const URL = "http://192.168.1.182:30002/enginConfigure"

// hmx
const IP_PORT = 'http://192.168.1.244:8002'

// gwx
export const QIANKUN_URL = '//192.168.1.244:3300'

// export const QIANKUN_URL = '//192.168.1.46:3300'

export default {
  STATICLIST,
  ROUTERS,
  URL,
  IP_PORT
}
