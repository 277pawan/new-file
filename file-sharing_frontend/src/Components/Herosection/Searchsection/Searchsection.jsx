import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { HiDotsVertical } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import Usestore from "../../Usestore";
import { filesize } from "filesize";
import toast from "react-hot-toast";
function Searchsection(props) {
  const [toggleRowIndex, setToggleRowIndex] = React.useState(null);
  const [sharetoogle, setsharetoogle] = React.useState(false);
  const [sharedata, setsharedata] = React.useState("");
  const [savetoogle, setsavetoogle] = React.useState(false);
  const [searchvalue, setsearchvalue] = React.useState("");
  const [adduser, setadduser] = React.useState([]);
  const folderstructure = props.folderstructure;

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

  // function for getting user id

  const getUserIds = (users) => {
    return users.map((user) => user.id);
  };

  // const collectKeys = (obj, keys = []) => {
  //   for (let key in obj) {
  //     keys.push(key);
  //     collectKeys(obj[key], keys);
  //   }
  //   return keys;
  // };

  // const keys = collectKeys(folderstructure);

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

  const { data: datashare } = useQuery({
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
      return response.json();
    },
    refetchInterval: 2000,
  });
  const { data: userdata } = useQuery({
    queryKey: ["userdata"],
    queryFn: async () => {
      const token = Cookies.get("token");
      const response = await fetch(
        `http://localhost:4000/users/user-search?q=${searchvalue}`,
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

      return data;
    },
    refetchInterval: 1000,
  });
  const handleSharefunction = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    const userArray = adduser.map((data) => data._id);
    console.log(userArray);
    const data = {
      fileId: sharedata,
      userArray,
    };
    const response = await fetch("http://localhost:4000/share-file/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const dataans = await response.json();
    if (response.ok) {
      console.log(dataans);
    } else {
      toast.error("Something went wrong!, Try again");
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
  return (
    <>
      <div className="Tablesection--title">Search Result...</div>
      <TableContainer
        style={{ position: "relative", height: "-webkit-fill-available" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Index</strong>
              </TableCell>

              <TableCell>
                <strong>FileName</strong>
              </TableCell>
              <TableCell>
                <strong>Type</strong>
              </TableCell>
              <TableCell>
                <strong>Size</strong>
              </TableCell>
              <TableCell style={{ cursor: "pointer", float: "right" }}>
                <strong>Option</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.filesdata && props.filesdata.length > 0 ? (
              props.filesdata.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    onClick={() => props.preview(row)}
                  >
                    {index + 1}
                  </TableCell>

                  <TableCell
                    component="th"
                    scope="row"
                    width="60%"
                    onClick={() => props.preview(row)}
                    style={{ cursor: "pointer" }}
                  >
                    {row.fileName}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    onClick={() => props.preview(row)}
                    style={{ cursor: "pointer" }}
                  >
                    {row.type}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    onClick={() => props.preview(row)}
                    style={{ cursor: "pointer" }}
                  >
                    {filesize(row.size)}
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
                <TableCell colSpan={3} align="center">
                  No files available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
              onChange={(e) => setsearchvalue(e.target.value)}
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
          {/* </div> */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {adduser.map((row) => (
              <p className="name--user">
                {row.username}
                <p style={{ position: "relative", top: "4px" }}>
                  <MdOutlineClose
                    size="20px"
                    onClick={() => removeUser(row._id)}
                  />
                </p>
              </p>
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
    </>
  );
}

export default Searchsection;
