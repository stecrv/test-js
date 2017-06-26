var people = [
    {name: "Jon Hay", head: true, brand: false, tech: true, senior: true, role: "Head of Technical Solutions"},
    {name: "Chris Campbell", head: false, brand: false, tech: true, senior: true, role: "Senior Technical Consultant"},
    {name: "Scott Thompson", head: false, brand: false, tech: true, senior: true, role: "Senior Technical Consultant"},
    {name: "Bishnu Biswas", head: false, brand: false, tech: true, senior: true, role: "Senior Technical Consultant"},
    {name: "Bryon Chan", head: false, brand: false, tech: true, senior: true, role: "Senior Technical Consultant"},
    {name: "Clark Tozer", head: false, brand: false, tech: true, senior: false, role: "Technical Consultant "},
    {name: "Valeria Maneva ", head: false, brand: false, tech: true, senior: false, role: "Technical Consultant "},
    {name: "Brett Sedcole", head: true, brand: true, tech: false, senior: true, role: "Head of Brand"},
    {name: "Gemma Tuffield", head: false, brand: true, tech: false, senior: true, role: "Senior Brand Consultant"},
    {name: "Tom Bugler", head: false, brand: true, tech: false, senior: false, role: "Brand Consultant"},
    {name: "Mikhail Graham", head: false, brand: true, tech: false, senior: false, role: "Brand Consultant"}
];
/*
    complexity  high    senior                      head of Tech                head of Tech
                        Senior Brand Consultant     Head of Brand               Head of Brand
                medium  Senior Consultant           Senior Consultant           Head of Tech
                        Senior Brand Consultant     Senior Brand Consultant     Head of Brand
                low     Consultant                  Senior Consultant           Senior Consultant
                        Brand Consultant            Senior Brand Consultant     Senior Brand Consultant

    value               low                         medium                      high
*/


var inputValues = {
    people: people,
    endUser: null,
    isStrategic: null,
    whatValue: null,
    whatComplexity: null,
    whoAttend: function () {
        var p = this.people.slice(0);


        console.log(this.endUser,
            this.isStrategic,
            this.whatValue,
            this.whatComplexity);

        if (this.isStrategic == 'yes') {
            p = p.filter(function (person) {
                return (person.head === true  );
            });
            if (this.endUser == 'no') {
                p = p.filter(function (person) {
                    return (person.brand === false);
                })
            }
            console.log('people to invite:', p);
            return p;
        } else if (this.whatValue && this.whatComplexity) {
            if (this.whatValue == 'low' && this.whatComplexity == 'low') {
                p = this.people.filter(function (person) {
                    return (person.senior === false );
                })
            } else if ((this.whatValue == 'low' && this.whatComplexity != 'low')
                || (this.whatValue != 'low' && this.whatComplexity == 'low')) {
                p = this.people.filter(function (person) {
                    return (person.head === false && person.senior == true);
                })
            } else if (this.whatValue == 'high' || this.whatComplexity == 'high') {
                p = this.people.filter(function (person) {
                    return (person.head === true );
                })
            } else if (this.whatValue != 'high' && this.whatComplexity != 'high') {
                p = this.people.filter(function (person) {
                    return (person.head === false && person.senior == true);
                })
            } else if ((this.whatValue == 'high' && this.whatComplexity == 'medium')
                || ((this.whatValue == 'medium' && this.whatComplexity == 'high'))) {
                p = this.people.filter(function (person) {
                    return (person.head === true );
                })
            } else if ((this.whatValue == 'high' && this.whatComplexity != 'high')
                || (this.whatValue != 'high' && this.whatComplexity == 'high')) {
                p = this.people.filter(function (person) {
                    return (person.head === false && person.senior == true);
                })
            }
            if (this.endUser == 'no' && p.length>0) {
                p = p.filter(function (person) {
                    return (person.brand === false);
                })
            }
            console.log('people to invite:', p);
            return p;
        }


        console.log('people to invite:', null);
        return []
    }
};

var involve = {
    tech: {add: false, head: false, senior: false},
    brand: {add: false, head: false, senior: false}
};

