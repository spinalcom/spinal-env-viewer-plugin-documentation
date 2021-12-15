import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { Utilities } from "../utils/documentationUtils";

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

  async addAttributes(nodeId, label, value, isBimObject, bimInfo) {
    let realNode = await Utilities.getRealNode(nodeId, isBimObject, bimInfo);
    return serviceDocumentation.addAttribute(realNode, label, value);
  }

  async editCategory(
    nodeId,
    categoryId,
    categoryNewName,
    isBimObject,
    bimInfo
  ) {
    let realNode = await Utilities.getRealNode(nodeId, isBimObject, bimInfo);
    let category = SpinalGraphService.getRealNode(categoryId);
    return serviceDocumentation.updateCategoryName(
      realNode,
      category,
      categoryNewName
    );
  }

  async removeCategory(
    nodeId,
    categoryId,
    categoryNewName,
    isBimObject,
    bimInfo
  ) {
    let realNode = await Utilities.getRealNode(nodeId, isBimObject, bimInfo);
    let category = SpinalGraphService.getRealNode(categoryId);
    return serviceDocumentation.deleteAttributeCategory(realNode, category);
  }

  async editAttribute(
    nodeId,
    categoryId,
    label,
    newValue,
    isBimObject,
    bimInfo
  ) {
    let realNode = await Utilities.getRealNode(nodeId, isBimObject, bimInfo);
    let category = SpinalGraphService.getRealNode(categoryId);
    return serviceDocumentation.updateAttribute(realNode, category, label, {
      value: newValue,
    });
  }

  async deleteAttribute(categoryId, label) {
    let categoryNode = SpinalGraphService.getRealNode(categoryId);
    const cat = {
      nameCat: categoryNode.getName().get(),
      node: categoryNode,
      element: await categoryNode.getElement(),
    };
    return serviceDocumentation.removeAttributesByLabel(cat, label);
  }

  // async addAttributes(
  //   option,
  //   BIMObjectName,
  //   label = undefined,
  //   value = undefined
  // ) {
  //   if (
  //     label != undefined &&
  //     value != undefined &&
  //     value != "" &&
  //     label != ""
  //   ) {
  //     if (option.info != undefined) {
  //       serviceDocumentation.addAttribute(option.info, label, value);
  //       return option;
  //     } else if (option.dbid != undefined) {
  //       let boolIsCreated =
  //         await window.spinal.BimObjectService.createBIMObject(
  //           option.dbid,
  //           BIMObjectName,
  //           option.model3d
  //         );
  //       if (boolIsCreated) {
  //         let bimObject = await window.spinal.BimObjectService.getBIMObject(
  //           option.dbid,
  //           option.model3d
  //         );
  //         option.info = SpinalGraphService.getRealNode(bimObject.id);
  //       }

  //       serviceDocumentation.addAttribute(option.info, label, value);
  //       return option;
  //     }
  //   } else {
  //     return option;
  //   }
  // }

  async getAndFormatAttributeCategories(nodeId) {
    const categories = await this.getAttibuteCategories(nodeId);
    return categories.map(({ node, element }) => {
      return this._formatAttributes(node, element);
    });
  }

  async getAttibuteCategories(nodeId) {
    const realNode = SpinalGraphService.getRealNode(nodeId);
    if (!realNode) return [];
    return serviceDocumentation.getCategory(realNode);
  }

  async getNodeParents(nodeId) {
    const realNode = SpinalGraphService.getRealNode(nodeId);
    if (!realNode) return [];

    const parents = await realNode.getParents();
    return parents.map((parent) => {
      SpinalGraphService._addNode(parent);
      return parent.info.get();
    });
  }

  _formatAttributes(categoryNode, attributesModels) {
    const obj = categoryNode.info.get();
    obj.children = [];
    for (let index = 0; index < attributesModels.length; index++) {
      const element = attributesModels[index].get();
      element.id = element.id || index;
      obj.children.push(element);
    }
    return obj;
  }
}

export const attributeController = new AttributeController();
