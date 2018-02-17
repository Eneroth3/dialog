function Controls( options ) {
  // REVIEW: Should underline be shown since init or only when holding down alt?

  /*
   * Test if element is a controller supported by this lib.
   */
  function isControl(c) {
    // Test on textarea, number input, date input, slider input, checkbox input, radio input.
    return $.inArray( c.tagName, [ 'BUTTON', 'INPUT', 'TEXTAREA', 'A' ] ) !== -1;
  }

  /*
   * Get the node being the label of a control
   * (the node which innerHTML the access key should be underlined in).
   */
  function labelNode(c) {
    c = $(c)
    var label = $("label[for='"+c.attr('id')+"']");
    if (label.length == 0) label = c.closest('label');

    return (label.length == 0) ? c.context : label[0];
  }

  /*
   * Activate a control.
   * Simulate click on buttons and links, focus text inputs.
   */
  function activateControl(c) {
    // Test if this can trigger both events defined by onclick attribute,
    // "normal" events (whatever those are called), and event set by this
    // lib (sketchup.{classname - 'button'}).
    // Should set focus to text inputs.
    switch(c.tagName) {
      case 'BUTTON':
      case 'A':
        c.click();
      case 'INPUT':
      case 'TEXTAREA':
        c.focus();
    }
  }

  function initAccessKey(c, accessKey) {
    var ln = labelNode(c);
    var regExp = RegExp(accessKey, 'i');
    // FIXME: This breaks checkboxes completely and makes them become text
    // inputs. It appears this is due to the <u> tag being added inside the
    // input tag.
    ln.innerHTML = ln.innerHTML.replace(regExp , '<u>$&</u>');

    // FIXME: access key doesn't work for inputs inside of labels.
    // This is probably an effect of changing innerHTML.
    $(document).keydown( { accessKey: accessKey, c: c } , function(e) {
      if (!e.altKey) return;
      if (e.key != e.data.accessKey) return;
      activateControl(e.data.c);
      e.preventDefault();
    });
  }

  function initControl(c, options) {
    // If click event isn't already defined, and button has a class
    // prefixed with 'button-' (e.g. 'button-ok'),
    // call Sketchup.<className excluding button> (e.g. sketchup.ok').
    if (c.tagName == 'BUTTON'){
      c.onclick = function() {alert(this.innerHTML);};
    }

    if (options.accessKeys) {
      var accessKey = c.getAttribute('data-access-key');
      if (accessKey) initAccessKey(c, accessKey);
    }
  }

  function initControls(options) {
    // elements needs to be array, not htmlColelction, as we are adding elements
    // from within a loop over it.
    var elements = Array.from(document.getElementsByTagName("*"));
    for (var i=0, max=elements.length; i < max; i++) {
      c = elements[i];
      if (!isControl(c)) continue;
      initControl(c, options);
    }
  }

  initControls(options);

}
