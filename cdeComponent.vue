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
  <div>
    <md-toolbar class="md-layout md-gutter myTicketManagertoolbar"
                layout="row"
                layout-align="center center">
      <md-button @click="activeTab = 0"
                 :style="activeTabColor(0)"
                 class="md-layout-item myTicketManagerButton">Files</md-button>
      <md-button @click="activeTab = 1"
                 :style="activeTabColor(1)"
                 class="md-layout-item myTicketManagerButton">Links</md-button>
      <md-button @click="activeTab = 2"
                 :style="activeTabColor(2)"
                 class="md-layout-item myTicketManagerButton">Attributes</md-button>
    </md-toolbar>
    <span v-if="selectedNode != undefined">{{selectedNode.info.name.get()}}</span>
    <span v-else>BIM Object not created</span>
    <urlpanel v-if="activeTab == 0"
              :selectedNode="selectedObject"
              :dbid="dbid"></urlpanel>
    <filepanel v-if="activeTab == 1"
               :selectedNode="selectedObject"
               :dbid="dbid"></filepanel>
    <attributespanel v-if="activeTab == 2"
                     :selectedNode="selectedObject"
                     :dbid="dbid"></attributespanel>
  </div>
</template>

<script>
import urlpanel from './component/cde/URLPanel.vue';
import filepanel from './component/cde/URLPanel.vue';
import attributespanel from './component/cde/URLPanel.vue';

export default {
  name: 'my_compo',
  data() {
    return {
      activeTab: 0,
      selectedNode: undefined,
      dbid: undefined,
    };
  },
  components: {urlpanel, filepanel, attributespanel},
  methods: {
    activeTabColor: function(value) {
      if (this.activeTab == value) return {background: '#356BaB'};
      else return {background: 'unset'};
    },
    opened(option, viewer) {
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
    },
    removed(option, viewer) {
      // console.log('removed option', option);
      // console.log('removed viewer', viewer);
    },
    closed(option, viewer) {
      // console.log('closed option', option);
      // console.log('closed viewer', viewer);
    },
  },
};
</script>

<style>
.myTicketManagertoolbar {
  box-sizing: border-box;
  min-height: 5%;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
}
.myTicketManagerButton {
  box-sizing: border-box;
  width: 30%;
}
</style>