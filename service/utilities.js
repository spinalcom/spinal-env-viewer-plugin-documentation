import {
  serviceDocumentation
} from "spinal-env-viewer-plugin-documentation-service";
import bimObjectService from 'spinal-env-viewer-plugin-bimobjectservice';

class DocumentationUtilities {
  constructor() {

  }

  async addLink(option, label = undefined, URL = undefined) {
    if (label != undefined && URL != undefined && URL != "" && label != "") {
      if (option.info != undefined) {
        serviceDocumentation.addURL(option.info, label, URL);
        return option
      } else if (option.dbid != undefined) {
        option.info = await bimObjectService.createBIMObject(
          option.dbid,
          'bimObject_' + option.dbid
        );
        serviceDocumentation.addURL(
          option.info,
          label,
          URL
        );
        return option;
      }
    } else {
      return undefined
    }
  }

  async addAttributes(option, label = undefined, value = undefined) {
    if (label != undefined && value != undefined && value != "" && label !=
      "") {
      if (option.info != undefined) {
        serviceDocumentation.addAttribute(option.info, label, value);
        return option
      } else if (option.dbid != undefined) {
        option.info = await bimObjectService.createBIMObject(
          option.dbid,
          'bimObject_' + option.dbid
        );
        serviceDocumentation.addAttribute(
          option.info,
          label,
          value
        );
        return option;
      }
    } else {
      return undefined
    }
  }

}
export const utilities = new DocumentationUtilities()