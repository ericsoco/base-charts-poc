// @flow

// This is a custom modification of the canonical styled-components libdef,
// aimed at making implicit typing acceptable

declare module 'styled-components' {
  declare type BuiltinElementInstances = {
    a: React$ElementRef<'a'>,
    abbr: React$ElementRef<'abbr'>,
    address: React$ElementRef<'address'>,
    area: React$ElementRef<'area'>,
    article: React$ElementRef<'article'>,
    aside: React$ElementRef<'aside'>,
    audio: React$ElementRef<'audio'>,
    b: React$ElementRef<'b'>,
    base: React$ElementRef<'base'>,
    bdi: React$ElementRef<'bdi'>,
    bdo: React$ElementRef<'bdo'>,
    big: React$ElementRef<'big'>,
    blockquote: React$ElementRef<'blockquote'>,
    body: React$ElementRef<'body'>,
    br: React$ElementRef<'br'>,
    button: React$ElementRef<'button'>,
    canvas: React$ElementRef<'canvas'>,
    caption: React$ElementRef<'caption'>,
    cite: React$ElementRef<'cite'>,
    code: React$ElementRef<'code'>,
    col: React$ElementRef<'col'>,
    colgroup: React$ElementRef<'colgroup'>,
    data: React$ElementRef<'data'>,
    datalist: React$ElementRef<'datalist'>,
    dd: React$ElementRef<'dd'>,
    del: React$ElementRef<'del'>,
    details: React$ElementRef<'details'>,
    dfn: React$ElementRef<'dfn'>,
    dialog: React$ElementRef<'dialog'>,
    div: React$ElementRef<'div'>,
    dl: React$ElementRef<'dl'>,
    dt: React$ElementRef<'dt'>,
    em: React$ElementRef<'em'>,
    embed: React$ElementRef<'embed'>,
    fieldset: React$ElementRef<'fieldset'>,
    figcaption: React$ElementRef<'figcaption'>,
    figure: React$ElementRef<'figure'>,
    footer: React$ElementRef<'footer'>,
    form: React$ElementRef<'form'>,
    h1: React$ElementRef<'h1'>,
    h2: React$ElementRef<'h2'>,
    h3: React$ElementRef<'h3'>,
    h4: React$ElementRef<'h4'>,
    h5: React$ElementRef<'h5'>,
    h6: React$ElementRef<'h6'>,
    head: React$ElementRef<'head'>,
    header: React$ElementRef<'header'>,
    hgroup: React$ElementRef<'hgroup'>,
    hr: React$ElementRef<'hr'>,
    html: React$ElementRef<'html'>,
    i: React$ElementRef<'i'>,
    iframe: React$ElementRef<'iframe'>,
    img: React$ElementRef<'img'>,
    input: React$ElementRef<'input'>,
    ins: React$ElementRef<'ins'>,
    kbd: React$ElementRef<'kbd'>,
    label: React$ElementRef<'label'>,
    legend: React$ElementRef<'legend'>,
    li: React$ElementRef<'li'>,
    link: React$ElementRef<'link'>,
    main: React$ElementRef<'main'>,
    map: React$ElementRef<'map'>,
    mark: React$ElementRef<'mark'>,
    menu: React$ElementRef<'menu'>,
    meta: React$ElementRef<'meta'>,
    meter: React$ElementRef<'meter'>,
    nav: React$ElementRef<'nav'>,
    noscript: React$ElementRef<'noscript'>,
    object: React$ElementRef<'object'>,
    ol: React$ElementRef<'ol'>,
    optgroup: React$ElementRef<'optgroup'>,
    option: React$ElementRef<'option'>,
    output: React$ElementRef<'output'>,
    p: React$ElementRef<'p'>,
    param: React$ElementRef<'param'>,
    picture: React$ElementRef<'picture'>,
    pre: React$ElementRef<'pre'>,
    progress: React$ElementRef<'progress'>,
    q: React$ElementRef<'q'>,
    rp: React$ElementRef<'rp'>,
    rt: React$ElementRef<'rt'>,
    ruby: React$ElementRef<'ruby'>,
    s: React$ElementRef<'s'>,
    samp: React$ElementRef<'samp'>,
    script: React$ElementRef<'script'>,
    section: React$ElementRef<'section'>,
    select: React$ElementRef<'select'>,
    small: React$ElementRef<'small'>,
    source: React$ElementRef<'source'>,
    span: React$ElementRef<'span'>,
    strong: React$ElementRef<'strong'>,
    style: React$ElementRef<'style'>,
    sub: React$ElementRef<'sub'>,
    summary: React$ElementRef<'summary'>,
    sup: React$ElementRef<'sup'>,
    table: React$ElementRef<'table'>,
    tbody: React$ElementRef<'tbody'>,
    td: React$ElementRef<'td'>,
    textarea: React$ElementRef<'textarea'>,
    tfoot: React$ElementRef<'tfoot'>,
    th: React$ElementRef<'th'>,
    thead: React$ElementRef<'thead'>,
    time: React$ElementRef<'time'>,
    title: React$ElementRef<'title'>,
    tr: React$ElementRef<'tr'>,
    track: React$ElementRef<'track'>,
    u: React$ElementRef<'u'>,
    ul: React$ElementRef<'ul'>,
    var: React$ElementRef<'var'>,
    video: React$ElementRef<'video'>,
    wbr: React$ElementRef<'wbr'>,

    // SVG
    circle: React$ElementRef<'circle'>,
    clipPath: React$ElementRef<'clipPath'>,
    defs: React$ElementRef<'defs'>,
    ellipse: React$ElementRef<'ellipse'>,
    g: React$ElementRef<'g'>,
    image: React$ElementRef<'image'>,
    line: React$ElementRef<'line'>,
    linearGradient: React$ElementRef<'linearGradient'>,
    mask: React$ElementRef<'mask'>,
    path: React$ElementRef<'path'>,
    pattern: React$ElementRef<'pattern'>,
    polygon: React$ElementRef<'polygon'>,
    polyline: React$ElementRef<'polyline'>,
    radialGradient: React$ElementRef<'radialGradient'>,
    rect: React$ElementRef<'rect'>,
    stop: React$ElementRef<'stop'>,
    svg: React$ElementRef<'svg'>,
    text: React$ElementRef<'text'>,
    tspan: React$ElementRef<'tspan'>,
  };

