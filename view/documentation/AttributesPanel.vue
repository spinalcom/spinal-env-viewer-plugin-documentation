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
        <!-- <md-table>
          <md-table-row class="myRowStyle ">
            <md-table-head class="size-md-cell myCellStyle">
              <span class="span-opacity"> Label </span>
            </md-table-head>
            <md-table-head class="size-md-cell myCellStyle2">
              <span class="span-opacity"> Value </span>
            </md-table-head>
          </md-table-row>
          <md-table-row class="myRowStyle"
                        v-for="(url, index) in URLDisplayList"
                        :key="index">
            <md-table-cell class="size-md-cell">
              <span class="span-opacity">{{url.element.label.get()}}</span>
            </md-table-cell>
            <md-table-cell class="size-md-cell">
              <span class="back-line span-opacity">
                {{url.element.value.get()}}</span>
            </md-table-cell>
            <md-table-cell>
              <menu-attributes @editURLNode="editURLNode"
                               @removeURLNode="removeURLNode"
                               :url="url"></menu-attributes>
            </md-table-cell>
          </md-table-row>
        </md-table> -->
      </md-content>
      <md-list class="widthOfList">
        <md-list-item class="colorForCategory"
                      v-for="(cat) in categoryDisplayList"
                      :key="cat.node.info.name.get()"
                      md-expand>
          <!-- <md-icon>whatshot</md-icon> -->
          <span class="nameOfCategory md-list-item-text">{{cat.node.info.name.get()}}</span>
          <menuCategoryAttributes class="buttonRight"
                                  @editCategoryNode="editCategoryNode"
                                  @removeCategoryNode="removeCategoryNode"
                                  :category="cat">
          </menuCategoryAttributes>
          <md-list class="unsetPadding"
                   slot="md-expand">
            <md-list-item v-for="(attributess, index) in getLstOfAttributes(cat)"
                          @click="selectAttributes(attributes)"
                          :key="index"
                          class="md-inset">
              <span>{{attributess.label.get()}}</span>
              <span>{{attributess.value.get()}}</span>
              <menu-attributes @editURLNode="editURLNode"
                               @removeURLNode="removeURLNode"
                               :url="attributess"
                               :category="cat"></menu-attributes>
            </md-list-item>

          </md-list>

        </md-list-item>
      </md-list>
    </div>
    <md-dialog :md-active.sync="activeDialogStatus">
      <md-dialog-title>Add Attributes</md-dialog-title>
      <md-tabs md-dynamic-height
               @md-changed="resetAttributes"
               md-alignment="fixed">
        <md-tab md-label="Create">
          <div class="md-layout-item">
            <md-field style="width: 80%; margin-left: auto; margin-right: auto;">
              <md-select v-model="categorySelected"
                         name="category"
                         id="category"
                         placeholder="category">
                <md-option v-for="(category, index) in categoryDisplayList"
                           :key="index"
                           :value="category.node.info.name.get()">{{category.node.info.name.get()}}</md-option>
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
                            @updatecategorySelected="updatecategorySelected"></attributesImport>
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
import Toasted from "vue-toasted";
import Vue from "vue";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import menuAttributes from "./component/menuAttributes.vue";
import menuCategoryAttributes from "./component/menuCategoryAttributes.vue";
import attributesImport from "./component/attributesImport.vue";
import { utilities } from "../../service/utilities.js";
import bimObjectService from "spinal-env-viewer-plugin-bimobjectservice";
Vue.use(Toasted);
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
      category: undefined,
      categoryDisplayList: [],
      URLDisplayList: [],
      myBind: undefined
    };
  },
  components: { menuAttributes, menuCategoryAttributes, attributesImport },
  props: ["option"],
  methods: {
    editURLNode(attributes, urlChange) {
      // console.log(attributes);
      // console.log(urlChange);
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
      // console.log(attributes);
      this.selectedAttributesForge = attributes;
      // get la list d'attributs depuis les attributes de forge
    },
    updatecategorySelected(categorySelected) {
      // console.log("updateCategorySelected");
      this.categorySelected = categorySelected;
      // console.log(this.categorySelected);
    },
    async updateURLList() {
      if (this.option.info != undefined) {
        // let test = await serviceDocumentation.getAllAttributes(
        //   this.option.info
        // );
        this.categoryDisplayList = await serviceDocumentation.getCategory(
          this.option.info
        );
        // console.log(this.categoryDisplayList);
      }

      // if (this.option.info != undefined)
      //   this.URLDisplayList = await serviceDocumentation.getAttributes(
      //     this.option.info
      //   );
      // else this.URLDisplayList = [];
    },
    getLstOfAttributes(cat) {
      let tab = [];
      for (let i = 0; i < cat.element.length; i++) {
        const element = cat.element[i];
        tab.push(element);
      }
      return tab;
    },
    async testAttributes() {
      // console.log(this.categorySelected);

      if (this.categorySelected != undefined || this.categorySelected != "") {
        if (this.label == undefined || this.value == undefined) {
          // console.log(this.selectedAttributesForge);
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
          console.log(cat);
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
            this.option.info = await bimObjectService.createBIMObject(
              this.option.dbid,
              res.name
            );
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
      // console.log(this.category);

      if (this.category != undefined && this.category != "") {
        serviceDocumentation.addCategoryAttribute(
          this.option.info,
          this.category
        );
        this.category = "";
      }
    },
    addCategory() {
      // console.log(this.category);
      // console.log(this.option);
      if (this.option.exist) {
        this.checkCategory();
      } else {
        // create bim object before add note
        if (this.option.dbid != undefined) {
          window.spinal.ForgeViewer.viewer.model.getProperties(
            this.option.dbid,
            async res => {
              this.option.info = await bimObjectService.createBIMObject(
                this.option.dbid,
                res.name
              );
              // console.log(this.option.info);
              this.checkCategory();
              this.resetBind();
            }
          );
        }
      }
      // this.category = "";
      this.activeDialogCategory = false;
    },
    resetAttributes() {
      // console.log("reset attributs");

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
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    this.resetBind();
  },
  watch: {
    option: function() {
      this.resetBind();
    }
  },
  beforeDestroy() {
    if (this.option.info != undefined && this.myBind != undefined)
      this.option.info.unbind(this.myBind);
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
.colorForCategory > .md-list-item-container > .md-list-item-content {
  background-color: rgba(53, 107, 171, 0.5);
}
.buttonRight {
  position: absolute;
  right: 0%;
}
</style>
