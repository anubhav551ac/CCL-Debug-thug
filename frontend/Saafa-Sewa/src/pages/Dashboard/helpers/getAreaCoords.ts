import * as turf from '@turf/turf';
import kathmanduPalikas from './data/kathmandu-palikas.json';

export const getAreaFromCoords = (lat: number, lng: number) => {
  const pt = turf.point([lng, lat]);

  for (const feature of kathmanduPalikas.features) {
    if (turf.booleanPointInPolygon(pt, feature)) {
      return {
        areaName: feature.properties.name,
        district: feature.properties.district,
        isMajorMetro: feature.properties.isMetropolitan
      };
    }
  }
  return null;
};