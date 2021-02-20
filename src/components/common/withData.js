import React from 'react';

export default function withData(Component) {
  /**
   * @param {{
   *   fetch: Function,
   *   data: any,
   *   needsRefresh?: boolean
   * }} props
   */
  return React.forwardRef((props, ref) => {
    const { fetch, data, needsRefresh, ...rest} = props;
    React.useEffect(() => {(data == null || needsRefresh) && fetch(); return;}, [needsRefresh, data, fetch]);

    return <Component ref={ref} data={data} {...rest} />
  });
}
