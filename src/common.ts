export const checkBehavior = (behavior?: string): behavior is undefined | ScrollBehavior => {
    return behavior === undefined || behavior === "auto" || behavior === "instant" || behavior === "smooth";
};

export const failedExecute = (method: string, object: string, reason = "cannot convert to dictionary."): string =>
    `Failed to execute '${method}' on '${object}': ${reason}`;

export const failedExecuteInvalidEnumValue = (method: string, object: string, value: string): string =>
    failedExecute(method, object, `The provided value '${value}' is not a valid enum value of type ScrollBehavior.`);

export const isObject = (value: unknown): boolean => {
    const type = typeof value;
    return value !== null && (type === "object" || type === "function");
};

export const isScrollBehaviorSupported = (): boolean => "scrollBehavior" in window.document.documentElement.style;

export const markPolyfill = (method: Record<never, never>): void => {
    Object.defineProperty(method, "__isPolyfill", { value: true });
};

type Prototype = typeof HTMLElement.prototype | typeof SVGElement.prototype | typeof Element.prototype;

export const modifyPrototypes = (modification: (prototype: Prototype) => void): void => {
    [HTMLElement.prototype, SVGElement.prototype, Element.prototype].forEach((prototype) => {
        modification(prototype);
    });
};

/**
 * - On Chrome and Firefox, document.scrollingElement will return the <html> element.
 * - Safari, document.scrollingElement will return the <body> element.
 * - On Edge, document.scrollingElement will return the <body> element.
 * - IE11 does not support document.scrollingElement, but you can assume its <html>.
 */
export const scrollingElement = (element: Element): Element =>
    element.ownerDocument.scrollingElement || element.ownerDocument.documentElement;