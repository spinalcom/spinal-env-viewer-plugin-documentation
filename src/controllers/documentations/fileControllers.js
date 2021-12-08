import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";

import { SpinalGraphService } from "spinal-env-viewer-graph-service";

import geographicService from "spinal-env-viewer-context-geographic-service";

import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";

import { BIM_OBJECT_TYPE } from "spinal-env-viewer-plugin-forge/dist/Constants";

import { isShownParam } from "spinal-env-viewer-plugin-standard_button/js/utilities";

import {
  NOTE_TYPE,
  NOTE_RELATION,
} from "spinal-env-viewer-plugin-documentation-service/dist/Models/constants";

import { SELECTrelationList } from "spinal-env-viewer-plugin-standard_button/js/utilities";

class FileController {
  constructor() {}
}

export const fileController = new FileController();
