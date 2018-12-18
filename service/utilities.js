import {
  serviceDocumentation
} from "spinal-env-viewer-plugin-documentation-service";
import bimObjectService from 'spinal-env-viewer-plugin-bimobjectservice';

class DocumentationUtilities {
  constructor() {}

  async addLink(option, BIMObjectName, label = undefined, URL = undefined) {
    // console.log("add LINK")
    // console.log(option, label, URL)
    if (label != undefined && URL != undefined && URL != "" && label != "") {
      if (option.info != undefined) {
        serviceDocumentation.addURL(option.info, label, URL);
        return option
      } else if (option.dbid != undefined) {
        option.info = await bimObjectService.createBIMObject(
          option.dbid,
          BIMObjectName
        );
        // console.log(option.info)
        serviceDocumentation.addURL(
          option.info,
          label,
          URL
        );
        return option;
      }
    } else {
      console.log("wazzaa le bug")
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