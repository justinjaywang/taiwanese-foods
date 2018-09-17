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

  var navClone = nav.cloneNode(true);
  navClone.classList.add('js-nav-ghost');
  var navParent = nav.parentNode;
  navParent.insertBefore(navClone, nav);

  navWatcher = scrollMonitor.create(navClone);
  navWatcher.stateChange(navListener);

  function navListener(event, watcher) {
    if (watcher.isAboveViewport) {
      document.body.classList.add('js-is-sticky');
    } else {
      document.body.classList.remove('js-is-sticky');
    }
  }

  navWatcher.update();

  // clone header links into nav
  var headerLinks = document.querySelectorAll('.header__link');
  for (i = 0, l = headerLinks.length; i < l; i++) {
    var headerLink = headerLinks[i];
    var headerLinkClone = headerLink.cloneNode(true);
    nav.appendChild(headerLinkClone);
  }

  window.addEventListener('resize', function () {
    navWatcher.recalculateLocation();
  });
};

var initScrollMonitor = function () {

  var items = document.querySelectorAll('.js-monitor');

  for (i = 0, l = items.length; i < l; i++) {
    var item = items[i];
    var offset = item.getAttribute('data-offset') ? item.getAttribute('data-offset') : 0;
    var watcher = scrollMonitor.create(item, parseInt(offset));
    watcher.partiallyExitViewport(function () {
      console.log('partially exited!')
    });
    watcher.enterViewport(function () {
      console.log('is in viewport!')
    });
    // watcher.stateChange(listener);
    listener(null, watcher);
  }

  function listener(event, watcher) {
    if (watcher.isInViewport) {
      watcher.watchItem.setAttribute('data-monitor', 'in-view');
    } else if (watcher.isBelowViewport) {
      watcher.watchItem.setAttribute('data-monitor', 'below-view');
    } else if (watcher.isAboveViewport) {
      watcher.watchItem.setAttribute('data-monitor', 'above-view');
    }
  }

};


document.addEventListener('DOMContentLoaded', function () {

  document.body.classList.add('js');
  initLazyLoad();
  initStickyNav();
  initScrollMonitor();
  
});
