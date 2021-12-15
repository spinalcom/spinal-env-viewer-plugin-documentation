import { SpinalGraphService } from "spinal-env-viewer-graph-service";

export const Utilities = {
  async getRealNode(nodeId, isBimObject = false, bimInfo = {}) {
    let realNode = SpinalGraphService.getRealNode(nodeId);
    if (!realNode && !isBimObject) return;
    if (!realNode && isBimObject) {
      realNode = await this.createBIMObject(bimInfo.dbId, bimInfo.model);
    }

    return realNode;
  },

  async createBIMObject(dbId, model) {
    let bimObject = await window.spinal.BimObjectService.getBIMObject(
      dbId,
      model
    );

    return SpinalGraphService.getRealNode(bimObject.id.get());
  },
};
