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
                   @click="addAttributes">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </md-content>
</template>


<script>
import Toasted from "vue-toasted";
import Vue from "vue";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import { utilities } from "../../service/utilities.js";
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
  props: ["option"],
  methods: {
    async updateURLList() {
      if (this.option.info != undefined)
        this.URLDisplayList = await serviceDocumentation.getAttributes(
          this.option.info
        );
      else this.URLDisplayList = [];
    },
    async addAttributes() {
      let option = await utilities.addAttributes(
        this.option,
        this.label,
        this.value
      );
      // console.log(option);
      this.$emit("updateMyBIMObject", option);
      this.label = undefined;
      this.value = undefined;
      // if (option.selectedNode != undefined) {
      //   this.$toasted.success("URL is register", {
      //     position: "bot-right",
      //     duration: 2000
      //   });
      // } else {
      //   this.$toasted.error("BAD Request", {
      //     position: "top-center",
      //     duration: 2000
      //   });
      // }
      this.updateURLList();
      this.activeDialogStatus = false;
    }
  },
  mounted() {
    if (this.option.info != undefined) {
      if (this.myBind == undefined)
        this.myBind = this.option.info.bind(this.updateURLList.bind(this));
      1;
    }
  },
  watch: {
    option: function() {
      this.updateURLList();
    }
  },
  beforeDestroy() {
    if (this.option.info != undefined && this.myBind != undefined)
      this.option.info.unbind(this.myBind);
  }
};
</script>

<style>
.size-md-cell {
  padding-right: unset;
  padding-left: unset;
}
</style>
