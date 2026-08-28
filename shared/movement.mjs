export function calculateMovement(input, speed, deltaSeconds) {
  const horizontal = Number(input.right) - Number(input.left);
  const vertical = Number(input.down) - Number(input.up);
  const length = Math.hypot(horizontal, vertical);
  if (!length) return { dx: 0, dy: 0, angle: null };
  const dx = (horizontal / length) * speed * deltaSeconds;
  const dy = (vertical / length) * speed * deltaSeconds;
  return { dx, dy, angle: Math.atan2(dy, dx) };
}

function rectsOverlap(first, second) {
  return !(
    first.x + first.w < second.x ||
    first.x > second.x + second.w ||
    first.y + first.h < second.y ||
    first.y > second.y + second.h
  );
}

export function canOccupy(map, entity, x, y) {
  if (x < 0 || y < 0 || x + entity.w > map.w || y + entity.h > map.h) return false;
  const box = { x, y, w: entity.w, h: entity.h };
  return ![...(map.walls || []), ...(map.rivers || [])].some((area) => rectsOverlap(box, area));
}
