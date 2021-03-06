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
  var firstPostwatcher = scrollMonitor.create(firstPost, 240);
  firstPostwatcher.stateChange(firstPostListener);
  firstPostListener(null, firstPostwatcher);

  function firstPostListener(event, watcher) {
    if (watcher.isAboveViewport) {
      document.body.classList.add('js-is-sticky');
    } else {
      document.body.classList.remove('js-is-sticky');
      removeActivePost();
      updateUrl(null);
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
    var watcher = scrollMonitor.create(item, 112);
    watchers[i] = watcher;
    watcher.stateChange(listener);
  }
  for (i = 0, l = watchers.length; i < l; i++) {
    listener(null, watchers[i]);
  }

  function listener(event, watcher) {
    if (watcher.isFullyInViewport) {
      setActivePost(watcher.watchItem.id);
      updateUrl(watcher.watchItem.id);
    }
  }
};

function setActivePost(id) {
  removeActivePost();
  var activeLink = document.querySelector(".food-nav__link[href='#" + id + "']");
  var activePost = document.querySelector(".food-post[id='" + id + "']");
  activeLink.classList.add('js-active');
  activePost.classList.add('js-active');
  setTimeout(function() {
    activeLink.classList.remove('js-active');
  }, 750);
}

function removeActivePost() {
  var nav = document.querySelector('.js-nav');
  var navLinks = nav.querySelectorAll('.js-nav-link');
  var i, l;
  for (i = 0, l = navLinks.length; i < l; i++) {
    navLinks[i].classList.remove('js-active');
  }
  var posts = document.querySelectorAll('.food-post');
  var j, k;
  for (j = 0, k = posts.length; j < k; j++) {
    posts[j].classList.remove('js-active');
  }
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
      var id = href.substr(1);
      scrollTo(
        document.querySelector('#' + id),
        500,
        'easeInOutQuart',
        function () {
          setActivePost(id);
          updateUrl(id);
        }
      );
    });
  }

};

function scrollTo (destination, duration, easing, callback) {
  const easings = {
    linear: function (t) {
      return t;
    },
    easeInQuad: function (t) {
      return t * t;
    },
    easeOutQuad: function (t) {
      return t * (2 - t);
    },
    easeInOutQuad: function (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic: function (t) {
      return t * t * t;
    },
    easeOutCubic: function (t) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic: function (t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart: function (t) {
      return t * t * t * t;
    },
    easeOutQuart: function (t) {
      return 1 - (--t) * t * t * t;
    },
    easeInOutQuart: function (t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    easeInQuint: function (t) {
      return t * t * t * t * t;
    },
    easeOutQuint: function (t) {
      return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint: function (t) {
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
  if (url) {
    window.history.replaceState(null, null, window.location.pathname + '#' + url);
  } else { // homepage
    window.history.replaceState(null, null, window.location.pathname);
  }
}

document.addEventListener('DOMContentLoaded', function () {

  initLazyLoad();
  initScrollMonitor();
  initSmoothScroll();
  setTimeout(function() {
    initStickyNav();
  }, 0);
  
});
