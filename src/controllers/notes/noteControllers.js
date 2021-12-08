import {
  SpinalGraphService,
  SpinalNode,
} from "spinal-env-viewer-graph-service";
import geographicService from "spinal-env-viewer-context-geographic-service";
import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";
import { BIM_OBJECT_TYPE } from "spinal-env-viewer-plugin-forge/dist/Constants";
import { SELECTrelationList } from "spinal-env-viewer-plugin-standard_button/js/utilities";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import { Utilities } from "../utils/noteUtils";
import * as lodash from "lodash";

class NoteController {
  constructor() {}

  async getAndFormatNotes(node) {
    const notes = await this.getNotes(node);
    return notes.map(({ element, selectedNode }, index) => {
      return this._formatNote(element, selectedNode, index);
    });
  }

  getNotes(node) {
    const realNode = this.getNoteRealNode(node);

    return serviceDocumentation.getNotes(realNode);
  }

  getIcon(nodeId, contextId) {
    return Utilities._isColored(nodeId, contextId).then((isColored) => {
      return isColored;
    });
  }

  restoreItem(nodeId, contextId) {
    Utilities.getGroups(nodeId, contextId).then((res) => {
      res.forEach(({ id }) => {
        // let id = el.id;
        this._restoreGroupColor(contextId, id);
      });
    });
  }

  colorItem(nodeId, contextId) {
    Utilities.getGroups(nodeId, contextId).then((res) => {
      res.forEach(({ id, color }) => {
        // let id = el.id;
        // let color = el.color ? el.color : undefined;
        let _color = color ? color : undefined;
        this._colorGroup(contextId, id, _color);
      });
    });
  }

  async getBimObjects(contextId, groupId) {
    const notes = await this._getNotesInContext(groupId, contextId);
    const parents = await this._getParents(notes);

    const promises = parents.map((el) => Utilities._getItemsBim(el.id));

    return Promise.all(promises).then((result) => {
      return lodash.flattenDeep(result);
      // const res = [];
      // result.forEach((el) => res.push(...el));
      // return res;
    });
  }

  getNoteRealNode(nodeOrNodeId) {
    return nodeOrNodeId instanceof SpinalNode
      ? nodeOrNodeId
      : SpinalGraphService.getRealNode(nodeOrNodeId);
  }

  ////////////////////////////////////////////////////////////
  //                    PRIVATE                             //
  ////////////////////////////////////////////////////////////

  _colorGroup(contextId, groupId, argColor) {
    return this.getBimObjects(contextId, groupId).then((res) => {
      let color = Utilities._convertHexColorToRGB(argColor);

      res.forEach((child) => {
        Utilities._colorItems(groupId, child, color);
      });
    });
  }

  _restoreGroupColor(contextId, groupId) {
    return this.getBimObjects(contextId, groupId).then((res) => {
      res.forEach((child) => {
        Utilities._restoreItemColor(groupId, child);
      });
    });
  }

  _getNotesInContext(nodeId, contextId) {
    const noteRealNode = SpinalGraphService.getRealNode(nodeId);
    const contextNode = SpinalGraphService.getRealNode(contextId);
    serviceDocumentation
      .getNotesInNoteContext(contextNode, noteRealNode)
      .then((res) => {
        return res.map((el) => {
          return el.info.get();
        });
      });

    // return SpinalGraphService.findInContext(nodeId, contextId, (node) => {
    //   SpinalGraphService._addNode(node);
    //   let argType = node.getType().get();
    //   return argType === NOTE_TYPE;
    // }).then((res) => {
    //   return res.map((el) => {
    //     return el.get();
    //   });
    // });
  }

  _getParents(notes) {
    const realNodes = notes.map((el) => {
      return SpinalGraphService.getRealNode(el.id);
    });

    return serviceDocumentation
      .getNotesReferencesNodes(realNodes)
      .then((result) => {
        const res = [];
        for (const key in result) {
          if (Object.hasOwnProperty.call(result, key)) {
            const parents = result[key];
            const infos = parents.map((el) => {
              SpinalGraphService._addNode(el);
              return el.info.get();
            });
            res.push(...infos);
          }
        }
        // result.forEach((element) => {
        //   const infos = element.map((el) => {
        //     SpinalGraphService._addNode(el);
        //     return el.info.get();
        //   });

        //   res.push(...infos);
        // });

        return res;
      });
  }

  async getGeographicElement(noteId) {
    const realNode = SpinalGraphService.getRealNode(noteId);
    const parents = await realNode.getParents(NOTE_RELATION);

    return parents
      .filter((el) => {
        SpinalGraphService._addNode(el);
        return isShownParam.indexOf(el.getType().get()) !== -1;
      })
      .map((el) => el.info);
  }

  async getNoteParentsBim(nodeId, contextId) {
    const notes = await this._getNotesInContext(nodeId, contextId);

    const promises = notes.map((el) => this.getGeographicElement(el.id));

    return Promise.all(promises).then(async (noteParents) => {
      const el = lodash.flattenDeep(noteParents);
      const promises = el.map(({ id }) => Utilities._getItemsBim(id));
      let bims = await Promise.all(promises);
      bims = lodash.flattenDeep(bims);

      const bimMap = new Map();

      for (const bimObject of bims) {
        const bimFileId = bimObject.bimFileId;
        const dbid = bimObject.dbid;

        if (typeof bimMap.get(bimFileId) === "undefined") {
          bimMap.set(bimFileId, new Set());
        }

        bimMap.get(bimFileId).add(dbid);
      }
      const res = [];

      for (const [key, value] of bimMap.entries()) {
        res.push({
          model: window.spinal.BimObjectService.getModelByBimfile(key),
          ids: Array.from(value),
        });
      }

      return res;
    });
  }

  _formatNote(noteElement, noteSpinalNode, index) {
    return {
      id: index,
      username: noteElement.username ? noteElement.username.get() : "unknow",
      message: noteElement.message.get(),
      date: Utilities.formatToDate(noteElement.date.get()),
      type: noteElement.type ? noteElement.type.get() : undefined,
      file: noteElement.file,
      selectedNode: noteSpinalNode,
      element: noteElement,
      viewPoint: noteElement.viewPoint,
    };
  }
}

export const noteController = new NoteController();
