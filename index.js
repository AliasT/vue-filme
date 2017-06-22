Vue.directive('fixme', {
  inserted(el) {
    window.onscroll = windowScroll
    // 当前仅适用于window层的滚动
    function windowScroll (e) {
      const { top } = el.getBoundingClientRect()
      const child = el.children[0]
      if(!child) return
      if(top <= 0 && !el.fixme) {
        const rect = child.getBoundingClientRect()
        el.style.height = rect.height + 'px'
        // 复刻元素当前可能影响样式的所有元素
        setStyle(child, {
          position: 'fixed',
          width: rect.width + 'px',
          left: rect.left+'px',
          top: 0
        })
        el.fixme = true
      } else if (top > 0) {
        setStyle(child, { position: 'initial' })
        el.fixme = false
      }
    }
  }
})
