

export class ActionBarConfig {
    actions: ActionButton[];
    swipeleft: Function;
    swiperight: Function;
    swipeup: Function;
    swipedown: Function;
}

export class ActionButton {
    icon: string;
    disabled: boolean;
    action: Function;
}
