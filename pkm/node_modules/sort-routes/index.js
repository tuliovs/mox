"use strict";

var memoize = require('memoize-id').default;
var getPathPartsMemoized = memoize(getPathParts);
var sort = require('stable');

function sortRoutes(routeA, routeB) {
    if(routeA instanceof RegExp && routeB instanceof RegExp)
        return 0;
    if(routeA instanceof RegExp) return 1;
    if(routeB instanceof RegExp) return -1;

    let pathPartsA = getPathPartsMemoized(routeA);
    let pathPartsB = getPathPartsMemoized(routeB);

    for(var i = 0; i <= pathPartsA.length; i++) {
        let a = pathPartsA[i];
        let b = pathPartsB[i];

        if(!a && !b) return 0;
        if(!b) return (pathPartsA[i-1]||{}).multipart ? -1 : 1;
        if(!a) return (pathPartsB[i-1]||{}).multipart ? 1 : -1;

        if(a.value === b.value) continue;

        let specificityDiff = a.specificity - b.specificity;
        if(specificityDiff !== 0) return specificityDiff;

        if(a.specificity > 0 && a.regex && b.regex) return 0;

        if(a.value < b.value) return -1;
        if(a.value > b.value) return 1;
        return 0;
    }
}

function getPathParts(path) {
    const TYPES = [
        /^[^\(\:][^\[]+$/, //static
        /^[^\(\:].*\[(.*)\]$/, //static+regex
        /^(?:\:[\w0-9]+)?\((.*)\)$/, //param?+regex
        /^\:[\w0-9]+$/, //param
    ]
    return splitPath(path).map(value => {
        var result;

        if(!TYPES.some((pattern, index) => {
            let match = pattern.exec(value)
            if(match) {
                let regex = match[1]
                let multipart = !!regex && isMultipart(regex)
                let specificity = index + (multipart ? TYPES.length : 0)
                result = { value, multipart, regex, specificity }
                return true;
            }
        })) throw new Error('Path part did not match a specifcity: '+value)

        return result;
    })
}

function getPathParts(path) {
    const TYPES = [
        /^[^\(\:][^\[]+$/, //static
        /^[^\(\:].*\[(.*)\]$/, //static+regex
        /^(?:\:[\w0-9]+)?\((.*)\)$/, //param?+regex
        /^\:[\w0-9]+$/, //param
    ]
    return splitPath(path).map(value => {
        var result;

        if(!TYPES.some((pattern, index) => {
            let match = pattern.exec(value)
            if(match) {
                let regex = match[1]
                let multipart = !!regex && isMultipart(regex)
                let specificity = index + (multipart ? TYPES.length : 0)
                result = { value, multipart, regex, specificity }
                return true;
            }
        })) throw new Error('Path part did not match a specifcity: '+value)

        return result;
    })
}

function splitPath(path) {
    var startIndex = 0;
    var parts = [];
    var parens = 0;
    var brackets = 0;
    var log = {};
    for(var i = 0; i <= path.length; i++) {
        if((path[i] === '/' && !parens && !brackets) || !path[i]) {
            let value = path.slice(startIndex, i)
            if(value) parts.push(value);
            startIndex = i+1;
        } else if(path[i] === '\\') {
            i++;
        } else if(path[i] === '(') {
            parens += 1;
        } else if(path[i] === ')') {
            if(parens) parens -= 1;
        } else if(path[i] === '[') {
            brackets += 1;
        } else if(path[i] === ']') {
            if(brackets) brackets -= 1;
        }
    }
    return parts;
}

function isMultipart(pattern) {
    if(!pattern) return false;

    var inNegatedSet = false;
    var negatedSlash = false;
    var escapeSequencesWithSlash = ['W', 'D', 'S', '/']

    for(var i = 0; i < pattern.length; i++) {
        if(pattern[i] === '\\') {
            if(escapeSequencesWithSlash.indexOf(pattern[++i]) !== -1) {
                if(!inNegatedSet) return true;
                negatedSlash = true;
            }
        } else if(pattern[i] === '/' || pattern[i] === '.') {
            if(!inNegatedSet) return true;
            negatedSlash = true;
        } else if(pattern[i] === '[' && pattern[i+1] === '^') {
            inNegatedSet = true;
        } else if(pattern[i] === ']' && inNegatedSet) {
            if(!negatedSlash) return true;
            inNegatedSet = negatedSlash = false;
        }
    }

    return false;
}

module.exports = sortRoutes;