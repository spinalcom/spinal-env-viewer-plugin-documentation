<!--
Copyright 2020 SpinalCom - www.spinalcom.com

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
  <md-dialog class="mdDialogContainer paramsDialogContainer"
             :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title style="text-align : center">

    </md-dialog-title>

    <md-dialog-content class="md-scrollbar">
      <ul>
        <message-component v-for="(note,index) in messages"
                           :key="index"
                           :date="note.date.get()"
                           :username="note.username.get()"
                           :message="note.message.get()"
                           :type="note.type.get()"
                           :file="note.file"></message-component>
      </ul>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <!-- <md-button class="md-primary"
                 @click="closeDialog(true)">Save</md-button> -->
    </md-dialog-actions>
  </md-dialog>

</template>

<script>
import { NOTE_TYPE } from "spinal-env-viewer-plugin-documentation-service/dist/Models/constants";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import messageVue from "../components/message.vue";

export default {
  name: "messageDetailDialog",
  props: ["onFinised"],
  components: { "message-component": messageVue },
  data() {
    return {
      showDialog: true,
      messages: []
    };
  },
  methods: {
    async opened(params) {
      this.messages = await this.getAllNotes(params.nodeId, params.contextId);
    },

    async getAllNotes(nodeId, contextId) {
      const realNode = SpinalGraphService.getRealNode(nodeId);
      const type = realNode && realNode.getType().get();

      if (!type) return [];

      return SpinalGraphService.findInContext(nodeId, contextId, node => {
        SpinalGraphService._addNode(node);
        return node.getType().get() === NOTE_TYPE;
      }).then(values => {
        const promises = values.map(async el => {
          const node = SpinalGraphService.getRealNode(el.id.get());
          const element = await node.getElement();
          return element;
        });

        return Promise.all(promises);
      });
    },

    removed(closed) {
      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    }
  }
};
</script>