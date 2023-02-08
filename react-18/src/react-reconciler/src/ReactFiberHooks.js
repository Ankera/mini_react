
/**
 * 
 * @param {*} current 
 * @param {*} workInPropress 
 * @param {*} Component 
 * @param {*} props 
 */
export function renderWithHooks (current, workInPropress, Component, props) {
  const children = Component(props);

  return children;
}