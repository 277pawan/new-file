import React from "react";
import "./Herosection.css";
import Navbar from "./Navbar/Navbar";
import Recent from "./Recent/Recent";
import Tablesection from "./Tablesection/Tablesection";
import Searchsection from "./Searchsection/Searchsection";
import Folderdatasection from "./Folderdatasection/Folderdatasection";
function Herosection(props) {
  console.log(props.sidebarfiledata.length);
  return (
    <div
      className={
        props.visibility
          ? "Herosection__container"
          : "Herosection__container--redefined"
      }
    >
      <Navbar
        setnavbardata={props.setnavbardata}
        setfiledata={props.setfiledata}
        popupvisible={props.popupvisible}
      />
      <Recent
        previewdata={props.previewData}
        visibility={props.visibility}
        popupsection={props.popupsection}
        popupvisible={props.popupvisible}
        commentdata={props.commentdata}
      />
      {Array.isArray(props.filedata) && props.filedata.length > 0 ? (
        <Searchsection
          setcomment={props.setcomment}
          preview={props.previewsection}
          folderstructure={props.folderstructure}
          setstorage={props.setstorage}
          sharedtoggle={props.sharedtoggle}
          filesdata={props.filedata}
        />
      ) : null}
      {Array.isArray(props.filedata) && props.filedata.length > 0 ? (
        <></>
      ) : (
        <>
          {" "}
          {Array.isArray(props.sidebarfiledata) &&
          props.sidebarfiledata.length > 0 ? (
            <Folderdatasection
              setcomment={props.setcomment}
              preview={props.previewsection}
              folderstructure={props.folderstructure}
              setstorage={props.setstorage}
              sharedtoggle={props.sharedtoggle}
              setfilefolder={props.setfilefolder}
              setfilevalue={props.setfilevalue}
              sidebarfiledata={props.sidebarfiledata}
              setdeletetoogle={props.setdeletetoogle}
            />
          ) : (
            <Tablesection
              setcomment={props.setcomment}
              preview={props.previewsection}
              folderstructure={props.folderstructure}
              setstorage={props.setstorage}
              sharedtoggle={props.sharedtoggle}
              popupvisible={props.popupvisible}
              setfilefolder={props.setfilefolder}
              setfilevalue={props.setfilevalue}
            />
          )}
        </>
      )}
    </div>
  );
}
export default Herosection;
