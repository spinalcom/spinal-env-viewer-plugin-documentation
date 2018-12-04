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
  <md-content class="md-scrollbar filesBox">
    <md-button class="addURLButtonPanel"
               @click="addURLDialogueStatus = true">
      File System Import
    </md-button>
  </md-content>
</template>

<script>
const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

export default {
  name: "my_compo",
  data() {
    return {
      outputNbr: 0,
      outputDialog: "",
      openedlabel: ""
    };
  },
  methods: {
    opened(option, viewer) {
      console.log("opened option", option);
      console.log("opened viewer", viewer);
      if (option.paramSent) this.openedlabel = option.paramSent;
    },
    removed(option, viewer) {
      console.log("removed option", option);
      console.log("removed viewer", viewer);
    },
    closed(option, viewer) {
      console.log("closed option", option);
      console.log("closed viewer", viewer);
    },
    openDialog() {
      spinalPanelManagerService.openPanel("myCustomDialogName", {
        paramSent: this.outputDialog
      });
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