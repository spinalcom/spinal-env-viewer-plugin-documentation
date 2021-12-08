import Vue from "vue";
import { SpinalForgeExtention } from "spinal-env-viewer-panel-manager-service_spinalforgeextention";

import notesComponent from "../../components/notes/notesComponent.vue";

const params = {
  name: "panel-notes",
  vueMountComponent: Vue.extend(notesComponent),
  panel: {
    title: "Notes",
    classname: "spinal-pannel",
    closeBehaviour: "remove", // if something else panel is deleted
  },
  style: {
    left: "405px",
    height: "475px",
    minWidth: "510px",
  },
  onload: () => {},
  onUnLoad: () => {},
};

const noteExtension = SpinalForgeExtention.createExtention(params);
SpinalForgeExtention.registerExtention(params.name, noteExtension);
