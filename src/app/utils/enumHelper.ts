/**
 * Helper class for enum.
 */
export default class EnumHelper {
  /**
   * Retrieves a random value from an enum.
   */
  static getRandomFromEnum(anyEnum: any): number {
    const enumKeys = Object.keys(anyEnum)
      .map((key) => parseInt(key))
      .filter((key) => !isNaN(key));

    return enumKeys[Math.floor(Math.random() * enumKeys.length)];
  }
}
