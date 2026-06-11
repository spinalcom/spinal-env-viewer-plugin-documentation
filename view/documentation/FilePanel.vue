<template>
   <md-content class="md-scrollbar urlBox">

      <div class="filesPaddingPath">
         <div class="sizeOfPathTab">
            <span v-for="(path, index) in pathTab" @click="loadRoute(index)" :key="index">
               {{ path.name }}
            </span>
         </div>
         <md-button class="md-icon-button addURLButtonPanel" @click="activeAddDirectory = true"
            :disabled="!boolInShared">
            <i class="material-icons iconPlusDocumentation">add_circle_outline</i>
         </md-button>
      </div>
      <md-subheader v-if="boolInShared == true" class="hr-sect ">Local Files</md-subheader>
      <md-subheader v-else class="hr-sect ">Shared Files</md-subheader>

      <md-table v-if="displayList.length != 0">
         <md-table-row v-for="(files, index) in displayList" @dblclick.native="enterInDirectory(files)" :key="index">
            <md-table-cell>
               <div class="filesPaddingIcon">
                  <md-icon>{{ getIconFile(files) }}</md-icon>
                  <div class="sizeOfPathTab">{{ files.name.get() }}</div>
               </div>
            </md-table-cell>
            <!-- <md-table-cell md-numeric>{{files.name.get()}}</md-table-cell> -->
            <md-table-cell>
               <menuFile :file="files" :boolInShared="boolInShared" :index="index" @downloadFile="downloadFile"
                  @removeFile="removeFile">
               </menuFile>
            </md-table-cell>
         </md-table-row>
      </md-table>

      <div v-if="boolInShared == true && !boolInDirectory && groupAttrDisplayList.length > 0">
         <md-subheader class="hr-sect ">Shared Files</md-subheader>
         <md-table>
            <!-- <span>{{group.nameGroup}}</span> -->
            <md-table-row v-for="(group, index) in groupAttrDisplayList" :key="index"
               @dblclick.native="enterInDirectoryParent(group)">
               <md-table-cell>
                  <div class="filesPaddingIcon">
                     <md-icon>folder</md-icon>
                     <div class="sizeOfPathTab">{{ group.groupName }}</div>
                  </div>
               </md-table-cell>
               <!-- <md-table-cell md-numeric>{{group.groupName}}</md-table-cell> -->
               <md-table-cell>
                  <!-- <menuFile :file="files"
                    :index="index"
                    @downloadFile="downloadFile">
          </menuFile> -->
               </md-table-cell>
            </md-table-row>
         </md-table>
      </div>

      <md-dialog class="fileUploadDialog" :md-active.sync="activeAddDirectory">

         <md-dialog-content class="dialogContent">
            <md-tabs class="dialogTabs" @md-changed="resetImportedFiles" md-alignment="fixed">
               <md-tab md-label="Upload">
                  <md-field>
                     <md-file @md-change="getFileImported" v-model="multipleFile" multiple />
                  </md-field>
               </md-tab>

               <md-tab md-label="Drive">
                  <!-- <md-button class="md-primary md-raised" @click="getPath">Get Path</md-button> -->
                  <drive @getFileImportedFromDrive="getFileImportedFromDrive"></drive>
               </md-tab>

               <md-tab md-label="Select from context">
                  <!-- <md-button class="md-primary md-raised" @click="getPath">Get Path</md-button> -->
                  <selectFromContext @selected="selectFileFromContext"></selectFromContext>
               </md-tab>

            </md-tabs>
         </md-dialog-content>

         <md-dialog-actions>
            <md-button class="md-primary" @click="activeAddDirectory = false">Close</md-button>
            <md-button class="md-primary" @click="saveFile">Save</md-button>
         </md-dialog-actions>
      </md-dialog>
   </md-content>
</template>

<script>
// import { FileExplorer } from "../../service/fileSystemExplorer.js";
import drive from "./component/drive.vue";
import menuFile from "./component/menuFile.vue";
import selectFromContext from "./selectFromContext.vue";

import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import serviceDocumentation, { FileExplorer } from "spinal-env-viewer-plugin-documentation-service";

