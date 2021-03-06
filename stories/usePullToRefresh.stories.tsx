import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { usePullToRefresh } from '../src';
import styled from 'styled-components';

const List = styled.div`
  height: 44px;
  line-height: 44px;
  border-bottom: 1px solid #dcdcdc;
  padding-left: 16px;
`;

storiesOf('Hooks|usePullToRefresh', module).add('Demo', function App(): JSX.Element {
  const DATA = [
    '雷杰',
    '黄刚',
    '薛涛',
    '陈勇',
    '姚明',
    '郑勇',
    '戴娜',
    '萧勇',
    '程涛',
    '徐平',
    '贺秀英',
    '夏明',
    '邵涛',
    '熊秀兰',
    '魏磊',
    '侯秀英',
    '杨芳',
    '薛杰',
    '徐明',
    '曾杰',
    '徐涛',
    '康强',
    '陈丽',
    '何芳',
    '廖静',
    '谭超',
    '汪涛',
    '邵杰',
    '崔丽',
    '于敏',
    '韩霞',
    '何伟',
    '吴平',
    '贾勇',
    '白明',
    '薛艳',
    '夏桂英',
    '田丽',
    '尹杰',
    '乔军',
    '赖明',
    '赖娜',
    '宋敏',
    '任强',
    '万强',
    '赵秀英',
    '许丽',
    '乔静',
    '钱伟',
    '陈芳',
    '郭强',
    '马磊',
    '卢艳',
    '傅秀兰',
    '熊芳',
    '石刚',
    '钱丽',
    '汪秀兰',
    '郭勇',
    '范秀兰',
    '董涛',
    '文丽',
    '叶娜',
    '秦丽',
    '何霞',
    '何明',
    '姜艳',
    '冯勇',
    '吕刚',
    '万伟',
    '武平',
    '郭丽',
    '赖涛',
    '方涛',
    '黄丽',
    '苏秀英',
    '杜霞',
    '廖秀兰',
    '高涛',
    '蒋明',
    '曹刚',
    '龙艳',
    '宋平',
  ];
  const [dataSource, setDataSource] = useState<string[]>(DATA);

  const ref = usePullToRefresh<HTMLDivElement>(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          setDataSource(DATA.slice(Math.random() * (DATA.length - 1)));
          resolve();
        }, 3000);
      }),
  );

  return (
    <div ref={ref} style={{ background: '#ffffff' }}>
      {dataSource.map((it, idx) => (
        <List key={`item_${idx}`}>{it}</List>
      ))}
    </div>
  );
});
