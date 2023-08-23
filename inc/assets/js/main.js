/* eslint-disable quotes */
/* eslint-disable no-undef */
;(function ($) {
  const BUY_LINK = powerShopData?.buyLink || '/'
  const SUPPORT_EMAIL = powerShopData?.supportEmail || 'cloud@luke.cafe'
  const LICENSE_LINK = powerShopData?.licenseLink || '/'

  $(document).ready(function () {
    const createShopNodeSelectors = [
      '.post-type-power-shop .page-title-action',
      "#menu-posts-power-shop a[href^='post-new.php?post_type=power-shop']",
      '#wp-admin-bar-new-power-shop a',
    ]
    const createShopNodeSelectorsString = createShopNodeSelectors.join(', ')

    init()

    function init() {
      // add event listener to the selector

      $(createShopNodeSelectorsString).click(function (e) {
        e.preventDefault()
        e.stopPropagation()

        const content = `<p>請輸入授權碼以開通進階功能，購買授權請到 <a target="_blank" href="${BUY_LINK}">站長路可網站</a> 購買
				有任何客服問題，請私訊站長路可網站右下方對話框，或是來信 <a target="_blank" href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> </p>`

        $.confirm({
          title: '前往購買授權',
          content,
          type: 'blue',
          closeIcon: true,
          buttons: {
            cancel: {
              text: '忍痛拒絕',
              btnClass: 'btn-default',
            },
            input: {
              text: '輸入授權碼',
              btnClass: 'btn-default',
              action() {
                window.open(LICENSE_LINK, '_blank')
              },
            },
            buy: {
              text: '前往購買',
              btnClass: 'btn-blue',
              action() {
                window.open(BUY_LINK, '_blank')
              },
            },
          },
        })
      })
    }
  })
})(jQuery)