/* Workflow

endUser
    yes ->  tech yes, brand yes
    no  ->  tech yes, brand no

isStrategic
    yes ->  head of tech yes,   if endUser = 1, head of brand yes
    no  ->  add whatValue and whatComplexity

whatValue + whatComplexity -> matrix

    complexity  high    senior                      head of Tech                head of Tech
                        Senior Brand Consultant     Head of Brand               Head of Brand
                medium  Senior Consultant           Senior Consultant           Head of Tech
                        Senior Brand Consultant     Senior Brand Consultant     Head of Brand
                low     Consultant                  Senior Consultant           Senior Consultant
                        Brand Consultant            Senior Brand Consultant     Senior Brand Consultant
    value               low                         medium                      high
 */

var Workflow = {
    inputValues: inputValues,
    involve: involve,
    init: function () {
        this.hide(".questionWrap");
        this.show("#decisionForm");
        this.show("#endUser");
        this.onClikRadio('endUser', this.levelOne.bind(this))
        this.onClikRadio('isStrategic', this.levelTwo.bind(this))
        this.onClikRadio('whatValue', this.levelThree.bind(this))
        this.onClikRadio('whatComplexity', this.levelThree.bind(this))
    },
    levelOne: function (val) {
        this.reset(1);
        this.inputValues.endUser = val;
        this.attendingList(this.inputValues.whoAttend());
        this.levelOneNext()
    },
    levelOneNext: function () {
        this.show("#isStrategic");
        this.hide("#whatValue");
        this.hide("#whatComplexity");
    },
    levelTwo: function (val) {
        this.reset(2);
        this.inputValues.isStrategic = val;
        this.attendingList(this.inputValues.whoAttend());
        this.leveltwoNext()
    },
    leveltwoNext: function (val) {
        if (this.inputValues.isStrategic == 'yes') {
            this.showAttending();
            this.hide("#whatValue");
            this.hide("#whatComplexity");
        } else {
            this.show("#whatValue");
            this.show("#whatComplexity");
        }
    },
    levelThree: function (val, name) {

        if (name == 'whatValue') {
            this.inputValues.whatValue = val;
        }
        if (name == 'whatComplexity') {
            this.inputValues.whatComplexity = val;
        }
        this.levelThreeEValuation();
    },
    levelThreeEValuation: function () {
        this.reset(3);
        this.attendingList(this.inputValues.whoAttend());
        if (this.inputValues.whatValue && this.inputValues.whatComplexity) {
            this.showAttending();
        }else{

        }
    },
    reset: function (lvl) {

        if (lvl === 1) {
            this.inputValues.endUser = null;
            this.inputValues.isStrategic = null;
            this.inputValues.whatValue = null;
            this.inputValues.whatValue = null;
            this.hide("#isStrategic");
            this.hide("#whatValue");
            this.hide("#whatComplexity");

        }
        if (lvl === 2) {
            this.inputValues.isStrategic = null;
            this.inputValues.whatValue = null;
            this.inputValues.whatValue = null;
            this.hide("#whatValue");
            this.hide("#whatComplexity");

        }
        if (lvl === 3) {


        }
    },
    showAttending: function () {
        this.show("#poepleList");
    },
    attendingList: function (list) {


        var html = '<ul class="list-group">';
        var c = '';
        for (var i = 0; i < list.length; i++) {
            if(list[i].tech) c = 'list-group-item-success';
            if(list[i].brand) c = 'list-group-item-info';
            html += '<li class="list-group-item " >' + list[i].name + '<span class="badge '+c+'"> ' + list[i].role + '</span></li>';
        }
        html += '</ul>';

        if (list.length = 0) html = 'No attending';
        $('#poepleListView').html(html);
    },
    show: function (el) {
        $(el).show().removeClass('hide');
    },
    hide: function (el) {
        $(el).hide().addClass('hide');
    },
    onClikRadio: function (name, func) {
        $("input[name='" + name + "']").change(function () {
            var v = $("input[name='" + name + "']:checked").val();
            func(v, name);
        });
    },
};

$(document).ready(function () {
    var wf = Workflow;
    wf.init();

});
