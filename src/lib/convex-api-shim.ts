// Shim for Convex API to allow the app to build without running codegen.
// This allows us to reference backend functions by string paths which work at runtime.

const functionName = Symbol.for("functionName");

const makeProxy = (path: string): any => {
  return new Proxy(
    {},
    {
      get(_, prop) {
        if (prop === functionName) {
          return path;
        }
        if (prop === Symbol.toStringTag) {
          return "FunctionReference";
        }
        if (typeof prop === "symbol") {
          return undefined;
        }
        if (prop === "toString" || prop === "toJSON") {
          return () => path;
        }
        
        const newPath = path ? `${path}:${prop}` : (prop as string);
        return makeProxy(newPath);
      },
    }
  );
};

export const api = makeProxy("") as any;
