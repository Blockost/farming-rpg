/**
 * Possible directions a character is facing.
 */
enum FacingDirection {
  LEFT,
  RIGHT,
  UP,
  DOWN
}

export function parseFacingDirection(direction: string): FacingDirection {
  if (!direction) {
    throw new Error('Facing direction cannot be undefined');
  }

  direction = direction.trim().toUpperCase();
  switch (direction) {
    case 'LEFT':
      return FacingDirection.LEFT;
    case 'RIGHT':
      return FacingDirection.RIGHT;
    case 'UP':
      return FacingDirection.UP;
    case 'DOWN':
      return FacingDirection.DOWN;

    default:
      throw new Error(`Unspported value ${direction} for FacingDirection enum `);
  }
}

export default FacingDirection;
