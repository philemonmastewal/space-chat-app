import React from "react";

// below we could use redux as well but we used react router for simplicity so we could focus more on the socket.io implementation, so we decided to pass the props as query parameters with react router instead
import { BrowserRouter as Router, Route } from "react-router-dom";

import Join from "./components/Join/Join";
import Chat from "./components/Chat/Chat";

const App = () => (
  <Router>
    <Route path="/" exact component={Join} />
    <Route path="/chat" exact component={Chat} />
  </Router>
);

export default App;
