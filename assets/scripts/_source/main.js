// lazy load

var initLazyLoad = function () {
  var lazy = new Blazy({
    selector: '.js-lazy',
    successClass: 'js-lazy-loaded',
    success: function(element) {
      setTimeout(function() {
        element.classList.add('js-post-lazy-loaded');
      }, 1);
    },
    errorClass: 'js-lazy-error',
    loadInvisible: true
  });
  lazy.load(
    document.querySelectorAll('.js-manual-lazy') // force load these ones
  );
};

// monitor scroll

var initStickyNav = function () {
  var nav = document.querySelector('.js-nav');
  if (!nav) return;

  // clone nav to make ghost for position calculation
  var navClone = nav.cloneNode(true);
  navClone.classList.remove('js-nav');
  navClone.classList.add('js-nav-ghost');
  var navParent = nav.parentNode;
  navParent.insertBefore(navClone, nav);

  // clone header links into nav
  var headerLinks = document.querySelectorAll('.header__link');
  for (i = 0, l = headerLinks.length; i < l; i++) {
    var headerLink = headerLinks[i];
    var headerLinkClone = headerLink.cloneNode(true);
    nav.appendChild(headerLinkClone);
  }

  // check if should be sticky
  var navTop = navClone.offsetTop;
  window.onscroll = function () {
    checkSticky(navClone, navTop);
  };
  window.onresize = function () {
    navTop = navClone.offsetTop;
    checkSticky(navClone, navTop);
  };
  checkSticky(navClone, navTop);
};

var checkSticky = function (el, top) {
  if (window.pageYOffset >= top) {
    document.body.classList.add('js-is-sticky')
  } else {
    document.body.classList.remove('js-is-sticky');
  }
}

var initScrollMonitor = function () {
  var items = document.querySelectorAll('.js-monitor');

  for (i = 0, l = items.length; i < l; i++) {
    var item = items[i];
    var watcher = scrollMonitor.create(item);
    watcher.partiallyExitViewport(function () {
      console.log('partially exited!');
      console.log(watcher.watchItem);
    });
    watcher.enterViewport(function () {
      console.log('is in viewport!');
      console.log(watcher.watchItem);
    });
    // watcher.stateChange(listener);
    listener(null, watcher);
  }

  // function listener(event, watcher) {
  //   if (watcher.isInViewport) {
  //     watcher.watchItem.setAttribute('data-monitor', 'in-view');
  //   } else if (watcher.isBelowViewport) {
  //     watcher.watchItem.setAttribute('data-monitor', 'below-view');
  //   } else if (watcher.isAboveViewport) {
  //     watcher.watchItem.setAttribute('data-monitor', 'above-view');
  //   }
  // }

};


document.addEventListener('DOMContentLoaded', function () {

  document.body.classList.add('js');
  initLazyLoad();
  initStickyNav();
  initScrollMonitor();
  
});
