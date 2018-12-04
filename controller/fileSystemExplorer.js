// import ServiceCDE from "spinal-env-viewer-plugin-documentation-service";
// import bimObjectService from 'spinal-env-viewer-plugin-bimobjectservice';

class FileSystemExplorer {
  constructor() {
    this.spinalSystem = window.spinal.spinalSystem;

  }

  getDrivePath() {
    var user = this.spinalSystem.getUser();
    var home = "/__users__/" + user.username;
    this.currentPath = home;
  }
  getDirectory(selectedNode) {
    // console.log(selectedNode)
    console.log("getDirectory")
    let tab = undefined;
    return selectedNode
      .getChildren(['hasDirectory'])
      .then(myDirectoryList => {
        if (myDirectoryList.length === 0)
          tab = undefined;
        else
          tab = myDirectoryList[0];
      })
      .then(() => tab);
  }

  createDirectory(selectedNode) {
    console.log("createDirectory")
    console.log(selectedNode)
  }


  getDirectoryChild(directory) {
    console.log(directory)
  }
  getPath(directory) {
    console.log(directory)
  }
  addFile(directory, fileList) {
    console.log(fileList)
    if (directory == undefined) {
      console.log(directory)

    }
  }
  addDirectory(selectedNode) {
    console.log(selectedNode)
  }

}
export const FileExplorer = new FileSystemExplorer()