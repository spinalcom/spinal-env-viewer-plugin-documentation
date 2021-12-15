<!--
Copyright 2021 SpinalCom - www.spinalcom.com

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
  <div class="documentation_panel_container">
    <!-- <md-toolbar class="md-layout md-gutter headerCDE"
                layout-align="center center">
      <div class="centerSelectedNodeName"
           v-if="selectedNode">
        {{selectedNode.info.name.get()}}
      </div>
      <div class="centerSelectedNodeName"
           v-else>
        BIM Object not created
      </div>
    </md-toolbar> -->

    <md-toolbar class="md-layout headerCDE">
      <div class="md-layout-item toolbarButton"
           :class="{'active': activeTab == TABS.files}"
           @click="activeTab = TABS.files">
        <span>Files</span>
      </div>

      <div class="md-layout-item toolbarButton"
           :class="{'active': activeTab == TABS.urls}"
           @click="activeTab = TABS.urls">
        <span>Urls</span>
      </div>

      <div class="md-layout-item toolbarButton"
           @click="activeTab = TABS.attributes"
           :class="{'active': activeTab == TABS.attributes}">
        <span>Attributes</span>
      </div>
    </md-toolbar>
    <!-- @updateMyBIMObject="updateSelectedBIMObject" :option="option" :selectedNode="selectedNode"-->

    <transition name="changeTabDocumentation">
      <md-content class="panelContent md-scrollbar">
        <file-component v-if="activeTab == TABS.files"
                        :parentGroup="parentGroup"
                        :nodeId="nodeId"
                        :dbId="dbid"></file-component>

        <!-- @updateMyBIMObject="updateSelectedBIMObject" :option="option" :selectedNode="selectedNode"-->
        <url-component v-else-if="activeTab == TABS.urls"
                       :nodeId="nodeId"
                       :dbId="dbId"
                       :parentGroup="parentGroup"></url-component>

        <!-- @updateMyBIMObject="updateSelectedBIMObject"  :option="option" :selectedNode="selectedNode"-->
        <attribute-component v-else-if="activeTab == TABS.attributes"
                             :nodeId="nodeId"
                             :dbId="dbId"
                             :parentGroup="parentGroup"></attribute-component>
      </md-content>
    </transition>

  </div>
</template>

<script>
import { SpinalNode } from "spinal-model-graph";
import AttributeComponent from "./attributes/attributesComponent.vue";
import FileComponent from "./files/filesComponent.vue";
import UrlComponent from "./urls/urlsComponent.vue";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";

export default {
  name: "documentationComponent",
  components: {
    "file-component": FileComponent,
    "attribute-component": AttributeComponent,
    "url-component": UrlComponent,
  },
  data() {
    this.TABS = {
      files: 0,
      urls: 1,
      attributes: 2,
    };
    return {
      nodeId: undefined,
      dbId: undefined,
      activeTab: this.TABS.attributes,
      selectedNode: undefined,
      dbid: undefined,
      option: undefined,
      buttonList: [],
      parentGroup: undefined,
    };
  },
  methods: {
    opened({ selectedNode, info, dbid }) {
      this.getSelectedNode(selectedNode, info);
      this.dbId = dbid;
      const realNode = SpinalGraphService.getRealNode(this.nodeId);
      if (realNode) {
        serviceDocumentation.setBuildingInformationAttributes(realNode);
      }
    },

    removed(option, viewer) {},

    closed(option, viewer) {},

    // activeTabColor: function (value) {
    //   if (this.activeTab == value)
    //     return { background: "#356BaB", border: "1px solid white" };
    //   else return { background: "unset", border: "1px solid white" };
    // },

    getSelectedNode(selectedNode, bimObjectInfo) {
      if (selectedNode && selectedNode instanceof SpinalNode) {
        SpinalGraphService._addNode(selectedNode);
        this.nodeId = selectedNode.getId().get();
        return;
      }

      if (selectedNode && selectedNode.id) {
        this.nodeId = selectedNode.id.get();
        return;
      }

      if (bimObjectInfo && bimObjectInfo instanceof SpinalNode) {
        SpinalGraphService._addNode(bimObjectInfo);
        this.nodeId = bimObjectInfo.getId().get();
        return;
      }
      this.nodeId = undefined;
    },
  },
};
</script>

<style scoped>
.documentation_panel_container {
  width: 100%;
  height: calc(100% - 15px);
}

.documentation_panel_container .headerCDE {
  width: 100%;
  height: 50px;
  padding: unset !important;
  /* border-top: 1px solid white; */
  /* border-bottom: 1px solid white; */
}

.documentation_panel_container .headerCDE .toolbarButton {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.3em;
}

.documentation_panel_container .headerCDE .toolbarButton:hover {
  cursor: pointer;
}

.documentation_panel_container .headerCDE .toolbarButton.active {
  background: #356bab;
  /* border: 1px solid white; */
}

.documentation_panel_container .panelContent {
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  background: transparent !important;
}
</style>