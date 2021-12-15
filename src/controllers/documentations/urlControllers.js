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

class UrlController {
  constructor() {}

  async addURL(nodeId, label, url, isBimObject = false, bimInfo = {}) {
    let realNode = await Utilities.getRealNode(nodeId, isBimObject, bimInfo);
    return serviceDocumentation.addURL(realNode, label, url);
  }

  async editUrl(nodeId, label, newValue, isBimObject = false, bimInfo = {}) {
    let realNode = await Utilities.getRealNode(nodeId, isBimObject, bimInfo);
    return serviceDocumentation.updateUrl(realNode, label, newValue);
  }

  async deletetUrl(nodeId, label, isBimObject = false, bimInfo = {}) {
    let realNode = await Utilities.getRealNode(nodeId, isBimObject, bimInfo);
    return serviceDocumentation.deleteURL(realNode, label);
  }

  async getSharedUrls(nodeId, isBimObject = false, bimInfo = {}) {
    const realNode = await Utilities.getRealNode(nodeId, isBimObject, bimInfo);
    const shared = await serviceDocumentation.getSharedUrls(realNode);

    return shared.map(({ node, urls }) => {
      SpinalGraphService._addNode(node);
      const info = node.info.get();
      info.children = urls.map((url, index) => this._formatUrl(url, index));
      return info;
    });
  }

  /*
  async addUrl(option, BIMObjectName, label = undefined, URL = undefined) {
    if (label != undefined && URL != undefined && URL != "" && label != "") {
      if (option.info != undefined) {
        serviceDocumentation.addURL(option.info, label, URL);
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

        serviceDocumentation.addURL(option.info, label, URL);
        return option;
      }
    } else {
      return option;
    }
  }*/

  async getAndFormatUrls(nodeId, isBimObject = false, bimInfo = {}) {
    return this.getUrls(nodeId, isBimObject, bimInfo);
  }

  async getUrls(nodeId, isBimObject = false, bimInfo = {}) {
    let realNode = await Utilities.getRealNode(nodeId, isBimObject, bimInfo);
    if (!realNode) return { name: "", children: [] };
    const urls = await serviceDocumentation.getURL(realNode);
    const info = realNode.info.get();
    info.children = urls.map(({ element }, index) => {
      return this._formatUrl(element, index);
    });

    return info;
  }

  _formatUrl(urlElement, index) {
    return {
      id: urlElement.id ? urlElement.id.get() : index,
      label: urlElement.name.get(),
      value: urlElement.URL.get(),
    };
  }
}

export const urlController = new UrlController();
