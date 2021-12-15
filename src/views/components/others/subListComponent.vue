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
  <md-list class="subList">
    <md-list-item class="md-inset"
                  v-for="subItem in data"
                  :key="subItem.id">
      <span class="value"
            v-tooltip="subItem.label">{{subItem.label}}</span>
      <span class="value"
            v-tooltip="subItem.value"
            v-if="!isLink">{{subItem.value}}</span>
      <a class="value"
         :href="subItem.value"
         v-tooltip="subItem.value"
         target="_blank"
         v-else>{{subItem.value}}</a>

      <menu-component class="submenu"
                      :id="subItem.id"
                      @edit="edit(subItem.id)"
                      @remove="remove(subItem.id)"></menu-component>

    </md-list-item>
  </md-list>
</template>

<script>
import Menu from "./menu.vue";
export default {
  name: "subList",
  props: {
    data: {
      required: false,
      type: Array,
      default: () => [],
    },
    isLink: {
      require: false,
      type: Boolean,
      default: false,
    },
  },
  components: {
    "menu-component": Menu,
  },
  methods: {
    edit(id) {
      this.$emit("edit", id);
    },
    remove(id) {
      this.$emit("remove", id);
    },
  },
};
</script>

<style scoped>
.subList {
  padding: unset;
}

.subList .value {
  width: 40%;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

<style>
.subList .md-list-item-content {
  min-height: 30px;
  justify-content: unset;
}

.subList .md-list-item-content .md-ripple {
  width: unset !important;
}
</style>