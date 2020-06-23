"use strict";
window.onscroll = () => {
  var buttonToTop = document.getElementById("buttonScrollToTop");
  var isScrolled =
    document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
  buttonToTop.style.display = isScrolled ? "block" : "none";
};

document.getElementById("buttonScrollToTop").onclick = () => {
  console.log("scroll btn clicked!");
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox and Opera
};
