import { Button } from "antd-mobile";
import Icon from "@/components/Icon";

const Layout = () => {
  return (
    <div>
      Layout
      <Button color="primary" fill="solid">
        Solid
      </Button>
      <Button>Button</Button>
      <Icon type={"iconbtn_like_sel"} />
    </div>
  );
};

export default Layout;
