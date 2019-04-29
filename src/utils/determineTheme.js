export default (props, fallbackTheme) => {
  // Props should take precedence over ThemeProvider, which should take precedence over
  // defaultProps, but React automatically puts defaultProps on props.

  const theme = props.theme ? props.theme : fallbackTheme;

  return theme;
};
