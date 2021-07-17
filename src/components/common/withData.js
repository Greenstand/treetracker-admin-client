import React, { useEffect } from 'react';

export default function withData(Component) {
  function ComponentWithData(props, ref) {
    const { fetch, data, needsRefresh, ...rest } = props;
    useEffect(() => {
      (data == null || needsRefresh) && fetch();
      return;
    }, [needsRefresh, data, fetch]);

    return <Component ref={ref} data={data} {...rest} />;
  }

  /**
   * @param {{
   *   fetch: Function,
   *   data: any,
   *   needsRefresh?: boolean
   * }} props
   */
  return React.forwardRef(ComponentWithData);
}
