enum SceneKey {
  FarmExteriorScene = 'FARM_EXTERIOR',
  FarmHouseFloorScene = 'FARM_HOUSE_FLOOR',
  FarmHouseBedroom = 'FARM_HOUSE_BEDROOM'
}

export function parseSceneKey(key: string) {
  if (!key) {
    throw new Error('Scene key cannot be undefined');
  }

  key = key.trim().toUpperCase();

  switch (key) {
    case 'FARM_EXTERIOR':
      return SceneKey.FarmExteriorScene;
    case 'FARM_HOUSE_FLOOR':
      return SceneKey.FarmHouseFloorScene;
    case 'FARM_HOUSE_BEDROOM':
      return SceneKey.FarmHouseBedroom;
    default:
      throw new Error(`Unknown scene key ${key}`);
  }
}

export default SceneKey;
