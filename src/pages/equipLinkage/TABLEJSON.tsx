import React from "react"

const TABLEJSON = [
  {
    "name": "name1",
    "width": "100",
    "label": {
      "name": "计划名称",
      "col": "3",
      "style": {}
    },
    "field": {
      "col": "7",
      "type": "input",
      "props": {
        "placeholder": "请输入计划名称",
        "style": {
          "width": "100%"
        }
      }
    },
    "rules": [
      {
        "required": false,
        "message": "该项为必填项"
      }
    ]
  },
  {
    "name": "name2",
    "width": "100",
    "label": {
      "name": `描述`,
      "col": "2",
      "style": {}
    },
    "field": {
      "col": "7",
      "type": "input",
      "props": {
        "placeholder": "请输入计划名称",
        "style": {
          "width": "100%"
        }
      }
    },
    "rules": [
      {
        "required": false,
        "message": "该项为必填项"
      }
    ]
  },
  {
    "name": "deviceTypeId",
    "width": "100",
    "label": {
      "name": "设备类型",
      "col": "3",
      "style": {}
    },
    "field": {
      "col": "7",
      "type": "select",
      "props": {
        "placeholder": "请选择报警类型",
        "options": [],
        "url": "/services/Common/GetDeviceType",
        "method": "POST",
        "params": {
        }
      }
    },
    "rules": [
      {
        "required": false,
        "message": "该项为必填项"
      }
    ]
  }
]
export default TABLEJSON