import {
  serviceDocumentation
} from "spinal-env-viewer-plugin-documentation-service";
import bimObjectService from 'spinal-env-viewer-plugin-bimobjectservice';

class DocumentationUtilities {
  constructor() {}

  async addLink(option, BIMObjectName, label = undefined, URL = undefined) {
    // console.log("add LINK")
    if (label != undefined && URL != undefined && URL != "" && label != "") {
      if (option.info != undefined) {
        serviceDocumentation.addURL(option.info, label, URL);
        return option
      } else if (option.dbid != undefined) {
        option.info = await bimObjectService.createBIMObject(
          option.dbid,
          BIMObjectName
        );
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
        option.info = await bimObjectService.createBIMObject(
          option.dbid,
          BIMObjectName
        );
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