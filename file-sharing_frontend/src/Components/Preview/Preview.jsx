import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaComment } from "react-icons/fa";
import { filesize } from "filesize";
import cookies from "js-cookie";
import profile from "../../Assets/profile.png";
import { toast } from "react-hot-toast";
import "./Preview.css";
import Usestore from "../Usestore";
import { useQuery } from "@tanstack/react-query";

function Preview(props) {
  const userzname = Usestore((state) => state.username);
  const [commentvalue, setcommentvalue] = useState("");
  const [commentdata, setcommentdata] = useState([]);
  const fileName = props.previewData.fileName;

  const handleCommentFunction = async (filename) => {
    const token = cookies.get("token");
    const body = {
      feedback: commentvalue,
      fileId: filename,
    };
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
    setcommentvalue(""); // Clear comment value after successfully adding the comment
  };

  const handleSubmit = async (e, filename) => {
    e.preventDefault();
    try {
      await handleCommentFunction(filename);
      await commentDatafunction(filename);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add or fetch comments");
    }
  };

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
  const { data: managedata, refetch: refetchmanage } = useQuery({
    queryKey: ["managedata"],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await fetch(
        `http://localhost:4000/share-file/check-access?fileId=${fileName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        console.log("data is fetched");
      } else {
        console.log("error found while fetching data");
      }
      return response.json();
    },
  });
  useEffect(() => {
    refetchmanage();
  }, [fileName]);
  console.log(managedata);
  useEffect(() => {
    commentDatafunction(fileName);
  }, [fileName]);

  if (props.visibility) {
    if (props.previewData) {
      const data = props.previewData;
      return (
        <div className="Preview__container">
          <div className="Preview__title">
            {data.fileName}
            <RxCross2
              onClick={
                props.comment ? props.commentsection : props.previewsection
              }
              size="24px"
            />
          </div>
          <div
            className={
              props.comment
                ? "preview__display__comment__container"
                : "preview__display__container"
            }
          >
            <div
              className={
                props.comment
                  ? "preview--image--comment--container"
                  : "preview--image--container"
              }
            >
              <div className="box--photo">
                {data.url.endsWith(".pdf") ? (
                  <embed
                    className="recent--url"
                    src={data.url}
                    type="application/pdf"
                  />
                ) : data.url.endsWith(".docx") ? (
                  <iframe
                    className="recent--url"
                    src={`https://docs.google.com/viewerng/viewer?url=${data.url}&embedded=true`}
                    width="600"
                    height="400"
                  ></iframe>
                ) : (
                  <img className="recent--url" src={data.url} alt="" />
                )}
              </div>
            </div>
            {props.comment ? (
              <div className="comment__manage__section">Comments</div>
            ) : (
              <>
                <div className="preview--access--info">
                  <p className="preview--who">Who has access</p>
                  <div className="preview--images">
                    {" "}
                    {Array.isArray(managedata) &&
                      managedata.map((data) => (
                        <div key={data.id} className="manage--image">
                          <img
                            height="100%"
                            width="100%"
                            style={{ borderRadius: "50%" }}
                            src={data.image ? data.image : profile}
                            alt=""
                          />
                        </div>
                      ))}
                  </div>
                  <button className="preview--button">🔑 Manage access</button>
                </div>
              </>
            )}
          </div>
          {props.comment ? (
            <div className="comment__container">
              <div className="comment__box1">
                {Array.isArray(commentdata) && commentdata.length > 0 ? (
                  commentdata.map((comment) => (
                    <div className="comment--section" key={comment.id}>
                      <div className="comment--heading">
                        <span className="comment--profile">
                          {comment.username.slice(0, 1).toUpperCase()}
                        </span>
                        <span>{comment.username}</span>
                      </div>
                      <p
                        style={{
                          paddingLeft: "10px",
                          margin: "4px",
                          textAlign: "left",
                        }}
                      >
                        {comment.feedback}
                      </p>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Be the first person to add a comment...
                  </div>
                )}
              </div>
              <div>
                <form
                  className="comment__box2"
                  onSubmit={(e) => handleSubmit(e, data.fileName)}
                >
                  <div>
                    <input
                      className="comment--input"
                      type="text"
                      placeholder="Enter your comment....."
                      value={commentvalue} // Ensure the input value is controlled
                      onChange={(e) => setcommentvalue(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      style={{
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: "none",
                        cursor: "pointer",
                      }}
                    >
                      <FaComment size="36px" color="#37A0EA" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="preview__info--container">
              <strong>File Details</strong>
              <br />
              <label htmlFor="">FileName</label>
              <p style={{ textWrap: "wrap", textAlign: "left" }}>
                {data.fileName}
              </p>
              <br />
              <label htmlFor="">Type</label>
              <p>{data.type}</p>
              <br />
              <label htmlFor="">Size</label>
              <p>{filesize(data.size)}</p>
              <br />
              <label htmlFor="">Owner</label>
              <p>{userzname}</p>
              <br />
              <label htmlFor="">Location</label>
              <p>Upload/files</p>
              <br />
              <label htmlFor="">Modified</label>
              <p>{data.lastModified}</p>
              <br />
              <label htmlFor="">Created</label>
              <p>{data.lastModified}</p>
            </div>
          )}
        </div>
      );
    } else {
      const data = props.navbardata;
      return (
        <div className="Preview__container">
          <div className="Preview__title">
            {data.fileName}
            <RxCross2 onClick={props.previewsection} size="24px" />
          </div>
          <div className="preview__display__container">
            <div className="preview--image--container">
              <div className="box--image">
                {data.url.endsWith(".pdf") ? (
                  <embed
                    className="recent--url"
                    src={data.url}
                    type="application/pdf"
                  />
                ) : data.url.endsWith(".docx") ? (
                  <iframe className="recent--url" src={data.url}></iframe>
                ) : (
                  <img className="recent--url" src={data.url} alt="" />
                )}
              </div>
            </div>
            <div className="preview--access--info">
              <p className="preview--who">Who has access</p>
              <div className="preview--images">P P P P </div>
              <button className="preview--button">🔑 Manage access</button>
            </div>
          </div>
          <div className="preview__info--container">
            <strong>File Details</strong>
            <br />
            <label htmlFor="">FileName</label>
            <p style={{ textWrap: "wrap", textAlign: "left" }}>
              {data.fileName}
            </p>
            <br />
            <label htmlFor="">Type</label>
            <p>{data.type}</p>
            <br />
            <label htmlFor="">Size</label>
            <p>{filesize(data.size)}</p>
            <br />
            <label htmlFor="">Owner</label>
            <p>{userzname}</p>
            <br />
            <label htmlFor="">Location</label>
            <p>Upload/files</p>
            <br />
            <label htmlFor="">Modified</label>
            <p>{data.lastModified}</p>
            <br />
            <label htmlFor="">Created</label>
            <p>{data.lastModified}</p>
          </div>
        </div>
      );
    }
  } else {
    return null;
  }
}

export default Preview;
