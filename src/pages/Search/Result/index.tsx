import styles from "./index.module.scss";

import { NavBar } from "antd-mobile";
import { useNavigate } from "react-router-dom";

const Result = () => {
  const navigate = useNavigate();
  console.log("Result");
  return (
    <div className={styles.root}>
      <NavBar onBack={() => navigate(-1)}>搜索结果</NavBar>
      <div className="article-list"></div>
    </div>
  );
};

export default Result;
