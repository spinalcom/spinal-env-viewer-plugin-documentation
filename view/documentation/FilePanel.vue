<template>
  <md-content class="md-scrollbar urlBox">
    <md-button class="addURLButtonPanel"
               @click="activeAddDirectory= true">
      File System Import
    </md-button>
    <div class="filesPaddingPath">
      <span v-for="(path,index) in pathTab"
            @click="loadRoute(index)"
            :key="index">{{path.name}} </span>
    </div>
    <md-table v-if="displayList.length != 0">
      <md-table-row v-for="(files, index) in displayList"
                    @dblclick.native="enterInDirectory(files)"
                    :key="index">
        <md-table-cell>
          <md-icon>{{getIconFile(files)}}</md-icon>
        </md-table-cell>
        <md-table-cell md-numeric>{{files.name.get()}}</md-table-cell>
        <md-table-cell>
          <menuFile :file="files"
                    :index="index"
                    @downloadFile="downloadFile"
                    @removeFile="removeFile">
          </menuFile>
        </md-table-cell>
      </md-table-row>
    </md-table>

    <md-dialog :md-active.sync="activeAddDirectory">
      <md-tabs md-dynamic-height
               @md-changed="resetImportedFiles"
               md-alignment="fixed">
        <md-tab md-label="Upload">
          <md-field>
            <md-file @md-change="getFileImported"
                     v-model="multipleFile"
                     multiple />
          </md-field>
        </md-tab>

        <md-tab md-label="Drive">
          <!-- <md-button class="md-primary md-raised" @click="getPath">Get Path</md-button> -->
          <drive @getFileImportedFromDrive="getFileImportedFromDrive"></drive>
        </md-tab>
      </md-tabs>

      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="activeAddDirectory = false">Close</md-button>
        <md-button class="md-primary"
                   @click="saveFile">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </md-content>
</template>

<script>
import { FileExplorer } from "../../service/fileSystemExplorer.js";
import bimObjectService from "spinal-env-viewer-plugin-bimobjectservice";
import drive from "./component/drive.vue";
import menuFile from "./component/menuFile.vue";
export default {
  name: "linkPanel",
  data() {
    return {
      activeAddDirectory: false,
      importedFiles: undefined,
      importedDriveFiles: undefined,
      selectedDirectory: undefined,
      displayList: [],
      multipleFile: undefined,
      myBind: undefined,
      pathTab: []
    };
  },
  components: { drive, menuFile },
  props: ["option"],
  methods: {
    downloadFile(file, index) {
      console.log(file, index);

      if (file._info.model_type.get() != "Directory") {
        file._ptr.load(path => {
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
      console.log(file, index);
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
      // console.log(this.selectedDirectory);
      if (index == this.pathTab.length - 1) {
        console.log("current directory");
      } else {
        this.deleteBind();
        this.selectedDirectory = this.pathTab[index].directory;
        let length = this.pathTab.length - 1;
        console.log(index, length - index);
        this.pathTab.splice(index + 1, length - index);
        this.resetBind();
      }
    },

    enterInDirectory(file) {
      if (file._info.model_type.get() == "Directory") {
        file._ptr.load(directory => {
          let pathObj = {
            name: file.name.get() + " /",
            directory: directory
          };
          this.pathTab.push(pathObj);
          this.selectedDirectory = directory;
          this.resetBind();
        });
      }
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
    sendAddFile() {
      // check if imported file come from drive or upload
      if (this.importedFiles != undefined) {
        FileExplorer.addFileUpload(this.selectedDirectory, this.importedFiles);
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
      if (this.selectedDirectory != undefined) {
        this.sendAddFile();
      } else {
        if (this.option.exist == false) {
          let option = this.option;
          option.info = await bimObjectService.createBIMObject(
            option.dbid,
            "bimObject_" + option.dbid
          );
          if (option.exist == false) {
            option.exist = true;
            this.$emit("updateMyBIMObject", option);
          }
        }
        this.selectedDirectory = await FileExplorer.createDirectory(
          this.option.info
        );
        this.sendAddFile();
      }
      this.resetBind();
      this.resetImportedFiles();
      this.activeAddDirectory = false;
    },
    deleteBind() {
      if (this.myBind != undefined) {
        this.selectedDirectory.unbind(this.myBind);
        this.myBind = undefined;
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
            }
          }
        }
      }
    }
  },
  watch: {
    option: async function() {
      this.selectedDirectory = await FileExplorer.getDirectory(
        this.option.info
      );
      let pathObj = {
        name: "home /",
        directory: this.selectedDirectory
      };
      this.pathTab = [];
      this.pathTab.push(pathObj);
      this.resetBind();
    }
  },
  async mounted() {
    if (this.option != undefined) {
      if (this.option.info != undefined) {
        this.selectedDirectory = await FileExplorer.getDirectory(
          this.option.info
        );
        let pathObj = {
          name: "home /",
          directory: this.selectedDirectory
        };
        this.pathTab.push(pathObj);
        this.resetBind();
      }
    }
  },
  beforeDestroy() {
    if (this.option.info != undefined && this.myBind != undefined)
      {this.option.info.unbind(this.myBind);}
  }
};
</script>

<style>
</style>
