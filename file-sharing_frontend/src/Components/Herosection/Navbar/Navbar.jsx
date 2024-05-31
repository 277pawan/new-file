import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./Navbar.css";
import Cookies from "js-cookie";
import Storage from "../../../Assets/Frame 13747.png";
import Dots from "../../../Assets/Vector.png";
import Profile from "../../../Assets/profile.png";
import useUserStore from "../../Usestore";
import Usestore from "../../Usestore";
import { useQuery } from "@tanstack/react-query";

function Navbar(props) {
  const [dots, setdots] = useState(false);
  const [loginstate, setloginstate] = useState(false);
  const [logintoogle, setlogintoogle] = useState(false);
  const [animClass, setAnimClass] = useState("");
  const [userinfo, setuserinfo] = useState("");
  const [loginemail, setloginemail] = useState("");
  const [loginpassword, setloginpassword] = useState("");
  const [signinname, setsigninname] = useState("");
  const [signinemail, setsigninemail] = useState("");
  const [signinpassword, setsigninpassword] = useState("");
  const [navsearch, setnavsearch] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const formRef = useRef(null);
  const setuseremail = useUserStore((state) => state.setzuseremail);
  const setusername = useUserStore((state) => state.setzusername);
  const setuserimage = useUserStore((state) => state.setzuserimage);
  const userzimage = Usestore((state) => state.userimage);
  const userzname = Usestore((state) => state.username);
  // User login function
  const handleloginform = async (e) => {
    e.preventDefault();
    const body = { useremail: loginemail, userpassword: loginpassword };
    const response = await fetch("http://localhost:4000/users/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const data = await response.json();
      setloginstate(!loginstate);
      Cookies.set("token", data.token);
      toast.success(data.message);
      setTimeout(() => {
        window.location.href = `/user?id=${data.token}`;
      }, 1500);
    } else {
      const data = await response.json();
      toast.error(data.message);
    }
  };

  // User sign-in function
  const handlesigninform = async (e) => {
    e.preventDefault();
    const body = {
      username: signinname,
      useremail: signinemail,
      userpassword: signinpassword,
    };
    const response = await fetch("http://localhost:4000/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      setlogintoogle(!logintoogle);
      toast.success("Account created successfully!");
    } else {
      const data = await response.json();
      toast.error(data.message);
    }
  };

  // Google login function
  const handlegooglelogin = () => {
    window.open("http://localhost:4000/users/google", "_self");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        let token = params.get("id");
        Cookies.set("token", token);
        const response = await fetch(`http://localhost:4000/users/token`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          toast.success("Login successfully.");
          setuserinfo(data);
          setuseremail(data.useremail);
          setusername(data.username);
          setuserimage(data.image);
        } else {
          const data = await response.json();
          console.error(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleLoginToggle = () => {
    setAnimClass("form-exit");
    setTimeout(() => {
      setlogintoogle(!logintoogle);
      setAnimClass("form-enter");
    }, 300);
  };

  const handleCloseForm = () => {
    setloginstate(false);
  };

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      handleCloseForm();
    }
  };

  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      handleCloseForm();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);
  const { data: filedata } = useQuery({
    queryKey: ["userdata", navsearch],
    queryFn: async () => {
      if (!navsearch) return [];
      const token = Cookies.get("token");
      const response = await fetch(
        `http://localhost:4000/imgupload/file-search?q=${navsearch}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        console.error("failed to fetch data");
      }
      return response.json();
    },
    refetchInterval: 1000,
  });
  props.setfiledata(filedata);
  const fileinfofunction = async () => {
    const token = Cookies.get("token");
    const response = await fetch(
      `http://localhost:4000/imgupload/file-info?fileName=${navsearch}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.error("failed to fetch data");
    }

    props.preview(data);
    props.setnavbardata(data);
    console.log(data);
  };
  useEffect(() => {
    if (Array.isArray(filedata)) {
      setSearchSuggestions(filedata);
      console.log(searchSuggestions);
    }
  }, [filedata]);
  const handleSuggestionClick = async (suggestion) => {
    setnavsearch(suggestion);
    console.log(navsearch);
    setSearchSuggestions([]);
    try {
      await fileinfofunction();
    } catch (error) {
      console.error("Error fetching file info:", error);
    }
  };
  const handleLogoutFunction = () => {
    Cookies.set("token", "");
    window.location.href = "/";
  };
  return (
    <div
      className={
        props.popupvisible
          ? "Navbar__container--notvisible"
          : "Navbar__container"
      }
    >
      <div className="storage">
        <img src={Storage} width="100%" alt="Storage" />
      </div>
      <div className="search__container">
        <input
          className="search--bar"
          placeholder="🔍 Enter your search text..."
          type="search"
          value={navsearch}
          onChange={(e) => setnavsearch(e.target.value)}
        />
      </div>

      <div className="profile--option">
        <div className="profile--section">
          <img
            style={{ borderRadius: "50%" }}
            src={userzimage ? userzimage : Profile}
            height="100%"
            width="100%"
            alt="Profile"
          />
        </div>
        <div>
          <p>{userzname ? userzname : "John Bhai"}</p>
        </div>
        <div
          className="dot--image"
          onClick={() => {
            setdots(!dots);
          }}
        >
          <img src={Dots} width="4.5px" alt="dots" />
          {dots ? (
            <div className="context--menu">
              <p>Profile</p>
              <hr color="white" />
              <p
                onClick={() => {
                  if (userzname) {
                    handleLogoutFunction();
                  } else {
                    setloginstate(!loginstate);
                  }
                }}
              >
                {userzname ? "Logout" : "Login"}
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {loginstate ? (
        <div className="form-container" ref={formRef}>
          {logintoogle ? (
            <>
              <p className="title">Create account</p>
              <form className={`form ${animClass}`} onSubmit={handlesigninform}>
                <input
                  type="text"
                  className="input"
                  placeholder="Name"
                  name="username"
                  onChange={(e) => setsigninname(e.target.value)}
                  value={signinname}
                  required
                />
                <input
                  type="email"
                  className="input"
                  placeholder="Email"
                  name="useremail"
                  onChange={(e) => setsigninemail(e.target.value)}
                  value={signinemail}
                  required
                />
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                  name="userpassword"
                  onChange={(e) => setsigninpassword(e.target.value)}
                  value={signinpassword}
                  required
                />
                <button type="submit" className="form-btn">
                  Create account
                </button>
              </form>
              <p className="sign-up-label">
                Already have an account?
                <span className="sign-up-link" onClick={handleLoginToggle}>
                  Log in
                </span>
              </p>
            </>
          ) : (
            <>
              <p className="title">Welcome</p>
              <form className={`form ${animClass}`} onSubmit={handleloginform}>
                <input
                  type="email"
                  className="input"
                  placeholder="Email"
                  name="useremail"
                  onChange={(e) => setloginemail(e.target.value)}
                  value={loginemail}
                  required
                />
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                  name="userpassword"
                  onChange={(e) => setloginpassword(e.target.value)}
                  value={loginpassword}
                  required
                />
                <button type="submit" className="form-btn">
                  Log In
                </button>
              </form>
              <p className="sign-up-label">
                Want to create an account?
                <span className="sign-up-link" onClick={handleLoginToggle}>
                  Login
                </span>
              </p>
            </>
          )}
          <div className="buttons-container">
            <div className="google-login-button" onClick={handlegooglelogin}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                version="1.1"
                x="0px"
                y="0px"
                className="google-icon"
                viewBox="0 0 48 48"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                                     c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                                     c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                                     C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                                     c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                                     c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              <span style={{ fontWeight: "bolder", fontSize: "13px" }}>
                Sign up with Google
              </span>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Toaster />
    </div>
  );
}

export default Navbar;
