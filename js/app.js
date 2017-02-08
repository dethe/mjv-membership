(function(){
"use strict";

var search = document.getElementById('membersearch');
var addbutton = document.getElementById('add-member');
function Mode(fields, buttonfields, modename){
    this.fields = fields;
    this.buttonfields = buttonfields;
    this.uifields = fields.concat(buttonfields);
    this.modename = modename;
    this.init();
}
Mode.prototype = {
    init: function(){
        this.uifields.forEach(field => this[field] = document.getElementById(field + '-' + this.modename));
    },
    populate: function(member){
        this.fields.forEach(field => this[field].value = member[field]);
        this.buttonfields.forEach(field => this[field].classList.remove('hidden'));
    },
    values: function(){
        var vals = {};
        this.fields.forEach(field => vals[field] = this[field].value);
        return vals;
    },
    clear: function(){
        this.fields.forEach(field => this[field].value = '');
        this.buttonfields.forEach(field => this[field].classList.add('hidden'));
    },
    hide: function(){
        this.uifields.forEach(field => this[field].classList.add('hidden'));
    },
    show: function(){
        this.uifields.forEach(field => this[field].classList.remove('hidden'));
    }
};
var display = new Mode(['id', 'first', 'last', 'email'], ['edit'], 'display');
var edit = new Mode(['id', 'first', 'last', 'email'], ['save'], 'edit');
function memberById(id){
    for (var i = 0; i < members.length; i++){
        if (id === members[i].id){
            return members[i];
        }
    }
}
new Awesomplete(
    search,
    {
        list: members,
        autoFirst: true,
        data: function(member, key){
            return {label: member.first + ' ' + member.last, value: member.id}
        }
    }
);

/*************************************
*
*          EVENT LISTENERS
*
**************************************/

/*
When we've selected someone from the search, set to display mode and populate it
*/
search.addEventListener('awesomplete-selectcomplete', function(event){
    var member = memberById(search.value);
    search.value = '';
    edit.hide();
    display.populate(member);
    display.show();
});

/*
When starting a new search, clear both views and reset to display

TODO: disable search if we're editing? Then we also need a cancel button.
*/
search.addEventListener('awesomplete-open', function(event){
    display.clear();
});

addbutton.addEventListener('click', function(event){
    edit.clear();
    display.hide();
    edit.show();
    search.value = '';
    edit.first.focus();
    Stretchy.resizeAll();
});

display.edit.addEventListener('click', function(event){
    console.log('clicked display-edit');
    event.stopPropagation();
    edit.populate(display.values());
    display.hide();
    edit.show();
    edit.first.select();
    edit.first.focus();
    Stretchy.resizeAll();
});

edit.save.addEventListener('click', function(event){
    console.log('clicked edit-save');
    event.stopPropagation();
    display.populate(edit.values());
    // PERSIST CHANGES!
    // Make Undo-able
    edit.hide();
    display.show();
    search.focus();
});

})();
