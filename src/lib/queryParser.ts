function setDeepValue(obj: any, path: string[], value: any) {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const part = path[i];
    current[part] = current[part] ?? {};
    current = current[part];
  }
  current[path[path.length - 1]] = value;
}

export function parseQueryParams(params: Record<string, string>) {
  const where: Record<string, any> = {};
  const include: Record<string, any> = {};
  let take: number | undefined;
  let orderBy: any;

  for (const [key, rawValue] of Object.entries(params)) {
    const value = isNaN(+rawValue) ? rawValue : +rawValue;

    if (key === "include") {
      rawValue.split(",").forEach((field) => {
        setDeepValue(include, field.split("."), true);
      });
    } else if (key === "take") {
      take = +rawValue;
    } else if (key === "orderBy") {
      try {
        orderBy = JSON.parse(rawValue);
      } catch {
        orderBy = undefined;
      }
    } else if (key.includes(".")) {
      setDeepValue(where, key.split("."), value);
    } else {
      where[key] = value;
    }
  }

  return { where, include, take, orderBy };
}
