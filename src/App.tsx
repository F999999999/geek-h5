import React from "react";
import "./App.scss";
import AppRouter from "./route";
import CustomRouter from "@/components/CustomRouter";
import { customHistory } from "./utils/history";

function App() {
  return (
    <CustomRouter history={customHistory}>
      <div className="App">
        <AppRouter />
      </div>
    </CustomRouter>
  );
}

export default App;
