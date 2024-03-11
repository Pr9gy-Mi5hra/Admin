"use client";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { addNotification } from "@/stores/reducers/notificationReducer";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import LoginHelper from "@/apiHelper/login";
import { setUser } from "@/stores/reducers/generalReducer";
const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state.general.user);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (user && user.token) {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "Already logged in",
          open: true,
          severity: "info",
        })
      );
      setEmail("");
      setPassword("");
      return; 
    }
    setLoading(true);
    const response = await LoginHelper({
      email: email,
      password: password,
    });
    if (response.success === true) {
      setLoading(false);
      const user = response.data.data;
      user.token = response.data.token;
      dispatch(setUser(user));
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: " Login successfull",
          open: true,
          severity: "success",
        })
      );
      setLoading(false);
      setEmail("");
      setPassword("");
    } else {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "Login failed",
          open: true,
          severity: "error",
        })
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.email) {
      setLoggedIn(true);
      router.refresh();
    }
  }, [user, loggedIn]);

  return (
    <div className="w-ful pt-10 flex justify-center px-10 lg:px-20">
      {loggedIn ? (
        <p>Redirecting to homepage...</p>
      ) : (
        <div className="space-y-4 w-full lg:w-4/12">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-lg font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded"
              required
            />
          </div>

          <div>
            <button
              onClick={handleLogin}
              className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {" "}
              {loading ? (
                <div className="text-white ">
                  <CircularProgress color="inherit" size={20} />
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
