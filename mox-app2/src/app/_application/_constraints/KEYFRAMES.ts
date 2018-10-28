import { style } from '@angular/animations';

export const rubberBand = [
    style({transform: 'scale3d(1, 1, 1)'}),
    style({transform: 'scale3d(1.25, 0.75, 1)'}),
    style({transform: 'scale3d(0.75, 1.25, 1)'}),
    style({transform: 'scale3d(1.15, 0.85, 1)'}),
    style({transform: 'scale3d(0.95, 1.05, 1)'}),
    style({transform: 'scale3d(1.05, 0.95, 1)'}),
    style({transform: 'scale3d(1, 1, 1)'}),
];

export const flipInY = [
    style({transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)'}),
    style({transform: 'perspective(400px) rotate3d(0, 1, 0, -20deg)'}),
    style({transform: 'perspective(400px) rotate3d(0, 1, 0, 10deg)'}),
    style({transform: 'perspective(400px) rotate3d(0, 1, 0, -5deg)'}),
    style({transform: 'perspective(400px)'}),
];

export const slideInUp = [
    style({visibility: 'visible', transform: 'translate3d(0, 100%, 0)'}),
    style({transform: 'translate3d(0, 0, 0)'}),
];

export const slideOutDown = [
    style({transform: 'translate3d(0, 0, 0)'}),
    style({visibility: 'hidden', transform: 'translate3d(0, 100%, 0)'}),
];

export const slideOutLeft = [
    style({'transform': 'translate3d(0, 0, 0)'}),
    style({'transform': 'translate3d(-100%, 0, 0)', 'visibility': 'hidden'})
];

export const slideOutRight = [
    style({'transform': 'translate3d(0, 0, 0)'}),
    style({'transform': 'translate3d(100%, 0, 0)', 'visibility': 'hidden'})
];

export const slideInLeft = [
    style({'transform': 'translate3d(-100%, 0, 0)', 'visibility': 'visible'}),
    style({'transform': 'translate3d(0, 0, 0)'})
];

export const slideInRight  = [
    style({'transform': 'translate3d(100%, 0, 0)', 'visibility': 'visible'}),
    style({'transform': 'translate3d(0, 0, 0)'})
];

export const wobble = [
    style({transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)', offset: .15}),
    style({transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)', offset: .30}),
    style({transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)', offset: .45}),
    style({transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)', offset: .60}),
    style({transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)', offset: .75}),
    style({transform: 'none', offset: 1})
];

export const bounceInDown = [
    style({transform: 'translate3d(0, -3000px, 0)', opacity: 0, offset: .0}),
    style({transform: 'translate3d(0, 25px, 0)', opacity: 1, offset: .60}),
    style({transform: 'translate3d(0, -10px, 0)', offset: .75}),
    style({transform: 'translate3d(0, 5px, 0)', offset: .90}),
    style({transform: 'translate3d(0, 0, 0)', offset: 1}),
];

export const jackInTheBox = [
    style({transform: 'scale(0.1) rotate(30deg)', 'transform-origin': 'center bottom', opacity: 0, offset: .0}),
    style({transform: 'rotate(-10deg)', offset: .50}),
    style({transform: 'rotate(3deg)', offset: .70}),
    style({transform: 'scale(1)', opacity: 1, offset: 1}),
];

export const swing = [
    style({transform: 'rotate3d(0, 0, 1, 15deg)', offset: .2}),
    style({transform: 'rotate3d(0, 0, 1, -10deg)', offset: .4}),
    style({transform: 'rotate3d(0, 0, 1, 5deg)', offset: .6}),
    style({transform: 'rotate3d(0, 0, 1, -5deg)', offset: .8}),
    style({transform: 'none', offset: 1})
];

export const tada = [
    style({transform: 'scale3d(1, 1, 1)', offset: 0}),
    style({transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)', offset: .10}),
    style({transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)', offset: .20}),
    style({transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)',  offset: .30}),
    style({transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)', offset: .40}),
    style({transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)',  offset: .50}),
    style({transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)', offset: .60}),
    style({transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)',  offset: .70}),
    style({transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)', offset: .80}),
    style({transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)',  offset: .90}),
    style({transform: 'scale3d(1, 1, 1)', offset: 1})
];
