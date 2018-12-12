<template>
  <md-content class="md-scrollbar filesBox">
    <md-button class="addURLButtonPanel"
               @click="activeAddDirectory= true">
      File System Import
    </md-button>
    <md-table v-if="displayList.length != 0">
      <md-table-row v-for="(files, index) in displayList"
                    @dblclick.native="enterInDirectory(files)"
                    :key="index">
        <md-table-cell>
          <md-icon>{{getIconFile(files)}}</md-icon>
        </md-table-cell>
        <md-table-cell md-numeric>{{files.name.get()}}</md-table-cell>
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
import { FileExplorer } from "../../controller/fileSystemExplorer.js";
import drive from "./drive.vue";
export default {
  name: "linkPanel",
  data() {
    return {
      activeAddDirectory: false,
      importedFiles: undefined,
      importedDriveFiles: undefined,
      selectedDirectory: undefined,
      displayList: [],
      multipleFile: undefined
    };
  },
  components: { drive },
  props: ["option"],
  methods: {
    getFileImported(files) {
      // ici il y a un bug sur les fichier importé, quand j'import un fichier toto.txt, que je change vers le drive tabs,
      // je retourne sur le upload tabs, je ne peux pas ajouter le meme fichier, levent md-change ne triger pas
      this.importedFiles = files;
    },
    resetImportedFiles() {
      this.importedFiles = undefined;
      this.importedDriveFiles = undefined;
      this.multipleFile = undefined;
    },
    getFileImportedFromDrive(files) {
      this.importedDriveFiles = files;
    },
    getIconFile(file) {
      return FileExplorer.getIconFile(file);
    },
    enterInDirectory(files) {
      console.log(files);
    },
    updateDisplayList(directory) {
      this.displayList = [];
      if (directory != undefined) {
        for (let i = 0; i < directory.length; i++) {
          const file = directory[i];
          this.displayList.push(file);
        }
        console.log(this.displayList);
      }
    },
    sendAddFile() {
      // check if imported file come from drive or upload
      if (this.importedFiles != undefined) {
        FileExplorer.addFileUpload(this.selectedDirectory, this.importedFiles);
      } else if (this.importedDriveFiles != undefined) {
        FileExplorer.addFileDrive(
          this.selectedDirectory,
          this.importedDriveFiles
        );
      }
    },
    saveFile() {
      if (this.selectedDirectory != undefined) {
        this.sendAddFile();
      } else {
        this.selectedDirectory = FileExplorer.createDirectory(this.option.info);
        this.sendAddFile();
      }
      this.updateDisplayList(this.selectedDirectory);
      this.resetImportedFiles();
      this.activeAddDirectory = false;
    }
  },
  watch: {
    option: async function() {
      this.updateDisplayList(await FileExplorer.getDirectory(this.option.info));
    }
  },
  mounted() {
    console.log(this.option);
  }
};
</script>

<style>
.filesBox {
  background: transparent !important;
  box-sizing: border-box;
  height: calc(100% - 50px);
}
</style>
