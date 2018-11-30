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
    <div class="centerSelectedNodeName"
         v-if="selectedNode != undefined">{{selectedNode.info.name.get()}}</div>
    <div class="centerSelectedNodeName"
         v-else>BIM Object not created</div>
    <filepanel v-if="activeTab == 0"
               :selectedNode="selectedNode"
               :dbid="dbid"></filepanel>
    <urlpanel v-if="activeTab == 1"
              :selectedNode="selectedNode"
              @updateMyBIMObject="updateSelectedBIMObject"
              :dbid="dbid"></urlpanel>
    <attributespanel v-if="activeTab == 2"
                     :selectedNode="selectedNode"
                     :dbid="dbid"></attributespanel>
  </div>
</template>

<script>
import urlpanel from "./component/cde/URLPanel.vue";
import filepanel from "./component/cde/FilePanel.vue";
import attributespanel from "./component/cde/AttributesPanel.vue";

export default {
  name: "my_compo",
  data() {
    return {
      activeTab: 0,
      selectedNode: undefined,
      dbid: undefined,
      buttonList: []
    };
  },
  components: { urlpanel, filepanel, attributespanel },
  methods: {
    activeTabColor: function(value) {
      if (this.activeTab == value) return { background: "#356BaB" };
      else return { background: "unset" };
    },
    updateSelectedBIMObject(newBIMObject) {
      this.selectedNode = newBIMObject;
    },
    opened(option, viewer) {
      // console.log(option);
      if (option.selectedNode !== undefined) {
        this.selectedNode = option.selectedNode;
        this.dbid = option.dbid;
      } else {
        this.selectedNode = undefined;
        this.dbid = option.dbid;
      }
      // console.log('opened option', option);
      // console.log('opened viewer', viewer);
      // if (option.paramSent) this.openedlabel = option.paramSent;

      // console.log(buttonObj)
    },
    removed(option, viewer) {
      // console.log('removed option', option);
      // console.log('removed viewer', viewer);
    },
    closed(option, viewer) {
      // console.log('closed option', option);
      console.log("closed");
      // console.log('closed viewer', viewer);
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

.containerCDE button.md-button.md-layout-item.toolbarButton.md-theme-default {
  margin-left: 7px;
  margin-right: unset;
}
</style>