import styles from "./index.module.scss";
import { useParams } from "react-router-dom";

const Article = () => {
  const params = useParams();
  return <div className={styles.root}>Article {params.id}</div>;
};

export default Article;
