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
  <md-content class="urlContainer">
    <div class="localAttributes">
      <url-template :data="urlData"
                    :isLocal="true"></url-template>
    </div>

    <div class="localAttributes">
      <url-template :data="sharedUrls"></url-template>
    </div>

    <md-button class="md-fab md-primary md-fab-bottom-right"
               title="add category"
               @click="addUrl">
      <md-icon>add</md-icon>
    </md-button>
  </md-content>
</template>

<script>
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import { urlController } from "../../../../controllers";
import UrlTemplate from "./urlTemplate.vue";

export default {
  name: "urlComponent",
  components: { urlTemplate: UrlTemplate },

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
      urlData: [],
      sharedUrls: [],
    };
  },
  async mounted() {
    this.updateUrls();
    this.updateSharedUrls();
  },
  methods: {
    addUrl() {
      spinalPanelManagerService.openPanel("createUrlDialog", {
        nodeId: this.nodeId,
        callback: (urlCreated) => {
          this.updateUrls();
        },
      });
    },

    editUrl(id) {
      const found = this.urls.find((el) => el.id == id);
      spinalPanelManagerService.openPanel("createUrlDialog", {
        nodeId: this.nodeId,
        label: found && found.label,
        url: found && found.value,
        edit: true,
        callback: (urlCreated) => {
          this.updateUrls();
        },
      });
    },

    deleteUrl(id) {
      const found = this.urls.find((el) => el.id == id);
      spinalPanelManagerService.openPanel("confimDeleteDialog", {
        title: "delete url",
        content: "Do you realy want delete this url",
        nodeId: this.nodeId,
        label: found && found.label,
        url: found && found.value,
        callback: async () => {
          await urlController.deletetUrl(this.nodeId, found.label);
          this.updateUrls();
        },
      });
    },

    async updateUrls() {
      const urlData = await urlController.getAndFormatUrls(this.nodeId);
      console.log(urlData);
      this.urlData = [urlData];
    },

    async updateSharedUrls() {
      this.sharedUrls = await urlController.getSharedUrls(this.nodeId);
      console.log(this.sharedUrls);
    },
  },
  watch: {
    nodeId() {
      this.updateUrls();
      this.updateSharedUrls();
    },
  },
};
</script>

<style scoped>
.urlContainer {
  width: 100%;
  height: 100%;
  background: transparent !important;
}

.urlContainer .localAttributes {
  min-height: 50%;
}

.urlContainer .localAttributes .emptyUrl {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>