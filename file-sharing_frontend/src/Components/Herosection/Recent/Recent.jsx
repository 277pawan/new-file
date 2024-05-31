import React, { useEffect, useState } from "react";
import "./Recent.css";
import { MdOutlineClose } from "react-icons/md";
import vectorphoto from "../../../Assets/vectorphoto.png";
import pdf from "../../../Assets/pdf.png";
import { BsSendFill } from "react-icons/bs";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import cookies from "js-cookie";
function Recent(props) {
  const [newtoogle, setnewtoogle] = useState(false);
  const [file, setFile] = useState(null);
  const [popup, setpopup] = useState(false);
  const [data, setdata] = useState("");
  const token = Cookies.get("token");
  const [commentdata, setcommentdata] = useState([]);
  const [commentvalue, setcommentvalue] = useState("");
  const fileName = props.previewdata.fileName;
  useEffect(() => {
    if (props.popupvisible) {
      setpopup(true);
    }
  }, [props.popupvisible]);
  // Handle file submit function
  const handlefilesubmitfun = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:4000/imgupload/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      toast.success("file uploaded");
      setnewtoogle(!newtoogle);
      console.log(data);
    } else {
      const data = await response.json();
      console.log(data);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleCloseForm = () => {
    setnewtoogle(false);
  };

  const {
    data: filesdata,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["filedata"],
    queryFn: async () => {
      const token = Cookies.get("token");
      const response = await fetch("http://localhost:4000/imgupload/files", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error("failed to fetch data");
      }
      return response.json();
    },
  });
  const handleCommentFunction = async (filename) => {
    const token = cookies.get("token");
    const body = {
      feedback: commentvalue,
      fileId: filename,
    };
    setcommentvalue("");
    console.log("we are here" + commentvalue);
    const response = await fetch("http://localhost:4000/comments/fileid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error("Failed to add your comment");
      return;
    }
    toast.success(data.message);
  };
  const handleSubmit = async (e, filename) => {
    e.preventDefault();
    try {
      await handleCommentFunction(filename);
      await commentDatafunction(filename);
      setcommentvalue("");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add or fetch comments");
    }
    setcommentvalue("");
  };
  useEffect(() => {
    setcommentvalue("");
  }, [commentdata, fileName]);
  const commentDatafunction = async (filename) => {
    const token = cookies.get("token");
    const response = await fetch(
      `http://localhost:4000/comments?fileId=${filename}`,
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
    setcommentdata(data.comments);
  };
  useEffect(() => {
    commentDatafunction(fileName);
  }, [fileName]);

  const renderFiles = () => {
    if (Array.isArray(filesdata) && filesdata.length > 0) {
      return filesdata.slice(0, 5).map((row) => (
        <div
          key={row.id}
          className={
            props.popupvisible ? "image--box-notvisible" : "image--box"
          }
          onClick={() => {
            props.popupsection(row);
            setpopup(!popup);
            setdata(row);
            commentDatafunction(row.fileName);
          }}
        >
          <div className="image--content">
            <span>
              <img src={vectorphoto} alt="photologo" />
            </span>
            <span className="file-name">{row.fileName}</span>
          </div>
          <div className="box--image">
            {row.url.endsWith(".pdf") ? (
              <img className="popupimage" src={pdf} alt="" />
            ) : row.url.endsWith(".docx") ? (
              <img className="popupimage" src={pdf} alt="" />
            ) : (
              <img className="recent--url" src={row.url} alt="urlofimage" />
            )}
          </div>
        </div>
      ));
    } else {
      return (
        <div className="image__container">
          {Array(5)
            .fill()
            .map((_, index) => (
              <div key={index} className="image--box">
                <div className="image--content">
                  <span>
                    <img src={vectorphoto} alt="photologo" />
                  </span>
                  &nbsp;this is demo.png
                </div>
                <div className="box--image-demo"></div>
              </div>
            ))}
        </div>
      );
    }
  };

  return (
    <div
      className={
        props.popupvisible
          ? "recent__container--notvisible"
          : "recent__container"
      }
    >
      <div className="recent__Navbar">
        <p className="recent--text">Recent</p>
        <div className="new__button__container">
          <button
            className="new--button"
            onClick={() => setnewtoogle(!newtoogle)}
          >
            <span>+</span>
            <span>New</span>
          </button>
        </div>
      </div>
      {newtoogle && (
        <div className="file-input-container">
          <form onSubmit={handlefilesubmitfun} encType="multipart/form-data">
            <div className="files--close">
              <MdOutlineClose size="30px" onClick={handleCloseForm} />
            </div>
            <h1>Add Your File.</h1>
            <article>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed a
              veniam minima, quod, possimus totam reprehenderit placeat eos vero
              sapiente doloribus. Numquam autem sit at, qui quam iure labore ad?
            </article>
            <div className="file__box__container">
              <input
                type="file"
                className="file-input"
                id="file-input"
                onChange={handleFileChange}
              />
              <label htmlFor="file-input" className="custom-file-label">
                Choose File
              </label>
              {file && <span className="file-name">{file.name}</span>}
            </div>
            <button type="submit" className="upload--button">
              Upload
            </button>
          </form>
        </div>
      )}
      {popup && props.popupvisible ? (
        <div className="popup__container">
          <div className="cross--button" onClick={() => props.popupsection("")}>
            {" "}
            <MdOutlineClose size="30px" />
          </div>
          <div className="popup__box1">
            {data.url.endsWith(".pdf") ? (
              <embed
                className="popupimage"
                src={data.url}
                type="application/pdf"
              />
            ) : data.url.endsWith(".docx") ? (
              <iframe className="popupimage" src={data.url}></iframe>
            ) : (
              <img className="popupimage" src={data.url} alt="" />
            )}
          </div>
          <div className="popup__box2">
            <div className="popup__box2__comment">
              <div className="comment--title">Comment...</div>
              <div className="comment--area">
                {Array.isArray(commentdata) &&
                  commentdata.map((data) => (
                    <div key={data.id} className="comment--box">
                      <div>
                        <span className="first--letter">
                          {data.username.slice(0, 1)}
                        </span>
                        <span style={{ fontWeight: "600" }}>
                          {" "}
                          {data.username}
                        </span>
                      </div>
                      <div>{data.feedback}</div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="popup__box2--input">
              <form
                onSubmit={(e) => handleSubmit(e, data.fileName)}
                style={{ display: "flex", gap: "2px" }}
              >
                <input
                  className="input--comment"
                  type="text"
                  placeholder="Enter your comment..."
                  value={commentvalue}
                  onChange={(e) => setcommentvalue(e.target.value)}
                />
                <button style={{ backgroundColor: "none" }}>
                  <BsSendFill size="28px" color="blue" />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div
        className={
          props.popupvisible
            ? "recent__image--notvisible"
            : "recent__image__container"
        }
      >
        <div className="image__container">{renderFiles()}</div>
      </div>
    </div>
  );
}

export default Recent;
