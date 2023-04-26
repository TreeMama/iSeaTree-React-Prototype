/* This code is importing the `Dimensions` and `StyleSheet` modules from the `react-native` library and
using them to define a stylesheet object called `styles`. The `styles` object contains several style
rules for different components, such as `treeCard`, `treeCardBottomContainer`, `buttonTab`, and
`challengeIcon`. These style rules define various properties such as width, height, margin, border,
borderRadius, backgroundColor, justifyContent, alignItems, and position for each component. These
styles can be applied to the corresponding components in a React Native application to control their
appearance. */

import { Dimensions, StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  treeCard: {
    width: Dimensions.get('screen').width * 0.47, // 0.92 for 1-column, 0.46 for 2-column
    height: Dimensions.get('screen').width * 0.47 * 0.85, // 0.92 * 0.618 for 1-column, 0.46 * 0.85 for 2-column
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#C4D0D9',
    shadowColor: '#171717',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: { width: 1, height: 2 },
    elevation: 5,
  },
  treeCardBottomContainer: {
    display: 'flex',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '30%',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  buttonTab: {
    width: Dimensions.get('screen').width * 0.57,
    height: Dimensions.get('screen').width * 0.57 * 0.16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#62717A',
    flexDirection: 'row',
    top: 15,
  },
  challengeIcon: {
    height: 28,
    width: 28,
    position: 'absolute',
    top: 3,
    left: 3,
    // backgroundColor: 'white'
  },
})
