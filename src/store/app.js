// Utilities
import { defineStore } from "pinia";
import _ from "lodash";
import MapService from "@/services/MapService";

export const useAppStore = defineStore("app", {
  state: () => ({
    project: null,
    styleObjects: [],
    currentProject: null,
    originalState: [],
  }),

  actions: {
    setCurrentProject(project) {
      this.currentProject = project;
    },
    setProject(project) {
      this.project = project;
    },
    setOriginalState() {
      this.originalState = [];
      if (this.styleObjects) {
        this.styleObjects.forEach((styleobject) => {
          this.originalState.push(_.cloneDeep(styleobject));
        });
      }
    },
    hasUnsavedChanges() {
      let unsaved_edits = this.originalState.some((original_styleObject) => {
        let styleObject = this.styleObjects.find(
          (x) => x.id === original_styleObject.id,
        );

        return !_.isEqual(original_styleObject, styleObject);
      });

      let new_datasources =
        this.styleObjects.length - this.originalState.length > 0;

      return unsaved_edits || new_datasources;
    },
    async clearProject() {
      this.currentProject = null;
      this.styleObjects = [];
    },
    addStyleObject(styleObject) {
      this.styleObjects.push(styleObject);
    },
    deleteDatasource(datasource_id_to_delete) {
      if (!datasource_id_to_delete) return;

      const index = this.project.datasources.findIndex(
        (ds) => ds.source_id === datasource_id_to_delete,
      );

      if (index === -1) {
        console.warn("Datasource not found:", datasource_id_to_delete);
        return;
      }

      this.project.datasources.splice(index, 1);
    },

    saveProject() {
      const map_service = new MapService();
      let style = map_service.getStyle();
      console.log("NEED TO IMPLEMENT: POST REQUESTS TO SAVE STYLE");
      // this.deleteStyleJSONS();

      // this.styleObjects.forEach((styleObject) => {
      //   let payload = {
      //     name: styleObject.name,
      //     description: styleObject.description,
      //     geometry_type: styleObject.geometry_type,
      //     source_id: styleObject.source_id,
      //     tilejson_url: styleObject.tilejson_url,
      //     tilematrixset_url: styleObject.tilematrixset_url,
      //     stylejson: JSON.parse(styleObject.getStyleJSON()),
      //   };

      //   if (styleObject.id) {
      //     api.Project.saveStyleJSON(
      //       this.currentProject.id,
      //       styleObject.id,
      //       payload
      //     ).then((res) => {
      //       this.setOriginalState();
      //     });
      //   } else {
      //     let res = api.Project.createStyleJSON(
      //       this.currentProject.id,
      //       payload
      //     ).then((res) => {
      //       styleObject.id = res.id;
      //       this.setOriginalState();
      //     });
      //   }
      // });
    },
  },
});
