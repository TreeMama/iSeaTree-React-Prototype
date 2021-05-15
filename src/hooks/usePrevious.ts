import React from 'react'

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
export function usePrevious<T>(value: T) {
  const ref = React.useRef<T>()

  React.useEffect(() => {
    ref.current = value
  })

  return ref.current
}
