<template>
  <md-content class="container-link urlBox">
    <div>
      <md-button class="addURLButtonPanel"
                 @click="activeDialogStatus = true">
        ADD ATTRIBUTES
      </md-button>

      <md-content>
        <md-table>
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
              <span class="span-opacity">{{url.label.get()}}</span>
            </md-table-cell>
            <md-table-cell class="size-md-cell">
              <span class="back-line span-opacity">
                {{url.value.get()}}</span>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </md-content>

    </div>
    <md-dialog :md-active.sync="activeDialogStatus">
      <md-dialog-title>Add Attributes</md-dialog-title>

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

      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="activeDialogStatus = false">Close</md-button>
        <md-button class="md-primary"
                   @click="addLink">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </md-content>
</template>


<script>
import Toasted from "vue-toasted";
import Vue from "vue";
import ServiceCDE from "spinal-env-viewer-plugin-cde-service";
Vue.use(Toasted);

export default {
  name: "linkPanel",
  data() {
    return {
      activeDialogStatus: false,
      label: undefined,
      value: undefined,
      URLDisplayList: [],
      myBind: undefined
    };
  },
  components: {},
  props: ["selectedNode", "dbid"],
  methods: {
    updateURLList() {
      let _this = this;
      // console.log(this.URLDisplayList);
      this.URLDisplayList = [];
      this.selectedNode.getChildren(["hasAttributes"]).then(myURLList => {
        // console.log(myURLList);
        for (let i = 0; i < myURLList.length; i++) {
          const urlNode = myURLList[i];
          // console.log(urlNode);
          urlNode.element.ptr.load(url => {
            _this.URLDisplayList.push(url);
          });
        }
      });
    },
    async addLink() {
      if (this.label != undefined && this.value != undefined) {
        this.$toasted.success("Attributes is register", {
          position: "top-center",
          duration: 2000
        });
        if (this.selectedNode != undefined) {
          ServiceCDE.addAttribute(this.selectedNode, this.label, this.value);
        } else {
          let myNewBIMObject = await ServiceCDE.addAttribute(
            this.dbid,
            this.label,
            this.value
          );
          this.$emit("updateMyBIMObject", myNewBIMObject);
        }
        this.label = undefined;
        this.value = undefined;
      } else {
        this.$toasted.error("BAD Request", {
          position: "top-center",
          duration: 2000
        });
      }
      this.activeDialogStatus = false;
    }
  },
  mounted() {
    // console.log("MOUNTED OF URL PANEL");
    // console.log(this.selectedNode);
    if (this.selectedNode != undefined) {
      // this.updateURLList();
      if (this.myBind == undefined)
        this.myBind = this.selectedNode.bind(this.updateURLList.bind(this));
    }
  },
  beforeDestroy() {
    if (this.selectedNode != undefined && this.myBind != undefined)
      this.selectedNode.unbind(this.myBind);
  }
};
</script>

<style>
.size-md-cell {
  padding-right: unset;
  padding-left: unset;
}
</style>