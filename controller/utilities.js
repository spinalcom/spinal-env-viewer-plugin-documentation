import {
  serviceDocumentation
} from "spinal-env-viewer-plugin-documentation-service";
import bimObjectService from 'spinal-env-viewer-plugin-bimobjectservice';

class DocumentationUtilities {
  constructor() {

  }

  async addLink(option, label = undefined, URL = undefined) {
    if (label != undefined && URL != undefined && URL != "" && label != "") {
      if (option.selectedNode != undefined) {
        serviceDocumentation.addURL(option.selectedNode, label, URL);
      } else if (option.dbid != undefined) {
        option.selectedNode = await bimObjectService.createBIMObject(
          option.dbid,
          'bimObject_' + option.dbid
        );
        serviceDocumentation.addURL(
          option.selectedNode,
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
      if (option.selectedNode != undefined) {
        serviceDocumentation.addAttribute(option.selectedNode, label, value);
      } else if (option.dbid != undefined) {
        option.selectedNode = await bimObjectService.createBIMObject(
          option.dbid,
          'bimObject_' + option.dbid
        );
        serviceDocumentation.addAttribute(
          option.selectedNode,
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