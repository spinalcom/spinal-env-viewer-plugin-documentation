import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";

import {
  SpinalGraphService,
  SpinalNode,
} from "spinal-env-viewer-graph-service";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

import {
  CIRCULAR_MENU_HOOK,
  SIDEBAR_HOOK,
  registerButtonToHook,
} from "../buttonHook";

class NotesButton extends SpinalContextApp {
  constructor() {
    super("Spinal Notes", "Spinal CDE description", {
      icon: "insert_comment",
      icon_type: "in",
      backgroundColor: "#356BAB",
      fontColor: "#FFFFFF",
    });
  }

  isShown(option) {
    /*
      if ((option.selectedNode && option.selectedNode.type === 'BIMObject') ||
        option.dbid)
        return Promise.resolve(true);
      // to do : put some restriction to see if the selectedNode is a BIMObject or an element of geographiqueContext
      // console.log(option)
      return Promise.resolve(-1);
      */

    return Promise.resolve(true);
  }

  async action(option) {
    let obj = {
      selectedNode: getSelectedNode(option.selectedNode),
      dbid: option.dbid ? option.dbid : getDbId(option.selectedNode),
      exist: option.exist,
      model: option.model3d,
    };

    spinalPanelManagerService.openPanel("panel-notes", obj);
  }
}

const getSelectedNode = (selectedNode) => {
  if (typeof selectedNode === "undefined") return;

  if (selectedNode instanceof SpinalNode) return selectedNode;

  return SpinalGraphService.getRealNode(selectedNode.id.get());
};

const getDbId = (selectedNode) => {
  if (selectedNode && selectedNode.info && selectedNode.info.dbid)
    return selectedNode.info.dbid.get();
  else if (selectedNode && selectedNode.dbid) return selectedNode.dbid.get();
};

const noteButton = new NotesButton();
registerButtonToHook([CIRCULAR_MENU_HOOK, SIDEBAR_HOOK], noteButton);
export default noteButton;
