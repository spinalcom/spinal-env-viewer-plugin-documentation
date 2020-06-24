const {
  SpinalContextApp
} = require('spinal-env-viewer-context-menu-service');

import {
  NOTE_TYPE,
  NOTE_RELATION
} from "spinal-env-viewer-plugin-documentation-service/dist/Models/constants";

import {
  GEOGRAPHIC_TYPES_ORDER
} from "spinal-env-viewer-context-geographic-service/build/constants";

import {
  SpinalContextSelectBIMObject
} from 'spinal-env-viewer-plugin-standard_button/js/selectBIMObjectButton';

import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

class FindMessageParent extends SpinalContextApp {

  constructor() {
    super("Find Message Parent", "Find message Parent", {
      icon: "find_in_page",
      icon_type: 'in',
      backgroundColor: '#356BAB',
      fontColor: '#FFFFFF'
    })
  }


  isShown(option) {
    const type = option.selectedNode.type.get();

    return type === NOTE_TYPE ? Promise.resolve(true) : Promise.resolve(-1);
  }

  async action(option) {
    const nodeId = option.selectedNode.id.get();
    const realNode = SpinalGraphService.getRealNode(nodeId);

    const parents = await realNode.getParents(NOTE_RELATION);


    if (!(parents) || (parents && parents.length === 0)) return;

    const parent = parents[0];

    SpinalGraphService._addNode(parent);

    if (GEOGRAPHIC_TYPES_ORDER.indexOf(parent.getType().get() !== -1)) {
      const params = {
        selectedNode: parent.info
      }

      const selectBtn = new SpinalContextSelectBIMObject();
      selectBtn.action(params);

    } else {
      alert("this message is not linked to geographic element");
    }

  }


}

export default FindMessageParent;