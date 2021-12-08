const {
  SpinalContextApp
} = require("spinal-env-viewer-context-menu-service");

import {
  NOTE_TYPE,
  NOTE_RELATION,
} from "spinal-env-viewer-plugin-documentation-service/dist/Models/constants";

import {
  GEOGRAPHIC_TYPES_ORDER
} from "spinal-env-viewer-context-geographic-service/build/constants";

import {
  SpinalContextSelectBIMObject
} from "spinal-env-viewer-plugin-standard_button/js/selectBIMObjectButton";

import {
  SpinalContextFitToViewer
} from "spinal-env-viewer-plugin-standard_button/js/fitToViewerButton";

import {
  isShownParam
} from "spinal-env-viewer-plugin-standard_button/js/utilities";

import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";
import {
  utilities
} from "../../service/utilities";

class FindMessageParent extends SpinalContextApp {
  constructor() {
    super("Find Message Parent", "Find message Parent", {
      icon: "find_in_page",
      icon_type: "in",
      backgroundColor: "#356BAB",
      fontColor: "#FFFFFF",
    });
  }

  isShown(option) {
    const contextType = option.context.type.get();
    const type = option.selectedNode.type.get();

    return contextType === `${NOTE_TYPE}GroupContext` ? Promise.resolve(
        true) :
      Promise.resolve(-1);
  }

  async action(option) {
    const nodeId = option.selectedNode.id.get();
    const contextId = option.context.id.get();

    const parents = await utilities.getNoteParentsBim(nodeId, contextId);


    if (!parents || (parents && parents.length === 0)) {
      window.alert("No parent on bimMaquette");
      return;
    }

    parents.forEach((el) => {
      el.model.selector.setSelection(el.ids, el.model, "selectOnly");
    })

  }
}

export default FindMessageParent;