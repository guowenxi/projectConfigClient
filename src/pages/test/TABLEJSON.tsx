export default () => {
  return [
    [
      {
        name: 'cardidMd5',
        width: '100',
        label: {
          name: '反馈意见',
          col: 3,
          style: {},
        },
        field: {
          col: 7,
          "type": "textArea",
          "props": {
            "relevance": "",
            "defaultValue": "",
            "placeholder": "",
            "style": {
              "width":"100%",
              "min-height":"30vh"
            }
          }
        },
        rules: [
          {
            required: false,
            message: '该项为必填项',
          },
        ],
      },
      {
        name: 'educationValue',
        width: '50',
        label: {
          name: '反馈类型',
          col: 3,
          style: {},
        },
        field: {
          col: 7,
          type: 'input',
          props: {
            defaultValue: '',
            placeholder: '',
            style: {
              width: '100%',
            },
          },
        },
        rules: [
          {
            required: false,
            message: '该项为必填项',
          },
        ],
      },
      {
        name: 'name',
        width: '50',
        label: {
          name: '姓名',
          col: 3,
          style: {},
        },
        field: {
          col: 7,
          type: 'input',
          props: {
            defaultValue: '',
            placeholder: '',
            style: {
              width: '100%',
            },
          },
        },
        rules: [
          {
            required: false,
            message: '该项为必填项',
          },
        ],
      },
      {
        name: 'phone',
        width: '50',
        label: {
          name: '手机号码',
          col: 3,
          style: {},
        },
        field: {
          col: 7,
          type: 'input',
          props: {
            defaultValue: '',
            placeholder: '',
            style: {
              width: '100%',
            },
          },
        },
        rules: [
          {
            required: false,
            message: '该项为必填项',
          },
        ],
      },
      {
        name: 'createDate',
        width: '50',
        label: {
          name: '提交时间',
          col: 3,
          style: {},
        },
        field: {
          col: 7,
          type: 'input',
          props: {
            defaultValue: '',
            placeholder: '',
            style: {
              width: '100%',
            },
          },
        },
        rules: [
          {
            required: false,
            message: '该项为必填项',
          },
        ],
      },
    ],
  ]
}
