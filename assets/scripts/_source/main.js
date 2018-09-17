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

// sticky nav

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

  var navWatcher = scrollMonitor.create(navClone);
  navWatcher.stateChange(navListener);
  navListener(null, navWatcher);

  function navListener(event, watcher) {
    if (watcher.isAboveViewport) {
      document.body.classList.add('js-is-sticky');
    } else {
      document.body.classList.remove('js-is-sticky');
    }
  };
};

// monitor scroll on food posts

var initScrollMonitor = function () {
  var items = document.querySelectorAll('[data-monitor]');

  for (i = 0, l = items.length; i < l; i++) {
    var item = items[i];
    var watcher = scrollMonitor.create(item);
    watcher.stateChange(listener);
    listener(null, watcher);
  }

  function listener(event, watcher) {
    if (watcher.isInViewport) {
      setActiveNav(watcher.watchItem.id);
    }
  }

  function setActiveNav(id) {
    console.log(id);
    // links = nav.querySelectorAll('.js-nav-link');
    // for (i = 0, l = links.length; i < l; i++) {
    //   links[i].classList.remove('js-active');
    // }

    // var activeLink = nav.querySelector('[data-target=' + id + ']');
    // activeLink.classList.add('js-active');
  }
};


document.addEventListener('DOMContentLoaded', function () {

  document.body.classList.add('js');
  initLazyLoad();
  initStickyNav();
  initScrollMonitor();
  
});
