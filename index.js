
function setStyle(target, props) {
  Object.keys(props).reduce((ret, cur) => {
    target.style[cur] = props[cur]
    return ret
  }, target)
}

Vue._FIXME_UUID = 0

Vue.directive('fixme', {
  inserted(el) {
    el._top = el.getBoundingClientRect().top
    // 当前仅适用于window层的滚动
    // 晃动是因为变量共享？
    el.windowScroll = function (e) {
      const { top, height} = el.getBoundingClientRect()
      const offsetTop = el._top - document.body.scrollTop

      if(offsetTop <= 0 && !el.timeout) {
        el.timeout = setTimeout(() => {
          el._cloned = el.cloneNode(true)
          el.parentNode.insertBefore(el._cloned, el)
          el._cloned.style.opacity = 0
          el._cloned.id = "cloned_" + Vue._FIXME_UUID++
          el.style.top = top + 'px'
          const rect = el._cloned.getBoundingClientRect()
          // 复刻元素当前可能影响样式的所有元素
          setStyle(el, {
            transition: 'top .2s ease-out',
            position: 'fixed',
            width: rect.width + 'px',
            left: rect.left + 'px',
            top: 0,
            opacity: 0.9,
            zIndex: 2000
          })
          el.fixme = true
        }, 100)
      } else if (offsetTop > 0) {
        if(el.timeout) {
          el.parentNode.removeChild(document.getElementById(el._cloned.id))
          setStyle(el, { position: 'initial', transition: '' })
          clearTimeout(el.timeout)
          el.timeout = null
          el._cloned = null
        }        
      }
    }
    window.addEventListener('scroll', el.windowScroll)
  },
  unbind(el) {
    window.removeEventListener('scroll', el.windowScroll)
  }
})
