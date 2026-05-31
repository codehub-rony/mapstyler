// Utilities
import { defineStore } from "pinia";
import _ from "lodash";
import MapService from "@/services/MapService";
import api from "@/services/apiService";
import { StyleJSON } from "@/utils/datasources/maplibre_style_approach/StyleJSON";

export const useAppStore = defineStore("app", {
  state: () => ({
    project: null,
    styleJSON: null,
    originalState: [],
  }),

  actions: {
    loadStylejson(stylejson) {
      this.styleJSON = stylejson;
    },
    loadProject(project) {
      this.project = project;
    },

    setStyleJSON(stylejson) {
      this.styleJSON = stylejson;
    },

    // setOriginalState() {
    //   this.originalState = [];
    //   if (this.styleObjects) {
    //     this.styleObjects.forEach((styleobject) => {
    //       this.originalState.push(_.cloneDeep(styleobject));
    //     });
    //   }
    // },
    // hasUnsavedChanges() {
    //   let unsaved_edits = this.originalState.some((original_styleObject) => {
    //     let styleObject = this.styleObjects.find(
    //       (x) => x.id === original_styleObject.id,
    //     );

    //     return !_.isEqual(original_styleObject, styleObject);
    //   });

    //   let new_datasources =
    //     this.styleObjects.length - this.originalState.length > 0;

    //   return unsaved_edits || new_datasources;
    // },
    createProject(project) {
      this.project = project;

      let stylejson = new StyleJSON();
      this.setStyleJSON(stylejson);
    },

    addDataSource(datasource) {
      if (!this.styleJSON) {
        console.error("styleJSON is not initialized");
        return;
      }

      this.styleJSON.addSource(datasource.getSourceAsObject());
      this.styleJSON.addLayers(datasource.layers);
      MapService.addSource(datasource.getSourceAsObject());

      datasource.layers.forEach((layer) => {
        MapService.addLayer(layer);
      });
    },
    removeLayer(layerId) {
      this.styleJSON.removeLayer(layerId);
      MapService.removeLayer(layerId);
    },

    setPaintProperties(layerId, properties) {
      this.styleJSON.updateLayerProperties(layerId, properties, "paint");
      MapService.setPaintProperties(layerId, properties);
    },

    setLayoutProperties(layerId, properties) {
      this.styleJSON.updateLayerProperties(layerId, properties, "layout");
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
      this.styleJSON = null;
    },

    async saveProject() {
      try {
        const stylejson = this.styleJSON.export();

        if (this.styleJSON.id) {
          const res = await api.StyleJSON.save(
            this.project.id,
            this.styleJSON.id,
            this.project.name,
            this.project.description,
            stylejson,
          );

          return { success: true, msg: "Project saved" };
        } else {
          const res = await api.StyleJSON.create(
            this.project.id,
            this.project.name,
            this.project.description,
            stylejson,
          );

          this.styleJSON.id = res.id;

          return { success: true, msg: "Project saved" };
        }
      } catch (error) {
        console.error("Failed to save project", error);

        return {
          success: false,
          msg: "failed to save project",
        };
      }

      // if (this.styleJSON.id) {
      //   console.log("Saving existing stylejosn");
      //   return api.StyleJSON.save(
      //     this.project.id,
      //     this.styleJSON.id,
      //     this.project.name,
      //     this.project.description,
      //     stylejson,
      //   );
      // } else {
      //   console.log("stylejson deos not exist, creating new");
      //   let res = await api.StyleJSON.create(
      //     this.project.id,
      //     this.project.name,
      //     this.project.description,
      //     stylejson,
      //   );

      //   this.styleJSON.id = res.id;

      //   return { succes: true}
      // }
    },
  },
});
