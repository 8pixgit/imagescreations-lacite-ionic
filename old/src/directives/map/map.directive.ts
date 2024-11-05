import * as _ from 'lodash';
import { AfsService, UserService } from '../../providers';
import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';
import { Layer, LngLat, LngLatBounds, Map } from 'mapbox-gl';
import { Network } from '@ionic-native/network';
import { POINTS_TYPES } from '../../app/constants';
import { Point } from '../../interfaces';

@Component({
  selector: 'map',
  templateUrl: './map.directive.html',
})

export class MapDirective {

  @Input('option') private option: string;
  public categories: any;
  public center: number[];
  public filterOpen: string;
  public hotelsStars: any;
  public map: Map;
  public points: any[];
  public pointsTypes: any;
  public starsFilter: number;
  public zoom: number;

  constructor(
    private afsService: AfsService,
    private event: Events,
    public network: Network,
    public user: UserService,
  ) {

    this.categories = {
      'must-see': false,
      'pre-post-tour': false,
      gala: false,
      hotel: false,
      other: false,
    };
    this.center = [-1.5425, 47.2129];
    this.filterOpen = 'open';
    this.hotelsStars = {};
    this.points = [];
    this.pointsTypes = {};
    this.starsFilter = null;
    this.zoom = 13;

    POINTS_TYPES.forEach((a) => {
      this.pointsTypes[a.id] = {
        englishLabel: a.englishLabel,
        icon: a.icon,
        label: a.label,
      };
    });

    this.event.subscribe('gesture:dblclick', () => setTimeout(() => this.map.resize()));

    this.event.subscribe('lang:changed', () => setTimeout(() => this.loadPoints()));

  }

  private loadPoints(): void {

    const layers = this.map.getStyle().layers;
    layers.forEach((layer: Layer) => {
      if (layer.type === 'symbol') this.map.setLayoutProperty(layer.id, 'text-field', ['get', `name_${this.user.lang}`]);
    });

    if (!this.starsFilter) {
      this.hotelsStars = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };
      this.afsService.points.forEach((point: Point) => {
        if (point.category === 'hotel') this.hotelsStars[point.stars]++;
      });
      this.points = _.filter(this.afsService.points, (point: Point) => {
        return this.categories[point.category] || this.categories[point.otherCategory];
      });
    } else {
      this.points = _.filter(this.afsService.points, (point: Point) => {
        return point.category === 'hotel' && point.stars === this.starsFilter;
      });
    }

    let isOnActive = false;
    Object.keys(this.categories).forEach((element: string) => {
      if (this.categories[element] === true) isOnActive = true;
    });
    if (isOnActive) {
      const bounds = new LngLatBounds;
      this.points.forEach((point: Point) => {
        bounds.extend(new LngLat(point.coord.lng, point.coord.lat));
      });
      this.map.fitBounds(bounds, {
        padding: 30,
      });
    }

  }

  private activeCat(category: string): void {

    if (category === 'hebergements') category = 'hotel';
    else if (category === 'accessibility') category = '';

    this.categories['must-see'] = this.categories['pre-post-tour'] = this.categories['gala'] = this.categories['hotel'] = this.categories['other'] = category.length > 0 ? false : true;
    if (category !== 'pre-post-tour') this.categories['pre-post-tour'] = false;
    this.categories[category] = true;

  }

  private loadSources(): void {
    const metersToPixelsAtMaxZoom = (meters, latitude) => meters / 0.5 / Math.cos(latitude * Math.PI / 180);

    this.map.addSource('source_circle', {
      data: {
        type: 'FeatureCollection',
        features: [{
          geometry: {
            type: 'Point',
            coordinates: [-1.5425, 47.2129],
          },
          properties: {},
          type: 'Feature',
        }],
      },
      type: 'geojson',
    });
    this.map.addSource('source_circle2', {
      data: {
        type: 'FeatureCollection',
        features: [{
          geometry: {
            type: 'Point',
            coordinates: [-1.5422, 47.2100],
          },
          properties: {},
          type: 'Feature',
        }],
      },
      type: 'geojson',
    });
    this.map.addSource('source_circle3', {
      data: {
        type: 'FeatureCollection',
        features: [{
          geometry: {
            type: 'Point',
            coordinates: [-1.5423, 47.2035],
          },
          properties: {},
          type: 'Feature',
        }],
      },
      type: 'geojson',
    });

    this.map.addLayer({
      id: 'circle1',
      paint: {
        'circle-color': 'grey',
        'circle-opacity': 0.2,
        'circle-radius': {
          stops: [
            [0, 0],
            [20, metersToPixelsAtMaxZoom(14000, 0)],
          ],
          base: 2,
        },
      },
      source: 'source_circle',
      type: 'circle',
    });
    this.map.addLayer({
      id: 'text1',
      layout: {
        'text-font': [
          'DIN Offc Pro Medium',
          'Arial Unicode MS Bold',
        ],
        'text-field': this.user.lang === 'fr' ? '5 minutes à pied' : '5 minutes by foot',
        'text-size': {
          stops: [
            [11.8, 0],
            [11.9, 12],
            [15, 20],
            [15.01, 0],
          ],
        },
      },
      source: 'source_circle2',
      type: 'symbol',
    });
    this.map.addLayer({
      id: 'circle2',
      paint: {
        'circle-color': 'grey',
        'circle-opacity': 0.2,
        'circle-radius': {
          stops: [
            [0, 0],
            [20, metersToPixelsAtMaxZoom(7000, 0)],
          ],
          base: 2,
        },
      },
      source: 'source_circle',
      type: 'circle',
    });
    this.map.addLayer({
      id: 'text2',
      layout: {
        'text-font': [
          'DIN Offc Pro Medium',
          'Arial Unicode MS Bold',
        ],
        'text-field': this.user.lang === 'fr' ? '15 minutes à pied' : '15 minutes by foot',
        'text-size': {
          stops: [
            [11.8, 0],
            [11.9, 12],
            [15, 20],
            [15.01, 0],
          ],
        },
      },
      source: 'source_circle3',
      type: 'symbol',
    });
  }

  public activeCategory(categoryID: string): void {
    this.option = categoryID;
    this.starsFilter = null;
    this.activeCat(this.option);
    const points = _.filter(this.afsService.points, (point: Point) => {
      return point.category === categoryID || point.otherCategory === categoryID;
    });
    if (points.length > 0) this.loadPoints();
    else this.points = [];
  }

  public activeHotels(nbStars: number): void {
    this.option = 'hotel';
    this.starsFilter = nbStars;
    this.activeCat(this.option);
    this.loadPoints();
  }

  public onMapReady(map: Map): void {
    if (this.option.length > 0) this.activeCat(this.option);
    this.map = map;
    this.loadPoints();
    this.loadSources();
  }

  public toggleFilters(): void {
    this.filterOpen = this.filterOpen === 'close' ? 'open' : 'close';
  }

  public noTransformRequest(url: string): { url: string; } {
    return { url };
  }

  public transformRequest(url: string, resourceType: string): { url: string; } {
    if (resourceType === 'Style') url = url.replace('v10', 'v11');
    return { url: url.replace('https://api.mapbox.com', 'http://localhost:8100/assets/map') };
  }

  public zoomChange(): void {
    this.zoom = this.map.getZoom();
  }

  ngOnDestroy() {
    this.event.unsubscribe('gesture:dblclick');
  }

}
