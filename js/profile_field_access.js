export function getProfilePermissions(viewer, targetUserId) {
  if (viewer.role_id === "admin") {
    return { view: "all", edit: "all" };
  }

  if (viewer.role_id === "doctor") {
    return { view: "all", edit: [] };
  }

  if (
    viewer.role_id === "clinic_manager" ||
    viewer.role_id === "assistant_manager"
  ) {
    return {
      view: ["name","age","gender","occupation","address"],
      edit: ["name","age","gender","occupation","address"]
    };
  }

  if (viewer.role_id === "patient" && viewer.uid === targetUserId) {
    return { view: "own", edit: ["name","age","gender","occupation","address"] };
  }

  return { view: [], edit: [] };
}
