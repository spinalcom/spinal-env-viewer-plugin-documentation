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
  <md-dialog class="mdDialogContainer"
             :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">

    <md-dialog-title style="text-align : center">
      Create Url
    </md-dialog-title>

    <md-dialog-content>
      <md-field md-inline>
        <label>Label</label>
        <md-input v-model.trim="label"
                  :disabled="editA"></md-input>
      </md-field>
      <md-field md-inline>
        <label>link</label>
        <md-input v-model.trim="url"></md-input>
      </md-field>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-accent"
                 @click="closeDialog(false)">Cancel</md-button>
      <md-button class="md-primary"
                 :disabled="label.length == 0 || url.length == 0"
                 @click="closeDialog(true)">Confirm</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { urlController } from "../../../../controllers";
export default {
  name: "createUrlDialogComponent",
  props: ["onFinised"],
  data() {
    this.nodeId;
    this.isBimObject;
    this.bimObjectInfo;
    this.callback;
    return {
      editA: false,
      showDialog: true,
      label: "",
      url: "",
    };
  },
  methods: {
    opened({ nodeId, callback, isBimObject, bimObjectInfo, edit, label, url }) {
      this.nodeId = nodeId;
      this.callback = callback;
      this.isBimObject = isBimObject || false;
      this.bimObjectInfo = bimObjectInfo || {};
      this.editA = edit || false;
      if (edit) {
        this.label = label;
        this.url = url;
      }
    },

    async removed(option) {
      if (option) {
        if (this.editA) await this.edit();
        else await this.create();
      }
      this.showDialog = false;
    },

    create() {
      return urlController
        .addURL(
          this.nodeId,
          this.label,
          this.url,
          this.isBimObject,
          this.bimObjectInfo
        )
        .then((result) => {
          if (typeof this.callback === "function") this.callback(null, result);
        })
        .catch((err) => {
          if (typeof this.callback === "function") this.callback(err);
        });
    },

    edit() {
      console.log("edit");
      return urlController
        .editUrl(
          this.nodeId,
          this.label,
          this.url,
          this.isBimObject,
          this.bimObjectInfo
        )
        .then((result) => {
          if (typeof this.callback === "function") this.callback(null, result);
        })
        .catch((err) => {
          if (typeof this.callback === "function") this.callback(err, result);
        });
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },
  },
};
</script>

<style scoped>
</style>