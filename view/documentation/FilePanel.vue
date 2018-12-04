<template>
  <md-content class="md-scrollbar filesBox">
    <md-button class="addURLButtonPanel"
               @click="activeAddDirectory= true">
      File System Import
    </md-button>
    <md-dialog :md-active.sync="activeAddDirectory">

      <md-tabs md-dynamic-height
               md-alignment="fixed">
        <md-tab md-label="Upload">
          <md-field>
            <md-file ref="fileupload"
                     @md-change="getFileImported"
                     v-model="multipleFile"
                     multiple />
          </md-field>
        </md-tab>

        <md-tab md-label="Drive">
          <!-- <md-button class="md-primary md-raised" @click="getPath">Get Path</md-button> -->

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
export default {
  name: "linkPanel",
  data() {
    return {
      activeAddDirectory: false,
      importedFiles: undefined,
      selectedDirectory: undefined
    };
  },
  components: {},
  props: ["option"],
  methods: {
    async saveFile() {
      this.selectedDirectory = await FileExplorer.getDirectory(
        this.option.selectedNode
      );
      if (this.selectedDirectory != undefined)
        FileExplorer.addFile(this.selectedDirectory, this.importedFiles);
      else {
        this.selectedDirectory = FileExplorer.createDirectory(
          this.option.selectedNode
        );
      }
      this.activeAddDirectory = false;
    },
    getFileImported(files) {
      this.importedFiles = files;
    }
  },
  mounted() {
    // console.log(utilities);
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
