/**
 * The function `usePrevious` is a custom React hook that returns the previous value of a given state
 * or prop.
 * @param {T} value - The value parameter is a generic type that can be any data type. It represents
 * the current value that we want to track and get the previous value of.
 * @returns The `usePrevious` custom hook returns the previous value of the input parameter passed to
 * it. It achieves this by using the `useRef` hook to create a mutable reference that persists across
 * re-renders. The `useEffect` hook is used to update the reference with the current value of the input
 * parameter on each render. Finally, the previous value is returned by accessing the current value of
 */
import React from 'react'

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
export function usePrevious<T>(value: T) {
  const ref = React.useRef<T>()

  React.useEffect(() => {
    ref.current = value
  })

  return ref.current
}
