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

function flattenObject(
  obj: Record<string, any>,
  prefix = "",
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, path));
    } else {
      result[path] = String(value);
    }
  }

  return result;
}

export function buildQueryParams(input: {
  where?: Record<string, any>;
  include?: Record<string, any>;
  take?: number;
  orderBy?: any;
}): string {
  const params: Record<string, string> = {};

  if (input.where) {
    Object.assign(params, flattenObject(input.where));
  }

  if (input.include) {
    const includes: string[] = [];
    const extractPaths = (obj: Record<string, any>, prefix = "") => {
      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (value === true) {
          includes.push(path);
        } else if (typeof value === "object") {
          extractPaths(value, path);
        }
      }
    };
    extractPaths(input.include);
    if (includes.length > 0) {
      params.include = includes.join(",");
    }
  }

  if (input.take !== undefined) {
    params.take = String(input.take);
  }

  if (input.orderBy) {
    params.orderBy = JSON.stringify(input.orderBy);
  }

  return new URLSearchParams(params).toString();
}
