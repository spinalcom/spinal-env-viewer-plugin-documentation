import Vue from "vue";
import { SpinalMountExtention } from "spinal-env-viewer-panel-manager-service";
import CreateUrlComponent from "../../components/documentations/urls/createUrl.vue";

const dialogData = {
  name: "createUrlDialog",
  vueMountComponent: Vue.extend(CreateUrlComponent),
  parentContainer: document.body,
};

SpinalMountExtention.mount(dialogData);
