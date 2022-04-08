import { render } from '@testing-library/react';
import EllipsisMiddle from '../';

import '@testing-library/jest-dom';

// one-line, not multiple
// suffix and start are right
// short text shows all text without ellipsis

describe('EllipsisMiddle', () => {
  it('should not crash when rendering', () => {
    expect(() => {
      render(
        <div style={{ width: '100px' }}>
          <EllipsisMiddle suffixCount={12}>
            {`  In the process of internal desktop applications development, many different design specs and
      implementations would be involved, which might cause designers and developers difficulties and
      duplication and reduce the efficiency of development.`}
          </EllipsisMiddle>
        </div>,
      );
    }).not.toThrowError();
  });

  // it('Renders correctly', () => {
  //   const longText = `In the process of internal desktop applications development, many different design specs and
  //   implementations would be involved, which might cause designers and developers difficulties and
  //   duplication and reduce the efficiency of development.`;

  //   const suffixCount = 12;

  //   render(
  //     <div style={{ width: '500px' }}>
  //       <EllipsisMiddle suffixCount={12} data-testid={'testid'}>
  //         {longText}
  //       </EllipsisMiddle>
  //     </div>);

  //   const expextedStart = longText?.slice(0, longText?.length - suffixCount).trim();
  //   const expextedSuffix = longText?.slice(-suffixCount).trim();
  //   screen.debug();
  //   const displayedText = screen.getByTestId('testid').innerText;
  //   // const displayedStart = displayedText?.slice(0, displayedText?.length - suffixCount-3).trim();
  //   // const displayedSuffix = displayedText?.slice(-(suffixCount+3));
  //   // console.log('start====', displayedStart, expextedStart)
  //   // console.log('end====', displayedSuffix, expextedSuffix)

  //   // expect(displayedStart).toBe(`...${expextedStart}`);
  //   // expect(displayedSuffix).toBe(`...${expextedSuffix}`);
  //   });
});
