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

  var firstPost = document.querySelectorAll('[data-monitor]')[0];

  var firstPostwatcher = scrollMonitor.create(firstPost, 200);
  firstPostwatcher.stateChange(firstPostListener);
  firstPostListener(null, firstPostwatcher);

  function firstPostListener(event, watcher) {
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
  if (!items) return;

  var watchers = [];
  for (i = 0, l = items.length; i < l; i++) {
    var item = items[i];
    var watcher = scrollMonitor.create(item, 200);
    watchers[i] = watcher;
    watcher.stateChange(listener);
  }
  for (i = 0, l = watchers.length; i < l; i++) {
    listener(null, watchers[i]);
  }

  function listener(event, watcher) {
    if (watcher.isFullyInViewport) {
      setActiveNav(watcher.watchItem.id);
      updateUrl(watcher.watchItem.id);
    }
  }
};

function setActiveNav(id) {
  var nav = document.querySelector('.js-nav');
  var navLinks = nav.querySelectorAll('.js-nav-link');
  for (i = 0, l = navLinks.length; i < l; i++) {
    navLinks[i].classList.remove('js-active');
  }

  if (id == 'home') return; // homepage
  var activeLink = nav.querySelector("[href='#" + id + "']");
  activeLink.classList.add('js-active');
}

// smooth scroll for home link and nav links

var initSmoothScroll = function () {
  var home = document.querySelector('.js-home');
  var navLinks = document.querySelectorAll('.js-nav-link');
  if (!home || !navLinks) return;

  home.addEventListener('click', function (e) {
    e.preventDefault();
    scrollTo(
      document.body,
      500,
      'easeInOutQuart',
      function () {
        updateUrl(null);
      }
    );
  });

  for (i = 0, l = navLinks.length; i < l; i++) {
    navLinks[i].addEventListener('click', function (e) {
      e.preventDefault();
      var href = this.getAttribute('href');
      var id = href.replace('#', '');
      scrollTo(
        document.querySelector('#' + id),
        500,
        'easeInOutQuart',
        function () {
          setActiveNav(id);
          updateUrl(id);
        }
      );
    });
  }

};

function scrollTo (destination, duration = 200, easing = 'linear', callback) {
  const easings = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart(t) {
      return 1 - (--t) * t * t * t;
    },
    easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint(t) {
      return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
  };
  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
  const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
  const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

  if ('requestAnimationFrame' in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll () {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = easings[easing](time);
    window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }
    requestAnimationFrame(scroll);
  }
  scroll();
}

// url rewriting

function updateUrl(url) {
  if (url && url != 'home') {
    window.history.replaceState(null, null, '/#' + url);
  } else { // homepage
    window.history.replaceState(null, null, '/');
  }
}

document.addEventListener('DOMContentLoaded', function () {

  initLazyLoad();
  initStickyNav();
  initScrollMonitor();
  initSmoothScroll();

  
});
