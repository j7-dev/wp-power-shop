/* eslint-disable quotes */
/* eslint-disable no-undef */
;(function ($) {
  const BUY_LINK = 'https://www.google.com'
  $(document).ready(function () {
    const createShopNodeSelectors = [
      '.post-type-power-shop .page-title-action',
      ".post-type-power-shop #menu-posts-power-shop a[href*='post_type=power-shop']",
    ]
    const createShopNodeSelectorsString = createShopNodeSelectors.join(', ')
    const dialog = $('#power-shop-dialog')

    init()

    function init() {
      dialog.dialog({
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

      $(createShopNodeSelectorsString).click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        dialog.dialog('open')
      })
    }
  })
})(jQuery)
