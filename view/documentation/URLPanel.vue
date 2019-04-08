<template>
  <md-content class=" container-link urlBox">
    <div>
      <md-button class="addURLButtonPanel"
                 @click="addURLDialogueStatus = true">
        ADD URL
      </md-button>

      <md-content>

        <md-list>
          <md-list-item class="myRowStyle">
            <span class="span-opacity"> Label </span>
            <span class="span-opacity"> URL </span>
          </md-list-item>
          <md-list-item class="myRowStyle"
                        v-for="(url, index) in URLDisplayList"
                        :key="index">
            <span class="span-opacity">{{url.element.label.get()}}</span>
            <a class="back-line"
               v-tooltip="url.element.URL.get()"
               :href="url.element.URL.get()"
               target="_blank">
              {{url.element.URL.get()}}</a>
            <menuURL @editURLNode="editURLNode"
                     @removeURLNode="removeURLNode"
                     :url="url"></menuURL>
          </md-list-item>
        </md-list>

        <!-- <md-table>
          <md-table-row class="myRowStyle ">
            <md-table-head class="size-md-cell myCellStyle">
              <span class="span-opacity"> Label </span>
            </md-table-head>
            <md-table-head class="size-md-cell myCellStyle2">
              <span class="span-opacity"> URL </span>
            </md-table-head>
          </md-table-row>
          <md-table-row class="myRowStyle"
                        v-for="(url, index) in URLDisplayList"
                        :key="index">
            <md-table-cell class="size-md-cell">
              <span class="span-opacity">{{url.label.get()}}</span>
            </md-table-cell>
            <md-table-cell class="size-md-cell">
              <a class="back-line"
                 v-tooltip="url.URL.get()"
                 :href="url.URL.get()"
                 target="_blank">
                {{url.URL.get()}}</a>
            </md-table-cell>
            <md-table-cell>
              <menuURL :url="url"></menuURL>
            </md-table-cell>
          </md-table-row>
        </md-table>-->
      </md-content>

    </div>
    <md-dialog :md-active.sync="addURLDialogueStatus">
      <md-dialog-title>Add Link</md-dialog-title>

      <md-field md-inline
                style="width: 80%; margin-left: auto; margin-right: auto;">
        <label>Label</label>
        <md-input v-model="label"></md-input>
      </md-field>

      <md-field md-inline
                style="width: 80%; margin-left: auto; margin-right: auto;">
        <label>Link</label>
        <md-input v-model="URL"></md-input>
      </md-field>

      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="addURLDialogueStatus = false">Close</md-button>
        <md-button class="md-primary"
                   @click="addLink">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </md-content>
</template>


<script>
//import Toasted from "vue-toasted";
import Vue from "vue";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import { utilities } from "../../service/utilities.js";
import menuURL from "./component/menuURL.vue";
//Vue.use(Toasted);
var viewer;
export default {
  name: "linkPanel",
  data() {
    return {
      addURLDialogueStatus: false,
      label: undefined,
      URL: undefined,
      URLDisplayList: [],
      myBind: undefined
    };
  },
  components: { menuURL },
  props: ["option"],
  methods: {
    editURLNode(urlNode, urlChange) {
      urlNode.element.label.set(urlChange.label);
      urlNode.element.URL.set(urlChange.URL);
    },
    removeURLNode(urlNode) {
      serviceDocumentation.removeNode(urlNode);
    },
    async updateURLList() {
      if (this.option.info != undefined) {
        this.URLDisplayList = await serviceDocumentation.getURL(
          this.option.info
        );
      } else this.URLDisplayList = [];
    },
    addLink() {
      let _this = this;
      let label = this.label;
      let URL = this.URL;
      viewer.model.getProperties(this.option.dbid, function(res) {
        let option = utilities.addLink(_this.option, res.name, label, URL);
        option.then(option => {
          console.log(_this.option);
          if (_this.option.exist == false) {
            _this.option.exist = true;
            _this.$emit("updateMyBIMObject", option);
          }
        });
      });
      this.label = undefined;
      this.URL = undefined;
      // if (selectedNode != undefined) {
      //   this.$toasted.success("URL is register", {
      //     position: "bot-right",
      //     duration: 2000
      //   });
      // } else {
      //   this.$toasted.error("BAD Request", {
      //     position: "top-center",
      //     duration: 2000
      //   });
      // }
      // this.resetBind();
      // this.updateURLList();
      this.addURLDialogueStatus = false;
    },
    resetBind() {
      if (this.option.info != undefined) {
        if (this.option != undefined) {
          if (this.myBind != undefined) {
            this.option.info.unbind(this.myBind);
            this.myBind = undefined;
          }
          if (this.myBind == undefined) {
            this.myBind = this.option.info.bind(this.updateURLList.bind(this));
          }
        }
      }
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    this.resetBind();
  },
  watch: {
    option: function() {
      console.log("update option in url panel");
      this.resetBind();
    }
  },
  beforeDestroy() {
    if (this.option.info != undefined && this.myBind != undefined)
      this.option.info.unbind(this.myBind);
  }
};
</script>

<style>
</style>
