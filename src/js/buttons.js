var Buttons = Backbone.View.extend({

    id: "edit-container",

    initialize: function() {

        this.listenToOnce(cellCollection, "add", this.enableButtons);

        this.render();
    },

    events: {
        "click #deselect": "deselect",
        "click #set-border": "borderButtonClickHandler",
        "click #fixed-toggle": "toggleFixed",
        "click #delete": "deleteImage",
        "click #build": "buildPuzzle",
        "click #instructions": "toggleModal",
        "change input": "test"
    },

    template: _.template($("#button-section").html()),

    render: function() {

        this.$el.html(this.template);

        $("#dimensions-container").after(this.el);
    },

    toggleModal: function() {
        $("body").css("overflow-y", "hidden");
        $("#modal").addClass('show');
    },

    /**
     * Removes the .highlighted class on all cells.
     */
    deselect: function() {
        $(".highlighted").removeClass("highlighted");
    },

    enableButtons: function() {
        $(".action-button").prop({disabled: false});
    },

    /**
     * Takes the group of selected cells and creates the cage border around them then deselects them.
     */
    borderButtonClickHandler: function() {

        if ($(".highlighted").length > 0) {

            var cells = [];

            // put all highlighted cell ids into an array for neighbor referencing
            $(".highlighted").each(function() {
                cells.push($(this).attr("id"));
            });

            cells.forEach(this.setBorder);

            this.deselect();
        }
    },

    /**
     * Sets the border on a specific cell.
     * Looks for adjacent cells in the "cells" parameter to determine the needed borders.
     *
     * @param {string} id
     * @param {number} index
     * @param {Array.<string>} cells
     */
    setBorder: function(id, index, cells) {

        var tempString,
            border = 0,
            coordinates = id.split("-"),
            y = parseInt(coordinates[0], 10),
            x = parseInt(coordinates[1], 10),
            cell = cellCollection.findWhere({id: id});

        // upper
        tempString = (y - 1) + "-" + x;

        if (cells.indexOf(tempString) === -1) {
            border += 2;
        }

        // right side
        tempString = y + "-" + (x + 1);

        if (cells.indexOf(tempString) === -1) {
            border += 4;
        }

        // bottom
        tempString = (y + 1) + "-" + x;

        if (cells.indexOf(tempString) === -1) {
            border += 8;
        }

        // left side
        tempString = y + "-" + (x - 1);

        if (cells.indexOf(tempString) === -1) {
            border += 1;
        }

        cell.set({border: border});
    },

    /**
     * Toggles the .fixed class on all .highlighted cells.
     */
    toggleFixed: function() {

        $(".puzzle-cell.highlighted").each(function() {

            var id = $(this).attr("id"),
                cell = cellCollection.findWhere({id: id}),
                currentFixed = cell.get("fixed");

            cell.set({fixed: !currentFixed});
        });

        this.deselect();
    },

    /**
     * Deletes the image and clears the filename value for the highlighted cell.
     * Only works when one cell is highlighted.
     */
    deleteImage: function() {

        $(".puzzle-cell.highlighted").each(function() {

            var id = $(this).attr("id");

            cellCollection.findWhere({id: id}).set({filename: ""});

            $(this).removeClass("highlighted");
        });
    },

    /**
     * Build the puzzle JSON.
     */
    buildPuzzle: function() {
        
        var solution = { s: [] },
            tempMatrixArray = [],
            tempSolutionArray = [],
            cageValue = 1,
            count = 1,
            width = dimensions.get("width"),
            height = dimensions.get("height"),
            puzzle = {
                u: null,
                p: [],
                s: []
            },
            text = "INCORRECT SOLUTION";

        // reset cage values
        // this is done in case the build button is pressed more than once
        cellCollection.each(function(model) {
            model.set({cage: ""});
        });

        // add cage value to each cell
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {

                if (this.cage(x, y, 0, cageValue, width, height)) {
                    cageValue++;
                }
            }
        }

        // add filenames to puzzle data
        var filenames = picker.get("filenames");

        puzzle.u = _.clone(filenames);

        if (this.checkResults(width, height, puzzle.u, cellCollection)) {
            
            // compile puzzle json
            cellCollection.each(function(model) {

                var filename = model.get("filename"),
                    fixed = model.get("fixed"),
                    border = model.get("border"),
                    cage = model.get("cage"),
                    filenameIndex = null;

                // if fixed get index in array
                if (fixed) {
                    filenameIndex = puzzle.u.indexOf(filename);
                }

                tempMatrixArray.push([
                    border,
                    filenameIndex,
                    cage,
                    fixed ? 1 : 0
                ]);

                tempSolutionArray.push(puzzle.u.indexOf(filename));

                if (count === width) {

                    // it's the end of a puzzle row and time to write the temp arrays to the matrix
                    puzzle.p.push(tempMatrixArray.slice());
                    tempMatrixArray = [];

                    puzzle.s.push(tempSolutionArray.slice());
                    tempSolutionArray = [];

                    count = 1;
                }
                else {
                    count++;
                }
            });

            text = JSON.stringify(puzzle);
        }

        $("#result").empty()
            .text(text)
            .css("display", "block");

        $("main").css("padding-top", $("header")[0].clientHeight);
    },

    /**
     * Function to set the model cage value of a set of puzzle cells.
     * It recursively traverses the cells moving up/down, side to side,
     *   depending on whether there's a border to block.
     *
     * @param {number} x - x-coordinate
     * @param {number} y - y-coordinate
     * @param {number} borderAdder - Value to add to the border so the function doesn't
     *                             call this function on the originating cell.
     * @param {number} cageValue Value of the cage to pass along the recursion path.
     * @param {number} width - Puzzle width.
     * @param {number} height - Puzzle height.
     * @returns {boolean}
     */
    cage: function(x, y, borderAdder, cageValue, width, height) {

        // check for out of bounds values
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return false;
        }

        var model = cellCollection.findWhere({x: x, y: y}),
            border = model.get("border"),
            modelCageValue = model.get("cage");

        // check if the cage value has already been set
        if (modelCageValue !== "") {
            return false;
        } else {

            model.set({cage: cageValue});

            // prevent an infinite loop by adding the border touching the cell we came from
            border += borderAdder;

            // create arrays of [x-coordinate, y-coordinate, borderAdder]
            var top = [x, y - 1, 8];
            var right = [x + 1, y, 1];
            var bottom = [x, y + 1, 2];
            var left = [x - 1, y, 4];

            switch (border) {
                case 0:
                    this.cage(top[0], top[1], top[2], cageValue, width, height);
                    this.cage(right[0], right[1], right[2], cageValue, width, height);
                    this.cage(bottom[0], bottom[1], bottom[2], cageValue, width, height);
                    this.cage(left[0], left[1], left[2], cageValue, width, height);
                    break;
                case 1:
                    this.cage(top[0], top[1], top[2], cageValue, width, height);
                    this.cage(right[0], right[1], right[2], cageValue, width, height);
                    this.cage(bottom[0], bottom[1], bottom[2], cageValue, width, height);
                    break;
                case 2:
                    this.cage(right[0], right[1], right[2], cageValue, width, height);
                    this.cage(bottom[0], bottom[1], bottom[2], cageValue, width, height);
                    this.cage(left[0], left[1], left[2], cageValue, width, height);
                    break;
                case 3:
                    this.cage(right[0], right[1], right[2], cageValue, width, height);
                    this.cage(bottom[0], bottom[1], bottom[2], cageValue, width, height);
                    break;
                case 4:
                    this.cage(top[0], top[1], top[2], cageValue, width, height);
                    this.cage(bottom[0], bottom[1], bottom[2], cageValue, width, height);
                    this.cage(left[0], left[1], left[2], cageValue, width, height);
                    break;
                case 5:
                    this.cage(top[0], top[1], top[2], cageValue, width, height);
                    this.cage(bottom[0], bottom[1], bottom[2], cageValue, width, height);
                    break;
                case 6:
                    this.cage(bottom[0], bottom[1], bottom[2], cageValue, width, height);
                    this.cage(left[0], left[1], left[2], cageValue, width, height);
                    break;
                case 7:
                    this.cage(bottom[0], bottom[1], bottom[2], cageValue, width, height);
                    break;
                case 8:
                    this.cage(top[0], top[1], top[2], cageValue, width, height);
                    this.cage(right[0], right[1], right[2], cageValue, width, height);
                    this.cage(left[0], left[1], left[2], cageValue, width, height);
                    break;
                case 9:
                    this.cage(top[0], top[1], top[2], cageValue, width, height);
                    this.cage(right[0], right[1], right[2], cageValue, width, height);
                    break;
                case 10:
                    this.cage(right[0], right[1], right[2], cageValue, width, height);
                    this.cage(left[0], left[1], left[2], cageValue, width, height);
                    break;
                case 11:
                    this.cage(right[0], right[1], right[2], cageValue, width, height);
                    break;
                case 12:
                    this.cage(top[0], top[1], top[2], cageValue, width, height);
                    this.cage(left[0], left[1], left[2], cageValue, width, height);
                    break;
                case 13:
                    this.cage(top[0], top[1], top[2], cageValue, width, height);
                    break;
                case 14:
                    this.cage(left[0], left[1], left[2], cageValue, width, height);
                    break;
                default:
                    break;
            }

            return true;
        }
    },

    /**
     * Function to check the puzzle solution. Before creating and displaying the puzzle JSON
     * we want to be sure that it's a valid puzzle. If return is true then JSON is created.
     *
     * @param {number} width Puzzle width.
     * @param {number} height Puzzle height.
     * @param {Array.<string>} u Array of puzzle piece filenames.
     * @param {Object} cellCollection Collection of cell models.
     * @returns {boolean}
     */
    checkResults: function(width, height, u, cellCollection) {

        var cellArray = [],
            cageArray = [],
            y = 0,
            solved = true;

        // populate the cellArray with the index of each cell's image filename
        // populate the cageArray with all cages and their values
        cellCollection.each(function(model) {

            var x = model.get("x");
            var y = model.get("y");
            var filenameIndex = u.indexOf(model.get("filename"));
            var cage = model.get("cage");

            if (typeof cellArray[y] === "undefined") {
                cellArray[y] = [];
            }

            cellArray[y][x] = filenameIndex;

            if (typeof cageArray[cage] === "undefined") {
                cageArray[cage] = [];
            }

            cageArray[cage].push(filenameIndex);
        });


        cageArray.forEach(function(array, index, cageArray) {

            // sort array of cage values
            if (array.length > 1) {
                array.sort(function(a, b) {
                    return a - b;
                });
            }

            // here we check the cage array to see if it is valid
            // a cage must contain numbers 1 through 'cage length' and not have any gaps or duplicates
            for (var x = 0; x < array.length; x++) {
                if (array[x] !== x) {

                    console.error("cage error");

                    solved = false;

                    break;
                }
            }
        });


        if (solved) {
            // all cages are valid so check the current puzzle solution

            checkSolution:
                for (y = 0; y < height; y++) {
                    for (var x = 0; x < width; x++) {
                        if (this.cellCheck(x, y, cellArray[y][x], cellArray, width, height) !== -1) {

                            console.error("puzzle error");

                            solved = false;

                            break checkSolution;
                        }
                    }
                }
        }

        return solved;
    },

    /**
     * Run a check on a particular puzzle cell. Get the cell's unicode value and look at all adjacent
     * cells to see if they contain a matching unicode value. We populate a result array with bool values
     * indicating the existence of a matching unicode value and return the index of the first true value
     * in that array. Return value of -1 means the cell's value is valid.
     *
     * @param {number} x - Puzzle cell's x coordinate.
     * @param {number} y - Puzzle cell's y coordinate.
     * @param {string} unicode - Unicode value the cell contains.
     * @param {Array.<number>} cellArray - Multidimensional array of all puzzle cells containing the index
     *   of the unicode value it contains. The index is from the array of puzzle unicode characters.
     * @param {number} width - Puzzle width
     * @param {number} height - Puzzle height
     * @returns {number} Index of a true value (unicode match with an adjacent cell) in the result array or -1.
     */
    cellCheck: function(x, y, unicode, cellArray, width, height) {

        // Values indicating the existence of a matching unicode value in an adjacent cell.
        var results = [];

        // check upper row
        if ((y - 1) >= 0) {

            results.push(unicode == cellArray[y - 1][x]);

            if ((x + 1) < width) {
                results.push(unicode == cellArray[y - 1][x + 1]);
            }

            if ((x - 1) >= 0) {
                results.push(unicode == cellArray[y - 1][x - 1]);
            }
        }

        // check lower row
        if ((y + 1) < height) {

            results.push(unicode == cellArray[y + 1][x]);

            if ((x + 1) < width) {
                results.push(unicode == cellArray[y + 1][x + 1]);
            }

            if ((x - 1) >= 0) {
                results.push(unicode == cellArray[y + 1][x - 1]);
            }
        }

        // check right
        if ((x + 1) < width) {
            results.push(unicode == cellArray[y][x + 1]);
        }

        // check left
        if ((x - 1) >= 0) {
            results.push(unicode == cellArray[y][x - 1]);
        }

        return results.indexOf(true);
    }
});
