import { Typography } from 'antd';
import type { TextProps } from 'antd/lib/typography/Text';

const { Text } = Typography;

export interface EllipsisMiddleProps extends TextProps {
  /** 后缀的个数 */
  suffixCount: number;
  children?: string;
}

const EllipsisMiddle = ({
  suffixCount,
  children,
  ...restProps
}: EllipsisMiddleProps) => {
  const start = children?.slice(0, children?.length - suffixCount).trim();
  const suffix = children?.slice(-suffixCount).trim();

  return (
    <Text ellipsis={{ suffix }} style={{ maxWidth: '100%' }} {...restProps}>
      {start}
    </Text>
  );
};

export default EllipsisMiddle;
