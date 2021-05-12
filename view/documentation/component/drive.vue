<template>
   <!-- class="md-scrollbar" -->
   <div class="tableDiv">
      <div class="path">
         <span
            v-for="(path,index) in pathTab"
            @click="loadRoute(index)"
            :key="index"
         >{{path.name}} </span>
      </div>

      <div class="table">
         <md-table
            v-model="tabDisplay"
            @md-selected="onSelectDriveFile"
            md-fixed-header
         >
            <!-- <md-table-row v-for="(driveFiles, index) in tabDisplay"
                    @dblclick.native="clickPath(driveFiles)"
                    :key="index"
                    md-auto-select
                    md-selectable="multiple"> -->
            <md-table-row
               @dblclick.native="clickPath(driveFiles)"
               slot="md-table-row"
               slot-scope="{ item:driveFiles }"
               md-auto-select
               md-selectable="multiple"
            >
               <!-- <md-table-cell>
          <md-icon>{{getIconFile(driveFiles)}}</md-icon>
        </md-table-cell> -->
               <md-table-cell md-label="Name">
                  <md-icon>{{getIconFile(driveFiles)}}</md-icon>
                  &#8287;
                  {{driveFiles.name}}
               </md-table-cell>
               <md-table-cell md-label="Type">{{driveFiles.type}}</md-table-cell>
            </md-table-row>
         </md-table>
      </div>

      <!-- <md-list>
      <md-list-item @click="getPath" v-for="(driveFiles, index) in tabDisplay" :key="index" >{{driveFiles.name.get()}}</md-list-item>
    </md-list> -->

   </div>
</template>


<script>
import { FileExplorer } from "../../../service/fileSystemExplorer.js";
// var viewer;
export default {
   name: "addGroup",
   data() {
      return {
         pathTab: [],
         currentPath: undefined,
         tabDisplay: [],
         selected: [],
      };
   },
   components: {},
   props: [],
   methods: {
      onSelectDriveFile: function (items) {
         this.selected = items;
         this.$emit("getFileImportedFromDrive", items);
      },
      getIconFile(file) {
         return FileExplorer.getIconFile(file);
      },
      clickPath: function (driveFiles) {
         this.selected = [];
         let type = driveFiles.type;
         if (type == "Directory" || type == "Synchronized Directory") {
            let route = FileExplorer.createDriveRoute(
               this.currentPath,
               driveFiles
            );
            this.pathTab.push(route);
            this.currentPath = route.path;
            this.getPath();
         }
      },
      getPath: function () {
         FileExplorer.loadDrivePath(this.currentPath).then((directory) => {
            this.tabDisplay = directory;
         });
      },
      loadRoute: function (indexPath) {
         this.selected = [];
         this.currentPath = this.pathTab[indexPath].path;
         this.pathTab.splice(
            indexPath + 1,
            this.pathTab.length - (indexPath + 1)
         );
         this.getPath();
      },
   },
   mounted() {
      let route = FileExplorer.getDrivePathRoot();
      this.currentPath = route.path;
      this.pathTab.push(route);
      this.getPath();
      this.$emit("resetImportedFiles");
   },
};
</script>


<style scoped>
.tableDiv {
   width: 100%;
   height: 100%;
}

.tableDiv .path {
   width: 100%;
   height: 50px;
   display: flex;
   align-items: center;
   font-size: 1.2em;
}

.tableDiv .table {
   width: 100%;
   height: calc(100% - 50px);
}
</style>