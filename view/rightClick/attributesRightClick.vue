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
    <div class="md-layout-item">
      <md-field style="width: 80%; margin-left: auto; margin-right: auto;">
        <md-select v-model="categorySelected"
                   name="category"
                   id="category"
                   placeholder="category">
          <md-option value="none">Create Category</md-option>
          <md-option v-for="(category, index) in allCategory"
                     :key="index"
                     :value="category.node.info.name.get()">{{category.node.info.name.get()}}</md-option>
        </md-select>
      </md-field>
      <md-field v-if="categorySelected === 'none'"
                md-inline
                style="width: 80%; margin-left: auto; margin-right: auto;">
        <label>category</label>
        <md-input v-model="categoryCreate"></md-input>
      </md-field>
    </div>
    <md-field md-inline
              style="width: 80%; margin-left: auto; margin-right: auto;">
      <label>Label</label>
      <md-input v-model="label"></md-input>
    </md-field>

    <md-field md-inline
              style="width: 80%; margin-left: auto; margin-right: auto;">
      <label>Value</label>
      <md-input v-model="value"></md-input>
    </md-field>
    <md-button class="md-primary"
               @click="addAttributes">Save</md-button>
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
      allCategory: [],
      categorySelected: "none",
      label: undefined,
      value: undefined,
      categoryCreate: undefined
    };
  },
  components: {},
  methods: {
    forgeSelection() {
      this.viewer.select(this.selectedDbidArray);
    },
    addAttributes() {
      // console.log(this.label);
      // console.log(this.value);
      // console.log(this.categorySelected);
      let myCategoerySelected = this.categorySelected;
      if (myCategoerySelected === "none") {
        myCategoerySelected = this.categoryCreate;
      }
      this.selectedDbidArray.forEach(dbid => {
        bimObjectService.getBIMObject(dbid).then(node => {
          if (node === undefined) {
            // bimobject is not create, we create it
            // console.log("create bim object");
            window.spinal.ForgeViewer.viewer.model.getProperties(dbid, res => {
              bimObjectService
                .createBIMObject(dbid, res.name)
                .then(myBIMObject => {
                  serviceDocumentation.addAttributeByCategoryName(
                    myBIMObject,
                    myCategoerySelected,
                    this.label,
                    this.value
                  );
                  // this.label = "";
                  // this.value = "";
                });
            });
          } else {
            // bim object is created, node is our bim object
            // console.log("bim object exist");
            serviceDocumentation.addAttributeByCategoryName(
              node,
              myCategoerySelected,
              this.label,
              this.value
            );
            // this.label = "";
            // this.value = "";
          }
        });
        // window.spinal.ForgeViewer.viewer.model.getProperties(
        //   this.nodeInfo.dbid,
        //   async res => {
        //     this.nodeInfo.selectedNode = await bimObjectService.createBIMObject(
        //       this.nodeInfo.dbid,
        //       res.name
        //     );
        //     serviceDocumentation.addNote(
        //       this.nodeInfo.selectedNode,
        //       window.spinal.spinalSystem.getUser().username,
        //       this.messageUser
        //     );
        //     this.resetBind();
        //   }
        // );
      });
    },
    opened(objet, viewer) {
      this.viewer = viewer;
      // console.log(objet);

      this.selectedDbidArray = objet.dbid;
      this.allCategory = objet.category;
    },
    removed(option, viewer) {
      // console.log("removed option", option);
      // console.log("removed viewer", viewer);
    },
    closed(option, viewer) {
      // console.log("closed option", option);
      // console.log("closed");
      // console.log("closed viewer", viewer);
    }
  }
};
</script>

<style>
/* .unsetBackgroundContent .md-content.md-theme-default {
  background-color: unset;
}
.unsetBackgroundUl ul.md-list.md-theme-default {
  background-color: unset;
} */
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
