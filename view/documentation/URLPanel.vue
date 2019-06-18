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
import Vue from "vue";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import { utilities } from "../../service/utilities.js";
import menuURL from "./component/menuURL.vue";
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
