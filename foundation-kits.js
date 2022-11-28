import KatonProps from "./props";
import { PhysicalWidget } from "./foundation";
import { Textual, Widget } from "./widgets";
import { FragmentedBuilder } from "./builder";
import KatonGesture from "./gestures";
export class ScrollingWidget extends PhysicalWidget {
    constructor(props) {
        super([]);
        this.props = undefined;
        this.container = undefined;
        this.indicator = undefined;
        this.readyToPull = true;
        this.readyToStartPull = true;
        this.readyToEndPull = true;
        this.props = new KatonProps(props);
    }
    prepare() {
        super.prepare();
        const style = {
            position: 'relative'
        };
        style[this.props?.data.direction == 'horizontal' ? 'overflowX' : 'overflowY'] = 'auto';
        style[this.props?.data.direction == 'vertical' ? 'overflowX' : 'overflowY'] = 'hidden';
        this.style(style);
        this.attribution({
            kit: { scrolling: this.props?.data.horizontal ? 'horizontal' : 'vertical' }
        });
        this.indicator = Widget().style({
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: '1',
            transition: `all 200ms ease-out`,
        });
        return this.append(this.indicator).listeners();
    }
    render() {
        super.render();
        if (this.builder &&
            this.indicator &&
            this.props?.data.controller?.indicator) {
            FragmentedBuilder(this.builder, this.props?.data.controller?.indicator, this.indicator);
        }
        return this.process();
    }
    checkPullToRefresh(level) {
        if (this.element) {
            const shape = this.element.getBoundingClientRect();
            const limit = this.element.scrollHeight - shape.height;
            this.readyToPull = false;
            this.readyToStartPull = false;
            this.readyToEndPull = false;
            if (level == 0) {
                this.readyToPull = true;
                this.readyToStartPull = true;
                this.emitter.dispatch('pullrefresh:ready', {
                    area: 'start',
                    level
                });
            }
            if (level == limit) {
                this.readyToPull = true;
                this.readyToEndPull = true;
                this.emitter.dispatch('pullrefresh:ready', {
                    area: 'end',
                    level
                });
            }
        }
        return this;
    }
    listeners() {
        this.emitter.listen('pullrefresh:ready', ({ emit }) => {
            if (this.container && this.readyToPull && emit.area == 'end') {
                if (this.props?.data.controller?.infinite) {
                    (async () => {
                        await this.props?.data.controller?.refreshing({
                            indicator: this.indicator,
                            container: this.container,
                            area: 'end',
                        });
                    })();
                }
            }
            if (this.container && this.readyToPull && emit.area == 'start') {
                const swipe = new KatonGesture.Swipe(this, {});
                let round = 0, height = 0;
                swipe
                    .start(() => {
                    round = 0;
                    height = 0;
                })
                    .move((payload) => {
                    if (this.readyToPull) {
                        if (this.container) {
                            payload.delta.y = payload.delta.y + round;
                            const limit = this.container.measure().height / 7;
                            const h = Math.floor(payload.delta.y >= limit ? limit : payload.delta.y);
                            this.indicator?.style({
                                display: 'flex',
                                opacity: '1',
                                height: `${h}px`,
                                maxHeight: `${limit}px`,
                                overflow: 'hidden'
                            });
                            height = h;
                        }
                    }
                    round++;
                })
                    .end(async () => {
                    this.indicator?.style({
                        display: 'flex',
                        opacity: '1',
                        height: `${height - (height / 7)}px`,
                        overflow: 'hidden'
                    });
                    this.emitter.dispatch('pullrefresh:pending', this);
                    await this.props?.data.controller?.refreshing({
                        indicator: this.indicator,
                        container: this.container,
                        area: 'start',
                    });
                    if (this.container && this.container.element) {
                        if (this.indicator && this.indicator.element) {
                            this.indicator.element.ontransitionend = () => {
                                this.indicator?.style({ display: 'none' });
                            };
                            this.indicator.style({ opacity: '0', height: `0px` });
                        }
                    }
                    round = 0;
                    height = 0;
                })
                    .observe();
            }
        });
        this.on('scroll', () => this.checkPullToRefresh(this.element?.scrollTop || 0));
        return this;
    }
    process() {
        this.container = Widget(...(this.props?.data.children || [])).style({
            transition: `margin-top 200ms ease-out`
        });
        if (this.builder) {
            FragmentedBuilder(this.builder, this.container, this);
        }
        this.checkPullToRefresh(this.element?.scrollTop || 0);
        return this;
    }
}
export class TabsWidget extends PhysicalWidget {
    constructor(props) {
        super([]);
        this.props = undefined;
        this.helmetsWidget = Widget().attribution({
            tab: { section: 'helmet' }
        });
        this.framesWidget = Widget().attribution({
            tab: { section: 'frame' }
        });
        this.helmets = [];
        this.frames = [];
        this.index = 0;
        this.props = new KatonProps(props);
    }
    prepare() {
        super.prepare();
        this.attribution({
            kit: { tabs: '' }
        });
        this.append(this.helmetsWidget, this.framesWidget);
        return this;
    }
    render() {
        super.render();
        return this.parse().switch();
    }
    parse() {
        this.helmets = this.props?.data.map(tab => Widget((typeof tab.label == 'string' ? Textual(tab.label) : tab.label)).attribution({
            helmet: { label: '' }
        })).map((helmet, index) => {
            if (this.builder) {
                helmet.on('click', () => {
                    this.switch(index);
                });
                FragmentedBuilder(this.builder, helmet, this.framesWidget);
            }
            return helmet;
        });
        this.helmetsWidget.append(...(this.helmets || []));
        this.frames = this.props?.data.map((tab) => tab.children.style({}).attribution({
            tab: { frame: `` }
        })).map(frame => {
            if (this.builder) {
                FragmentedBuilder(this.builder, frame, this.framesWidget);
            }
            return frame;
        });
        return this;
    }
    switch(key) {
        if (this.props?.data) {
            this.props.data.map((tab, index) => {
                const activate = ((key && (index == key)) ||
                    (!key && tab.default === true));
                let helmet = undefined;
                let frame = undefined;
                if (this.helmets &&
                    this.helmets[index] &&
                    this.helmets[index] instanceof PhysicalWidget) {
                    helmet = this.helmets[index];
                    this.helmets[index].attribution({
                        tab: { helmet: activate ? `active` : `` }
                    });
                }
                if (this.frames &&
                    this.frames[index] &&
                    this.frames[index] instanceof PhysicalWidget) {
                    frame = this.frames[index];
                    if (!activate) {
                        this.frames[index].style({
                            display: 'none'
                        });
                    }
                    else {
                        this.frames[index].removeStyle(['display']);
                    }
                }
                if (activate) {
                    this.index = index;
                    this.helmet = helmet;
                    this.frame = frame;
                    this.emitter.dispatch('switch', {
                        index, helmet, frame,
                    });
                }
            });
        }
        return this;
    }
    next(loop) {
        const key = (this.index || 0) + 1;
        const limit = (this.props?.data || []).length - 1;
        return this.switch(key >= limit ? (loop ? 0 : limit) : key);
    }
    previous(loop) {
        const key = (this.index || 0) - 1;
        const limit = (this.props?.data || []).length - 1;
        return this.switch(key <= 0 ? (loop ? limit : 0) : key);
    }
}
