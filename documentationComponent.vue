<!--
Copyright 2018 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->


<template>
  <div class=" containerCDE">
    <md-toolbar class="md-layout md-gutter headerCDE"
                layout-align="center center">
      <div class="centerSelectedNodeName"
           v-if="selectedNode !== undefined">{{selectedNode.info.name.get()
        }}</div>
      <div class="centerSelectedNodeName"
           v-else>BIM Object not created</div>
    </md-toolbar>
    <md-toolbar class="md-layout md-gutter headerCDE"
                layout="row"
                layout-align="center center">
      <md-button @click="activeTab = 0"
                 :style="activeTabColor(0)"
                 class="md-layout-item toolbarButton">Files</md-button>
      <md-button @click="activeTab = 1"
                 :style="activeTabColor(1)"
                 class="md-layout-item toolbarButton">URL</md-button>
      <md-button @click="activeTab = 2"
                 :style="activeTabColor(2)"
                 class="md-layout-item toolbarButton">Attributes</md-button>
    </md-toolbar>

    <filepanel v-if="activeTab == 0"
               :option="option"
               @updateMyBIMObject="updateSelectedBIMObject"
               :parentGroup="parentGroup"
               :selectedNode="selectedNode"
               :dbid="dbid"></filepanel>
    <urlpanel v-if="activeTab == 1"
              :option="option"
              :parentGroup="parentGroup"
              :selectedNode="selectedNode"
              @updateMyBIMObject="updateSelectedBIMObject"
              :dbid="dbid"></urlpanel>
    <attributespanel v-if="activeTab == 2"
                     :selectedNode="selectedNode"
                     :option="option"
                     :parentGroup="parentGroup"
                     @updateMyBIMObject="updateSelectedBIMObject"
                     :dbid="dbid"></attributespanel>
  </div>
</template>

<script>
import urlpanel from "./view/documentation/URLPanel.vue";
import filepanel from "./view/documentation/FilePanel.vue";
import attributespanel from "./view/documentation/AttributesPanel.vue";
import {
  SpinalGraphService,
  SpinalNode
} from "spinal-env-viewer-graph-service";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
export default {
  name: "my_compo",
  data() {
    return {
      activeTab: 0,
      selectedNode: undefined,
      dbid: undefined,
      option: undefined,
      buttonList: [],
      parentGroup: undefined
    };
  },
  components: { urlpanel, filepanel, attributespanel },
  methods: {
    activeTabColor: function(value) {
      if (this.activeTab == value) return { background: "#356BaB" };
      else return { background: "unset" };
    },
    updateSelectedBIMObject(option) {
      this.option = {};
      Object.assign(this.option, option);
      this.selectedNode = this.option.info;
    },
    opened(option) {
      this.option = option;
      let _this = this;
      if (option.selectedNode !== undefined) {
        if (option.selectedNode instanceof SpinalNode) {
          option.info = option.selectedNode;
        } else {
          option.info = SpinalGraphService.getRealNode(
            option.selectedNode.id.get()
          );
        }
        this.selectedNode = option.info;
        option.exist = true;
      } else {
        if (option.info !== undefined) {
          this.selectedNode = option.info;
          this.dbid = option.dbid;
        } else {
          this.selectedNode = undefined;
          this.dbid = option.dbid;
        }
      }
      // console.log("test of group parent");
      // console.log(serviceDocumentation);

      serviceDocumentation
        .getParentGroup(this.selectedNode)
        .then(allParentGroup => {
          _this.parentGroup = allParentGroup;
          // console.log(_this.parentGroup);

          // console.log(allParentGroup);
        });
    },
    removed(option, viewer) {
      // console.log("removed option", option);
      // console.log("removed viewer", viewer);
    },
    closed(option, viewer) {
      // console.log("closed option", option);
      // console.log("closed");
      // console.log("closed viewer", viewer);
    }
  }
};
</script>

