<template>
  <md-content class="md-scrollbar urlBox">
    <div>
      <md-button class="addURLButtonPanel"
                 @click="activeDialogStatus = true">
        ADD URL
      </md-button>
      <md-table class="urlListBackground">
        <md-table-row class="urlListBackground">
          <md-table-head class="urlListBackground">Label</md-table-head>
          <md-table-head class="urlListBackground">URL</md-table-head>
        </md-table-row>
        <md-table-row class="urlListBackground"
                      v-for="(url, index) in URLDisplayList"
                      :key="index">
          <md-table-cell class="urlListBackground">{{url.nameURL.get()}}</md-table-cell>
          <md-table-cell class="urlListBackground">{{url.URL.get()}}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
    hello world
    <md-dialog :md-active.sync="activeDialogStatus">
      <md-dialog-title>Add Link</md-dialog-title>

      <md-field md-inline
                style="width: 80%; margin-left: auto; margin-right: auto;">
        <label>Label</label>
        <md-input v-model="nameURL"></md-input>
      </md-field>

      <md-field md-inline
                style="width: 80%; margin-left: auto; margin-right: auto;">
        <label>Link</label>
        <md-input v-model="URL"></md-input>
      </md-field>

      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="activeDialogStatus = false">Close</md-button>
        <md-button class="md-primary"
                   @click="addLink">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </md-content>
</template>


<script>
import Toasted from "vue-toasted";
import Vue from "vue";
import ServiceCDE from "spinal-env-viewer-plugin-cde-service";
Vue.use(Toasted);

export default {
  name: "linkPanel",
  data() {
    return {
      activeDialogStatus: false,
      nameURL: undefined,
      URL: undefined,
      URLDisplayList: []
    };
  },
  components: {},
  props: ["selectedNode", "dbid"],
  methods: {
    updateURLList() {
      let _this = this;
      console.log(this.URLDisplayList);
      this.URLDisplayList = [];
      this.selectedNode.getChildren(["hasURL"]).then(myURLList => {
        // console.log(myURLList);
        for (let i = 0; i < myURLList.length; i++) {
          const urlNode = myURLList[i];
          // console.log(urlNode);
          urlNode.element.ptr.load(url => {
            _this.URLDisplayList.push(url);
          });
        }
      });
    },
    async addLink() {
      if (this.nameURL != undefined && this.URL != undefined) {
        this.$toasted.success("URL is register", {
          position: "top-center",
          duration: 2000
        });
        if (this.selectedNode != undefined) {
          ServiceCDE.addURL(this.selectedNode, this.nameURL, this.URL);
        } else {
          let myNewBIMObject = await ServiceCDE.addURL(
            this.dbid,
            this.nameURL,
            this.URL
          );
          this.$emit("updateMyBIMObject", myNewBIMObject);
        }
        this.nameURL = undefined;
        this.URL = undefined;
      } else {
        this.$toasted.error("BAD Request", {
          position: "top-center",
          duration: 2000
        });
      }
      this.activeDialogStatus = false;
    }
  },
  mounted() {
    console.log("MOUNTED OF URL PANEL");
    console.log(this.selectedNode);
    if (this.selectedNode != undefined) this.updateURLList();
  }
};
</script>

<style>
.addURLButtonPanel {
  width: calc(100% - 16px);
  box-sizing: border-box;
}
.urlBox {
  background: transparent !important;
  box-sizing: border-box;
  height: calc(100% - 50px);
}
.urlListBackground {
  background: transparent !important;
}
</style>