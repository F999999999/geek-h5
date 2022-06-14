import styles from "./index.module.scss";

// 性别的列表数据
const genderList = [
  { text: "男", value: "0" },
  { text: "女", value: "1" },
];
// 头像的列表数据
const photoList = [
  { text: "拍照", value: "picture" },
  { text: "本地选择", value: "local" },
];

type Props = {
  onClose: () => void;
  type: "" | "gender" | "photo";
  onUpdateProfile: (type: "gender" | "photo", value: string) => void;
};

const EditList = ({ onClose, type, onUpdateProfile }: Props) => {
  const onItemClick = (value: string) => {
    if (type !== "") onUpdateProfile(type, value);
  };

  const list = type === "gender" ? genderList : photoList;
  return (
    <div className={styles.root}>
      {list.map((item) => (
        <div
          className="list-item"
          key={item.text}
          onClick={() => onItemClick(item.value)}
        >
          {item.text}
        </div>
      ))}
      <div className="list-item" onClick={onClose}>
        取消
      </div>
    </div>
  );
};

export default EditList;
