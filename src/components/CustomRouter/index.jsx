import { useLayoutEffect, useState } from "react";
import { Router } from "react-router-dom";

const CustomRouter = ({ history, children, ...props }) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      history={history}
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      {children}
    </Router>
  );
};

export default CustomRouter;