<style>
.headerCDE {
  box-sizing: border-box;
  min-height: 5%;
  margin-left: unset !important;
  margin: unset;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
}
.toolbarButton {
  text-align: center;
  box-sizing: border-box;
  padding: unset;
  width: 30%;
}
.centerSelectedNodeName {
  text-align: center;
  margin-top: 8px;
}
.containerCDE {
  height: 100%;
}

.containerCDE .md-ripple {
  padding: unset;
}
.containerCDE .md-content.md-theme-default {
  background-color: unset;
}
.containerCDE ul.md-list.md-theme-default {
  background-color: unset;
}

.containerCDE button.md-button.md-layout-item.toolbarButton.md-theme-default {
  margin-left: 7px;
  margin-right: unset;
}

.centerSelectedNodeName {
  margin-left: auto;
  margin-right: auto;
  margin-top: unset;
  margin-bottom: unset;
}

/* .commentcutPart {
  margin: unset
} */

.filesPaddingPath {
  padding-left: 17px;
  display: flex;
  padding-right: 17px;
  height: auto;
}
.filesPaddingIcon {
  display: flex;
  height: auto;
}
.sizeOfPathTab {
  flex-grow: 1;
  margin-top: auto;
  margin-left: 15px;
  margin-bottom: auto;
}
.filesBox {
  background: transparent !important;
  box-sizing: border-box;
  height: calc(100% - 50px);
}

.notesBox {
  background: transparent !important;
  box-sizing: border-box;
  height: 100%;
}
/* .commentcutPart {
  margin: unset
} */

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
  padding-right: 15px;
  padding-left: 20px;
}
.myRowStyleURLShared {
  padding-top: 5px;
}
.back-line {
  width: calc(100% - 25px);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.alignToIconFile {
  background: #212121;
}
.span-opacity {
  color: white;
  width: 100%;
}
.addURLButtonPanel {
  box-sizing: border-box;
  float: right;
  margin-top: auto;
  margin-bottom: auto;
}
.attributesButtonPanel {
  width: calc(50% - 16px);
  border: 1px solid #356bab;
  box-sizing: border-box;
}
.urlBox {
  height: calc(100% - 90px);
  box-sizing: border-box;
}
.size-md-cell {
  padding-right: unset;
  padding-left: unset;
}
.heightTabsCreateAttr {
  height: 30vh;
}

/* .commentcutPart {
  margin: unset
} */

.my-test-panel-container * {
  box-sizing: border-box;
}
.my-test-panel-container-nbr-output {
  text-align: center;
}

/* .commentcutPart {
  margin: unset
} */

.my-test-panel-container * {
  box-sizing: border-box;
}
.my-test-panel-container-nbr-output {
  text-align: center;
}

/* .commentcutPart {
  margin: unset
} */

.my-test-panel-container * {
  box-sizing: border-box;
}
.my-test-panel-container-nbr-output {
  text-align: center;
}

.hr-sect {
  display: flex;
  flex-basis: 100%;
  align-items: center;
  color: rgba(204, 204, 204, 0.082);
  font-size: 12px;
  margin: 8px 0px;
}
.hr-sect::before,
.hr-sect::after {
  content: "";
  flex-grow: 1;
  background: rgba(204, 204, 204, 0.35);
  height: 1px;
  font-size: 0px;
  line-height: 0px;
  margin: 0px 16px;
}
/* .tabulationGroupName {
  padding-left: 20px;
  border-top: 2px dotted;
} */
.sharedCategoryCss {
  overflow: hidden;
  align-items: center;
}

.sharedCategoryCss:after {
  content: "";
  display: inline-block;
  height: 2px;
  vertical-align: center;
  width: 100%;
  margin-right: -100%;
  margin-left: 11px;
  border-top: 2px dotted;
}

.urlBox .md-subheader {
  padding: unset;
}

.colorForCategory > .md-list-item-container > .md-list-item-content {
  background-color: rgba(204, 204, 204, 0.2);
}
/* .commentcutPart {
  margin: unset
} */
</style>
