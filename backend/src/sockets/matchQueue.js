function createMatchQueue() {
  let entries = [];

  return {
    enqueue(entry) {
      entries = entries.filter(
        (queued) => queued.socketId !== entry.socketId && queued.user.userId !== entry.user.userId
      );
      entries.push(entry);
      const opponentIndex = entries.findIndex(
        (queued) => queued.socketId !== entry.socketId && queued.mapId === entry.mapId
      );
      if (opponentIndex < 0) return null;
      const [opponent] = entries.splice(opponentIndex, 1);
      const entrantIndex = entries.findIndex((queued) => queued.socketId === entry.socketId);
      const [entrant] = entries.splice(entrantIndex, 1);
      return [opponent, entrant];
    },

    removeBySocketId(socketId) {
      const before = entries.length;
      entries = entries.filter((entry) => entry.socketId !== socketId);
      return entries.length !== before;
    },

    size(mapId) {
      return mapId ? entries.filter((entry) => entry.mapId === mapId).length : entries.length;
    },

    snapshot() {
      return entries.map((entry) => ({ ...entry }));
    }
  };
}

module.exports = { createMatchQueue };
