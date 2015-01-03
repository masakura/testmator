(function () {
  'use strict';

  var PageObject = testmator.PageObject;
  var automator = testmator.automator;

  describe('automator', function () {
    var ChildPage;
    var rootPage;

    beforeEach(function () {
      var childEl = $('<div>')
            .append($('<button id="toParent">'));
      ChildPage = PageObject.extend({
        name: 'child',
        clickToParent: function () {
          this.click('#toParent');
          return this.switchParent();
        }
      });

      var rootEl = $('<div>')
            .append($('<button id="button1">'))
            .append($('<ul><li id="li1"></ul>'));
      var RootPage = PageObject.extend({
        name: 'root',
        clickButton1: function () {
          this.click('#button1');
          return new ChildPage({el: childEl, parent: this});
        },
        clickLi1: function () {
          this.click('#li1');
        }
      });
      rootPage = new RootPage({el: rootEl});
    });

    describe('Full test', function (done) {
      it('simple', function () {
        automator(rootPage)
          .test(function (root) {
            expect(root.name).toEqual('root');
          })
          .action(function (root) {
            return root.clickLi1();
          })
          .test(function (root) {
            expect(root.name).toEqual('root');
          })
          .done(done);
      });

      it('open and close', function (done) {
        automator(rootPage)
          .action(function (root) {
            return root.clickButton1();
          })
          .test(function (child) {
            expect(child.name).toEqual('child');
          })
          .action(function (child) {
            return child.clickToParent();
          })
          .test(function (root) {
            expect(root.name).toEqual('root');
          })
          .done(done);
      });

      it('open and close with $.Deferred()', function (done) {
        automator(rootPage)
          .action(function (root) {
            return $.Deferred().resolve(root.clickButton1()).promise();
          })
          .test(function (child) {
            expect(child.name).toEqual('child');
          })
          .action(function (child) {
            return $.Deferred().resolve(child.clickToParent()).promise();
          })
          .test(function (root) {
            expect(root.name).toEqual('root');
          })
          .done(done);
      });

      it('open and close with scope', function (done) {
        automator(rootPage)
          .action(function (root) {
            return root.clickButton1();
          })
          .test(function (child) {
            expect(child.name).toEqual('child');
          })
          .scope(function (child) {
            return automator(child)
              .action(function (child) {
                return child.clickToParent();
              })
              .test(function (root) {
                expect(root.name).toEqual('root');
              });
          })
          .test(function (root) {
            expect(root.name).toEqual('root');
          })
          .done(done);
      });
    });
  });
})();
