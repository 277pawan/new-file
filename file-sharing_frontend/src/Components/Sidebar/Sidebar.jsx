import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import Logo from "../../Assets/Frame 4.png";
import footerlogo from "../../Assets/footerlogo.png";
import ProgressBar from "@ramonak/react-progress-bar";
import Cookies from "js-cookie";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { MdOutlineFolderShared } from "react-icons/md";
import { FcStatistics } from "react-icons/fc";
import { IoSettings } from "react-icons/io5";
import { CiStar } from "react-icons/ci";
import { filesize } from "filesize";

function Folder({
  name,
  content,
  onClick,
  createNewFolder,
  currentPath,
  path,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick(path.concat(name), name, content);
  };

  return (
    <div className="Folder">
      <p className="Folder__name" onClick={handleClick}>
        {isOpen ? (
          <FaAngleDown color="white" />
        ) : (
          <FaAngleRight color="white" />
        )}
        {name}
      </p>
      {isOpen && content && (
        <div className="Folder__content">
          {renderFolders(
            content,
            onClick,
            createNewFolder,
            currentPath,
            path.concat(name)
          )}
        </div>
      )}
    </div>
  );
}

function renderFolders(
  folders = {},
  onClick,
  createNewFolder,
  currentPath,
  path
) {
  return Object.keys(folders).map((folderName) => {
    const content = folders[folderName];
    if (typeof content === "object" && content !== null) {
      return (
        <Folder
          key={folderName}
          name={folderName}
          content={content}
          onClick={onClick}
          createNewFolder={createNewFolder}
          currentPath={currentPath}
          path={path}
        />
      );
    }
    return null;
  });
}

function Sidebar({
  folders = {},
  onFolderClick,
  createNewFolder,
  storage,
  setsharedtoggle,
  popupvisible,
  setsidebarfiledata,
  setdeletetoogle,
  deletetoogle,
}) {
  const [newFolderName, setNewFolderName] = useState("");
  const [foldname, setfoldname] = useState("");
  const handlefolderdata = async () => {
    console.log("they called us");
    const token = Cookies.get("token");
    const response = await fetch(
      `http://localhost:4000/folder-struc/folder-search?folderName=${foldname}`,
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
      console.error("Failed to fetch data of folders");
    }
    console.log(data);
    setdeletetoogle(false);
    setsidebarfiledata(data);
  };
  useEffect(() => {
    handlefolderdata();
  }, [foldname, deletetoogle]);
  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (newFolderName.trim() !== "") {
      createNewFolder(newFolderName, []);
      setNewFolderName("");
    }
  };
  const currentsize = storage / 1024 / 100;
  const totalsize = 100;
  const handleClick = (path, folderName, content) => {
    setfoldname(folderName);
    console.log(folderName);
    onFolderClick(path, folderName, content);
  };
  return (
    <div
      className={
        popupvisible ? "Sidebar__container__popup" : "Sidebar__container"
      }
    >
      <div className="Logo__container">
        <div>
          <img src={Logo} alt="Logo" />
        </div>
      </div>
      <div className="Files__container">
        {renderFolders(folders, handleClick, createNewFolder, [], [])}
        <ul className="ul--list">
          <li
            className="li--list"
            onClick={() => {
              setsharedtoggle(false);
              setsidebarfiledata([]);
            }}
          >
            <CiStar color="white" size="24px" />
            Starred
          </li>
          <li className="li--list" onClick={() => setsharedtoggle(true)}>
            <MdOutlineFolderShared size="24px" /> Shared with me
          </li>
          <li className="li--list">
            <FcStatistics size="24px" /> Statistics
          </li>
          <li className="li--list">
            <IoSettings size="24px" /> Setting
          </li>
        </ul>
      </div>
      <div className="Fixed__container">
        <form onSubmit={handleCreateFolder}>
          <div>
            <input
              className="create--folder--input"
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder name"
            />
            <button className="create--folder--button" type="submit">
              +
            </button>
          </div>
        </form>
      </div>
      <div className="Files__footer">
        <div className="footer__container">
          <div>
            <img src={footerlogo} alt="footerlogo" />
          </div>
          <div>
            <ProgressBar
              completed={Math.floor(currentsize)}
              maxCompleted={totalsize}
              bgColor="#79b6e2"
              height="12px"
              isLabelVisible="false"
              labelClassName="hidden-label"
            />
            <p className="footer__text">
              You have used {Math.floor(currentsize)}MB out of 100MB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
