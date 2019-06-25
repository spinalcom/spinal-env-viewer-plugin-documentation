<template>
  <md-content class=" container-link urlBox">
    <div>
      <md-button class="addURLButtonPanel"
                 @click="addURLDialogueStatus = true">
        ADD URL
      </md-button>

      <md-content>
        <!-- <md-list> -->
        <!-- <md-list-item md-expand
                        class="myRowStyle">
            <span class="nameOfCategory md-list-item-text">Local</span> -->

        <md-list>
          <md-subheader class="titleOfSharedLocal">Local</md-subheader>
          <!-- <md-list-item class="myRowStyle">
                <span class="span-opacity"> Label </span>
                <span class="span-opacity"> URL </span>
              </md-list-item> -->
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
        <!-- </md-list-item>
        </md-list> -->
        <md-list v-if="groupURLDisplayList.length > 0">
          <md-subheader class="titleOfSharedLocal">Shared URL</md-subheader>
          <md-list-item class="myRowStyle"
                        v-for="(cat) in groupURLDisplayList"
                        :key="cat.groupName"
                        md-expand>
            <!-- <md-icon>whatshot</md-icon> -->
            <span class="nameOfCategory md-list-item-text">{{cat.groupName}}</span>

            <md-list class="unsetPadding"
                     slot="md-expand">
              <md-list-item v-for="(url, index) in cat.url"
                            :key="index"
                            class="md-inset">
                <span style="width: 40%">{{url.element.label.get()}}</span>
                <a class="back-line"
                   v-tooltip="url.element.URL.get()"
                   :href="url.element.URL.get()"
                   target="_blank">
                  {{url.element.URL.get()}}</a>
              </md-list-item>

            </md-list>

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
import { parse } from "path";
var viewer;
export default {
  name: "linkPanel",
  data() {
    return {
      addURLDialogueStatus: false,
      label: undefined,
      URL: undefined,
      URLDisplayList: [],
      myBind: undefined,
      groupURLDisplayList: [],
      myBindParent: undefined,
      parentListToBind: undefined
    };
  },
  components: { menuURL },
  props: ["option", "parentGroup"],
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
    async updateURLParent() {
      // console.log("updateURLParent");

      this.groupURLDisplayList = [];
      let json = {};
      for (let i = 0; i < this.parentGroup.length; i++) {
        const node = this.parentGroup[i];
        json = {
          groupName: node.info.name.get(),
          url: await serviceDocumentation.getURL(node)
        };
        this.groupURLDisplayList.push(json);
      }
      // console.log(this.groupURLDisplayList);
    },
    addLink() {
      let _this = this;
      let label = this.label;
      let URL = this.URL;
      viewer.model.getProperties(this.option.dbid, function(res) {
        let option = utilities.addLink(_this.option, res.name, label, URL);
        option.then(option => {
          // console.log(_this.option);
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
    },
    resetBindParent() {
      // j'ai la liste de tous les node parent
      // console.log("reserbindparent");
      // console.log(this.parentGroup);

      if (this.parentListToBind == undefined) {
        this.parentListToBind = new Lst();
      }
      if (!this.parentListToBind.length == this.parentGroup.length) {
        this.parentListToBind.splice(0, this.parentListToBind.length);
        for (let i = 0; i < this.parentGroup.length; i++) {
          const element = this.parentGroup[i];
          this.parentListToBind.push(element);
        }
      }
      if (this.myBindParent == undefined)
        this.parentListToBind.bind(this.updateURLParent.bind(this));
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    this.resetBind();
    this.resetBindParent();
  },
  watch: {
    option: function() {
      this.resetBind();
    },
    parentGroup: function() {
      this.resetBindParent();
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
