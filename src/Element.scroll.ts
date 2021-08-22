import {
    IContext,
    IScrollConfig,
    isObject,
    isScrollBehaviorSupported,
    modifyPrototypes,
    nonFinite,
    now,
    original,
    step,
} from "./common.js";

export const elementScroll = (element: Element, options: ScrollToOptions, config?: IScrollConfig): void => {
    const originalBoundFunc = original.elementScroll.bind(element);

    if (options.left === undefined && options.top === undefined) {
        return;
    }

    const startX = element.scrollLeft;
    const startY = element.scrollTop;

    const targetX = nonFinite(options.left ?? startX);
    const targetY = nonFinite(options.top ?? startY);

    if (options.behavior !== "smooth") {
        return originalBoundFunc(targetX, targetY);
    }

    const removeEventListener = () => {
        window.removeEventListener("wheel", cancelScroll);
        window.removeEventListener("touchmove", cancelScroll);
    };

    const context: IContext = {
        ...config,
        timeStamp: now(),
        startX,
        startY,
        targetX,
        targetY,
        rafId: 0,
        method: originalBoundFunc,
        callback: removeEventListener,
    };

    const cancelScroll = () => {
        cancelAnimationFrame(context.rafId);
        removeEventListener();
    };

    window.addEventListener("wheel", cancelScroll, {
        passive: true,
        once: true,
    });
    window.addEventListener("touchmove", cancelScroll, {
        passive: true,
        once: true,
    });

    step(context);
};

export const elementScrollPolyfill = (config?: IScrollConfig): void => {
    if (isScrollBehaviorSupported()) {
        return;
    }

    const originalFunc = original.elementScroll;

    modifyPrototypes(
        (prototype) =>
            (prototype.scroll = function scroll() {
                if (arguments.length === 1) {
                    const scrollOptions = arguments[0];
                    if (!isObject(scrollOptions)) {
                        throw new TypeError(
                            "Failed to execute 'scroll' on 'Element': parameter 1 ('options') is not an object.",
                        );
                    }

                    return elementScroll(this, scrollOptions, config);
                }

                return originalFunc.apply(this, arguments as any);
            }),
    );
};
