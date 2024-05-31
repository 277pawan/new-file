import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { HiDotsVertical } from "react-icons/hi";
import { FaComment } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import frame1 from "../../../Assets/frame1.png";
import { BsSendFill } from "react-icons/bs";
import frame2 from "../../../Assets/frame2.png";
import profile from "../../../Assets/profile.png";
import emptybox from "../../../Assets/emptybox.jpg";
import userprofile from "../../../Assets/usershareprofile.jpg";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import "./Tablesection.css";
import Usestore from "../../Usestore";
import toast from "react-hot-toast";
import { debounce } from "@mui/material";

export default function Tablesection(props) {
  const [toggleRowIndex, setToggleRowIndex] = React.useState(null);
  const [sharetoogle, setsharetoogle] = React.useState(false);
  const [sharedata, setsharedata] = React.useState("");
  const [savetoogle, setsavetoogle] = React.useState(false);
  const [searchvalue, setsearchvalue] = React.useState("");
  const userzname = Usestore((state) => state.username);
  const userzimage = Usestore((state) => state.userimage);
  const [adduser, setadduser] = React.useState([]);
  const [userdata, setuserdata] = React.useState("");
  const [selectedFolder, setSelectedFolder] = React.useState(null);
  const [emails, setEmails] = React.useState([]);
  const [emailtoogle, setemailtoogle] = React.useState(false);
  const [prevFilesLength, setPrevFilesLength] = React.useState(0);
  const [previewdata, setpreviewdata] = React.useState([]);
  const [preview, setpreview] = React.useState(false);
  const [commentvalue, setcommentvalue] = React.useState("");
  const [commentdata, setcommentdata] = React.useState("");
  const folderstructure = props.folderstructure;
  function downloadFunction(url) {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const bloburl = window.URL.createObjectURL(new Blob([blob]));
        const filename = url.split("/").pop();
        const link = document.createElement("a");
        link.href = bloburl;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  }

  const handleCommentFunction = async (filename) => {
    const token = Cookies.get("token");
    console.log(token);
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
  };
  const handleSubmit = async (e, filename) => {
    e.preventDefault();
    try {
      await handleCommentFunction(filename);
      setcommentdata("");
      await commentDatafunction(filename);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add or fetch comments");
    }
  };
  const commentDatafunction = async (filename) => {
    const token = Cookies.get("token");
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
  React.useEffect(() => {
    commentDatafunction(previewdata.fileName);
  }, [previewdata.fileName]);
  // Add user in array of object.
  const handleadduser = (user) => {
    setsearchvalue("");
    if (!adduser.find((u) => u._id === user._id)) {
      setadduser([...adduser, user]);
    }
  };

  // Remove user from array of object.
  const removeUser = (id) => {
    setadduser(adduser.filter((user) => user._id !== id));
  };
  const removeUserEmails = (indexvalue) => {
    setEmails((prevemails) =>
      prevemails.filter((email, index) => indexvalue !== index)
    );
  };

  // function for getting user id

  const getUserIds = (users) => {
    return users.map((user) => user.id);
  };

  // function for sharing the files access to users

  const shareFile = async (fileId, users) => {
    const token = Cookies.get("token");
    const userIds = getUserIds(users);

    const response = await fetch("http://localhost:4000/share-file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileId,
        userIds,
      }),
    });

    if (!response.ok) {
      console.error("failed to fetch data");
    }

    return response.json();
  };
  const handleShareButtonClick = async () => {
    try {
      await shareFile(sharedata, adduser);
      console.log("File shared successfully");
    } catch (error) {
      console.error(error.message);
    }
  };

  const collectNestedKeys = (obj, parentKey = "") => {
    const keys = [];
    const stack = [{ currentObj: obj, currentPath: parentKey }];

    while (stack.length) {
      const { currentObj, currentPath } = stack.pop();

      let hasSubfolders = false;
      for (let key in currentObj) {
        const value = currentObj[key];
        const fullPath = currentPath ? `${key}` : key;

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          stack.push({ currentObj: value, currentPath: fullPath });
          hasSubfolders = true;
        }
      }

      // If no subfolders were found and the current path is not empty, this is a last-level folder
      if (!hasSubfolders && currentPath) {
        keys.push(currentPath);
      }

      // Handle the case where the object itself is empty and the path is at the root level
      if (
        !hasSubfolders &&
        !currentPath &&
        Object.keys(currentObj).length === 0
      ) {
        keys.push(parentKey);
      }
    }

    return keys;
  };
  const keys = collectNestedKeys(folderstructure);
  const handleToggle = (index) => {
    if (toggleRowIndex === index) {
      setToggleRowIndex(null);
    } else {
      setToggleRowIndex(index);
    }
  };

  const handleCloseForm = () => {
    setsavetoogle(!savetoogle);
  };

  const handlesharecloseform = () => {
    setsharetoogle(!sharetoogle);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value;
      if (emailtoogle && value.includes("@")) {
        setEmails((prevEmails) => {
          if (!prevEmails.includes(value)) {
            return [...prevEmails, value];
          }
          return prevEmails;
        });
        setsearchvalue("");
      } else if (emailtoogle) {
        alert("Please enter a valid email address.");
      }
    }
  };
  const { data: filesdata } = useQuery({
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
    refetchInterval: 2000,
  });
  const { data: datashare, refetch: refetchDatashare } = useQuery({
    queryKey: ["datashare"],
    queryFn: async () => {
      const token = Cookies.get("token");
      const response = await fetch("http://localhost:4000/share-file", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error("failed to fetch data");
      }
      const data = await response.json();
      return data;
    },
  });
  const fetchUserdata = React.useCallback(
    debounce(async (value) => {
      const token = Cookies.get("token");
      const response = await fetch(
        `http://localhost:4000/users/user-search?q=${value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.length === 0) {
        setemailtoogle(true);
      } else {
        setemailtoogle(false);
      }
      if (!response.ok) {
        console.error("failed to fetch data");
      }
      setuserdata(data);
    }, 500),
    []
  );
  React.useEffect(() => {
    if (searchvalue === null) {
      return;
    }
    fetchUserdata(searchvalue);
  }, [searchvalue, fetchUserdata]);
  const handleSharefunction = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (adduser.length === 0 && emails.length === 0) {
      toast.error("Please select the user.");
      return;
    }
    const userArray = adduser.map((data) => data._id);
    console.log(userArray);
    const data = {
      fileId: sharedata,
      userArray,
      emails,
    };
    const response = await fetch("http://localhost:4000/share-file/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      toast.error("Something went wrong!, Try again");
    } else {
      toast.success(`Successfully Shared.`);
      setEmails([]);
      setadduser([]);
      refetchDatashare();
    }
  };

  const handleDeleteFunction = async (fileName) => {
    const token = Cookies.get("token");
    const response = await fetch(
      `http://localhost:4000/imgupload/delete-file?fileName=${fileName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      toast.success("Deleted successfully.");
    } else {
      toast.error("Failed to Delete, Try again!");
    }
    return;
  };
  React.useEffect(() => {
    if (filesdata && filesdata.length > 0) {
      const newSize = filesdata.reduce((total, file) => total + file.size, 0);
      props.setstorage(newSize);
      setPrevFilesLength(filesdata.length);
    }
  }, [filesdata, prevFilesLength]);
  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
  };
  const handlesavefileFunction = (filevalue) => {
    props.setfilefolder(selectedFolder);
    props.setfilevalue(filevalue);
    setsavetoogle(!savetoogle);
    toast.success("File Saved Successfully");
  };
  return (
    <>
      <div className={props.popupvisible ? "" : "Tablesection--title"}>
        My Files
      </div>
      <TableContainer
        className={props.popupvisible ? "tablecontainer" : ""}
        style={{ position: "relative" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Asset Name</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Tag</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Created</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Owner</strong>
              </TableCell>
              <TableCell align="right" style={{ cursor: "pointer" }}>
                <strong>Option</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.sharedtoggle ? (
              <>
                {" "}
                {datashare && datashare.length > 0 ? (
                  datashare.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        width="200px"
                        onClick={() => props.preview(row)}
                      >
                        <div className="table-cell">
                          <img
                            src={row.type === "png" ? frame2 : frame1}
                            alt="frame"
                          />
                          {row.fileName}
                        </div>
                      </TableCell>
                      <TableCell align="right" width="200px">
                        {1}
                      </TableCell>
                      <TableCell align="right" width="200px">
                        {row.lastModified}
                      </TableCell>
                      <TableCell align="right" width="100px">
                        <div className="table-cell--profile">
                          <img
                            height="100%"
                            width="24%"
                            src={row.userImage ? row.userImage : profile}
                            alt="profile"
                          />
                          {row.userName}
                        </div>
                      </TableCell>
                      <TableCell
                        style={{ cursor: "pointer" }}
                        width="100px"
                        align="right"
                        onClick={() => handleToggle(index)}
                      >
                        <HiDotsVertical
                          size="20px"
                          style={{ cursor: "pointer" }}
                        />
                        {toggleRowIndex === index ? (
                          <div className="table--context--menu">
                            <p
                              className="table--p--text"
                              onClick={() => setsavetoogle(!savetoogle)}
                            >
                              Save
                            </p>
                            <hr />
                            <p
                              className="table--p--text"
                              onClick={() => {
                                props.preview(row);
                                props.setcomment(true);
                              }}
                            >
                              Comment
                            </p>
                            '' <hr />
                            <p
                              className="table--p--text"
                              onClick={() => {
                                setsharetoogle(!sharetoogle);
                                setsharedata(row.fileName);
                              }}
                            >
                              Share
                            </p>
                            <hr />
                            <p
                              className="table--p--text"
                              onClick={() => handleDeleteFunction(row.fileName)}
                            >
                              Delete
                            </p>
                          </div>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="demo--container">
                        <img
                          style={{ height: "60%", width: "20%" }}
                          src={emptybox}
                          alt="emptybox"
                        />
                        <p>Be someone to add here something.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}{" "}
              </>
            ) : (
              <>
                {" "}
                {filesdata && filesdata.length > 0 ? (
                  filesdata.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        width="200px"
                        onClick={() => props.preview(row)}
                      >
                        <div className="table-cell">
                          <img
                            src={row.type === "png" ? frame2 : frame1}
                            alt="frame"
                          />
                          {row.fileName}
                        </div>
                      </TableCell>
                      <TableCell align="right" width="200px">
                        {1}
                      </TableCell>
                      <TableCell align="right" width="200px">
                        {row.lastModified}
                      </TableCell>
                      <TableCell align="right" width="100px">
                        <div className="table-cell--profile">
                          <img
                            height="100%"
                            width="24%"
                            src={userzimage ? userzimage : profile}
                            alt="profile"
                          />
                          {userzname}
                        </div>
                      </TableCell>
                      <TableCell
                        width="100px"
                        align="right"
                        onClick={() => handleToggle(index)}
                      >
                        <HiDotsVertical size="20px" />
                        {toggleRowIndex === index ? (
                          <div className="table--context--menu">
                            <p
                              className="table--p--text"
                              onClick={() => {
                                setpreviewdata(row);
                                setpreview(!preview);
                              }}
                            >
                              Preview
                            </p>
                            <hr />
                            <p
                              className="table--p--text"
                              onClick={() => {
                                setsavetoogle(!savetoogle);
                                setsharedata(row.fileName);
                              }}
                            >
                              Save
                            </p>
                            <hr />
                            <p
                              className="table--p--text"
                              onClick={() => {
                                downloadFunction(row.url);
                              }}
                            >
                              Download
                            </p>
                            <hr />
                            <p
                              className="table--p--text"
                              onClick={() => {
                                props.preview(row);
                                props.setcomment(true);
                              }}
                            >
                              Comment
                            </p>
                            <hr />
                            <p
                              className="table--p--text"
                              onClick={() => {
                                setsharetoogle(!sharetoogle);
                                setsharedata(row.fileName);
                              }}
                            >
                              Share
                            </p>
                            <hr />
                            <p
                              className="table--p--text"
                              onClick={() => handleDeleteFunction(row.fileName)}
                            >
                              Delete
                            </p>
                          </div>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="demo--container">
                        <img
                          style={{ height: "60%", width: "20%" }}
                          src={emptybox}
                          alt="emptybox"
                        />
                        <p>Be someone to add here something.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {savetoogle ? (
        <div className="save__container">
          <div className="files--close" onClick={handleCloseForm}>
            <MdOutlineClose size="30px" />
          </div>
          <h1>Add-file</h1>
          <p className="text--desc">
            File saver app select your folder and save your file where you want
            to save.
          </p>
          <p className="save--title">Select folder to save</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlesavefileFunction(sharedata);
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {keys.map((data) => (
                <div
                  key={data.id}
                  className="save--button"
                  style={{
                    backgroundColor:
                      selectedFolder === data
                        ? "rgba(0, 198, 73, 0.70)"
                        : "rgb(0, 140, 255)",
                  }}
                  onClick={() => handleFolderClick(data)}
                >
                  {data}
                </div>
              ))}
            </div>
            <button type="submit" className="save--final--button">
              Save file
            </button>
          </form>{" "}
        </div>
      ) : null}
      {sharetoogle ? (
        <div className="share__container">
          <div className="share--close--button" onClick={handlesharecloseform}>
            <MdOutlineClose />
          </div>
          <p className="share--title">Share Your File</p>
          <p className="share--link">{sharedata}</p>
          <div className="search__share__container">
            <input
              className="search--bar--share"
              placeholder="🔍 Enter your search text..."
              type="search"
              value={searchvalue}
              onChange={(e) => setsearchvalue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>{" "}
          {userdata.length > 0 ? (
            <div
              className={
                userdata.length > 0
                  ? "search__contain--data"
                  : "search__contain"
              }
            >
              {userdata.map((row) => (
                <div
                  className="search--username"
                  key={row.id}
                  onClick={() => handleadduser(row)}
                >
                  <p className="search--user--name">{row.username}</p>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              width: "auto",
            }}
          >
            {adduser.map((row) => (
              <div className="name--user">
                <div className="share--image">
                  <img
                    style={{ borderRadius: "50%" }}
                    height="100%"
                    width="100%"
                    src={row.image ? row.image : userprofile}
                    alt="userimage"
                  />
                </div>
                <span style={{ width: "100%" }}>{row.username}</span>
                <div
                  style={{ position: "relative", top: "4px", width: "auto" }}
                >
                  <MdOutlineClose
                    size="20px"
                    onClick={() => removeUser(row._id)}
                  />
                </div>
              </div>
            ))}

            {emails.length > 0 &&
              emails.map((row, index) => (
                <div className="name--user" key={index}>
                  <div className="share--image">
                    <img
                      height="100%"
                      width="100%"
                      src={row.image ? row.image : userprofile}
                      alt="userimage"
                    />
                  </div>
                  {row}
                  <div
                    style={{ position: "relative", top: "4px", width: "auto" }}
                  >
                    <MdOutlineClose
                      size="20px"
                      onClick={() => removeUserEmails(index)}
                    />
                  </div>
                </div>
              ))}
          </div>
          <button onClick={handleSharefunction} className="share--button">
            Share
          </button>
          <p className="share--article">
            this is certified link and secured link don't try to misuse it.
          </p>
        </div>
      ) : null}
      {preview ? (
        <div className="modal-overlay">
          <div>
            <MdOutlineClose
              style={{
                position: "relative",
                top: "-360px",
                left: "10px",
                cursor: "pointer",
              }}
              size="30px"
              onClick={() => {
                setpreviewdata("");
                setpreview(!preview);
              }}
            />
          </div>
          <div className="modal--preview">
            {previewdata && typeof previewdata === "object" ? (
              <>
                {previewdata.url.endsWith(".pdf") ? (
                  <embed
                    className="popupimage"
                    src={previewdata.url}
                    type="application/pdf"
                  />
                ) : previewdata.url.endsWith(".docx") ? (
                  <iframe className="popupimage" src={previewdata.url}></iframe>
                ) : (
                  <img className="popupimage" src={previewdata.url} alt="" />
                )}
              </>
            ) : (
              <div>No preview data available</div>
            )}
          </div>
          <div className="modal--content">
            <p>Comment...</p>
            <div className="comm__container">
              <div className="comm__box1">
                {Array.isArray(commentdata) ? (
                  commentdata.map((data) => (
                    <div className="comm--section" key={data.id}>
                      <div className="comment--heading">
                        <span className="comm--profile">
                          {data.username.slice(0, 1).toUpperCase()}
                        </span>
                        <span>{data.username}</span>
                      </div>
                      <p
                        style={{
                          paddingLeft: "4px",
                          margin: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.feedback}
                      </p>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                    }}
                  >
                    Be first person to add some comment...
                  </div>
                )}
              </div>
              <div>
                <form
                  className="comment__box2"
                  onSubmit={(e) => handleSubmit(e, previewdata.fileName)}
                >
                  <div style={{ width: "100%" }}>
                    <input
                      className="comment--input comm--input"
                      type="text"
                      placeholder="Enter your comment....."
                      onChange={(e) => setcommentvalue(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <button type="submit" style={{ backgroundColor: "none" }}>
                      <BsSendFill size="26px" color="blue" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
