import React from "react";
import { Link } from "react-router-dom";
import styles from "./index.less";
import { connect } from "dva";

const Files: React.FC<any> = (props) => {
    console.log(props);

    return (
        <>
            <div className={styles.title}>Welcome Files</div>
            <Link to="/">home</Link>
        </>
    );
};

// export default Products;
export default connect(({ common }) => ({
    common,
}))(Files);
