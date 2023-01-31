import React, { useState, useEffect } from 'react';
import { Tabs as ATabs } from 'antd';

export const { TabPane } = ATabs;




interface Props {
  data: any,
  onClick: Function;
  onEdit: Function; 
  checkIndex ?:string;
  checkIndex ?:object;
}
const Tabs: React.FC<Props> = (props) => {
  const { data,checkIndex ,style , type ,hideAdd} = props;
  // const [DATA, setDATA] = useState(data);
  // useEffect(()=>{
  //   setDATA(data)
  // },[data])

  const callback =(idx: any,item:any)=>{
    try{
      props.onClick(idx,data[idx-1]);
    }catch(err){
        console.error("onClick is undefined")
    }
  }
  const onEdit =(targetKey : any , action : any)=>{
    try{
      props.onEdit(targetKey, action);
    }catch(err){
        console.error("onClick is undefined")
    }
  }

  return (
    <div style={style}>
      <ATabs defaultActiveKey={checkIndex} type={type || "line"} onChange={callback} onEdit={onEdit}>
        {
          Array.isArray(data)?data.map((item: { name: React.ReactNode; id: string | number | undefined; },idx)=>{
            return <TabPane tab={item.name} key={idx+1}>
          </TabPane>
          }):null
        }
    </ATabs>
    </div>

  );
};

export default Tabs;
