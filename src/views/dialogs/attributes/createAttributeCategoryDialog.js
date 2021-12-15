import Vue from "vue";
import { SpinalMountExtention } from "spinal-env-viewer-panel-manager-service";
import CreateCategoryComponent from "../../components/documentations/attributes/createCategory.vue";

const dialogData = {
  name: "createAttributeCategoryDialog",
  vueMountComponent: Vue.extend(CreateCategoryComponent),
  parentContainer: document.body,
};

SpinalMountExtention.mount(dialogData);
