Vue._FIXME_UUID = 0

function setStyle(target, props) {
  Object.keys(props).reduce((ret, cur) => {
    target.style[cur] = props[cur]
    return ret
  }, target)
}

Vue.directive('fixme', {
  inserted(el) {
    window.onscroll = windowScroll
    el._top = el.getBoundingClientRect().top
    // 当前仅适用于window层的滚动
    function windowScroll (e) {
      const { top, height} = el.getBoundingClientRect()
      const child = el.children[0]
      if(!child) return
      const offsetTop = el._top - document.body.scrollTop
      if(offsetTop <= 0 && !el.fixme) {
        el._cloned = el.cloneNode(true)
        el._cloned.style.opacity = 0
        el._cloned.id = "cloned_" + Vue._FIXME_UUID++
        el.parentNode.appendChild(el._cloned)
        el.fixme = true
        const rect = child.getBoundingClientRect()
        el.style.height = rect.height + 'px'
        // 复刻元素当前可能影响样式的所有元素
        setStyle(el, {
          position: 'fixed',
          width: rect.width + 'px',
          left: rect.left + 'px',
          top: 0,
          opacity: 0.9
        })
      } else if (offsetTop > 0) {
        if(el._cloned) {
          el.parentNode.removeChild(document.getElementById(el._cloned.id))
          el._cloned = null
        }
        setStyle(el, { position: 'initial' })

        el.fixme = false
      }
    }
  }
})
