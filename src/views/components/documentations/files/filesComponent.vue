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

    <md-button class="md-fab md-primary md-fab-bottom-right"
               title="add category"
               @click="addFile">
      <md-icon>file_upload</md-icon>
    </md-button>
  </md-content>
</template>

<script>
export default {
  name: "fileComponent",
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
      displaySharedFile: false,
    };
  },
  async mounted() {
    this.updateFiles();
  },
  methods: {
    addFile() {},
    async updateFiles() {},
  },
  watch: {
    nodeId() {
      this.updateFiles();
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
</style>