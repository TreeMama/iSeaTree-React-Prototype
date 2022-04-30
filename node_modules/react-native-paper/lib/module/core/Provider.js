import * as React from 'react';
import { ThemeProvider } from './theming';
import { Provider as SettingsProvider } from './settings';
import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
export default class Provider extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement(PortalHost, null, /*#__PURE__*/React.createElement(SettingsProvider, {
      value: this.props.settings || {
        icon: MaterialCommunityIcon
      }
    }, /*#__PURE__*/React.createElement(ThemeProvider, {
      theme: this.props.theme
    }, this.props.children)));
  }

}
//# sourceMappingURL=Provider.js.map