export default {
   name: "linkPanel",
   data() {
      return {
         activeAddDirectory: false,
         importedFiles: undefined,
         importedDriveFiles: undefined,
         selectedDirectory: undefined,
         oldDirectory: undefined,
         displayList: [],
         multipleFile: undefined,
         myBind: undefined,
         pathTab: [],
         parentListToBind: new Lst(),
         groupAttrDisplayList: [],
         boolInShared: false,
         boolInDirectory: false,
         selectedFileFromContext: undefined,
      };
   },
   components: { drive, menuFile, selectFromContext },
   props: ["option", "parentGroup"],
   methods: {
      async downloadFile(file, index) {
         const files = await serviceDocumentation.getFilesInTreeAsBuffer(file);
         if (files.length === 1) {
            const fileOne = files[0];
            const blob = this.normalizeBuffer(fileOne);
            if (!blob) return;

            this.triggerBrowserDownload(blob, this.getFileName(fileOne));
            return;
         }

         await this.downloadFilesAsZip(files);

         // const fileType = file._info.model_type.get();
         // if (fileType === "Directory") {
         //    return this.downloadFileAsZip(file);
         // }

         // const fileBuffer = await serviceDocumentation.convertFileToBuffer(file);

         // if (file._info.model_type.get() != "Directory") {
         //    file._ptr.load((path) => {
         //       if (file._info.model_type.get() == "HttpPath") {
         //          const element = document.createElement("a");
         //          const _path =
         //             path.host.get() +
         //             "/file/" +
         //             encodeURIComponent(path.httpRootPath.get()) +
         //             "/" +
         //             encodeURIComponent(path.httpPath.get());
         //          element.setAttribute("href", _path);
         //          element.setAttribute("download", file.name.get());
         //          element.style.display = "none";
         //          document.body.appendChild(element);
         //          element.click();
         //          document.body.removeChild(element);
         //       } else {
         //          var element = document.createElement("a");
         //          element.setAttribute("href", "/sceen/_?u=" + path._server_id);
         //          element.setAttribute("download", file.name);
         //          element.click();
         //       }
         //    });
         // } else {
         //    // check recursive directory & create a ZIP
         // }
      },

      getFileName(file) {
         return file?.name || "spinalcom_file";
      },

      async downloadFilesAsZip(files) {
         const zip = new JSZip();
         let zipName = this.getRootFolderName(files);


         for (const file of files) {

            if (!zipName || zipName.startsWith(file.path)) zipName = file.name;

            const blob = this.normalizeBuffer(file);
            if (!blob) continue;

            zip.file(file.path, blob);
         }

         const content = await zip.generateAsync({ type: "blob" });
         this.triggerBrowserDownload(content, `${zipName}.zip`);
      },

      normalizeBuffer(file) {
         const data = file?.buffer || file?.data || file?.blob || file;

         if (data instanceof Blob) return data;
         if (data instanceof ArrayBuffer) return new Blob([data], { type: file?.type || "application/octet-stream" });
         if (ArrayBuffer.isView(data)) return new Blob([data], { type: file?.type || "application/octet-stream" });
         if (typeof data === "string") return new Blob([data], { type: file?.type || "text/plain" });

         return null;
      },

      triggerBrowserDownload(blob, filename) {
         const url = URL.createObjectURL(blob);
         const link = document.createElement("a");

         link.href = url;
         link.download = filename;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         URL.revokeObjectURL(url);
      },

      async removeFile(file, index) {
         await serviceDocumentation.unlinkFileFromNode(this.option.info, file);
         await this.resetBind();
         // this.selectedDirectory.splice(index, 1);
      },

      getFileImported(files) {
         // ici il y a un bug sur les fichier importé, quand j'import un fichier toto.txt, que je change vers le drive tabs,
         // je retourne sur le upload tabs, je ne peux pas ajouter le meme fichier, levent md-change ne triger pas
         this.importedFiles = files;
      },

      getFileImportedFromDrive(files) {
         this.importedDriveFiles = files.map(f => f.model);
      },

      selectFileFromContext(files) {
         this.selectedFileFromContext = files;
      },

      resetImportedFiles() {
         this.importedFiles = undefined;
         this.importedDriveFiles = undefined;
         this.multipleFile = undefined;
      },

      getIconFile(file) {
         let fileType;
         if (file.type != undefined) {
            fileType = file.type;
         } else {
            fileType = file._info.model_type.get();
         }

         const icons = {
            "File": "insert_drive_file",
            "Directory": "folder",
            "Digital twin": "location_city",
            "Path": "insert_drive_file",
            "Synchronized Directory": "folder_shared",
            "HttpPath": "file_copy"
         };

         if (fileType in icons) {
            return icons[fileType];
         }

         return "not_listed_location";

         // if (fileType === "Directory") return "folder";

         // else if (fileType === "Digital twin") return "location_city";

         // else if (fileType === "Path") return "insert_drive_file";

         // else if (fileType === "Synchronized Directory") return "folder_shared";

         // else if (fileType === "HttpPath") return "file_copy";

         // return "not_listed_location";
      },

      loadRoute(index) {
         if (index == this.pathTab.length - 1) {
         } else {
            this.selectedDirectory = this.pathTab[index].directory;

            let length = this.pathTab.length - 1;
            this.pathTab.splice(index + 1, length - index);
            this.resetBind();
            if (this.pathTab.length == 1) {
               this.boolInShared = true;
               this.boolInDirectory = false;
            }
         }
      },

      enterInDirectory(file) {
         if (file._info.model_type.get() == "Directory") {
            file._ptr.load((directory) => {
               let pathObj = {
                  name: file.name.get() + " /",
                  directory: directory,
               };
               this.pathTab.push(pathObj);
               this.selectedDirectory = directory;

               this.resetBind();
            });
            this.boolInDirectory = true;
         }
      },
      enterInDirectoryParent(group) {
         let pathObj = {
            name: group.groupName + " /",
            directory: group.groupAttr,
         };
         this.pathTab.push(pathObj);
         this.selectedDirectory = group.groupAttr;
         this.boolInShared = false;
         this.boolSharedDirectory = false;
         this.updateDisplayList();
         this.resetBind();
      },

      async updateDisplayList() {
         const displayList = [];
         const node = this.option.info;

         // if (this.selectedDirectory != undefined) {
         if (!node) return;

         const files = await serviceDocumentation.getFileLinkedToNode(node);

         for (let i = 0; i < files.length; i++) {
            const file = files[i];
            displayList.push(file);
         }

         this.displayList = displayList;
         // }
      },

      getFileInDir(directory) {
         let displayList = [];
         if (directory != undefined) {
            for (let i = 0; i < directory.length; i++) {
               const file = directory[i];
               displayList.push(file);
            }
         }
         return displayList;
      },

      async updateDisplayListParent() {
         this.groupAttrDisplayList = [];
         let json = {};
         for (let i = 0; i < this.parentGroup.length; i++) {
            const node = this.parentGroup[i];
            if (node) {
               const dir = await this.getDirectoryElement(node);
               json = {
                  groupName: node.info.name.get(),
                  groupAttr: dir,
                  files: this.getFileInDir(dir),
               };

               this.groupAttrDisplayList.push(json);
            }
         }
      },
      async sendAddFile(node) {
         const promises = [];

         // check if imported file come from drive or upload
         if (this.importedFiles != undefined) {
            promises.push(FileExplorer.addFileUpload(node, this.importedFiles));
         }

         if (this.importedDriveFiles != undefined) {
            promises.push(FileExplorer.addFileUpload(node, this.importedDriveFiles));
         }

         if (this.selectedFileFromContext != undefined) {
            for (const file of this.selectedFileFromContext) {
               promises.push(serviceDocumentation.linkFileToNode(node, file));
            }
         }

         await Promise.all(promises).catch((err) => {
            console.error("Error adding file:", err);
         });
      },

      async saveFile() {
         // // check if the node exist
         // // check if node has a directory
         // // if node doesn't exist, i create it
         // // if node haven't a directory, add it



         const nodeIsNotCreated = this.option.info == false; // 
         let option = this.option;

         if (nodeIsNotCreated) option = await this._createBimObjectNode(this.option);

         this.selectedDirectory = await this.createFileDirectory(option.info);
         await this.sendAddFile(option.info);
         await this.resetBind();
         await this.resetImportedFiles();

         this.activeAddDirectory = false;




         // let _this = this;
         // if (this.selectedDirectory != undefined) {
         //    this.sendAddFile(this.option.info);
         // } else {
         //    if (this.option.exist == false) {
         //       let option = this.option;
         //       window.spinal.ForgeViewer.viewer.model.getProperties(
         //          this.option.dbid,
         //          async function (res) {
         //             let boolIsCreated = await window.spinal.BimObjectService.createBIMObject(option.dbid, res.name, option.model3d);
         //             if (boolIsCreated) {
         //                let bimObject = await window.spinal.BimObjectService.getBIMObject(option.dbid, option.model3d);
         //                option.info = SpinalGraphService.getRealNode(bimObject.id);
         //             }

         //             if (option.exist == false) {
         //                option.exist = true;
         //                _this.$emit("updateMyBIMObject", option);
         //             }
         //             _this.selectedDirectory = await this.createFileDirectory(option.info);
         //             _this.sendAddFile(option.info);
         //             _this.resetBind();
         //             _this.resetImportedFiles();
         //          }
         //       );
         //    } else {
         //       this.selectedDirectory = await this.createFileDirectory(this.option.info);
         //       this.sendAddFile(this.option.info);
         //       this.resetBind();
         //       this.resetImportedFiles();
         //    }
         // }

         // this.activeAddDirectory = false;
      },

      async _createBimObjectNode(option) {

         const model = window.spinal.ForgeViewer.viewer.model;
         const dbid = option.dbid;
         const bimObjectService = window.spinal.BimObjectService;

         return new Promise((resolve, reject) => {
            model.getProperties(dbid, async (res) => {
               let boolIsCreated = await bimObjectService.createBIMObject(dbid, res.name, option.model3d);

               if (boolIsCreated) {
                  let bimObject = await bimObjectService.getBIMObject(dbid, option.model3d);
                  option.info = SpinalGraphService.getRealNode(bimObject.id);
               }

               if (option.exist == false) {
                  option.exist = true;
                  _this.$emit("updateMyBIMObject", option);
               }

               resolve(option.info);
               // _this.selectedDirectory = await this.createFileDirectory(option.info);
               // _this.sendAddFile(option.info);
               // _this.resetBind();
               // _this.resetImportedFiles();
            }
            );
         });

      },

      deleteBind() {
         if (this.myBind != undefined) {
            if (this.oldDirectory != undefined) {
               this.oldDirectory.unbind(this.myBind);
               this.myBind = undefined;
            }
         }
      },
      resetBind() {
         console.log("reset bind");

         if (this.option.info != undefined) {
            if (this.option != undefined) {
               this.deleteBind();
               if (this.myBind == undefined) {
                  if (this.selectedDirectory != undefined) {
                     console.log("bind");
                     this.myBind = this.selectedDirectory.bind(this.updateDisplayList.bind(this));
                     this.oldDirectory = this.selectedDirectory;
                  } else {
                     console.log("update display list");
                     this.updateDisplayList();
                  }
               }
            }
         }
      },
      resetBindParent() {
         // j'ai la liste de tous les node parent
         this.parentListToBind.splice(0, this.parentListToBind.length);
         for (let i = 0; i < this.parentGroup.length; i++) {
            const element = this.parentGroup[i];
            this.parentListToBind.push(element);
         }
         if (this.myBindParent == undefined) {
            this.myBindParent = this.parentListToBind.bind(
               this.updateDisplayListParent.bind(this)
            );
         }
      },

      async getDirectoryElement(node) {
         const directoryNode = await FileExplorer.getDirectory(node);
         if (!directoryNode) return undefined;

         const element = directoryNode.getElement(true);
         return element;
         // return new Promise((resolve, reject) => {
         //    element._ptr.load((directory) => {
         //       resolve(directory);
         //    });
         // });


      },

      async createFileDirectory(node) {
         const directoryNode = await FileExplorer.createDirectory(node);
         if (!directoryNode) return undefined;
         const element = directoryNode.getElement(true);
         return element;
         // return new Promise((resolve, reject) => {
         //    element._ptr.load((directory) => {
         //       resolve(directory);
         //    });
         // });
      },
   },
   watch: {
      option: async function () {
         let namePath = "";
         this.selectedDirectory = await this.getDirectoryElement(this.option.info);
         if (this.option.info != undefined) {
            namePath = this.option.info.info.name.get() + " /";
         } else {
            namePath = "Home /";
         }
         let pathObj = {
            name: namePath,
            directory: this.selectedDirectory,
         };
         this.pathTab = [];
         this.pathTab.push(pathObj);
         this.boolInShared = true;

         this.resetBind();
      },
      parentGroup: function () {
         this.resetBindParent();
      },
   },
   async mounted() {
      if (this.option != undefined) {
         if (this.option.info != undefined) {
            this.selectedDirectory = await this.getDirectoryElement(this.option.info);
            console.log(this.selectedDirectory);
            let namePath = this.option.info.info.name.get() + " /";
            let pathObj = {
               name: namePath,
               directory: this.selectedDirectory,
            };
            this.boolInShared = true;
            this.pathTab.push(pathObj);
            this.resetBind();
            this.resetBindParent();
         }
      }
   },
   beforeDestroy() {
      if (this.option.info != undefined && this.myBind != undefined) {
         this.option.info.unbind(this.myBind);
      }
   },
};
</script>

<style scoped>
.fileUploadDialog {
   width: 700px;
   height: 520px;
}

.fileUploadDialog .dialogContent {
   width: 100%;
   height: 100%;
}

.fileUploadDialog .dialogTabs {
   width: 100%;
   height: 100%;
}
</style>

<style>
.fileUploadDialog .md-dialog-container {
   width: 100%;
   height: 100%;
}

.fileUploadDialog .dialogTabs .md-tabs-content,
.fileUploadDialog .dialogTabs .md-tabs-content .md-tabs-container,
.fileUploadDialog .dialogTabs .md-tabs-content .md-tabs-container .md-tab {
   width: 100%;
   height: 100% !important;
}
</style>
