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
  <md-content class="container-link urlBox">
    <div>
      <md-button class="attributesButtonPanel"
                 @click="activeDialogCategory = true">
        ADD CATEGORY
      </md-button>
      <md-button class="attributesButtonPanel"
                 @click="activeDialogStatus = true">
        ADD ATTRIBUTES
      </md-button>
      <md-content>
      </md-content>
      <md-subheader class="hr-sect ">Local Attributes</md-subheader>
      <md-list class="widthOfList">
        <md-list-item class="colorForCategory"
                      v-for="(cat) in categoryDisplayList"
                      :key="cat.nameCat"
                      md-expand>
          <!-- <md-icon>whatshot</md-icon> -->
          <span class="nameOfCategory md-list-item-text">{{cat.nameCat}}</span>
          <menuCategoryAttributes class="buttonRight"
                                  @editCategoryNode="editCategoryNode"
                                  @removeCategoryNode="removeCategoryNode"
                                  :category="cat">
          </menuCategoryAttributes>
          <md-list class="unsetPadding"
                   slot="md-expand">
            <md-list-item v-for="(attributess, index) in getLstOfAttributes(cat)"
                          :key="index"
                          class="md-inset">
              <span style="width: 40%">{{attributess.label.get()}}</span>
              <span style="width: 40%">{{attributess.value.get()}}</span>
              <menu-attributes @editURLNode="editURLNode"
                               @removeURLNode="removeURLNode"
                               :url="attributess"
                               :category="cat"></menu-attributes>
            </md-list-item>

          </md-list>

        </md-list-item>
      </md-list>
      <div v-if="groupAttrDisplayList.length > 0">
        <md-subheader class="hr-sect ">Shared Attributes</md-subheader>
        <md-list class="widthOfList"
                 v-for="(group) in groupAttrDisplayList"
                 :key="group.groupName">
          <md-subheader class="sharedCategoryCss">{{group.groupName}}
          </md-subheader>

          <md-list-item class="colorForCategory"
                        v-for="(cat) in group.groupAttr"
                        :key="cat.nameCat"
                        md-expand>
            <!-- <md-icon>whatshot</md-icon> -->
            <span
                  class="nameOfCategory md-list-item-text">{{cat.nameCat}}</span>

            <md-list class="unsetPadding"
                     slot="md-expand">
              <md-list-item v-for="(attributess, index) in getLstOfAttributes(cat)"
                            :key="index"
                            class="md-inset">
                <span style="width: 40%">{{attributess.label.get()}}</span>
                <span style="width: 40%">{{attributess.value.get()}}</span>

              </md-list-item>

            </md-list>

          </md-list-item>
        </md-list>
      </div>

    </div>
    <md-dialog class="spinal-dialog-add-attr"
               :md-active.sync="activeDialogStatus">
      <md-dialog-title>Add Attributes</md-dialog-title>
      <md-tabs md-dynamic-height
               @md-changed="resetAttributes"
               md-alignment="fixed">
        <md-tab class="heightTabsCreateAttr"
                md-label="Create">
          <div class="md-layout-item">
            <md-field
                      style="width: 80%; margin-left: auto; margin-right: auto;">
              <md-select v-model="categorySelected"
                         name="category"
                         id="category"
                         placeholder="category">
                <!-- <md-option value="none">Create Category</md-option> -->
                <md-option v-for="(category, index) in categoryDisplayList"
                           :key="index"
                           :value="category.node.info.name.get()">
                  {{category.node.info.name.get()}}</md-option>
              </md-select>
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
        </md-tab>
        <md-tab md-label="Import">
          <attributesImport :option="option"
                            :categoryDisplayList="categoryDisplayList"
                            @getAttributesFromForge="getAttributesFromForge"
                            @updatecategorySelected="updatecategorySelected">
          </attributesImport>
        </md-tab>
      </md-tabs>
      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="activeDialogStatus = false">Close</md-button>
        <md-button class="md-primary"
                   @click="addAttributes">Save</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="activeDialogCategory">
      <md-dialog-title>Add Category</md-dialog-title>

      <md-field md-inline
                style="width: 80%; margin-left: auto; margin-right: auto;">
        <label>category</label>
        <md-input v-model="category"></md-input>
      </md-field>

      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="activeDialogCategory = false">Close</md-button>
        <md-button class="md-primary"
                   @click="addCategory">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </md-content>
