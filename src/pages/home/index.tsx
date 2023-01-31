import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./index.less";
import { Button } from "antd";
import { connect } from "dva";

// const Home: React.FC<any> = (props) => {
//   return (
//     <>
//       <div className={styles.title}>Welcome Home</div>
//       <Button>111</Button>
//       <Link to="/login">login</Link>
//       <Link to="/about">about</Link>
//       <Link to="/main/screen">screen</Link>
//     </>
//   );
// };

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log(this.props);
    const { dispatch } = this.props;
    dispatch({
      type: 'common/testCnode',
      data: {},
    })
    // dispatch({
    //   type: "common/postLogin",
    //   payload: {
    //     username: "admin",
    //     password: "123456",
    //   },
    //   callback: (res) => {
    //     console.log("服务器返回", res);
    //   },
    // });
    // dispatch({
    //   type: "common/getServerData",
    //   callback: (res) => {
    //     console.log("服务器返回", res);
    //   },
    // });
  }

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "common/test",
    });
  };

  render() {
    return (
      <div className="home-page">
        <div className={styles.title}>Welcome Home</div>
        <Button type="primary" onClick={this.handleClick}>
          {this.props.comWidth || 1}
        </Button>
        <Link to="/login">login</Link>
        <Link to="/about">about</Link>
        <Link to="/main/screen">screen</Link>


          <Link to="/testMainLayout/test">screen</Link>
      </div>
    );
  }
}

// export default Products;
export default connect(({ common }) => common)(Home);
