type MapWithPolyfills = Map<unknown, unknown> & {
  getOrInsertComputed?: <T>(key: unknown, callback: () => T) => T;
  getOrInsert?: <T>(key: unknown, defaultValue: T) => T;
};

export function applyMapPolyfills(): void {
  const mapProto = Map.prototype as MapWithPolyfills;

  if (!mapProto.getOrInsertComputed) {
    mapProto.getOrInsertComputed = function getOrInsertComputed<T>(
      key: unknown,
      callback: () => T,
    ): T {
      if (this.has(key)) {
        return this.get(key) as T;
      }
      const value = callback();
      this.set(key, value);
      return value;
    };
  }

  if (!mapProto.getOrInsert) {
    mapProto.getOrInsert = function getOrInsert<T>(key: unknown, defaultValue: T): T {
      if (this.has(key)) {
        return this.get(key) as T;
      }
      this.set(key, defaultValue);
      return defaultValue;
    };
  }
}

applyMapPolyfills();
