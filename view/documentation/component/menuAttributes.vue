<!--
import { constants } from 'http2';
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
    <md-menu md-direction="top-end"
             md-align-trigger>
      <md-button class="md-icon-button"
                 md-menu-trigger>
        <md-icon>more_vert</md-icon>
      </md-button>

      <md-menu-content>
        <md-menu-item @click="activeEditAttributesNode  = true">Edit
        </md-menu-item>
        <md-menu-item @click="remove()">Remove</md-menu-item>
      </md-menu-content>
    </md-menu>

    <md-dialog :md-active.sync="activeEditAttributesNode">
      <md-dialog-title>Edit Attribute</md-dialog-title>
      <md-field md-inline
                style="width: 80%; margin-left: auto; margin-right: auto;">
        <label>Label</label>
        <md-input v-model="urlChange.label"></md-input>
      </md-field>
      <md-field md-inline
                style="width: 80%; margin-left: auto; margin-right: auto;">
        <label>Link</label>
        <md-input v-model="urlChange.value"></md-input>
      </md-field>

      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="activeEditAttributesNode = false">Close</md-button>
        <md-button class="md-primary"
                   @click="edit">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
export default {
  name: "my_compo",
  props: ["url", "category"],
  data() {
    return {
      activeEditAttributesNode: false,
      urlChange: { label: "", URL: "" },
    };
  },
  methods: {
    edit() {
      this.$emit("editURLNode", this.url, this.urlChange);
      this.activeEditAttributesNode = false;
    },

    remove() {
      this.$emit("removeURLNode", this.url, this.category);
    },
  },
  mounted() {
    if (this.url !== undefined) {
      this.urlChange.label = this.url.label.get();
      this.urlChange.value = this.url.value.get();
    }
  },
  watch: {
    activeEditAttributesNode() {
      if (this.activeEditAttributesNode) {
        if (this.url !== undefined) {
          this.urlChange.label = this.url.label.get();
          this.urlChange.value = this.url.value.get();
        }
      }
    },
  },
};
</script>

<style>
</style>