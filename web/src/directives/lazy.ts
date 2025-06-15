import type { DirectiveBinding } from 'vue'

interface LazyElement extends HTMLImageElement {
  _observer?: IntersectionObserver
}

const defaultOptions = {
  threshold: 0.01,
  rootMargin: '0px'
}

const lazyLoad = (el: LazyElement, binding: DirectiveBinding) => {
  const imgSrc = binding.value

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        el.src = imgSrc
        el.setAttribute('lazy', 'loaded')
        observer.unobserve(el)
        el._observer = undefined
      }
    })
  }, defaultOptions)

  el.setAttribute('lazy', 'loading')
  observer.observe(el)
  el._observer = observer
}

export default {
  mounted(el: LazyElement, binding: DirectiveBinding) {
    if ('IntersectionObserver' in window) {
      lazyLoad(el, binding)
    } else {
      el.src = binding.value
    }
  },
  beforeUnmount(el: LazyElement) {
    if (el._observer) {
      el._observer.unobserve(el)
      el._observer = undefined
    }
  },
  updated(el: LazyElement, binding: DirectiveBinding) {
    if (binding.value !== binding.oldValue) {
      if (el._observer) {
        el._observer.unobserve(el)
        el._observer = undefined
      }
      lazyLoad(el, binding)
    }
  }
}