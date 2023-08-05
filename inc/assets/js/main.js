/* eslint-disable quotes */
/* eslint-disable no-undef */
;(function ($) {
  const BUY_LINK = 'https://www.google.com'
  $(document).ready(function () {
    const selectors = [
      '.post-type-power-shop .page-title-action',
      ".post-type-power-shop #menu-posts-power-shop a[href*='post_type=power-shop']",
    ]

    const selectorString = selectors.join(', ')
    init()

    function init() {
      $('#power-shop-dialog').dialog({
        modal: true,
        autoOpen: false,
        draggable: false,
        hide: 300,
        show: 300,
        buttons: [
          {
            text: '前往購買',
            icon: 'ui-icon-heart',
            click() {
              window.open(BUY_LINK, '_blank')
            },
          },
        ],
      })

      // add event listener to the selector

      $(selectorString).click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        $('#power-shop-dialog').dialog('open')
      })
    }
  })
})(jQuery)
