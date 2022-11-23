declare module 'sensen-katon/attribution' {
  import type { IAttributesObject, IAttributesObjectValues, IAttributesParsed, IAttribution } from "sensen-katon/declarations";
  import { KatonEmitter } from "sensen-katon/emitter";
  export function AttributesObjectValues(value: IAttributesObjectValues): IAttributesObjectValues;
  export function AttributesObject(attributes: IAttributesObject, ns?: string | undefined, separator?: string | undefined): IAttributesParsed;
  export default class KatonAttribution implements IAttribution {
      #private;
      attributeName: string;
      emitter: KatonEmitter;
      get entries(): string[];
      get value(): string;
      constructor(element: HTMLElement | null, attributeName?: string);
      sync(attributeName?: string): this;
      add(value: string): this;
      remove(value: string): this;
      replace(older: string, value: string): this;
      contains(value: string): boolean;
      link(): this;
      unlink(attributes?: string | string[]): this;
  }

}
declare module 'sensen-katon/builder' {
  import KatonContext from "sensen-katon/context";
  import { KatonEmitter } from "sensen-katon/emitter";
  import WidgetNode, { AbstractWidget } from "sensen-katon/foundation";
  import type { IWidgetNode, IWidgetUsable, IKatonBuilder, IKatonContext } from "sensen-katon/declarations";
  import Ui from "sensen-katon/ui";
  export class KatonBuilder<T extends IWidgetNode> implements IKatonBuilder<T> {
      widget: T;
      context: IKatonContext | null;
      ancestor: KatonBuilder<IWidgetNode> | null;
      emitter: KatonEmitter;
      ready: boolean;
      constructor(widget: T);
      prepare(): this;
      injector(widget: IWidgetNode, parent?: IWidgetNode): this;
      render(): this;
  }
  export function FragmentedBuilder(builder: KatonBuilder<IWidgetNode>, widget: IWidgetUsable, parent?: IWidgetNode): KatonContext | KatonBuilder<any> | WidgetNode<any> | AbstractWidget;
  export function PhysicalWidgetBuilder(builder: KatonBuilder<IWidgetNode>, widget: IWidgetUsable, parent?: IWidgetNode): IWidgetUsable;
  export function Append(entry: KatonBuilder<IWidgetNode>, ui: Ui): void;
  export default function Builder<T extends IWidgetNode>(widget: T): KatonBuilder<T>;

}
declare module 'sensen-katon/context' {
  import { KatonEmitter } from "sensen-katon/emitter";
  import type { IKatonContext, IKatonContextStore } from "sensen-katon/declarations";
  export default class KatonContext implements IKatonContext {
      emitter: KatonEmitter;
      storage: IKatonContextStore;
      ready: boolean;
      slot<T extends unknown>(name: string): T;
      addSlot(name: string, value: any): this;
      removeSlot(name: string): this;
      render(): this;
  }

}
declare module 'sensen-katon/declarations' {
  import { KatonEmitter, KatonEmitterCallback } from "sensen-katon/emitter";
  export type IWidgetUsable = IWidgetNode | IPhysicalWidget | IAbstractWidget | IKatonBuilder<IWidgetNode> | IKatonContext;
  export interface IWidgetNode {
      codex: string | null;
      props?: any;
      children?: any;
      element?: HTMLElement | null;
      parent: IWidgetNode | null;
      ancestor: IWidgetNode | null;
      context: IKatonContext | null;
      emitter: KatonEmitter;
      ready: boolean;
      builder: IKatonBuilder<IWidgetNode> | null;
      render(): this;
      prepare(): this;
      listener<T>(name: string, callback: KatonEmitterCallback<T>): this;
      beforePrepare(): this;
      afterPrepare(): this;
  }
  export interface IPhysicalWidget extends IWidgetNode {
      $element(): this;
      connect(): this;
      disconnect(): this;
      clean(): this;
      style(declarations: IStyleDeclaration): this;
      addClass(tokens: string): this;
      remove(): this;
      getAttribution(attrib: IAttributionProps | string): string | null;
      attribution(attrib: IAttributionProps): this;
      toggleClass(tokens: string, force?: boolean | undefined): boolean | (boolean | undefined)[] | undefined;
      containsClass(tokens: string): boolean | (boolean | undefined)[] | undefined;
      supportsClass(tokens: string): boolean | (boolean | undefined)[] | undefined;
      removeClass(tokens: string): this;
      replaceClass(oldTokens: string, newTokens: string): this;
      content(data: IWidgetUsable): this;
      html(data: string | null): this;
      pushToRender(...children: IWidgetChildren[]): this;
  }
  export interface IHeadlingWidget extends IPhysicalWidget {
  }
  export interface IAbstractWidget extends IWidgetNode {
  }
  export type IWidgetChildren = IWidgetNode | IKatonBuilder<IWidgetNode> | Node | Element | Text | string | boolean | null | undefined;
  export type IWidgetProps = {
      [P: string]: any;
  };
  export type IUiAssignCallback = (e: HTMLElement) => void;
  export interface IKatonBuilder<C extends IWidgetNode> {
      widget: C;
      context: IKatonContext | null;
      ancestor: IKatonBuilder<IWidgetNode> | null;
      emitter: KatonEmitter;
      ready: boolean;
      prepare(): this;
      injector(widget: C): this;
      render(): this;
  }
  export interface IKatonPropsInstance<T extends IKatonProps> {
      emitter: KatonEmitter;
      get data(): T;
      get<V extends unknown>(name: string): V;
      add(name: string, value: any): this;
      remove(name: string): this;
      all(): T;
  }
  export interface IKatonProps {
      [P: string]: any;
  }
  export interface IKatonContextStore {
      [C: string]: any;
  }
  export interface IKatonContext {
      emitter: KatonEmitter;
      storage: IKatonContextStore;
      ready: boolean;
      slot<T extends unknown>(name: string): T;
      addSlot(name: string, value: any): this;
      removeSlot(name: string): this;
      render(): this;
  }
  export type IKatonContextCallback = (context: IKatonContext | null) => void;
  export interface IKatonReference extends IAbstractWidget {
      layer<T extends IWidgetNode>(): T;
      measure(): DOMRect | undefined;
  }
  export type IKatonReferenceCallback = (context: IKatonReference) => void;
  export type IStyleDefault = 'unset' | 'initial';
  export type IStylePropImportant<P> = {
      [K in keyof P]: P[K] | `${P[K] | any} !important`;
  };
  export type IStylePropDisplay = 'flex' | 'grid' | 'inline' | 'inline-block' | 'block' | 'none' | IStyleDefault;
  export interface IStyleDeclaration extends Partial<CSSStyleDeclaration> {
      display?: IStylePropDisplay;
      flexDirection?: 'column' | 'column-reverse' | 'row' | 'row-reverse' | IStyleDefault;
      backdropFilter?: string;
  }
  export interface IStyleSelectorDeclarations {
      [selector: string]: IStyleDeclaration;
  }
  export interface IAttributionProps extends IAttributesObject {
      [A: string]: IAttributionProps | string | number | boolean | null;
  }
  export type IAttributesObjectValues = IAttributesObject | Array<any> | string | number | boolean | null;
  export type IAttributesObject = {
      [A: string]: IAttributesObjectValues;
  };
  export type IAttributesParsed = {
      [A: string]: string;
  };
  export type IActionCallbackInstance<C extends IWidgetNode> = {
      context: IKatonContext | null;
      builder: IKatonBuilder<C> | null;
      event: Event | null;
  };
  export type IActionCallback<C extends IWidgetNode> = (argument: IActionCallbackInstance<C>) => void;
  export interface IActionProps<C extends IWidgetNode> extends IKatonProps {
      name: string;
      callback: IActionCallback<C>;
      options?: boolean | AddEventListenerOptions | undefined;
  }
  export interface IKatonElement extends HTMLElement {
      emitter?: KatonEmitter;
      connectedCallback?: () => void;
      adoptedCallback?: () => void;
      disconnectedCallback?: () => void;
  }
  export type IState = {
      [S: string]: any;
  };
  export type IStateWidgetStore = {
      [S: string]: any;
  };
  export type IStatePayloadNode = Element | Node;
  export type IStatePayloadSlots<T extends IState> = {
      [K in keyof T]: RegExpMatchArray;
  };
  export type IStatePayload<T extends IState> = {
      values: (T[keyof T])[];
      slots: IStatePayloadSlots<T>;
      node: Element | Node;
      clone: Element | Node;
  };
  export type IStateSlot = {
      name: string;
      value: any;
      persistance?: boolean;
  };
  export type IStateData<T extends IState> = {
      slot: keyof T;
      value: T[keyof T];
  };
  export interface IKatonState<T extends IState> {
      emitter: KatonEmitter;
      get data(): T;
      use(): IAbstractWidget;
      get(slot: keyof T): T[keyof T];
      set(slot: keyof T, value: T[keyof T]): this;
      add(slot: keyof T, value: T[keyof T]): this;
      remove(slot: keyof T): this;
      hydrate(slot: keyof T): this;
      hydrates(): this;
  }
  export type IStateWatcherProps<T extends IState> = Array<keyof T>;
  export type IStateWatcherCallback<T extends IState> = (state: T) => IPhysicalWidget;
  export interface IAttribution {
      attributeName: string;
      get entries(): string[];
      get value(): string;
      sync(attribute?: string): this;
      add(value: string): this;
      remove(value: string): this;
      replace(older: string, value: string): this;
      contains(value: string): boolean;
      link(): this;
      unlink(property?: string | string[]): this;
  }
  export type IInputProps = IAttributesObject & {
      rows?: boolean | number;
      placeholder?: string;
      type: 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'username' | 'fistname' | 'lastname' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week';
      accept?: string;
      alt?: string;
      autocomplete?: 'on' | 'off';
      autofocus?: boolean;
      checked?: boolean;
      dirname?: string;
      disabled?: boolean;
      form?: string;
      formaction?: string;
      formmethod?: 'get' | 'post';
      formnovalidate?: string;
      formtarget?: '_blank' | '_self' | '_parent' | '_top' | string;
      list?: string;
      max?: number | string;
      maxlength?: number;
      min?: number | string;
      multiple?: boolean;
      name?: string;
      pattern?: string;
      readonly?: boolean;
      required?: boolean;
      size?: number;
      src?: string;
      step?: number;
      value?: string | number;
  };
  export type IDropdownListOptionGroup = {
      label?: string;
      disabled?: boolean;
  };
  export type IDropdownListOption = IDropdownListOptionGroup & {
      value?: string | number;
      selected?: boolean;
      group?: Array<IDropdownListOption>;
  };
  export type IDropdownListProps = IAttributesObject & {
      autofocus?: boolean;
      disabled?: boolean;
      form?: string;
      multiple?: true;
      name?: string;
      required?: boolean;
      size?: number;
      options?: Array<IDropdownListOption>;
  };
  export interface IDropdownListOptionExtended extends IPhysicalWidget {
      widgets?: Array<IDropdownListOptionExtended>;
      options(options?: IDropdownListOption[]): this;
      option(option: IDropdownListOption): this;
  }
  export type ITableType = 'text' | 'number' | 'boolean' | 'date' | 'time' | 'datetime' | 'username' | 'email' | 'selection' | 'image' | 'video' | 'file' | 'longtext' | 'custom';
  export type ITableColumn = {
      label: string;
      name?: string;
      type?: ITableType;
      colspan?: number;
      rowspan?: number;
  };
  export type ITableColumns = Array<ITableColumn>;
  export type ITableRow = {
      value: any;
      colspan?: number;
      rowspan?: number;
  };
  export type ITableRows = Array<ITableRow>;
  export type ITableProps = {
      column: Array<ITableColumns>;
      rows: Array<ITableRows>;
      footer?: Array<ITableRows>;
  };
  export interface ITableFragmentWidget extends IPhysicalWidget {
  }
  export interface ITableRowWidget extends ITableFragmentWidget {
      element: HTMLTableRowElement | null;
  }
  export interface ITableColWidget extends ITableFragmentWidget {
      element: HTMLTableColElement | null;
  }
  export interface ITableCellWidget extends ITableFragmentWidget {
      element: HTMLTableCellElement | null;
  }
  export interface ITableSectionWidget extends ITableFragmentWidget {
      element: HTMLTableSectionElement | null;
  }

}
declare module 'sensen-katon/elements-html' {
  import { IKatonElement } from "sensen-katon/declarations";
  import KatonElement from "sensen-katon/elements";
  import { KatonEmitter } from "sensen-katon/emitter";
  export class KatonElementHeadling extends KatonElement implements IKatonElement {
      emitter: KatonEmitter;
  }
  export class KatonElementHeadlingBigger extends KatonElementHeadling implements IKatonElement {
      emitter: KatonEmitter;
  }
  export class KatonElementHeadlingBig extends KatonElementHeadling implements IKatonElement {
      emitter: KatonEmitter;
  }
  export class KatonElementHeadlingMedium extends KatonElementHeadling implements IKatonElement {
      emitter: KatonEmitter;
  }
  export class KatonElementHeadlingSmall extends KatonElementHeadling implements IKatonElement {
      emitter: KatonEmitter;
  }
  export class KatonElementHeadlingSmaller extends KatonElementHeadling implements IKatonElement {
      emitter: KatonEmitter;
  }

}
declare module 'sensen-katon/elements' {
  import { KatonEmitter } from "sensen-katon/emitter";
  import { IKatonElement } from "sensen-katon/declarations";
  export default class KatonElement extends HTMLElement implements IKatonElement {
      emitter: KatonEmitter;
      constructor();
      connectedCallback(): void;
      adoptedCallback(): void;
      disconnectedCallback(): void;
  }
  export function defineElement(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions | undefined): CustomElementConstructor;

}
declare module 'sensen-katon/emitter' {
  export type KatonEmitterType = string;
  export type KatonEmitterArguments<T> = {
      emit: T;
      type: string;
  };
  export type KatonEmitterCallback<T> = ((arg: KatonEmitterArguments<T>) => Promise<T | KatonEmitterArguments<T>> | boolean | void);
  export type KatonEmitterError = {
      code: number;
      message: string;
  };
  export type KatonEmitterErrorCallback = ((arg: KatonEmitterError) => void);
  export type KatonEmitterEntries = {
      [K: KatonEmitterType]: KatonEmitterCallback<any>[];
  };
  export type EmitterDispatcherProps<T> = {
      instance: IKatonEmitter;
      type: KatonEmitterType;
      args: any;
      callback: KatonEmitterCallback<T>;
      resolve?: KatonEmitterCallback<T>;
      reject?: (err: KatonEmitterErrorCallback) => void;
  };
  export interface IKatonEmitter {
      entries: KatonEmitterEntries;
      listener: KatonEmitterType[];
      dispatcher: KatonEmitterType[];
      returned?: any;
      listen: <T>(type: KatonEmitterType, callback: KatonEmitterCallback<T>) => this;
      dispatch: <T>(type: KatonEmitterType, args: {}, resolve?: KatonEmitterCallback<T>, reject?: (err: KatonEmitterErrorCallback) => void) => this;
      resolveDispatcher?: <T>(args: EmitterDispatcherProps<T>) => (boolean | Promise<void> | IKatonEmitter);
  }
  export function EmitterResponse<T>(type: string, emit: any): KatonEmitterArguments<T>;
  export class KatonEmitter implements IKatonEmitter {
      entries: KatonEmitterEntries;
      listener: KatonEmitterType[];
      dispatcher: KatonEmitterType[];
      returned?: any;
      constructor();
      reset(type?: KatonEmitterType): this;
      listen<T>(type: KatonEmitterType, callback: KatonEmitterCallback<T>): this;
      dispatch<T>(type: KatonEmitterType, args: {}, resolve?: KatonEmitterCallback<T>, reject?: (err: KatonEmitterErrorCallback) => void): this;
      static resolveDispatcher<T>({ instance, type, args, callback, resolve, reject, }: EmitterDispatcherProps<T>): boolean | Promise<void> | typeof KatonEmitter;
  }

}
declare module 'sensen-katon/extended' {
  import { IDropdownListOption, IDropdownListOptionExtended } from "sensen-katon/declarations";
  export function ExtendedDropdownListOptions(widget: IDropdownListOptionExtended, options: IDropdownListOption[]): IDropdownListOptionExtended;
  export function ExtendedDropdownListOption(widget: IDropdownListOptionExtended, option: IDropdownListOption): IDropdownListOptionExtended;

}
declare module 'sensen-katon/foundation-html' {
  import { AbstractWidget, PhysicalWidget } from "sensen-katon/foundation";
  import KatonProps from "sensen-katon/props";
  import type { IAbstractWidget, IStyleDeclaration, IHeadlingWidget, IPhysicalWidget, IWidgetChildren, IAttribution, IInputProps, IDropdownListProps, IDropdownListOption, IDropdownListOptionGroup, IDropdownListOptionExtended, ITableProps, ITableSectionWidget, ITableRowWidget, ITableCellWidget, ITableFragmentWidget } from "sensen-katon/declarations";
  export class HeadlingWidget extends PhysicalWidget implements IHeadlingWidget {
      name?: string;
      children: IWidgetChildren[];
      constructor(children: IWidgetChildren[]);
      styling(): this;
  }
  export class HeadlingBiggerWidget extends HeadlingWidget implements IHeadlingWidget {
      name?: string;
      styling(): this;
  }
  export class HeadlingBigWidget extends HeadlingWidget implements IHeadlingWidget {
      name?: string;
      styling(): this;
  }
  export class HeadlingMediumWidget extends HeadlingWidget implements IHeadlingWidget {
      name?: string;
      styling(): this;
  }
  export class HeadlingSmallWidget extends HeadlingWidget implements IHeadlingWidget {
      name?: string;
      styling(): this;
  }
  export class HeadlingSmallerWidget extends HeadlingWidget implements IHeadlingWidget {
      name?: string;
      styling(): this;
  }
  export class ParagraphWidget extends PhysicalWidget implements IPhysicalWidget {
      name?: string;
  }
  export class TextualWidget extends PhysicalWidget implements IPhysicalWidget {
      name?: string;
  }
  export class UListWidget extends PhysicalWidget implements IPhysicalWidget {
      name?: string;
  }
  export class LiWidget extends PhysicalWidget implements IPhysicalWidget {
      name?: string;
  }
  export class StrongTextWidget extends PhysicalWidget implements IPhysicalWidget {
      name?: string;
  }
  export class FormWidget extends PhysicalWidget implements IPhysicalWidget {
      name?: string;
  }
  export class InputWidget extends PhysicalWidget implements IPhysicalWidget {
      name?: string;
      props?: KatonProps<IInputProps>;
      constructor(props: IInputProps);
      prepare(): this;
      make(): this;
  }
  export class DropdownListWidget extends PhysicalWidget implements IPhysicalWidget, IDropdownListOptionExtended {
      name?: string;
      jumplist: Array<string>;
      widgets?: Array<DropdownOptionWidget>;
      props?: KatonProps<IDropdownListProps>;
      constructor(props: IDropdownListProps);
      prepare(): this;
      make(): this;
      options(options?: IDropdownListOption[]): this;
      option(option: IDropdownListOption): this;
  }
  export class DropdownOptionWidget extends PhysicalWidget implements IPhysicalWidget, IDropdownListOptionExtended {
      name?: string;
      props?: KatonProps<IDropdownListOption>;
      widgets?: Array<IDropdownListOptionExtended>;
      jumplist: Array<string>;
      constructor(props: IDropdownListOption);
      prepare(): this;
      make(): this;
      options(options?: IDropdownListOption[]): this;
      option(option: IDropdownListOption): this;
  }
  export class DropdownOptionGroupWidget extends DropdownOptionWidget implements IPhysicalWidget, IDropdownListOptionExtended {
      name?: string;
      props?: KatonProps<IDropdownListOptionGroup>;
      widgets?: Array<DropdownOptionWidget>;
      jumplist: Array<string>;
      constructor(props: IDropdownListOptionGroup);
      prepare(): this;
  }
  export class ButtonWidget extends PhysicalWidget implements IPhysicalWidget {
      name?: string;
  }
  export class VisualKitWidget extends AbstractWidget implements IAbstractWidget {
      props?: KatonProps<IStyleDeclaration> | undefined;
      constructor(props?: IStyleDeclaration);
      make(): this;
  }
  export class StyleWidget extends AbstractWidget implements IAbstractWidget {
      #private;
      props?: KatonProps<IStyleDeclaration> | undefined;
      selector: string;
      attribution: IAttribution | null;
      constructor(props?: IStyleDeclaration);
      prepare(): this;
      remove(): this;
      render(): this;
  }
  export class TableFragmentWidget extends PhysicalWidget implements ITableFragmentWidget {
      element: HTMLElement | null;
      children: IWidgetChildren[];
      constructor(children: IWidgetChildren[]);
      prepare(): this;
      process(): this;
  }
  export class TableRowWidget extends TableFragmentWidget implements ITableRowWidget {
      name?: string;
      element: HTMLTableRowElement | null;
      children: IWidgetChildren[];
      constructor(children: IWidgetChildren[]);
      process(): this;
  }
  export class TableCellWidget extends TableFragmentWidget implements ITableCellWidget {
      name?: string;
      element: HTMLTableCellElement | null;
      children: IWidgetChildren[];
      constructor(children: IWidgetChildren[]);
      process(): this;
  }
  export class TableSectionWidget extends TableFragmentWidget implements ITableSectionWidget {
      name?: string;
      element: HTMLTableSectionElement | null;
      children: IWidgetChildren[];
      constructor(children: IWidgetChildren[]);
      process(): this;
  }
  export class TableHeadWidget extends TableSectionWidget implements ITableSectionWidget {
      name?: string;
      children: IWidgetChildren[];
      constructor(children: IWidgetChildren[]);
      process(): this;
  }
  export class TableBodyWidget extends TableSectionWidget implements ITableSectionWidget {
      name?: string;
      children: IWidgetChildren[];
      constructor(children: IWidgetChildren[]);
      process(): this;
  }
  export class TableFootWidget extends TableSectionWidget implements ITableSectionWidget {
      name?: string;
      children: IWidgetChildren[];
      constructor(children: IWidgetChildren[]);
      process(): this;
  }
  export class TableWidget extends PhysicalWidget implements IPhysicalWidget {
      props?: KatonProps<ITableProps> | undefined;
      name?: string;
      head: ITableSectionWidget | null;
      body: ITableSectionWidget | null;
      foot: ITableSectionWidget | null;
      constructor(props: ITableProps);
      prepare(): this;
      render(): this;
      parseColumns(): this;
      parseRows(): this;
      parseFoot(): this;
      parseCellValue(data: any): string | PhysicalWidget;
  }

}
declare module 'sensen-katon/foundation' {
  import { KatonBuilder } from "sensen-katon/builder";
  import { KatonEmitter, KatonEmitterCallback } from "sensen-katon/emitter";
  import KatonProps from "sensen-katon/props";
  import type { IWidgetNode, IWidgetChildren, IKatonContext, IWidgetProps, IPhysicalWidget, IAbstractWidget, IKatonProps, IKatonReference, IStyleDeclaration, IAttributionProps, IActionProps, IState, IWidgetUsable } from "sensen-katon/declarations";
  export default class WidgetNode<Props extends IKatonProps> implements IWidgetNode {
      codex: string | null;
      children?: any;
      props?: KatonProps<Props>;
      context: IKatonContext | null;
      parent: WidgetNode<IKatonProps> | null;
      ancestor: WidgetNode<IKatonProps> | null;
      emitter: KatonEmitter;
      ready: boolean;
      builder: KatonBuilder<IWidgetNode> | null;
      constructor(props?: any);
      beforePrepare(): this;
      afterPrepare(): this;
      prepare(): this;
      render(): this;
      listener<T>(name: string, callback: KatonEmitterCallback<T>): this;
  }
  export class PhysicalWidget extends WidgetNode<IKatonProps> implements IPhysicalWidget {
      #private;
      props?: KatonProps<IKatonProps>;
      children: IWidgetChildren[];
      name?: string;
      element: HTMLElement | null;
      constructor(children: IWidgetChildren[]);
      $element(): this;
      prepare(): this;
      connect(): this;
      disconnect(): this;
      clean(): this;
      style(declarations: IStyleDeclaration): this;
      addClass(tokens: string): this;
      toggleClass(tokens: string, force?: boolean | undefined): boolean | (boolean | undefined)[] | undefined;
      containsClass(tokens: string): boolean | (boolean | undefined)[] | undefined;
      removeClass(tokens: string): this;
      supportsClass(tokens: string): boolean | (boolean | undefined)[] | undefined;
      replaceClass(oldTokens: string, newTokens: string): this;
      remove(): this;
      getAttribution(name: string): string | null;
      attribution(attrib: IAttributionProps): this;
      html(data: string | null): this;
      content(data: IWidgetUsable | IWidgetChildren): this;
      append(...nodes: (string | Node | IPhysicalWidget)[]): this;
      pushToRender(...children: IWidgetChildren[]): this;
  }
  export class AbstractWidget extends WidgetNode<IKatonProps> implements IAbstractWidget {
      props?: any;
      constructor(props?: IWidgetProps);
  }
  export class ReferenceWidget extends AbstractWidget implements IKatonReference {
      codex: string;
      props?: KatonProps<IKatonProps>;
      constructor(props?: IWidgetProps);
      measure(): DOMRect | undefined;
      layer<T extends WidgetNode<IKatonProps>>(): T;
  }
  export function ActionTrigger<C extends IWidgetNode>(artifact: ActionWidget<C>, immediat?: boolean): ActionWidget<C>;
  export function ActionName(name: keyof GlobalEventHandlersEventMap): string;
  export class ActionWidget<C extends IWidgetNode> extends AbstractWidget {
      props?: IActionProps<C>;
      constructor(props: IActionProps<C>);
      render(): this;
      parse(): this;
      make(node: HTMLElement): this;
  }
  export class StateWidget<T extends IState> extends AbstractWidget implements IAbstractWidget {
      props: T;
      widget: PhysicalWidget | null;
      constructor(props: T);
  }
  export class AttributionWidget extends AbstractWidget implements IAbstractWidget {
      props?: KatonProps<IAttributionProps> | undefined;
      constructor(props?: IAttributionProps);
      render(): this;
  }

}
declare module 'sensen-katon/index' {
  export default class Katon {
  }

}
declare module 'sensen-katon/props' {
  import { KatonEmitter } from "sensen-katon/emitter";
  import type { IKatonProps, IKatonPropsInstance } from "sensen-katon/declarations";
  export default class KatonProps<T extends IKatonProps> implements IKatonPropsInstance<T> {
      #private;
      emitter: KatonEmitter;
      get data(): T;
      constructor(props: T);
      get<V extends T[keyof T]>(name: keyof T): V;
      add(name: keyof T, value: any): this;
      all(): T;
      mutate<Remix extends IKatonProps>(): Remix;
      remove(name: string): this;
  }

}
declare module 'sensen-katon/state' {
  import { IKatonState, IPhysicalWidget, IState, IStateData, IStatePayload, IStatePayloadNode, IStateWatcherCallback, IStateWatcherProps } from "sensen-katon/declarations";
  import { KatonEmitter } from "sensen-katon/emitter";
  import { StateWidget } from "sensen-katon/foundation";
  export const StateExpression: () => RegExp;
  export function findState(data: string | null): RegExpMatchArray[];
  export class KatonStatePayloads<T extends IState> {
      #private;
      add(payload: IStatePayload<T>): this;
      exists(node: IStatePayloadNode): IStatePayload<T>[];
      find(slots: Array<keyof T>): IStatePayload<T>[];
      set(node: IStatePayloadNode, entry: IStateData<T>): this;
      unset(node: IStatePayloadNode): this;
      parse(node: IStatePayloadNode, callback: (data: IStatePayload<T>) => void): this;
      parseNode(node: Node, callback: (data: IStatePayload<T>) => void): this;
      parseElement(node: Element, callback: (data: IStatePayload<T>) => void): this;
  }
  export class StateWatcher<T extends IState> {
      state: IKatonState<T>;
      props: IStateWatcherProps<T>;
      pointer: IPhysicalWidget | null;
      callback: IStateWatcherCallback<T> | null;
      constructor(state: IKatonState<T>);
      watch(props: Array<keyof T> | keyof T): this;
      widget(callback: IStateWatcherCallback<T>): IPhysicalWidget | null;
  }
  export default class KatonState<T extends IState> implements IKatonState<T> {
      #private;
      emitter: KatonEmitter;
      get data(): T;
      constructor(state: T);
      use(): StateWidget<T>;
      watch(affected: string): StateWatcher<T>;
      get(slot: keyof T): T[keyof T];
      set(slot: keyof T, value: T[keyof T]): this;
      add(slot: keyof T, value: T[keyof T]): this;
      remove(slot: keyof T): this;
      hydrate(slots: keyof T | Array<keyof T>): this;
      hydrates(): this;
  }

}
declare module 'sensen-katon/test' {
  export {};

}
declare module 'sensen-katon/ui' {
  import type { IPhysicalWidget, IUiAssignCallback } from "sensen-katon/declarations";
  export default class Ui {
      #private;
      selector: string | null;
      parent: HTMLElement;
      constructor(selector: string | null, parent?: HTMLElement);
      get root(): HTMLElement | null;
      get roots(): HTMLElement[];
      get exists(): boolean;
      static context(selector: string | null, parent?: HTMLElement): Ui;
      assign(callback: IUiAssignCallback): this;
  }
  export function UiMutation(widget: IPhysicalWidget | null, callback: MutationCallback, initier?: MutationObserverInit | undefined): MutationObserver | undefined;

}
declare module 'sensen-katon/utils/camelcase' {
  export function uncamelize(value: string): string;
  export function camelize(value: string): string;

}
declare module 'sensen-katon/utils/class' {
  export function cloneClassInstance(instance: object): any;
  export function isWidgetInstance(i: any): boolean;
  export function useTrait(origin: {
      [O: string]: any;
  }, trait: object): {
      [O: string]: any;
  };

}
declare module 'sensen-katon/widgets' {
  import { AbstractWidget, ActionWidget, AttributionWidget, PhysicalWidget, ReferenceWidget } from "sensen-katon/foundation";
  import type { IStyleDeclaration, IActionCallback, IWidgetChildren, IWidgetNode, IKatonContextCallback, IKatonReferenceCallback, IState, IInputProps, IDropdownListProps, IDropdownListOption, IAttributionProps, ITableProps } from "sensen-katon/declarations";
  import { HeadlingBigWidget, HeadlingBiggerWidget, HeadlingMediumWidget, HeadlingSmallWidget, HeadlingSmallerWidget, LiWidget, ParagraphWidget, StrongTextWidget, StyleWidget, TextualWidget, UListWidget, VisualKitWidget, FormWidget, InputWidget, DropdownOptionWidget, DropdownListWidget, ButtonWidget, DropdownOptionGroupWidget, TableWidget } from "sensen-katon/foundation-html";
  import KatonState from "sensen-katon/state";
  export function Context(callback: IKatonContextCallback): AbstractWidget;
  export function Ref(ref: IKatonReferenceCallback): ReferenceWidget;
  export function Widget(...widgets: IWidgetChildren[]): PhysicalWidget;
  export function FlexBox(...widgets: IWidgetChildren[]): PhysicalWidget;
  export function Row(...widgets: IWidgetChildren[]): PhysicalWidget;
  export function RowReverse(...widgets: IWidgetChildren[]): PhysicalWidget;
  export function Column(...widgets: IWidgetChildren[]): PhysicalWidget;
  export function ColumnReverse(...widgets: IWidgetChildren[]): PhysicalWidget;
  export function Center(...widgets: IWidgetChildren[]): PhysicalWidget;
  export function HCenter(...widgets: IWidgetChildren[]): PhysicalWidget;
  export function HColumnCenter(...widgets: IWidgetChildren[]): PhysicalWidget;
  export function VCenter(...widgets: IWidgetChildren[]): PhysicalWidget;
  export function VColumnCenter(...widgets: IWidgetChildren[]): PhysicalWidget;
  export function Textual(...widgets: IWidgetChildren[]): TextualWidget;
  export function H1(...widgets: IWidgetChildren[]): HeadlingBiggerWidget;
  export function H2(...widgets: IWidgetChildren[]): HeadlingBigWidget;
  export function H3(...widgets: IWidgetChildren[]): HeadlingMediumWidget;
  export function H4(...widgets: IWidgetChildren[]): HeadlingSmallWidget;
  export function H5(...widgets: IWidgetChildren[]): HeadlingSmallerWidget;
  export function Paragraph(...widgets: IWidgetChildren[]): ParagraphWidget;
  export function UL(...widgets: IWidgetChildren[]): UListWidget;
  export function Li(...widgets: IWidgetChildren[]): LiWidget;
  export function StrongText(...widgets: IWidgetChildren[]): StrongTextWidget;
  export function Form(...widgets: IWidgetChildren[]): FormWidget;
  export function Input(props: IInputProps): InputWidget;
  export function DropdownList(props: IDropdownListProps): DropdownListWidget;
  export function DropdownOption(props: IDropdownListOption): DropdownOptionWidget;
  export function DropdownOptionGroup(props: IDropdownListOption): DropdownOptionGroupWidget;
  export function Button(...widgets: IWidgetChildren[]): ButtonWidget;
  export function Table(props: ITableProps): TableWidget;
  export function Style(selectors: IStyleDeclaration): StyleWidget;
  export function Action<C extends IWidgetNode>(name: string, callback: IActionCallback<C>, options?: boolean | AddEventListenerOptions | undefined): ActionWidget<C>;
  export function UseAction<C extends IWidgetNode>(eventName: keyof GlobalEventHandlersEventMap, callback: IActionCallback<C>, options?: boolean | AddEventListenerOptions | undefined): ActionWidget<C>;
  export function UseKit(declaration?: IStyleDeclaration): VisualKitWidget;
  export function State<T extends IState>(state: T): KatonState<T>;
  export function Attribution(props: IAttributionProps): AttributionWidget;

}
declare module 'sensen-katon' {
  import main = require('sensen-katon/index');
  export = main;
}