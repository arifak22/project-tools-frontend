

var bgColor   = ['bg-primary', 'bg-secondary', 'bg-light', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger', 'bg-dark'];
var textColor = ['text-inverse-primary', 'text-inverse-secondary', 'text-inverse-light', 'text-inverse-success', 'text-inverse-info', 'text-inverse-warning', 'text-inverse-danger', 'text-inverse-dark'];
var moment = require('moment'); // require

function getColor(search = '', parameter = 'bg'){
    if(search !== ''){
        var matches = 'bg-primary';
        if(parameter === 'bg'){
            matches = bgColor.filter(function(s) {
                return s.match(search);
            });
        }
        if(parameter === 'text'){
            matches = textColor.filter(function(s) {
                return s.match(search);
            });
        }
        return matches;
    }
}

function getColorRandom(parameter = 'bg'){
    if(parameter === 'bg')
    return bgColor[Math.floor(Math.random()*bgColor.length)];

    if(parameter === 'text')
    return textColor[Math.floor(Math.random()*textColor.length)];
}

function dateFromNow(date, maxHours = 6*24){
    const hourFromNow = Math.abs(moment().diff(date, 'hours'));
    if(hourFromNow >= maxHours){
        return moment(date).format("D MMMM YYYY - HH:mm");
    }else{
        return moment(date).fromNow();
    }
}

function dateTimeBetween(start, end){
    return moment(start).format("D MMMM YYYY") + ' (' +moment(start).format("HH:mm") + ' - '+ moment(end).format("HH:mm") + ')';
}

export {getColor, getColorRandom, dateFromNow, dateTimeBetween}