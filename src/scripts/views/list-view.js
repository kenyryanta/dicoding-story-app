import { createStoriesTemplate } from "../../templates/list-template.js";
import appView from "./app-view.js";

class ListView {
  constructor() {
    this.stories = [];
    this.map = null;
    this.markers = [];
  }

  render(stories, isOfflinePage = false) {
    this.stories = stories;

    const html = createStoriesTemplate(stories, isOfflinePage);
    appView.renderHTML(html);

    if (!isOfflinePage) {
      this.initMap();
    }
  }

  initMap() {
    const mapContainer = document.getElementById("storiesMap");

    if (!mapContainer) {
      return;
    }

    this.map = L.map(mapContainer).setView([-2.548926, 118.0148634], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    const baseMaps = {
      OpenStreetMap: L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ),
      Satellite: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri",
          maxZoom: 19,
        }
      ),
      Topography: L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
          attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 17,
        }
      ),
    };

    L.control.layers(baseMaps).addTo(this.map);
    this.addMarkers();
  }

  addMarkers() {
    if (!this.map) {
      return;
    }

    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.markers = [];

    this.stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map)
          .bindPopup(`
            <div class="map-popup">
              <strong>${story.name}</strong>
              <p>${story.description.substring(0, 100)}${
          story.description.length > 100 ? "..." : ""
        }</p>
              <img src="${story.photoUrl}" alt="Thumbnail cerita ${
          story.name
        }" style="width: 100%; max-height: 100px; object-fit: cover; border-radius: 4px; margin-top: 5px;">
            </div>
          `);

        this.markers.push(marker);
      }
    });

    if (this.markers.length > 0) {
      const group = new L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.2));
    }
  }
}

export default new ListView();
