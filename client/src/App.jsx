import React, { useEffect, useState } from "react";
import LoginView from "./views/LoginView.jsx";
import UserView from "./views/UserView.jsx";

function BasePage() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(false);

  useEffect(() => {
    console.log(token);
  }, [token]);
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div>
      {user && (
        <UserView
          token={token}
          setToken={setToken}
          user={user}
          setUser={setUser}
        />
      )}
      {!user && (
        <LoginView
          token={token}
          setToken={setToken}
          user={user}
          setUser={setUser}
        />
      )}
    </div>
  );
}

export default BasePage;
