import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Main.css";
import Herosection from "../Herosection/Herosection";
import Sidebar from "../Sidebar/Sidebar";
import Preview from "../Preview/Preview";
import cookies from "js-cookie";
import debounce from "lodash.debounce";

function Main() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderStructure, setFolderStructure] = useState({ Storage: {} });
  const [currentPath, setCurrentPath] = useState(["Mainfolder"]);
  const [previewData, setPreviewData] = useState("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [navbardata, setnavbardata] = useState("");
  const [comment, setcomment] = useState(false);
  const [storage, setstorage] = useState(0);
  const [sharedtoggle, setsharedtoggle] = useState(false);
  const [filedata, setfiledata] = useState([]);
  const [sidebarfiledata, setsidebarfiledata] = useState([]);
  const [popupvisible, setpopupvisible] = useState(false);
  const [filefolder, setfilefolder] = useState("");
  const [filevalue, setfilevalue] = useState("");
  const [popupdata, setpopupdata] = useState("");
  const [deletetoogle, setdeletetoogle] = useState(false);
  const [commentdata, setcommentdata] = useState("");
  const token = cookies.get("token");
  const isInitialMount = useRef(true);

  // Fetch folder data when the component mounts
  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/folder-struc/folder-get",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setFolderStructure(data || { Storage: {} });
        } else {
          console.log("No data to display.");
        }
      } catch (error) {
        console.error("Error fetching folder data:", error);
      }
    };
    fetchFolderData();
  }, [token]);

  // Debounced function to upload folder data
  const uploadFolderData = useCallback(
    debounce(async (data) => {
      console.log(data);
      try {
        const response = await fetch(
          "http://localhost:4000/folder-struc/folder-set",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error uploading folder data:", error);
      }
    }, 5000),
    []
  );

  // Upload folder data when there's a meaningful change
  useEffect(() => {
    if (!isInitialMount.current) {
      uploadFolderData({ folder: folderStructure });
    } else {
      isInitialMount.current = false;
    }
  }, [folderStructure, uploadFolderData]);

  // Handle folder click event
  const handleFolderClick = (path, folderName, content) => {
    setSelectedFolder({ folderName, content });
    setCurrentPath(path);
    uploadFolderData({ folder: folderStructure });
  };

  // Create a new folder in the current path
  // Check if the path contains files
  const containsFiles = (path) => {
    let currentLevel = folderStructure;
    for (const folder of path) {
      if (!currentLevel[folder]) {
        return false;
      }
      currentLevel = currentLevel[folder];
    }

    // Check if the current level contains files
    return Object.values(currentLevel).some(
      (content) => typeof content === "string"
    );
  };

  // Create a new folder in the current path
  const createNewFolder = (newFolderName) => {
    if (currentPath.length > 6) {
      alert("You cannot create folders more than 6 levels deep.");
      return;
    }

    // Check if there are files in the current path
    if (containsFiles(currentPath)) {
      alert(
        "Cannot create a new folder here because there are existing files."
      );
      return;
    }

    setFolderStructure((prevStructure) => {
      const newStructure = { ...prevStructure };
      let currentLevel = newStructure;

      currentPath.forEach((folder) => {
        if (!currentLevel[folder]) {
          currentLevel[folder] = {};
        }
        currentLevel = currentLevel[folder];
      });

      if (!currentLevel[newFolderName]) {
        currentLevel[newFolderName] = {};
      }
      setCurrentPath([...currentPath, newFolderName]);
      return newStructure; // Return the updated structure
    });
  };

  // Handle preview section
  const previewsection = (data) => {
    setPreviewData(data);
    setIsPreviewVisible(!isPreviewVisible);
  };

  const popupsection = (data) => {
    setpopupdata(data);
    setpopupvisible(!popupvisible);
    console.log(popupvisible);
  };

  const commentpreviewsection = (data) => {
    setcomment(!comment);
    setPreviewData(data);
    setIsPreviewVisible(!isPreviewVisible);
  };

  useEffect(() => {
    if (navbardata) {
      console.log(navbardata);
      setIsPreviewVisible(true); // Show the preview section
    } else {
      setIsPreviewVisible(false); // Hide the preview section
    }
  }, [navbardata]);

  // Function to save filevalue inside the correct folder
  const saveFileValueInFolder = (folderPath, fileValue) => {
    setFolderStructure((prevStructure) => {
      const newStructure = { ...prevStructure };
      let currentLevel = newStructure;

      folderPath.forEach((folder, index) => {
        if (!currentLevel[folder]) {
          currentLevel[folder] = {};
        }
        if (index === folderPath.length - 1) {
          // Last folder in the path
          if (!Array.isArray(currentLevel[folder])) {
            currentLevel[folder] = [fileValue];
          } else {
            currentLevel[folder].push(fileValue);
          }
        } else {
          currentLevel = currentLevel[folder];
        }
      });

      return newStructure;
    });
  };

  // Save filevalue in the corresponding folder
  useEffect(() => {
    if (filefolder && filevalue) {
      const folderPath = filefolder.split("/");
      console.log(folderPath);
      searchKeyInObject(folderStructure, filefolder, filevalue);
    }
  }, [filefolder, filevalue]);
  const searchKeyInObject = (obj, keyToFind, filevalue, currentPath = []) => {
    for (let key in obj) {
      if (key === keyToFind) {
        console.log("Found key:", keyToFind, "at path:", [...currentPath, key]);
        console.log(obj);
        obj[key][`${Date.now()}-${Math.floor(Math.random() * 1000)}`] =
          filevalue;
        return;
      }

      if (typeof obj[key] === "object" && obj[key] !== null) {
        searchKeyInObject(obj[key], keyToFind, filevalue, [
          ...currentPath,
          key,
        ]);
        if (obj[filevalue]) {
          return;
        }
      }
    }
    console.log(obj);
  };

  console.log(folderStructure);
  return (
    <div className="Main__container">
      <Sidebar
        folders={folderStructure}
        onFolderClick={handleFolderClick}
        createNewFolder={createNewFolder}
        currentPath={currentPath}
        storage={storage}
        setsharedtoggle={setsharedtoggle}
        popupvisible={popupvisible}
        filefolder={filefolder}
        setsidebarfiledata={setsidebarfiledata}
        setdeletetoogle={setdeletetoogle}
        deletetoogle={deletetoogle}
      />
      <Herosection
        folderstructure={folderStructure}
        selectedFolder={selectedFolder}
        previewsection={previewsection}
        visibility={isPreviewVisible}
        previewData={previewData}
        setnavbardata={setnavbardata}
        setcomment={setcomment}
        setstorage={setstorage}
        sharedtoggle={sharedtoggle}
        setfilefolder={setfilefolder}
        setfiledata={setfiledata}
        filedata={filedata}
        popupsection={popupsection}
        popupvisible={popupvisible}
        commentdata={commentdata}
        setfilevalue={setfilevalue}
        sidebarfiledata={sidebarfiledata}
        setdeletetoogle={setdeletetoogle}
      />
      <Preview
        visibility={isPreviewVisible}
        previewsection={previewsection}
        commentsection={commentpreviewsection}
        previewData={previewData}
        navbardata={navbardata}
        comment={comment}
        popupvisible={popupvisible}
        setcommentdata={setcommentdata}
      />
    </div>
  );
}

export default Main;
