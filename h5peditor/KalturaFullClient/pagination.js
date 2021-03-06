$(function() {
    // Number of items and limits the number of items per page
    var numberOfItems = $("#modalContent .play-lists").length;
    var limitPerPage = 2;
    // Total pages rounded upwards
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    // Number of buttons at the top, not counting prev/next,
    // but including the dotted buttons.
    // Must be at least 5:
    var paginationSize = 7;
    var currentPage;
  
    function showPage(whichPage) {
      if (whichPage < 1 || whichPage > totalPages) return false;
      currentPage = whichPage;
      $("#modalContent .play-lists")
        .hide()
        .slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage)
        .show();
      // Replace the navigation items (not prev/next):
      $(".pagination li").slice(1, -1).remove();
      getPageList(totalPages, currentPage, paginationSize).forEach(item => {
        $("<li>")
          .addClass(
            "page-item " +
              (item ? "current-page " : "") +
              (item === currentPage ? "active " : "")
          )
          .append(
            $("<a>")
              .addClass("page-link")
              .attr({
                href: "javascript:void(0)"
              })
              .text(item || "...")
          )
          .insertBefore("#next-page");
      });
      return true;
    }
  
    // Include the prev/next buttons:
    $(".pagination").append(
      $("<li>").addClass("page-item").attr({ id: "previous-page" }).append(
        $("<a>")
          .addClass("page-link")
          .attr({
            href: "javascript:void(0)"
          })
          .text("Prev")
      ),
      $("<li>").addClass("page-item").attr({ id: "next-page" }).append(
        $("<a>")
          .addClass("page-link")
          .attr({
            href: "javascript:void(0)"
          })
          .text("Next")
      )
    );
    // Show the page links
    $("#modalContent").show();
    showPage(1);
  
    // Use event delegation, as these items are recreated later
    $(
      document
    ).on("click", ".pagination li.current-page:not(.active)", function() {
      return showPage(+$(this).text());
    });
    $("#next-page").on("click", function() {
      return showPage(currentPage + 1);
    });
  
    $("#previous-page").on("click", function() {
      return showPage(currentPage - 1);
    });
    $(".pagination").on("click", function() {
      $("html,body").animate({ scrollTop: 0 }, 0);
    });
  });