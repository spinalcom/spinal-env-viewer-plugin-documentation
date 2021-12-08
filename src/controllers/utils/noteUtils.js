import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import geographicService from "spinal-env-viewer-context-geographic-service";
import { BIM_OBJECT_TYPE } from "spinal-env-viewer-plugin-forge/dist/Constants";
import { SELECTrelationList } from "spinal-env-viewer-plugin-standard_button/js/utilities";
import moment from "moment";

export const Utilities = {
  // ,ItemColoredMap = {};
  // ,BimElementsColor = {};

  ItemColoredMap: new Map(),
  BimElementsColor: new Map(),

  getGroups(nodeId, contextId) {
    const nodeRef = SpinalGraphService.getInfo(nodeId);
    const type = nodeRef.type.get();

    if (groupManagerService.isGroup(type)) {
      return Promise.resolve([nodeRef.get()]);
    }

    return SpinalGraphService.findInContext(nodeId, contextId, (node) => {
      let argType = node.getType().get();

      if (groupManagerService.isGroup(argType)) {
        SpinalGraphService._addNode(node);
        return true;
      }
      return false;
    }).then((res) => {
      return res.map((el) => {
        return el.get();
      });
    });
  },

  _isColored(nodeId, contextId) {
    return this.getGroups(nodeId, contextId).then((res) => {
      if (res.length === 0) return false;

      for (const { id } of res) {
        if (typeof this.ItemColoredMap.get(id) === "undefined") {
          return false;
        }
      }

      return true;
    });
  },

  _getItemsBim(nodeId) {
    const nodeRef = SpinalGraphService.getInfo(nodeId);
    const type = nodeRef.type.get();
    // const type = nodeInfo.type;
    // const nodeId = nodeInfo.id;

    if (type === BIM_OBJECT_TYPE) {
      return Promise.resolve([nodeInfo]);
    } else if (type === geographicService.constants.ROOM_TYPE) {
      return SpinalGraphService.getChildren(nodeId, [
        geographicService.constants.REFERENCE_RELATION,
        geographicService.constants.EQUIPMENT_RELATION,
      ]);
    } else {
      // let relations = [
      //   ...geographicService.constants.GEOGRAPHIC_RELATIONS,
      //   geographicService.constants.REFERENCE_RELATION
      // ];

      return SpinalGraphService.findNodes(
        nodeId,
        SELECTrelationList,
        (node) => {
          return node.getType().get() === BIM_OBJECT_TYPE;
        }
      ).then((res) => {
        return res.map((el) => {
          SpinalGraphService._addNode(el);
          return el.info.get();
        });
      });
    }
  },

  _convertHexColorToRGB(hex) {
    if (typeof hex === "undefined") hex = "#000000";
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  _colorItems(groupId, bimNodeRef, color) {
    this.ItemColoredMap.set(groupId, groupId);
    const { dbid, bimFileId } = bimNodeRef;
    let BimColors = this.BimElementsColor.get(dbid) || [];

    BimColors.push({
      id: groupId,
      color,
    });

    this.BimElementsColor.set(dbid, BimColors);
    this.setColor(bimFileId, dbid, color);
  },

  _restoreItemColor(groupId, bimNodeRef) {
    this.ItemColoredMap.delete(groupId);
    const { dbid, bimFileId } = bimNodeRef;
    this.removeColor(bimFileId, dbid);
    let allColors = this.BimElementsColor.get(dbid);
    if (allColors) {
      allColors = allColors.filter((el) => el.id !== groupId);
      if (allColors.length > 0) {
        this.BimElementsColor.set(dbid, allColors);
        let newColor = allColors[0].color;
        this.setColor(bimFileId, dbid, newColor);
      } else this.BimElementsColor.delete(dbid);
    }
  },

  setColor(bimFileId, dbId, color) {
    let model = window.spinal.BimObjectService.getModelByBimfile(bimFileId);

    model.setThemingColor(
      dbId,
      new THREE.Vector4(color.r / 255, color.g / 255, color.b / 255, 0.7, true)
    );
  },

  removeColor(bimFileId, dbId) {
    let model = window.spinal.BimObjectService.getModelByBimfile(bimFileId);

    model.setThemingColor(dbId, new THREE.Vector4(0, 0, 0, 0), true);
  },

  formatToDate(date) {
    return moment(date).format("MMMM Do YYYY, h:mm:ss a");
  },
};
