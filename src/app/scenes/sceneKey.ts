enum SceneKey {
  FarmExteriorScene = 'FARM_EXTERIOR',
  FarmHouseFloorScene = 'FARM_HOUSE_FLOOR'
}

export function parseSceneKey(key: string) {
  key = key.trim().toUpperCase();

  switch (key) {
    case 'FARM_EXTERIOR':
      return SceneKey.FarmExteriorScene;
    case 'FARM_HOUSE_FLOOR':
      return SceneKey.FarmHouseFloorScene;
    default:
      throw new Error(`Unknown scene key ${key}`);
  }
}

export default SceneKey;
