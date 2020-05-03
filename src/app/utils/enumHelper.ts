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

  static extractNamesFromEnum(anyEnum: any) {
    return Object.keys(anyEnum).filter((name) => isNaN(Number(name)));
  }

  static getNextInEnum(anyEnum: any, currentValue: any): any {
    const enumNames = EnumHelper.extractNamesFromEnum(anyEnum);
    let currentIndexInEnum = enumNames.findIndex((name) => name == currentValue);

    if (currentIndexInEnum === enumNames.length - 1) {
      return anyEnum[enumNames[0]];
    }

    return anyEnum[enumNames[++currentIndexInEnum]];
  }
}
