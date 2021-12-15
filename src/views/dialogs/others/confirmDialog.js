import Vue from "vue";
import { SpinalMountExtention } from "spinal-env-viewer-panel-manager-service";
import confirmationDialog from "../../components/others/confirmationDialog.vue";

const dialogData = {
  name: "confimDeleteDialog",
  vueMountComponent: Vue.extend(confirmationDialog),
  parentContainer: document.body,
};

SpinalMountExtention.mount(dialogData);
