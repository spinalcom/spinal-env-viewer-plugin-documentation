import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";

import { SpinalGraphService } from "spinal-env-viewer-graph-service";

import geographicService from "spinal-env-viewer-context-geographic-service";

import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";

import { BIM_OBJECT_TYPE } from "spinal-env-viewer-plugin-forge/dist/Constants";

import { isShownParam } from "spinal-env-viewer-plugin-standard_button/js/utilities";

import {
  NOTE_TYPE,
  NOTE_RELATION,
} from "spinal-env-viewer-plugin-documentation-service/dist/Models/constants";

import { SELECTrelationList } from "spinal-env-viewer-plugin-standard_button/js/utilities";

class AttributeController {
  constructor() {}

  async addAttributes(
    option,
    BIMObjectName,
    label = undefined,
    value = undefined
  ) {
    if (
      label != undefined &&
      value != undefined &&
      value != "" &&
      label != ""
    ) {
      if (option.info != undefined) {
        serviceDocumentation.addAttribute(option.info, label, value);
        return option;
      } else if (option.dbid != undefined) {
        let boolIsCreated =
          await window.spinal.BimObjectService.createBIMObject(
            option.dbid,
            BIMObjectName,
            option.model3d
          );
        if (boolIsCreated) {
          let bimObject = await window.spinal.BimObjectService.getBIMObject(
            option.dbid,
            option.model3d
          );
          option.info = SpinalGraphService.getRealNode(bimObject.id);
        }

        serviceDocumentation.addAttribute(option.info, label, value);
        return option;
      }
    } else {
      return option;
    }
  }
}

export const attributeController = new AttributeController();