  declare type BuiltinElementType<ElementName: string> = $ElementType<
    BuiltinElementInstances,
    ElementName
  >;

  declare class InterpolatableComponent<P> extends React$Component<P> {
    static +styledComponentId: string;
  }

  declare export type Interpolation<P> =
    | ((executionContext: P) => Interpolation<P>) // eslint-disable-line flowtype/no-weak-types
    | InterpolatableComponent<*> // eslint-disable-line flowtype/no-weak-types
    | CSSRules
    | KeyFrames
    | string
    | number;

  // Should this be `mixed` perhaps?
  declare export type CSSRules = Interpolation<*>[]; // eslint-disable-line flowtype/no-weak-types

  // This is not exported on purpose, since it's an implementation detail
  declare type TaggedTemplateLiteral<I, R> = (
    strings: string[],
    ...interpolations: Interpolation<I>[]
  ) => R;

  declare export class KeyFrames {
    id: string;
    name: string;
    rules: string[];

    constructor(name: string, rules: string[]): this;
    toString(): string;
    getName(): string;
  }

  declare export type CSSConstructor = TaggedTemplateLiteral<any, CSSRules>; // eslint-disable-line flowtype/no-weak-types

  declare export type KeyFramesConstructor = TaggedTemplateLiteral<
    any,
    KeyFrames
  >;
  declare export type CreateGlobalStyleConstructor = TaggedTemplateLiteral<
    any,
    React$ComponentType<*>
  >; // eslint-disable-line flowtype/no-weak-types

  declare export var css: CSSConstructor;
  declare export var keyframes: KeyFramesConstructor;
  declare export var createGlobalStyle: CreateGlobalStyleConstructor;

  declare export var ThemeProvider: React$ComponentType<{
    children?: ?React$Node,
    theme: mixed | (mixed => mixed),
  }>;

  declare type PropsWithTheme<Props, Theme> = {|
    theme: Theme,
    ...$Exact<Props>,
  |};

  declare export type StyledComponent<
    Props,
    Theme,
    Instance
  > = React$AbstractComponent<Props, Instance> & InterpolatableComponent<Props>;

  // A styled component that doesn't require props or theme
  declare export type BareStyledComponent = StyledComponent<
    {},
    {},
    HTMLElement
  >;

  // No defs for these in the flow-typed repo
  declare export var ServerStyleSheet: any;
  declare export var StyleSheetManager: any;

  declare interface StyledFactory<StyleProps, Props, Theme, Instance> {
    [[call]]: TaggedTemplateLiteral<
      PropsWithTheme<StyleProps, Theme>,
      StyledComponent<StyleProps, Theme, Instance>
    >;
  }

  declare type ConvenientShorthand<Instance> = <StyleProps, Theme>(
    string[],
    ...Interpolation<PropsWithTheme<StyleProps, Theme>>[]
  ) => StyledComponent<StyleProps, Theme, Instance>;

  declare type ConvenientShorthands = $ObjMap<
    BuiltinElementInstances,
    // TODO: I'm not seeing any actual benefit from passing in the specific elements here
    () => ConvenientShorthand<HTMLElement> & React$Node
  >;

  declare interface Styled {
    <StyleProps, Theme, ElementName: $Keys<BuiltinElementInstances>>(
      ElementName
    ): StyledFactory<StyleProps, {}, Theme, BuiltinElementType<ElementName>>;
    <StyleProps, Theme, OwnProps: {}, Comp: React$ComponentType<OwnProps>>(
      Comp
    ): StyledFactory<StyleProps, OwnProps, Theme, React$ComponentType<Comp>>;
  }

  declare export default Styled & ConvenientShorthands;
}
