var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _StyleWidget_dom, _PictureWidget_instances, _PictureWidget_pendingElement, _PictureWidget_failedElement, _PictureWidget_loaded, _PictureWidget_unloaded;
import { AbstractWidget, PhysicalWidget } from "./foundation";
import KatonProps from "./props";
import { defineElement } from "./elements";
import { KatonElementHeadlingBig, KatonElementHeadlingBigger, KatonElementHeadlingMedium, KatonElementHeadlingSmall, KatonElementHeadlingSmaller } from "./elements-html";
import { VisualKitStyle } from "sensen-visualkit";
import MetricRandom from "sensen-metric-random";
import useVisualKit from "sensen-visualkit/index";
import KatonAttribution, { AttributesObject } from "./attribution";
import { ExtendedDropdownListOption, ExtendedDropdownListOptions } from "./extended";
import { FragmentedBuilder } from "./builder";
export class HeadlingWidget extends PhysicalWidget {
    constructor(children) {
        super(children);
        this.name = 'kt-h';
        this.children = [];
        this.children = children;
        this.emitter.listen('render', () => {
            this.styling();
        });
    }
    styling() {
        return this;
    }
}
export class HeadlingBiggerWidget extends HeadlingWidget {
    constructor() {
        super(...arguments);
        this.name = 'kt-h1';
    }
    styling() {
        useVisualKit(this.element).define({
            display: 'block',
            fontSize: '36px',
        }).use('kat-h1');
        return this;
    }
}
export class HeadlingBigWidget extends HeadlingWidget {
    constructor() {
        super(...arguments);
        this.name = 'kt-h2';
    }
    styling() {
        useVisualKit(this.element).define({
            display: 'block',
            fontSize: '32px',
        }).use('kat-h2');
        return this;
    }
}
export class HeadlingMediumWidget extends HeadlingWidget {
    constructor() {
        super(...arguments);
        this.name = 'kt-h3';
    }
    styling() {
        useVisualKit(this.element).define({
            display: 'block',
            fontSize: '28px',
        }).use('kat-h3');
        return this;
    }
}
export class HeadlingSmallWidget extends HeadlingWidget {
    constructor() {
        super(...arguments);
        this.name = 'kt-h4';
    }
    styling() {
        useVisualKit(this.element).define({
            display: 'block',
            fontSize: '24px',
        }).use('kat-h4');
        return this;
    }
}
export class HeadlingSmallerWidget extends HeadlingWidget {
    constructor() {
        super(...arguments);
        this.name = 'kt-h5';
    }
    styling() {
        useVisualKit(this.element).define({
            display: 'block',
            fontSize: '20px',
        }).use('kat-h5');
        return this;
    }
}
export class ParagraphWidget extends PhysicalWidget {
    constructor() {
        super(...arguments);
        this.name = 'p';
    }
}
export class TextualWidget extends PhysicalWidget {
    constructor() {
        super(...arguments);
        this.name = 'span';
    }
}
export class UListWidget extends PhysicalWidget {
    constructor() {
        super(...arguments);
        this.name = 'ul';
    }
}
export class LiWidget extends PhysicalWidget {
    constructor() {
        super(...arguments);
        this.name = 'li';
    }
}
export class StrongTextWidget extends PhysicalWidget {
    constructor() {
        super(...arguments);
        this.name = 'b';
    }
}
export class FormWidget extends PhysicalWidget {
    constructor() {
        super(...arguments);
        this.name = 'form';
    }
}
export class InputWidget extends PhysicalWidget {
    constructor(props) {
        super([]);
        this.name = 'input';
        this.props = undefined;
        this.props = new KatonProps(props);
    }
    prepare() {
        const rows = this.props?.get('rows');
        this.name = (rows) ? 'textarea' : this.name;
        super.prepare();
        this.make();
        return this;
    }
    make() {
        const props = this.props?.mutate();
        if (props) {
            Object.entries(AttributesObject(props)).map(({ 0: slot, 1: value }) => {
                value = typeof value == 'boolean'
                    ? (value ? slot : `${value}`)
                    : `${value}`;
                this.element?.setAttribute(slot, `${value}`);
            });
        }
        return this;
    }
}
export class DropdownListWidget extends PhysicalWidget {
    constructor(props) {
        super([]);
        this.name = 'select';
        this.jumplist = ['options', 'listen'];
        this.widgets = [];
        this.props = undefined;
        this.props = new KatonProps(props);
    }
    prepare() {
        super.prepare();
        this.make();
        if (this.props?.data.options) {
            this.options(this.props?.data.options);
        }
        return this;
    }
    make() {
        const props = this.props?.mutate();
        if (props) {
            Object.entries(AttributesObject(props)).map(({ 0: slot, 1: value }) => {
                if (!this.jumplist.includes(slot)) {
                    value = typeof value == 'boolean'
                        ? (value ? slot : `${value}`)
                        : `${value}`;
                    this.element?.setAttribute(slot, `${value}`);
                }
            });
        }
        return this;
    }
    options(options) {
        const _options = (options || this.props?.data.options || []);
        ExtendedDropdownListOptions(this, _options);
        return this;
    }
    option(option) {
        ExtendedDropdownListOption(this, option);
        return this;
    }
}
export class DropdownOptionWidget extends PhysicalWidget {
    constructor(props) {
        super([]);
        this.name = 'option';
        this.props = undefined;
        this.widgets = [];
        this.jumplist = ['group'];
        this.props = new KatonProps(props);
    }
    prepare() {
        super.prepare();
        this.make();
        return this;
    }
    make() {
        const props = this.props?.mutate();
        if (props) {
            Object.entries(AttributesObject(props)).map(({ 0: slot, 1: value }) => {
                if (!this.jumplist.includes(slot)) {
                    value = typeof value == 'boolean'
                        ? (value ? slot : `${value}`)
                        : `${value}`;
                    this.element?.setAttribute(slot, `${value}`);
                }
            });
        }
        return this;
    }
    options(options) {
        if (options) {
            ExtendedDropdownListOptions(this, options);
        }
        return this;
    }
    option(option) {
        ExtendedDropdownListOption(this, option);
        return this;
    }
}
export class DropdownOptionGroupWidget extends DropdownOptionWidget {
    constructor(props) {
        super(props);
        this.name = 'optgroup';
        this.props = undefined;
        this.widgets = [];
        this.jumplist = ['group'];
        this.props = new KatonProps(props);
    }
    prepare() {
        super.prepare();
        this.make();
        return this;
    }
}
export class ButtonWidget extends PhysicalWidget {
    constructor() {
        super(...arguments);
        this.name = 'button';
    }
}
export class VisualKitWidget extends AbstractWidget {
    constructor(props) {
        super(props);
        this.props = undefined;
        this.props = new KatonProps(props || {});
        this.whenemit('render', () => {
            this.builder?.emitter.listen('ready', () => {
                this.make();
            });
        });
    }
    make() {
        if (this.parent instanceof PhysicalWidget && this.parent.element) {
            useVisualKit(this.parent.element)
                .define(this.props?.all() || {})
                .use().append();
        }
        return this;
    }
}
export class StyleWidget extends AbstractWidget {
    constructor(props) {
        super(props);
        this.props = undefined;
        _StyleWidget_dom.set(this, null);
        this.selector = '';
        this.attribution = null;
        this.props = new KatonProps(props || {});
        __classPrivateFieldSet(this, _StyleWidget_dom, document.createElement('style'), "f");
        this.selector = MetricRandom.CreateAplpha(16).join('');
    }
    prepare() {
        __classPrivateFieldGet(this, _StyleWidget_dom, "f")?.setAttribute('type', 'text/css');
        __classPrivateFieldGet(this, _StyleWidget_dom, "f")?.setAttribute('kat:kit:respository', `${this.selector}`);
        this.emitter.dispatch('prepare', this);
        return this;
    }
    remove() {
        __classPrivateFieldGet(this, _StyleWidget_dom, "f")?.remove();
        this.emitter.dispatch('remove', this);
        return this;
    }
    render() {
        if (this.parent instanceof PhysicalWidget && __classPrivateFieldGet(this, _StyleWidget_dom, "f")) {
            const declarations = this.props?.all();
            const computed = VisualKitStyle.parse(declarations || {}).join('');
            __classPrivateFieldGet(this, _StyleWidget_dom, "f").append(`[kat\\:kit~="${this.selector}"] { ${computed} }`);
            this.parent.element?.prepend(__classPrivateFieldGet(this, _StyleWidget_dom, "f"));
            this.attribution = (new KatonAttribution(this.parent.element))
                .sync('kat:kit')
                .add(this.selector)
                .link();
        }
        this.emitter.dispatch('render', this);
        return this;
    }
}
_StyleWidget_dom = new WeakMap();
export class TableFragmentWidget extends PhysicalWidget {
    constructor(children) {
        super(children);
        this.element = null;
        this.children = [];
        this.children = children;
    }
    prepare() {
        super.prepare();
        this.process();
        return this;
    }
    process() {
        return this;
    }
}
export class TableRowWidget extends TableFragmentWidget {
    constructor(children) {
        super(children);
        this.name = 'tr';
        this.element = null;
        this.children = [];
        this.children = children;
    }
    process() {
        return this;
    }
}
export class TableCellWidget extends TableFragmentWidget {
    constructor(children) {
        super(children);
        this.name = 'td';
        this.element = null;
        this.children = [];
        this.children = children;
    }
    process() {
        return this;
    }
}
export class TableSectionWidget extends TableFragmentWidget {
    constructor(children) {
        super(children);
        this.name = '';
        this.element = null;
        this.children = [];
        this.children = children;
    }
    process() {
        return this;
    }
}
export class TableHeadWidget extends TableSectionWidget {
    constructor(children) {
        super(children);
        this.name = 'thead';
        this.children = [];
        this.children = children;
    }
    process() {
        return this;
    }
}
export class TableBodyWidget extends TableSectionWidget {
    constructor(children) {
        super(children);
        this.name = 'tbody';
        this.children = [];
        this.children = children;
    }
    process() {
        return this;
    }
}
export class TableFootWidget extends TableSectionWidget {
    constructor(children) {
        super(children);
        this.name = 'tfoot';
        this.children = [];
        this.children = children;
    }
    process() {
        return this;
    }
}
export class TableWidget extends PhysicalWidget {
    constructor(props) {
        super([]);
        this.name = 'table';
        this.head = null;
        this.body = null;
        this.foot = null;
        this.props = new KatonProps(props || {});
    }
    prepare() {
        super.prepare();
        this.head = (new TableHeadWidget([])).prepare();
        this.body = (new TableBodyWidget([])).prepare();
        this.foot = (new TableFootWidget([])).prepare();
        this.pushToRender(this.head, this.body, this.foot);
        this.attribution({ kit: { table: 'default' } });
        return this;
    }
    render() {
        super.render();
        this.parseColumns().parseRows().parseFoot();
        return this;
    }
    parseColumns() {
        const columns = this.props?.get('column');
        columns?.map(column => {
            const row = (new TableRowWidget([])).prepare();
            column.map(data => {
                const a = {};
                if (data.colspan) {
                    a['colspan'] = `${data.colspan}`;
                }
                if (data.rowspan) {
                    a['colspan'] = `${data.rowspan}`;
                }
                a.table = { column: `${data.type || 'text'}` };
                this.builder?.fragment((new TableCellWidget([
                    (new TextualWidget([data.label])).prepare()
                ])).prepare().attribution(a), row);
            });
            if (this.builder) {
                FragmentedBuilder(this.builder, row, this.head || undefined);
            }
        });
        return this;
    }
    parseRows() {
        const rows = this.props?.get('rows');
        rows?.map(row => {
            const line = (new TableRowWidget([])).prepare();
            row.map(data => {
                const a = {};
                if (data.colspan) {
                    a['colspan'] = `${data.colspan}`;
                }
                if (data.rowspan) {
                    a['colspan'] = `${data.rowspan}`;
                }
                a.table = { cell: `body` };
                const cellule = (new TableCellWidget([])).prepare().attribution(a);
                const content = (new TextualWidget([this.parseCellValue(data.value, row, line, cellule)])).prepare();
                this.builder?.fragment(cellule.pushToRender(content), line);
            });
            if (this.builder) {
                FragmentedBuilder(this.builder, line, this.body || undefined);
            }
        });
        return this;
    }
    parseFoot() {
        const footers = this.props?.get('footer');
        footers?.map(row => {
            const line = (new TableRowWidget([])).prepare();
            row.map(data => {
                const a = {};
                if (data.colspan) {
                    a['colspan'] = `${data.colspan}`;
                }
                if (data.rowspan) {
                    a['colspan'] = `${data.rowspan}`;
                }
                a.table = { cell: `foot` };
                const cellule = (new TableCellWidget([])).prepare().attribution(a);
                const content = (new TextualWidget([this.parseCellValue(data.value, row, line, cellule)])).prepare();
                this.builder?.fragment(cellule.pushToRender(content), line);
            });
            if (this.builder) {
                FragmentedBuilder(this.builder, line, this.foot || undefined);
            }
        });
        return this;
    }
    parseCellValue(value, entry, row, cellule) {
        if (value instanceof PhysicalWidget) {
            return value;
        }
        else if (typeof value == 'function') {
            const props = { entry, row, cellule };
            return this.parseCellValue(value(props), entry, row, cellule);
        }
        else if (typeof value == 'object') {
            return Array.isArray(value) ? `${value.join(',')}` : `${JSON.stringify(value)}`;
        }
        return `${value}`;
    }
}
export class PictureWidget extends PhysicalWidget {
    constructor(props) {
        super([]);
        _PictureWidget_instances.add(this);
        this.name = 'picture';
        this.props = undefined;
        this.element = null;
        _PictureWidget_pendingElement.set(this, null);
        _PictureWidget_failedElement.set(this, null);
        this.source = null;
        this.sources = [];
        this.props = new KatonProps(props);
    }
    prepare() {
        super.prepare();
        __classPrivateFieldSet(this, _PictureWidget_pendingElement, document.createElement('div'), "f");
        __classPrivateFieldSet(this, _PictureWidget_failedElement, document.createElement('div'), "f");
        this.source = document.createElement('img');
        this.source.style.display = 'none';
        this.sources = [];
        this.append(__classPrivateFieldGet(this, _PictureWidget_pendingElement, "f"), __classPrivateFieldGet(this, _PictureWidget_failedElement, "f"), this.source);
        return this;
    }
    pending() {
        if (this.props?.data.pending) {
            if (this.builder) {
                if (this.props.data.pending instanceof PhysicalWidget) {
                    FragmentedBuilder(this.builder, this.props.data.pending, this);
                    if (this.props.data.pending.element) {
                        __classPrivateFieldGet(this, _PictureWidget_pendingElement, "f")?.append(this.props.data.pending.element);
                    }
                }
                else if (typeof this.props.data.pending && __classPrivateFieldGet(this, _PictureWidget_pendingElement, "f")) {
                    __classPrivateFieldGet(this, _PictureWidget_pendingElement, "f").innerHTML = `${this.props.data.pending}`;
                }
            }
        }
        return this;
    }
    inheritShapeStyle(element) {
        if (element) {
            const properties = 'objectFit minWidth width maxWidth minHeight height maxHeight';
            properties.split(' ').map(prop => element.style[prop] = 'inherit');
        }
        return this;
    }
    sourceListener(element) {
        if (element) {
            this.inheritShapeStyle(element);
            element.addEventListener('load', () => __classPrivateFieldGet(this, _PictureWidget_instances, "m", _PictureWidget_loaded).call(this));
            element.addEventListener('error', () => __classPrivateFieldGet(this, _PictureWidget_instances, "m", _PictureWidget_unloaded).call(this));
        }
        return this;
    }
    medias() {
        if (this.props?.data.media) {
            this.props.data.media.map(({ query, source }) => {
                const element = document.createElement('source');
                this.sourceListener(element);
                element.setAttribute('media', `(${query})`);
                element.setAttribute('srcset', `${source}`);
                this.sources?.push(element);
                this.element?.prepend(element);
            });
        }
        return this;
    }
    render() {
        super.render();
        this.pending()
            .medias()
            .sourceListener(this.source)
            .source?.setAttribute('src', `${this.props?.data.source}`);
        return this;
    }
}
_PictureWidget_pendingElement = new WeakMap(), _PictureWidget_failedElement = new WeakMap(), _PictureWidget_instances = new WeakSet(), _PictureWidget_loaded = function _PictureWidget_loaded() {
    __classPrivateFieldGet(this, _PictureWidget_failedElement, "f")?.remove();
    __classPrivateFieldGet(this, _PictureWidget_pendingElement, "f")?.remove();
    this.emitter.dispatch('load', this);
    if (this.source) {
        this.source.style.removeProperty('display');
    }
    return this;
}, _PictureWidget_unloaded = function _PictureWidget_unloaded() {
    __classPrivateFieldGet(this, _PictureWidget_pendingElement, "f")?.remove();
    if (this.source) {
        this.source.style.display = 'none';
    }
    if (this.props?.data.failed) {
        if (this.builder) {
            if (this.props.data.failed instanceof PhysicalWidget) {
                FragmentedBuilder(this.builder, this.props.data.failed, this);
                if (this.props.data.failed.element) {
                    __classPrivateFieldGet(this, _PictureWidget_failedElement, "f")?.append(this.props.data.failed.element);
                }
            }
            else if (typeof this.props.data.failed && __classPrivateFieldGet(this, _PictureWidget_failedElement, "f")) {
                __classPrivateFieldGet(this, _PictureWidget_failedElement, "f").innerHTML = `${this.props.data.failed}`;
            }
        }
    }
    this.emitter.dispatch('error', this);
    return this;
};
defineElement('kt-h1', KatonElementHeadlingBigger);
defineElement('kt-h2', KatonElementHeadlingBig);
defineElement('kt-h3', KatonElementHeadlingMedium);
defineElement('kt-h4', KatonElementHeadlingSmall);
defineElement('kt-h5', KatonElementHeadlingSmaller);
