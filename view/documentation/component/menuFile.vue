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
  <md-menu md-direction="top-end"
           md-align-trigger>
    <md-button class="md-icon-button"
               md-menu-trigger>
      <md-icon>more_vert</md-icon>
    </md-button>

    <md-menu-content>
      <md-menu-item v-if="file._info.model_type.get() != 'Directory'"
                    @click="download">Download</md-menu-item>
      <md-menu-item @click="remove">Remove</md-menu-item>
    </md-menu-content>
  </md-menu>
</template>

<script>
export default {
  name: "my_compo",
  props: ["file", "index"],
  data() {
    return {};
  },
  methods: {
    download() {
      // console.log(this.file);
      this.$emit("downloadFile", this.file, this.index);
    },
    remove() {
      // console.log(this.file);
      this.$emit("removeFile", this.file, this.index);
    }
  }
};
</script>

<style>
.my-test-panel-container * {
  box-sizing: border-box;
}
.my-test-panel-container-nbr-output {
  text-align: center;
}
</style>