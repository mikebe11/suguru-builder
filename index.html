<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Suguru with images</title>
    <link rel="stylesheet" href="./dist/builder.min.css">
    <script src="./dist/vendor-bundle.min.js"></script>
</head>
<body>
    <div id="modal">
        <div id="directions">
            <div id="modal-close"><div>X</div></div>
            <h3>images</h3>
            <div>The image picker expects all five puzzle images to be in the project's <i>dist/images</i> folder. Place puzzle images in the folder before choosing pieces in the picker section. At this time only local images work in the puzzles.</div>
            <h3>start</h3>
            <div>Choose the puzzle dimensions, cells wide by cells high. Then the ability to pick the five images pieces will be enabled. Once all five images are chosen you can drag and drop pieces on puzzle squares.
            </div>
            <h3>cages</h3>
            <div>To build cages highlight all squares in a cage and click the <b>SET BORDER</b> button. Single cell cages also need a border set on them.</div>
            <h3>highlighting</h3>
            <div>Highlighted cells can have certains actions performed on them. To toggle highlighting on a cell just click on it. If you click and hold the mouse button down you enter a mode where you can move the cursor over additional cells to highlight more. Releasing the mouse button exits this mode. Press the <b>DESELECT</b> button to remove highlighting on all selected cells.</div>
            <h3>deleting images</h3>
            <div>To delete an image that has been placed on the puzzle select that cell and press the <b>DELETE IMAGE</b> button.</div>
            <h3>fixed</h3>
            <div>To choose the image that will be initially shown ("fixed") highlight the applicable cells and click the <b>TOGGLE FIXED</b> button.</div>
            <h3>building</h3>
            <div>Once the puzzle has been filled with images the build button will be enabled. If the puzzle is a valid suguru puzzle the puzzle's JSON data will be compiled and displayed in the header.</div>
        </div>
    </div>

    <header>
        <div id="controls">
            <div id="dimensions-container"></div>
        </div>
        <div id="result"></div>
    </header>

    <main>
        <div id="puzzle-container"></div>
    </main>

    <script type="text/template" id="button-section">
        <button type="button" class="action-button hide" id="deselect" disabled="disabled">DESELECT</button><button type="button" class="action-button hide" id="fixed-toggle" disabled="disabled">TOGGLE FIXED</button><button type="button" class="action-button hide" id="set-border" disabled="disabled">SET BORDER</button><button type="button" class="action-button hide" id="delete" disabled="disabled">DELETE IMAGE</button><button type="button" id="build" class="hide" disabled="disabled">BUILD</button><button type="button" id="instructions">INSTRUCTIONS</button><div class="hide"><input type="file" class="image-chooser" accept="image/*" /></div>
    </script>

    <script src="./dist/builder.min.js"></script>

    <script>

        var cellCollection = new CellCollection();
        var dimensions = new Dimensions();
        var picker = new ImagePicker();
        
        new Buttons();

        new DimensionsView({model: dimensions});

        new ImagePickerView({model: picker});

        // in case a selection ghost is created during highlighting multiple cells
        // this will turn off the puzzle cell mouseover event
        $("#puzzle-container").mouseleave(function() {
            cellCollection.trigger("stopHighlight");
        });

        // an image has been selected
        $('input[type="file"]').on("change", function(event) {

            var filePath = event.target.value.split("\\");
            var filename = filePath[filePath.length - 1];

            picker.set({newFilename: filename});
        });

        function closeModal() {
            $("body").attr("style", null);
            $("#modal").removeClass("show");
        }

        $("#modal").on("click", function(e) {
            if (e.target.id === "modal") {
                closeModal();
            }
        });

        $("#modal-close div").on("click", closeModal);

    </script>
</body>
</html>