import {
  serviceDocumentation
} from "spinal-env-viewer-plugin-documentation-service";
import {
  SpinalGraphService
} from 'spinal-env-viewer-graph-service';
class DocumentationUtilities {
  constructor() {}

  async addLink(option, BIMObjectName, label = undefined, URL = undefined) {
    if (label != undefined && URL != undefined && URL != "" && label != "") {
      if (option.info != undefined) {
        serviceDocumentation.addURL(option.info, label, URL);
        return option
      } else if (option.dbid != undefined) {
        let boolIsCreated = await window.spinal.BimObjectService
          .createBIMObject(
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

        serviceDocumentation.addURL(
          option.info,
          label,
          URL
        );
        return option;
      }
    } else {
      return option
    }
  }

  async addAttributes(option, BIMObjectName, label = undefined, value =
    undefined) {
    if (label != undefined && value != undefined && value != "" && label !=
      "") {
      if (option.info != undefined) {
        serviceDocumentation.addAttribute(option.info, label, value);
        return option
      } else if (option.dbid != undefined) {
        let boolIsCreated = await window.spinal.BimObjectService
          .createBIMObject(
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

        serviceDocumentation.addAttribute(
          option.info,
          label,
          value
        );
        return option;
      }
    } else {
      return option
    }
  }

}
export const utilities = new DocumentationUtilities()