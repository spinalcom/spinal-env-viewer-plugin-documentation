// const HeaderBarName = "GraphManagerGlobalBar";
// const sidebarName = "GraphManagerSideBar";
const circularMenuHookName = "circularMenu";


const {
  spinalContextMenuService,
  SpinalContextApp
} = require("spinal-env-viewer-context-menu-service");

const {
  spinalPanelManagerService,
  SpinalMountExtention
} = require("spinal-env-viewer-panel-manager-service");
const {
  SpinalForgeExtention
} = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");
import cdeComponent from "./cdeComponent.vue";
import notesComponent from "./notesComponent.vue";
import Vue from "vue"

// import CreateContextBtn from './classes/createContext';
// import AddAbstactElement from "./classes/addAbstract";


const cdeExtension = SpinalForgeExtention.createExtention({
  name: "panel-cde",
  vueMountComponent: Vue.extend(cdeComponent),
  // toolbar is optional

  panel: {
    title: "Spinalcom CDE",
    classname: "spinal-pannel",
    closeBehaviour: "remove" // if something else panel is deleted
  },
  style: {
    left: "405px"
  },
  onload: () => {},
  onUnLoad: () => {}
});

SpinalForgeExtention.registerExtention("panel-cde", cdeExtension);


const noteExtension = SpinalForgeExtention.createExtention({
  name: "panel-notes",
  vueMountComponent: Vue.extend(notesComponent),
  // toolbar is optional

  panel: {
    title: "Spinalcom CDE",
    classname: "spinal-pannel",
    closeBehaviour: "remove" // if something else panel is deleted
  },
  style: {
    left: "405px"
  },
  onload: () => {},
  onUnLoad: () => {}
});

SpinalForgeExtention.registerExtention("panel-notes", noteExtension);

class CDECircularMenuButton extends SpinalContextApp {
  constructor() {
    super("Spinal CDE", "Spinal CDE description", {
      icon: "folder",
      icon_type: "in",
      backgroundColor: "#356BAB",
      fontColor: "#FFFFFF"
    });
  }

  isShown(option) {
    console.log(option);
    //   if (
    //     option &&
    //     option.selectedNode &&
    //     option.selectedNode.getName().equals("Floor0")
    //   )
    //     return Promise.resolve(-1);
    return Promise.resolve(true);
  }

  action(option) {
    option.paramSent = "hello from CDECircularMenuButton";
    spinalPanelManagerService.openPanel("panel-cde", option);
    console.log("action clicked");
  }
}

spinalContextMenuService.registerApp(circularMenuHookName, new CDECircularMenuButton());

class NoteCircularMenu extends SpinalContextApp {
  constructor() {
    super("Spinal CDE", "Spinal CDE description", {
      icon: "border_color",
      icon_type: "in",
      backgroundColor: "#356BAB",
      fontColor: "#FFFFFF"
    });
  }

  isShown(option) {
    console.log(option);
    //   if (
    //     option &&
    //     option.selectedNode &&
    //     option.selectedNode.getName().equals("Floor0")
    //   )
    //     return Promise.resolve(-1);
    return Promise.resolve(true);
  }

  action(option) {
    option.paramSent = "hello from NoteCircularMenu";
    spinalPanelManagerService.openPanel("panel-notes", option);
    console.log("action clicked");
  }
}

spinalContextMenuService.registerApp(circularMenuHookName, new NoteCircularMenu());