var ImagePicker = Backbone.Model.extend({
    defaults: {
        newFilename: "",
        filenames: [],
        index: 1
    }
});

var ImagePickerView = Backbone.View.extend({

    id: "image-picker-container",

    initialize: function() {
        this.listenTo(this.model, "change:newFilename", this.addImage);

        this.render();
    },

    pieceTemplate: _.template(
        '<div class="png-container' +
        '<% if (highlight) print(" current") %>"' +
        'data-index="<%= index %>">' +
        '<% if (filename) { %>' +
        '<img src="./dist/images/<%= filename %>" class="png" data-filename="<%= filename %>" />' +
        '<% } else { %>' +
        '<%= index %>' +
        '<% } %>' +
        '</div>'
    ),

    imageTemplate: _.template( '<img src="./dist/images/<%= filename %>" class="png" data-filename="<%= filename %>" />' ),

    render: function() {

        for (var x = 1; x <= 5; x++) {
            var filename = this.model.attributes.filenames[x - 1];

            if (typeof filename === 'undefined') {
                filename = null;
            }
          
            this.$el.append(this.pieceTemplate({
                index: x,
                highlight: x === this.model.attributes.index,
                filename: filename
            }));
        }

        $("#controls").append(this.el);
    },

    addImage: function(el) {

        var currentFilenames = this.model.get("filenames");

        var newFilenames = _.clone(currentFilenames);
        newFilenames.push(el.attributes.newFilename);
        
        var newImage = this.imageTemplate({filename: el.attributes.newFilename});
        
        $('.png-container.current').removeClass('current');
        
        $('div[data-index="' + this.model.attributes.index + '"]').empty().append(newImage);

        $('div[data-index="' + (this.model.attributes.index + 1 ) + '"]').addClass('current');
        
        this.model.set({
            filenames: newFilenames,
            index: this.model.attributes.index + 1
        });

        this.checkImageCount();
    },

    /**
     * Check if all five images for the puzzle have been chosen.
     * If so make them draggable.
     */
    checkImageCount: function() {

        var images = this.model.get("filenames");

        if (images.length === 5) {

            $("#edit-container div").remove();

            // add draggable to emoji piece
            $(".png").draggable({
                addClasses: false,
                revert: "invalid",
                helper: "clone"
            });
        }
    }
});
