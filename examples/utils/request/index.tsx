import React from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRequest } from 'ahooks';
import { addUser, getUserList } from './service';
import type { UserInfo } from './interface';
import { ModalForm, ProFormText } from '@ant-design/pro-form';

const columns: ProColumns<UserInfo>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
];

export default function User() {
  const { data: addData, run: add } = useRequest(addUser, {
    manual: true,
    onSuccess: async (data) => {
      console.log('onSuccess data: ', data);
    },
  });
  console.log('add user data: ', addData);

  return (
    <ProTable
      request={getUserList}
      columns={columns}
      rowKey="id"
      toolBarRender={() => [
        <ModalForm<Omit<UserInfo, 'id'>>
          title="新建用户"
          trigger={
            <Button key="button" icon={<PlusOutlined />} type="primary">
              新建用户
            </Button>
          }
          autoFocusFirstInput
          modalProps={{
            onCancel: () => console.log('run'),
          }}
          onFinish={async (values) => {
            await add(values);
            return true;
          }}
        >
          <ProFormText name="userName" label="用户名" />
          <ProFormText name="age" label="年龄" />
        </ModalForm>,
      ]}
    />
  );
}
