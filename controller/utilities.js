import {
  serviceDocumentation
} from "spinal-env-viewer-plugin-documentation-service";
import bimObjectService from 'spinal-env-viewer-plugin-bimobjectservice';

class DocumentationUtilities {
  constructor() {}

  async addLink(option, label = undefined, URL = undefined) {
    if (label != undefined && URL != undefined && URL != "" && label != "") {
      if (option.selectedNode != undefined) {
        serviceDocumentation.addURL(option.selectedNode, label, URL);
      } else if (option.dbid != undefined) {
        option.selectedNode = await bimObjectService.createBIMObject(
          option.dbid,
          'bimObject_' + option.dbid
        );
        console.log("call service add url")
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

  async addAttributes(option, label, value) {
    if (label != undefined && value != undefined && value != "" && label !=
      "") {
      if (option.selectedNode != undefined) {
        serviceDocumentation.addAttribute(option.selectedNode, label, value);
        return option
      } else if (option.dbid != undefined) {
        // console.log(option)
        // console.log("before create node", option.selectedNode)
        option.selectedNode = await bimObjectService.createBIMObject(
          option.dbid,
          'bimObject_' + option.dbid
        );
        option.exist = true;
        // ici le bim object est créer
        // console.log("BIM object created", option.selectedNode)
        // console.log(option)
        serviceDocumentation.addAttribute(
          option.selectedNode,
          label,
          value
        );
        return option;
      } else {
        return option
      }

    } else {
      return option
    }
  }

}
export const utilities = new DocumentationUtilities()