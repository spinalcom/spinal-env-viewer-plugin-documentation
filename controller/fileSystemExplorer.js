// import ServiceCDE from "spinal-env-viewer-plugin-documentation-service";
// import bimObjectService from 'spinal-env-viewer-plugin-bimobjectservice';
import {
  SPINAL_RELATION_PTR_LST_TYPE,
} from 'spinal-model-graph';
class FileSystemExplorer {
  constructor() {
    this.spinalSystem = window.spinal.spinalSystem;

  }

  getDrivePathRoot() {
    var user = this.spinalSystem.getUser();
    var home = "/__users__/" + user.username;
    this.currentPath = home;
    var route = {};
    route.name = "home";
    route.path = home;
    return route;
  }
  createRoute(path, file) {
    var name = "/ " + file.name;
    var mypath = path + "/" + file.name;
    var route = {};
    route.name = name;
    route.path = mypath;
    return route
  }
  loadDrivePath(currentPath) {
    let tabDisplay = [];
    return this.spinalSystem.load(currentPath).then(directory => {
      for (let i = 0; i < directory.length; i++) {
        const element = directory[i];
        let obj = {
          name: element.name.get(),
          type: element._info.model_type.get(),
          serverid: element._server_id
        }
        tabDisplay.push(obj);
      }
      return tabDisplay;
    });

  }
  async getDirectory(selectedNode) {
    console.log("getDirectory")
    if (selectedNode != undefined) {
      const attrNodes = await selectedNode.getChildren("hasFiles");
      if (attrNodes.length == 0) {
        return []
      } else {
        let directory = await attrNodes[0].getElement();
        return (directory)
      }
    }
  }

  createDirectory(selectedNode) {
    console.log("createDirectory")
    let myDirectory = new Directory();
    selectedNode.addChild(
      myDirectory,
      'hasFiles',
      SPINAL_RELATION_PTR_LST_TYPE
    );
    return myDirectory;
  }


  getDirectoryChild(directory) {
    console.log("getDirectoryChild", directory)
  }
  getPath(directory) {
    console.log("getPath", directory)
  }
  addFileUpload(directory, uploadFileList) {
    console.log("addFIle")
    // console.log(directory, uploadFileList)
    for (let i = 0; i < uploadFileList.length; i++) {
      const element = uploadFileList[i];
      let filePath = new Path(element);
      let myFile = new File(element.name, filePath);
      directory.push(myFile);
    }
  }
  addFileDrive(directory, driveFileList) {
    console.log(directory, driveFileList)
  }
  addDirectory(selectedNode) {
    console.log(selectedNode)
  }
  getIconFile(file) {
    let fileType;
    if (file.type != undefined) {
      fileType = file.type;
    } else {
      fileType = file._info.model_type.get();
    }
    if (fileType === "Directory") return "folder";
    else if (fileType === "Digital twin") return "location_city";
    else if (fileType === "Path") return "insert_drive_file";
    else return "not_listed_location";
  }

}
export const FileExplorer = new FileSystemExplorer()