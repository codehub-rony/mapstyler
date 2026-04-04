// Utilities
import { defineStore } from "pinia";
import _ from "lodash";
import MapService from "@/services/MapService";
import api from "@/services/apiService";

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
    addDataSource(datasource) {
      this.project.addDataSource(datasource);
      MapService.addSource(datasource);
    },
    removeLayer(sourceId, layerId) {
      const datasource = this.project.datasources.find(
        (ds) => ds.source_id === sourceId,
      );

      if (!datasource) {
        console.warn(`Datasource ${sourceId} not found`);
        return;
      }

      datasource.deleteLayer(layerId);
      MapService.removeLayer(layerId);
    },

    setPaintProperties(layerId, properties) {
      MapService.setPaintProperties(layerId, properties);
    },

    setLayoutProperties(layerId, properties) {
      MapService.setLayoutProperties(layerId, properties);
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
      MapService.removeSourceAndLayers(datasource_id_to_delete);
    },

    unloadProject() {
      MapService.destroyMap();
      this.project = null;
      console.log("project closed", this.project);
    },

    async saveProject() {
      let style = MapService.getStyleJSON();
      let stylejson = this.project.cleanStyle(style);

      console.log(this.project, "saving project");

      if (this.project.stylejson_id) {
        console.log("Saving existing stylejosn");
        api.StyleJSON.save(
          this.project.id,
          this.project.stylejson_id,
          this.project.name,
          this.project.description,
          stylejson,
        );
      } else {
        console.log("stylejson deos not exist, creating new");
        let res = await api.StyleJSON.create(
          this.project.id,
          this.project.name,
          this.project.description,
          stylejson,
        );

        this.project.stylejson_id = res.id;
      }
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
