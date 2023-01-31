import React, {useEffect, useState} from "react";
import {connect} from "dva";

const Test = (props: any) => {
    const {dispatch} = props;

    return (<div>
        test

    </div>);
};

export default connect(({common, select}) => ({
    common,
    select
}))(Test);
