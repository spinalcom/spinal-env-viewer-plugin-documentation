<template>
  <md-content class=" md-scrollbar"
              style="box-sizing: border-box; overflow-y:auto; height: 40vh">
    <div class="md-layout-item">
      <md-field style="width: 80%; margin-left: auto; margin-right: auto;">
        <md-select :md-selected="updatecategorySelected"
                   v-model="categorySelected"
                   name="category"
                   id="category"
                   placeholder="category">
          <md-option v-for="(category, index) in categoryDisplayList"
                     :key="index"
                     :value="category.node.info.name.get()">{{category.node.info.name.get()}}</md-option>
        </md-select>
      </md-field>
    </div>
    <div>
      <md-table v-model="displayAttributesList"
                md-card
                @md-selected="onSelectAttribute">
        <md-table-row class="myRowStyle"
                      slot="md-table-row"
                      slot-scope="{ item:forgeAttributes }"
                      md-auto-select
                      md-selectable="multiple">
          <md-table-cell>
            <span class="md-list-item-text">{{forgeAttributes.attributeName}}</span>
          </md-table-cell>
          <md-table-cell>
            <span class="md-list-item-text">{{forgeAttributes.displayValue}}</span>
          </md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </md-content>
</template>


<script>
export default {
  name: "addGroup",
  data() {
    return {
      categorySelected: undefined,
      selectedAttributesTab: [],
      propertiesTab: [],
      displayAttributesList: []
    };
  },
  components: {},
  props: ["option", "categoryDisplayList"],
  methods: {
    async benef() {
      // console.log(this.option);
      this.selectedNode = this.option.info;
      if (this.option.dbid) {
        this.dbid = this.option.dbid;
      } else {
        if (this.option.info.info.type.get() == "BIMObject")
          this.dbid = this.option.info.info.dbid.get();
      }
      this.exist = this.option.exist;

      this.propertiesTab = await this.promiseGetPorperties(this.dbid);
      this.updateDisplayAttributesList();
    },
    updateDisplayAttributesList() {
      this.displayAttributesList = [];
      for (let i = 0; i < this.propertiesTab.properties.length; i++) {
        const forgeAttributes = this.propertiesTab.properties[i];
        this.displayAttributesList.push(forgeAttributes);
      }
    },
    updatecategorySelected() {
      this.$emit("updatecategorySelected", this.categorySelected);
    },
    onSelectAttribute(items) {
      this.$emit("getAttributesFromForge", items);
    },
    promiseGetPorperties(dbId) {
      return new Promise(resolve => {
        window.spinal.ForgeViewer.viewer.model.getProperties(dbId, resolve);
      });
    }
  },
  mounted() {
    this.categorySelected = undefined;
    this.benef();
  },
  watch: {
    categorySelected: function() {
      this.updatecategorySelected();
    }
  }
};
</script>