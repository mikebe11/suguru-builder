var Dimensions = Backbone.Model.extend({
    defaults: {
        width: 5,
        height: 5
    }
});

var DimensionsView = Backbone.View.extend({

    el: "#dimensions-container",

    initialize: function() {
        this.render();
    },

    events: {
        "click #set-dimensions": "buildPuzzleContainer"
    },

    template: (
        '<label for="width">width: </label><input type="number" min="5" id="width" value="5">' +
        '<label for="height">height: </label><input type="number" min="5" id="height" value="5">' +
        '<button type="button" id="set-dimensions">GO</button>'
    ),

    render: function() {
        this.$el.html(this.template);
    },

    /**
     * Resize the puzzle box and insert the correct amount of cells.
     */
    buildPuzzleContainer: function() {

        var width = parseInt($("#width").val(), 10),
            height = parseInt($("#height").val(), 10),
            cellModel = null,
            id = "",
            a = 0,
            b = "";

        if (width >= 0 && height >= 0) {

            this.model.set({
                width: width,
                height: height
            });

            $("#puzzle-container").css({
                width: width * 90,
                height: height * 90,
                "grid-template-columns": "repeat(" + width + ", 90px)",
                "grid-template-rows": "repeat(" +  height + ", 90px)"
            });

            $("#image-picker-container").css("display", "flex");

            $("#edit-container .hide").removeClass("hide");

            for (a; a < height; a++) {
                for (b = 0; b < width; b++) {
                    id = a + "-" + b;
                    cellModel = new Cell({id: id, y: a, x: b});
                    cellCollection.add(cellModel);
                    new CellView({id: id, model: cellModel});
                }
            }

            // not really necessary but I chose to remove this view from the DOM anyway
            this.remove();
        }
    }
});
