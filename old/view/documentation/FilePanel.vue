<template>
   <md-content class="md-scrollbar urlBox">

      <div class="filesPaddingPath">
         <div class="sizeOfPathTab">
            <span
               v-for="(path,index) in pathTab"
               @click="loadRoute(index)"
               :key="index"
            >
               {{path.name}}
            </span>
         </div>
         <md-button
            class="md-icon-button addURLButtonPanel"
            @click="activeAddDirectory= true"
            :disabled="!boolInShared"
         >
            <i class="material-icons iconPlusDocumentation">add_circle_outline</i>
         </md-button>
      </div>
      <md-subheader
         v-if="boolInShared == true"
         class="hr-sect "
      >Local Files</md-subheader>
      <md-subheader
         v-else
         class="hr-sect "
      >Shared Files</md-subheader>

      <md-table v-if="displayList.length != 0">
         <md-table-row
            v-for="(files, index) in displayList"
            @dblclick.native="enterInDirectory(files)"
            :key="index"
         >
            <md-table-cell>
               <div class="filesPaddingIcon">
                  <md-icon>{{getIconFile(files)}}</md-icon>
                  <div class="sizeOfPathTab">{{files.name.get()}}</div>
               </div>
            </md-table-cell>
            <!-- <md-table-cell md-numeric>{{files.name.get()}}</md-table-cell> -->
            <md-table-cell>
               <menuFile
                  :file="files"
                  :boolInShared="boolInShared"
                  :index="index"
                  @downloadFile="downloadFile"
                  @removeFile="removeFile"
               >
               </menuFile>
            </md-table-cell>
         </md-table-row>
      </md-table>
      <div v-if="boolInShared == true && !boolInDirectory && groupAttrDisplayList.length > 0">
         <md-subheader class="hr-sect ">Shared Files</md-subheader>
         <md-table>
            <!-- <span>{{group.nameGroup}}</span> -->
            <md-table-row
               v-for="(group, index) in groupAttrDisplayList"
               :key="index"
               @dblclick.native="enterInDirectoryParent(group)"
            >
               <md-table-cell>
                  <div class="filesPaddingIcon">
                     <md-icon>folder</md-icon>
                     <div class="sizeOfPathTab">{{group.groupName}}</div>
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

      <md-dialog
         class="fileUploadDialog"
         :md-active.sync="activeAddDirectory"
      >

         <md-dialog-content class="dialogContent">
            <md-tabs
               class="dialogTabs"
               @md-changed="resetImportedFiles"
               md-alignment="fixed"
            >
               <md-tab md-label="Upload">
                  <md-field>
                     <md-file
                        @md-change="getFileImported"
                        v-model="multipleFile"
                        multiple
                     />
                  </md-field>
               </md-tab>

               <md-tab md-label="Drive">
                  <!-- <md-button class="md-primary md-raised" @click="getPath">Get Path</md-button> -->
                  <drive @getFileImportedFromDrive="getFileImportedFromDrive"></drive>
               </md-tab>
            </md-tabs>
         </md-dialog-content>

         <md-dialog-actions>
            <md-button
               class="md-primary"
               @click="activeAddDirectory = false"
            >Close</md-button>
            <md-button
               class="md-primary"
               @click="saveFile"
            >Save</md-button>
         </md-dialog-actions>
      </md-dialog>
   </md-content>
</template>

