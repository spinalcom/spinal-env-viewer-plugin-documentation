<template>
  <md-content class=" container-link urlBox">
    <div>
      <md-button class="addURLButtonPanel"
                 @click="addURLDialogueStatus = true">
        ADD URL
      </md-button>

      <md-content>
        <md-table>
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
          </md-table-row>
        </md-table>
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
import Toasted from "vue-toasted";
import Vue from "vue";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import { utilities } from "../../service/utilities.js";
Vue.use(Toasted);
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
  components: {},
  props: ["option"],
  methods: {
    async updateURLList() {
      if (this.option.info != undefined) {
        // console.log(await serviceDocumentation.getURL(this.option.info));
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
        // console.log(res);
        // console.log(label, URL);
        let option = utilities.addLink(_this.option, res.name, label, URL);
        // console.log(option);
        option.then(option => {
          // console.log(option);
          console.log(_this.option);
          // if (_this.option.info == undefined)
          if (_this.option.exist == false) {
            _this.option.exist = true;
            _this.$emit("updateMyBIMObject", option);
          }
        });
      });
      // console.log(BIMObjectName);

      // console.log(option);
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
.container-link * {
  box-sizing: border-box;
}

.container-link .md-table-cell-container {
  white-space: nowrap;
  overflow: hidden;
  white-space: initial;
}
.container-link .md-ripple.md-list-item-content {
  box-sizing: border-box;
  min-height: 20px;
  height: 25px;
  font-size: 14px;
  border-bottom: 1px solid #212121;
}

.container-link td.md-table-cell {
  height: unset;
}
.size-md-cell {
  padding-right: unset;
  padding-left: unset;
  max-width: 280px;
}
.myRowStyle {
  padding-top: 5px;
  padding-right: 15px;
  padding-left: 20px;
}
.back-line {
  width: calc(100% - 25px);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.span-opacity {
  color: white;
  width: 100%;
}
.addURLButtonPanel {
  width: calc(100% - 16px);
  box-sizing: border-box;
}
.urlBox {
  box-sizing: border-box;
}
</style>
