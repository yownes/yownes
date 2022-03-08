import { App_app } from "../api/types/App";
import { Apps_apps_edges_node } from "../api/types/Apps";
import { BuildBuildStatus } from "../api/types/globalTypes";
import connectionToNodes from "./connectionToNodes";

export function getAppBuildState(
  app?: Apps_apps_edges_node | App_app
): BuildBuildStatus {
  if (!app) {
    return BuildBuildStatus.STALLED;
  }
  const nodes = connectionToNodes(app.builds);
  return nodes[nodes.length - 1]?.buildStatus ?? BuildBuildStatus.STALLED;
}
