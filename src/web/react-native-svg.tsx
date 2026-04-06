import React from 'react';

type SvgElementProps = React.SVGProps<SVGElement> & {
  children?: React.ReactNode;
};

type SvgRootProps = React.SVGProps<SVGSVGElement> & {
  children?: React.ReactNode;
};

function createSvgComponent<T extends keyof React.JSX.IntrinsicElements>(
  tagName: T,
) {
  return React.forwardRef<SVGElement, SvgElementProps>(function SvgComponent(
    props,
    ref,
  ) {
    return React.createElement(tagName, { ...props, ref }, props.children);
  });
}

export const Svg = React.forwardRef<SVGSVGElement, SvgRootProps>(function Svg(
  props,
  ref,
) {
  return <svg {...props} ref={ref}>{props.children}</svg>;
});

export const Circle = createSvgComponent('circle');
export const ClipPath = createSvgComponent('clipPath');
export const Defs = createSvgComponent('defs');
export const Ellipse = createSvgComponent('ellipse');
export const G = createSvgComponent('g');
export const Line = createSvgComponent('line');
export const LinearGradient = createSvgComponent('linearGradient');
export const Path = createSvgComponent('path');
export const Polygon = createSvgComponent('polygon');
export const Polyline = createSvgComponent('polyline');
export const RadialGradient = createSvgComponent('radialGradient');
export const Rect = createSvgComponent('rect');
export const Stop = createSvgComponent('stop');

export default Svg;
