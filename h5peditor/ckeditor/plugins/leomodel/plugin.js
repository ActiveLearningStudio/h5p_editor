//
// Plugin Model
//
var ico = "",
  dyn = [],
  it = {};

dyn = [];
ico = "";
var alw =
  "p a div span h2 h3 h4 h5 h6 section article iframe object embed strong b i em cite pre blockquote small sub sup code ul ol li dl dt dd table thead tbody th tr td img caption mediawrapper br[*]{*}(*)";
dyn[0] = {
  n: "twocol",
  t: '<div class="row twoCol">'+
        '<div class="grid6 col1">'+
            '<p>Content</p>'+
        '</div>'+
        '<div class="grid6 col2">'+
            '<p>Content</p>'+
        '</div>'+
     '</div>',
  e: { col1: { selector: ".col1" }, col2: { selector: ".col2" } },
  a: alw,
  u: "twoCol",
  l: "Two Column",
};
dyn[1] = {
  n: "threecol",
  t: '<div class="row threeCol">'+
        '<div class="grid4 col1">'+
            '<p>Content</p>'+
        '</div>'+
        '<div class="grid4 col2">'+
            '<p>Content</p>'+
        '</div>'+
        '<div class="grid4 col3">'+
            '<p>Content</p>'+
        '</div>'+
     '</div>',
  e: {
    col1: { selector: ".col1" },
    col2: { selector: ".col2" },
    col3: { selector: ".col3" },
  },
  a: alw,
  u: "threeCol",
  l: "Three Columns",
};
for (v = 0; v < dyn.length; ++v) {
  ico += dyn[v].n + ",";
}
ico = ico.substr(0, ico.length - 1);

CKEDITOR.plugins.add("leomodel", {
  requires: "widget",
  init: function (editor) {
    for (var v = 0; v < dyn.length; ++v)
      (function (v) {
        editor.widgets.add(dyn[v].n, {
          template: dyn[v].t,
          editables: dyn[v].e,
          allowedContent: dyn[v].a,
          requiredContent: "div(leomodel)",
          upcast: function (element) {
            return element.name == "div" && element.hasClass(dyn[v].u);
          },
        });
      })(v);
    editor.addMenuGroup("leomodel");
    for (v = 0; v < dyn.length; ++v) {
      it[dyn[v].n] = {
        label: dyn[v].l,
        group: "leomodel",
        command: dyn[v].n,
        icon: this.path + "icons/" + dyn[v].n + ".png",
      };
    }
    editor.addMenuItems(it);
    editor.ui.add("leomodel", CKEDITOR.UI_MENUBUTTON, {
      label: "Model",
      modes: { wysiwyg: 1 },
      icon: this.path + "icons/leomodel.png",
      onMenu: function () {
        var a = {},
          v;
        for (v in it) a[v] = CKEDITOR.TRISTATE_OFF;
        return a;
      },
    });
    if (typeof editor.config.contentsCss == "object")
      editor.config.contentsCss.push(
        CKEDITOR.getUrl(this.path + "leomodel.css")
      );
    else
      editor.config.contentsCss = [
        editor.config.contentsCss,
        CKEDITOR.getUrl(this.path + "leomodel.css"),
      ];
  },
});