</template>


<script>
//import Toasted from "vue-toasted";

import Vue from "vue";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import menuAttributes from "./component/menuAttributes.vue";
import menuCategoryAttributes from "./component/menuCategoryAttributes.vue";
import attributesImport from "./component/attributesImport.vue";
import { utilities } from "../../service/utilities.js";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
//Vue.use(Toasted);
let viewer;

export default {
  name: "linkPanel",
  data() {
    return {
      activeDialogStatus: false,
      activeDialogCategory: false,
      label: undefined,
      value: undefined,
      categorySelected: undefined,
      categoryCreate: "none",
      category: undefined,
      categoryDisplayList: [],
      URLDisplayList: [],
      myBind: undefined,
      groupAttrDisplayList: [],
      myBindParent: undefined,
      parentListToBind: undefined
    };
  },
  components: { menuAttributes, menuCategoryAttributes, attributesImport },
  props: ["option", "parentGroup"],
  methods: {
    // async selectAttributes(attr) {
    //   console.log("___________________________");
    //   serviceDocumentation
    //     .getCategoryByName(this.option.info, attr.nameCat)
    //     .then(async category => {
    //       console.log(category);
    //     });

    //   let category = await serviceDocumentation.addCategoryAttribute(
    //     this.option.info,
    //     "categoryName"
    //   );
    //   console.log(category);
    //   console.log("___________________________");
    // },
    editURLNode(attributes, urlChange) {
      attributes.label.set(urlChange.label);
      attributes.value.set(urlChange.value);
      this.resetBind();
    },
    removeURLNode(attributes, category) {
      for (let i = 0; i < category.element.length; i++) {
        const element = category.element[i];
        if (element.label.get() == attributes.label.get()) {
          category.element.splice(i, 1);
        }
      }
    },
    editCategoryNode(category, change) {
      category.node.info.name.set(change.name);
    },
    removeCategoryNode(category) {
      serviceDocumentation.removeNode(category.node);
    },
    getAttributesFromForge(attributes) {
      this.selectedAttributesForge = attributes;
      // get la list d'attributs depuis les attributes de forge
    },
    updatecategorySelected(categorySelected) {
      this.categorySelected = categorySelected;
    },
    async updateURLList() {
      if (this.option.info != undefined) {
        this.categoryDisplayList = await serviceDocumentation.getCategory(
          this.option.info
        );
      }
    },
    async updateAttrParent() {
      this.groupAttrDisplayList = [];
      let json = {};
      for (let i = 0; i < this.parentGroup.length; i++) {
        const node = this.parentGroup[i];
        json = {
          groupName: node.info.name.get(),
          groupAttr: await serviceDocumentation.getCategory(node)
        };
        this.groupAttrDisplayList.push(json);
      }
    },
    getLstOfAttributes(cat) {
      let tab = [];
      if (cat.element != undefined) {
        for (let i = 0; i < cat.element.length; i++) {
          const element = cat.element[i];
          tab.push(element);
        }
      }
      return tab;
    },
    async testAttributes() {
      if (this.categorySelected != undefined || this.categorySelected != "") {
        if (this.label == undefined || this.value == undefined) {
          let cat = await serviceDocumentation.getCategoryByName(
            this.option.info,
            this.categorySelected
          );
          for (let i = 0; i < this.selectedAttributesForge.length; i++) {
            const element = this.selectedAttributesForge[i];
            serviceDocumentation.addAttributeByCategory(
              this.option.info,
              cat,
              element.displayName,
              element.displayValue
            );
          }
        } else {
          let label = this.label;
          let value = this.value;
          let cat = await serviceDocumentation.getCategoryByName(
            this.option.info,
            this.categorySelected
          );
          serviceDocumentation.addAttributeByCategory(
            this.option.info,
            cat,
            this.label,
            this.value
          );
        }
      } else {
        console.log("error");
      }
    },
    async addAttributes() {
      if (this.option.exist == false) {
        window.spinal.ForgeViewer.viewer.model.getProperties(
          this.option.dbid,
          async res => {
            let boolIsCreated = await window.spinal.BimObjectService.createBIMObject(
              this.option.dbid,
              res.name,
              this.option.model3d
            );
            if (boolIsCreated) {
              let bimObject = await window.spinal.BimObjectService.getBIMObject(
                this.option.dbid,
                this.option.model3d
              );
              this.option.info = SpinalGraphService.getRealNode(bimObject.id);
            }

            await this.testAttributes();
            this.resetAttributes();
            this.resetBind();
          }
        );
      } else {
        await this.testAttributes();
        this.resetAttributes();
      }
      // on check si les attributs viennent de forge ou on créer un attributs

      // viewer.model.getProperties(this.option.dbid, function(res) {
      //   let option = utilities.addAttributes(
      //     _this.option,
      //     res.name,
      //     label,
      //     value
      //   );
      //   option.then(option => {
      //     if (_this.option.exist == false) {
      //       _this.option.exist = true;
      //       _this.$emit("updateMyBIMObject", option);
      //     }
      //   });
      // });
      // this.label = undefined;
      // this.value = undefined;
      // this.categorySelected = undefined;
      this.activeDialogStatus = false;
    },
    checkCategory() {
      if (this.category != undefined && this.category != "") {
        serviceDocumentation.addCategoryAttribute(
          this.option.info,
          this.category
        );
        this.category = "";
      }
    },
    addCategory() {
      let _this = this;
      if (this.option.exist) {
        this.checkCategory();
      } else {
        // create bim object before add note
        if (this.option.dbid != undefined) {
          window.spinal.ForgeViewer.viewer.model.getProperties(
            this.option.dbid,
            async res => {
              let boolIsCreated = await window.spinal.BimObjectService.createBIMObject(
                _this.option.dbid,
                res.name,
                _this.option.model3d
              );
              if (boolIsCreated) {
                let bimObject = await window.spinal.BimObjectService.getBIMObject(
                  _this.option.dbid,
                  _this.option.model3d
                );
                _this.option.info = SpinalGraphService.getRealNode(
                  bimObject.id
                );
              }
              _this.option.exist = true;
              _this.$emit("updateMyBIMObject", this.option);

              _this.checkCategory();
              _this.resetBind();
            }
          );
        }
      }
      // this.category = "";
      this.activeDialogCategory = false;
    },
    resetAttributes() {
      this.label = undefined;
      this.value = undefined;
      this.categorySelected = undefined;
      this.selectedAttributesForge = undefined;
    },
    resetBind() {
      if (this.option.info != undefined) {
        if (this.option != undefined) {
          if (this.myBind != undefined) {
            this.option.info.unbind(this.myBind);
            this.myBind = undefined;
          }
          if (this.myBind == undefined) {
            this.myBind = this.option.info.bind(this.updateURLList.bind(this));
          }
        }
      }
    },
    resetBindParent() {
      // j'ai la liste de tous les node parent
      if (this.parentListToBind == undefined) {
        this.parentListToBind = new Lst();
      }
      if (!this.parentListToBind.length == this.parentGroup.length) {
        this.parentListToBind.splice(0, this.parentListToBind.length);
        for (let i = 0; i < this.parentGroup.length; i++) {
          const element = this.parentGroup[i];
          this.parentListToBind.push(element);
        }
      }
      if (this.myBindParent == undefined)
      {this.parentListToBind.bind(this.updateAttrParent.bind(this));}
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    this.resetBind();
    this.resetBindParent();
  },
  watch: {
    option: function() {
      this.resetBind();
    },
    parentGroup: function() {
      this.resetBindParent();
    }
  },
  beforeDestroy() {
    if (this.option.info != undefined && this.myBind != undefined)
    {this.option.info.unbind(this.myBind);}
  }
};
</script>

<style>
.container-link
  i.md-icon.md-icon-font.md-icon-image.md-list-expand-icon.md-theme-default {
  position: absolute;
  margin: unset;
}

.nameOfCategory {
  position: absolute;
  left: 26px;
}
.unsetPadding {
  padding: unset;
}
.widthOfList {
  width: 93%;
  margin-left: auto;
  margin-right: auto;
}

.buttonRight {
  position: absolute;
  right: 0%;
}

.titleOfSharedLocal {
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
}
.spinal-dialog-add-attr {
  max-width: 80vw;
}
.spinal-dialog-add-attr > .md-dialog-container {
  max-width: 100%;
}
</style>
