import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC<any> = () => {
  return (
    <>
      <div className="nothing-page flex-row">
        <img className="run-img" src="/image/web404.svg" />
        <div className="right-info">
          <h1>
            Oops！Error <span>404</span>…
          </h1>
          <p>We are sorry , the page you resquested cannot be found.</p>
          <Link className="go-home" to="/">
            go home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
