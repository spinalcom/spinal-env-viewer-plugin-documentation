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
  <md-list class="principalList">
    <md-subheader class="hr-sect ">{{title}}</md-subheader>
    <md-list-item class="categoryItem"
                  v-for="item in data"
                  :key="item.id"
                  md-expand>
      <span class="categoryName md-list-item-text">{{item.name}}</span>
      <md-button class="md-icon-button md-list-action md-primary">
        <md-icon>add</md-icon>
      </md-button>

      <md-button class="md-icon-button md-list-action md-accent">
        <md-icon>remove</md-icon>
      </md-button>
      <!-- <menu-component class="menu"
                      :id="item.id"
                      @edit="editParent"
                      @delete="deleteParent"></menu-component> -->

      <sub-list-component slot="md-expand"
                          :data="item.children"
                          @edit="editChild"
                          @remove="deleteChild"></sub-list-component>

    </md-list-item>
  </md-list>
</template>

<script>
import MenuComponent from "./menu.vue";
import SubListComponent from "./subListComponent.vue";

export default {
  name: "listComponent",
  components: {
    "menu-component": MenuComponent,
    "sub-list-component": SubListComponent,
  },
  props: {
    data: {
      required: false,
      type: Array,
      default: () => [],
    },
    subData: {
      required: false,
      type: Array,
      default: () => [],
    },
    title: {
      require: false,
      type: String,
      default: "",
    },
  },
  methods: {
    editParent(id) {
      this.$emit("editParent", id);
    },
    deleteParent(id) {
      this.$emit("deleteParent", id);
    },
    editChild(id) {
      this.$emit("editChild", id);
    },
    deleteChild(id) {
      this.$emit("deleteChild", id);
    },
  },
};
</script>

<style scoped>
.principalList {
  width: 100%;
  margin: auto;
  padding: unset !important;
  background: transparent !important;
}

.principalList * {
  background: transparent !important;
}

.principalList .categoryName {
  flex: 0 0 75%;
}

/* .principalList .categoryName {
  position: absolute;
  left: 26px;
} */

.principalList .menu {
  position: absolute;
  right: 0%;
  border: 0px;
}

/* .principalList .listItem {
} */
</style>

<style>
.principalList .md-list-item-content {
  min-height: 30px;
  justify-content: unset;
}
</style>