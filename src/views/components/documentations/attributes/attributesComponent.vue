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
  <md-content class="content md-scrollbar">
    <div class="nodeAttributes">
      <liste-component :data="categories"
                       @editParent="editCategory"
                       @deleteParent="deleteCategory"
                       @editChild="editAttribute"
                       @deleteChild="deleteAttibute"></liste-component>
    </div>

    <!-- <div class="nodeparentAttibutes">

    </div> -->

    <md-button class="md-fab md-primary md-fab-bottom-right"
               title="add category"
               @click="addCategory">
      <md-icon>add</md-icon>
    </md-button>
  </md-content>
</template>

<script>
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { attributeController } from "../../../../controllers";
import ListeComponent from "../../others/listComponent.vue";

export default {
  name: "attributeComponent",
  components: {
    "liste-component": ListeComponent,
  },
  props: {
    nodeId: {
      required: false,
      type: String,
    },
    dbId: {
      required: false,
      type: String | Number,
    },
  },
  data() {
    return {
      selectedNode: undefined,
      categories: [],
    };
  },
  async mounted() {
    this.updateCategories();
  },
  methods: {
    addCategory() {
      spinalPanelManagerService.openPanel("createAttributeCategoryDialog", {
        nodeId: this.nodeId,
        callback: (attribute) => {
          this.updateCategories();
        },
      });
    },

    async updateCategories() {
      this.categories =
        await attributeController.getAndFormatAttributeCategories(this.nodeId);
    },

    editCategory(id) {},

    deleteCategory(id) {},

    editAttribute(id) {},

    deleteAttibute(id) {},
  },
  watch: {
    nodeId() {
      this.updateCategories();
    },
  },
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  background: transparent !important;
  overflow: auto;
}

/* .content .nodeAttributes {
  width: 100%;
  height: 100%;
} */

.content .speedDial {
  flex-direction: row;
}

.content .speedDial .speedialContent {
  /* width: 350px; */
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-right: 5px;
}

.content .speedDial .speedialContent .speedialContentButton {
  width: 170px;
}
</style>