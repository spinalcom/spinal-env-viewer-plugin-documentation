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
  <md-content class="unsetBackgroundContent ">
    <md-button @click="forgeSelection">
      {{selectedDbidArray.length}} Selected Object
    </md-button>
    <md-field md-inline
              style="width: 80%; margin-left: auto; margin-right: auto;">
      <label>Label</label>
      <md-input v-model="label"></md-input>
    </md-field>

    <md-field md-inline
              style="width: 80%; margin-left: auto; margin-right: auto;">
      <label>URL</label>
      <md-input v-model="value"></md-input>
    </md-field>
    <md-button class="md-primary"
               @click="editURL">Edit</md-button>
    <md-button class="md-primary"
               @click="deleteURL">Delete</md-button>
  </md-content>
</template>

<script>
import bimObjectService from "spinal-env-viewer-plugin-bimobjectservice";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
export default {
  name: "my_compo",
  data() {
    return {
      selectedDbidArray: [],
      label: undefined,
      value: undefined
    };
  },
  components: {},
  methods: {
    forgeSelection() {
      this.viewer.select(this.selectedDbidArray);
    },
    deleteURL() {
      this.selectedDbidArray.forEach(dbid => {
        bimObjectService.getBIMObject(dbid).then(node => {
          if (node === undefined) {
            // bimobject is not create, we create it
            // console.log("create bim object");
            // window.spinal.ForgeViewer.viewer.model.getProperties(dbid, res => {
            //   bimObjectService
            //     .createBIMObject(dbid, res.name)
            //     .then(myBIMObject => {
            //       serviceDocumentation.addURL(
            //         myBIMObject,
            //         this.label,
            //         this.value
            //       );
            //     });
            // });
          } else {
            // bim object is created, node is our bim object
            serviceDocumentation.deleteURL(node, this.label);
          }
        });
      });
    },
    editURL() {},
    addURL() {
      this.selectedDbidArray.forEach(dbid => {
        bimObjectService.getBIMObject(dbid).then(node => {
          if (node === undefined) {
            // bimobject is not create, we create it
            // console.log("create bim object");
            window.spinal.ForgeViewer.viewer.model.getProperties(dbid, res => {
              bimObjectService
                .createBIMObject(dbid, res.name)
                .then(myBIMObject => {
                  serviceDocumentation.addURL(
                    myBIMObject,
                    this.label,
                    this.value
                  );
                });
            });
          } else {
            // bim object is created, node is our bim object
            serviceDocumentation.addURL(node, this.label, this.value);
          }
        });
      });
    },
    opened(objet, viewer) {
      this.viewer = viewer;
      this.selectedDbidArray = objet.dbid;
    },
    removed(option, viewer) {},
    closed(option, viewer) {}
  }
};
</script>

<style>
.unsetBackgroundContent {
  background: transparent !important;
  box-sizing: border-box;
  height: calc(100% - 50px);
}
.unsetBackgroundContent ul.md-list.md-theme-default {
  background-color: unset;
}
.unsetBackgroundContent .md-field.md-theme-default.md-inline {
  margin: unset;
}
</style>
