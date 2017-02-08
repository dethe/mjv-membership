(function(){
"use strict";

var search = document.getElementById('membersearch');
var addbutton = document.getElementById('add-member');

function randomId(){
    return Math.floor(Math.random() * 16777215).toString(16);
}

function memberById(id){
    for (var i = 0; i < members.length; i++){
        if (id === members[i].id){
            return members[i];
        }
    }
}

function newMember(){
    var member = {
        first: '',
        last: '',
        email: '',
        id: Math.floor(Math.random() * 16777215).toString(16),
        memberSince: new Date().toISOString(),
        membershipSource: '',
        credits: 0,
        isCrew: false
    };
    members.push(member);
    return member;
}

function Mode(fields, buttonfields, modename){
    this.fields = fields;
    this.buttonfields = buttonfields;
    this.uifields = fields.concat(buttonfields);
    this.modename = modename;
    this.init();
}
Mode.prototype = {
    init: function(){
        this.section = document.getElementById(this.modename);
        this.uifields.forEach(field => this[field] = document.getElementById(field + '-' + this.modename));
    },
    populate: function(member){
        var self = this;
        this.member = member;
        this.fields.forEach(function(field){
            var type = self[field].dataset.type;
            if (type === 'date'){
                // self[field].value = prettyDate(member[field]);
                self[field].value = member[field];
                self[field].dataset.date = member[field];
            }else{
                self[field].value = member[field];
            }
        });
    },
    values: function(){
        if (this.modename === 'edit'){
            var self = this;
            this.fields.forEach(function(field){
                var type = self[field].dataset.type;
                if (type === 'date'){
                    self.member[field] = self[field].dataset.date;
                }else{
                    self.member[field] = self[field].value;
                }

            });
        }
        return this.member;
    },
    clear: function(){
        this.member = null;
        this.fields.forEach(field => this[field].value = '');
    },
    hide: function(){
        this.section.classList.add('hidden');
    },
    show: function(){
        this.section.classList.remove('hidden');
    },
    // hideButtons: function(){
    //     this.buttonfields.forEach(field => this[field].classList.add('hidden'));
    // },
    // showButtons: function(){
    //     this.buttonfields.forEach(field => this[field].classList.remove('hidden'));
    // }
};

var display = new Mode(['id', 'first', 'last', 'memberSince', 'credits'], ['edit'], 'display');
var edit = new Mode(['id', 'first', 'last', 'email'], ['save'], 'edit');

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
    edit.hide();
    display.show();
});

/*
    Show form to add a new member
*/
addbutton.addEventListener('click', function(event){
    edit.populate(newMember());
    display.hide();
    edit.show();
    search.value = '';
    edit.first.focus();
    Stretchy.resizeAll();
});

/*

Switch to edit view for an existing member

*/
display.edit.addEventListener('click', function(event){
    event.stopPropagation();
    edit.populate(display.values());
    display.hide();
    edit.show();
    edit.first.select();
    edit.first.focus();
    Stretchy.resizeAll();
});

edit.save.addEventListener('click', function(event){
    event.stopPropagation();
    display.populate(edit.values());
    // PERSIST CHANGES!
    // Make Undo-able
    edit.hide();
    display.show();
    search.focus();
});

})();