<script>
import { FileExplorer } from "../../service/fileSystemExplorer.js";
import drive from "./component/drive.vue";
import menuFile from "./component/menuFile.vue";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
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
      };
   },
   components: { drive, menuFile },
   props: ["option", "parentGroup"],
   methods: {
      downloadFile(file, index) {
         if (file._info.model_type.get() != "Directory") {
            file._ptr.load((path) => {
               if (file._info.model_type.get() == "HttpPath") {
                  const element = document.createElement("a");
                  const _path =
                     path.host.get() +
                     "/file/" +
                     encodeURIComponent(path.httpRootPath.get()) +
                     "/" +
                     encodeURIComponent(path.httpPath.get());
                  element.setAttribute("href", _path);
                  element.setAttribute("download", file.name.get());
                  element.style.display = "none";
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
               } else {
                  var element = document.createElement("a");
                  element.setAttribute("href", "/sceen/_?u=" + path._server_id);
                  element.setAttribute("download", file.name);
                  element.click();
               }
            });
         } else {
            // check recursive directory & create a ZIP
         }
      },
      removeFile(file, index) {
         this.selectedDirectory.splice(index, 1);
      },
      getFileImported(files) {
         // ici il y a un bug sur les fichier importé, quand j'import un fichier toto.txt, que je change vers le drive tabs,
         // je retourne sur le upload tabs, je ne peux pas ajouter le meme fichier, levent md-change ne triger pas
         this.importedFiles = files;
      },
      getFileImportedFromDrive(files) {
         this.importedDriveFiles = files;
      },
      resetImportedFiles() {
         this.importedFiles = undefined;
         this.importedDriveFiles = undefined;
         this.multipleFile = undefined;
      },
      getIconFile(file) {
         return FileExplorer.getIconFile(file);
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
         this.resetBind;
      },
      updateDisplayList() {
         this.displayList = [];
         if (this.selectedDirectory != undefined) {
            for (let i = 0; i < this.selectedDirectory.length; i++) {
               const file = this.selectedDirectory[i];
               this.displayList.push(file);
            }
         }
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
               const dir = await FileExplorer.getDirectory(node);
               json = {
                  groupName: node.info.name.get(),
                  groupAttr: dir,
                  files: this.getFileInDir(dir),
               };

               this.groupAttrDisplayList.push(json);
            }
         }
      },
      sendAddFile() {
         // check if imported file come from drive or upload
         if (this.importedFiles != undefined) {
            FileExplorer.addFileUpload(
               this.selectedDirectory,
               this.importedFiles
            );
         } else if (this.importedDriveFiles != undefined) {
            FileExplorer.addFileDrive(
               this.selectedDirectory,
               this.importedDriveFiles,
               this.pathTab
            );
         }
      },
      async saveFile() {
         // check if the node exist
         // check if node has a directory
         // if node doesn't exist, i create it
         // if node haven't a directory, add it
         let _this = this;
         if (this.selectedDirectory != undefined) {
            this.sendAddFile();
         } else {
            if (this.option.exist == false) {
               let option = this.option;
               window.spinal.ForgeViewer.viewer.model.getProperties(
                  this.option.dbid,
                  async function (res) {
                     let boolIsCreated = await window.spinal.BimObjectService.createBIMObject(
                        option.dbid,
                        res.name,
                        option.model3d
                     );
                     if (boolIsCreated) {
                        let bimObject = await window.spinal.BimObjectService.getBIMObject(
                           option.dbid,
                           option.model3d
                        );
                        option.info = SpinalGraphService.getRealNode(
                           bimObject.id
                        );
                     }
                     if (option.exist == false) {
                        option.exist = true;
                        _this.$emit("updateMyBIMObject", option);
                     }
                     _this.selectedDirectory = await FileExplorer.createDirectory(
                        option.info
                     );
                     _this.sendAddFile();
                     _this.resetBind();
                     _this.resetImportedFiles();
                  }
               );
            } else {
               this.selectedDirectory = await FileExplorer.createDirectory(
                  this.option.info
               );
               this.sendAddFile();
               this.resetBind();
               this.resetImportedFiles();
            }
         }

         this.activeAddDirectory = false;
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
         if (this.option.info != undefined) {
            if (this.option != undefined) {
               this.deleteBind();
               if (this.myBind == undefined) {
                  if (this.selectedDirectory != undefined) {
                     this.myBind = this.selectedDirectory.bind(
                        this.updateDisplayList.bind(this)
                     );
                     this.oldDirectory = this.selectedDirectory;
                  } else {
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
   },
   watch: {
      option: async function () {
         let namePath = "";
         this.selectedDirectory = await FileExplorer.getDirectory(
            this.option.info
         );
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
            this.selectedDirectory = await FileExplorer.getDirectory(
               this.option.info
            );

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
