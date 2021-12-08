import Vue from "vue";
import { SpinalForgeExtention } from "spinal-env-viewer-panel-manager-service_spinalforgeextention";

import DocumentationComponent from "../../components/documentations/documentationPanel.vue";

const params = {
  name: "panel-documentation",
  vueMountComponent: Vue.extend(DocumentationComponent),
  panel: {
    title: "Documentation",
    classname: "spinal-pannel",
    closeBehaviour: "remove", // if something else panel is deleted
  },
  style: {
    left: "405px",
    minWidth: "600px",
    height: "700px",
  },
};

const extension = SpinalForgeExtention.createExtention(params);
SpinalForgeExtention.registerExtention(params.name, extension);
