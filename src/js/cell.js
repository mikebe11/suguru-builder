/**  This is the model, view and cell collection for each puzzle cell. */

var Cell = Backbone.Model.extend({

    defaults: {
        row: "",
        column: "",
        border: 0,
        cage: "",
        fixed: false,
        filename: ""
    }
});

var CellCollection = Backbone.Collection.extend({
    model: Cell
});

var CellView = Backbone.View.extend({

    tagName: "div",

    className: "puzzle-cell",

    initialize: function() {

        this.listenTo(this.model, "change:border", this.changeBorder);
        this.listenTo(this.model, "change:fixed", this.changeFixedBackground);
        this.listenTo(this.model, "change:filename", this.filenameChangeActions);
        this.listenTo(cellCollection, "startHighlight", this.startHighlight);
        this.listenTo(cellCollection, "stopHighlight", this.stopHighlightEvent);

        this.render();
    },

    imageTemplate: _.template('<img src="./dist/images/<%= filename %>" class="png" data-filename="<%= filename %>">'),

    events: {
        "mousedown" : "startClickCapture",
        "mouseup" : "stopHighlight"
    },

    render: function() {

        var self = this;

        this.$el.addClass("border-" + this.model.attributes.border);

        $("#puzzle-container").append(this.el);

        this.$el.droppable({
            accept: ".png",
            addClasses: false,
            tolerance: "intersect",
            hoverClass: "droppable-hover",
            drop: function(event, ui) {
                $(this).droppable("disable");
                
                self.model.set({filename: ui.draggable.data("filename").toString()});
            }
        });
    },

    filenameChangeActions: function () {
        this.renderImage();
        this.toggleBuildButton();
    },

    /**
     * "filename" attribute change event. An image has been dropped on this cell so render it.
     */
    renderImage: function() {
        if (this.model.attributes.filename === "") {
            
            this.$el.empty();

            this.$el.droppable("enable");
        } else {
            var image = this.imageTemplate({filename: this.model.attributes.filename});

            this.$el.append(image);
        }
    },

    /**
     * Mousedown event.
     * Add .highlighted class to this cell and trigger the mouseover event on the entire cell collection.
     */
    startClickCapture: function() {

        this.$el.toggleClass("highlighted");

        cellCollection.trigger("startHighlight");
    },

    /**
     * "fixed" attribute change event. Toggle the .fixed class on this cell.
     */
    changeFixedBackground: function() {
        this.$el.toggleClass("fixed");
    },

    /**
     * "border" attribute change event.
     */
    changeBorder: function() {

        var self = this;

        self.$el.removeClass(function(index, className) {
            var cn = className.match(/border\-\d{1,2}/);

            return cn[0];
        });

        self.$el.addClass("border-" + self.model.attributes.border);
    },

    /**
     * "filename" attribute change event.
     * Enables or disables the build button based on whether each puzzle cell has an emoji or not.
     */
    toggleBuildButton: function() {

        var emptyCellCount = cellCollection.where({filename: ""}).length;

        var disabledFlag = $("#build").prop("disabled");

        if (emptyCellCount === 0 && disabledFlag) {

            $("#build").prop("disabled", false);

        }
        else if (!disabledFlag && emptyCellCount > 0) {

            $("#build").prop("disabled", "disabled");

        }
    },

    /**
     * Turn on the mouseover event. Add .highlighted class to puzzle cells on mouseover.
     */
    startHighlight: function() {

        this.$el.on("mouseover", function() {

            $(this).addClass("highlighted");
        });
    },

    /**
     * Trigger the stopHighlightEvent function on the entire cell collection
     *   turning off the mouseover highlighting event.
     */
    stopHighlight: function() {
        cellCollection.trigger("stopHighlight");
    },

    /**
     * Turn off the mouseover event.
     *
     * @returns
     */
    stopHighlightEvent: function() {

        this.$el.off("mouseover");
    }
});
