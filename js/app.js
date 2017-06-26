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

        if (this.isStrategic == 'yes') {
            p = p.filter(function (person) {
                return (person.head === true  );
            });
        } else {
            if (this.whatValue == 'low' && this.whatComplexity == 'low') {
                p = this.people.filter(function (person) {
                    return (person.senior === false );
                })
            } else if (this.whatValue == 'high' && this.whatComplexity == 'high') {
                p = this.people.filter(function (person) {
                    return (person.head === true );
                })
            } else  if (this.whatValue  && this.whatComplexity ) {
                if (this.whatValue != 'high' && this.whatComplexity != 'high') {
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
            }
        }

        if (this.endUser == 'no') {
            p = p.filter(function (person) {
                return (person.brand === false);
            })
        }
        console.log('people to invite:', p);
        return p;
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
        this.hide("#isStrategic");
        this.hide("#whatValue");
        this.hide("#whatComplexity");
        this.reset(1);
        this.inputValues.endUser = val;
        if (val === 'yes') {
            this.involve.brand.add = true;
        }
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
        if (val === 'yes') {
            this.involve.brand.head = true;
            this.involve.tech.head = true;
        }
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
        if (this.inputValues.whatValue && this.inputValues.whatComplexity) {
            this.showAttending();
            this.attendingList(this.inputValues.whoAttend());
        }
    },
    reset: function (lvl) {

        if (lvl === 1) {
            this.involve.tech.add = false;
            this.involve.brand.add = false;

            this.inputValues.isStrategic = null;

            this.reset(2);
            this.reset(3);
        }
        if (lvl === 2) {
            this.involve.brand.head = false;
            this.involve.tech.head = false;

            this.inputValues.whatValue = null;
            this.inputValues.whatComplexity = null;

            this.reset(3);
        }
        if (lvl === 3) {

        }
    },
    showAttending: function () {
        this.show("#poepleList");
    },
    attendingList: function (list) {

        var html = '<ul>';
        for (var i = 0; i < list.length; i++) {
            html += '<li>' + list[i].name + ': ' + list[i].role + '</li>';
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
            var v = $("input[name='" + name + "']:checked").val()
            func(v, name);
        });
    },
};

$(document).ready(function () {
    var wf = Workflow;
    wf.init();

});
