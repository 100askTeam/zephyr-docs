// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'README',
    {
      type: 'category',
      label: '开始之前',
      collapsed: false,
      items: [
        'common-01-准备开发环境/README',
        {
          type: 'doc',
          id: 'common-02-认识Zephyr与工程模型/README',
          label: 'Zephyr 与工程模型',
        },
        {
          type: 'doc',
          id: 'common-03-认识HPM6E70板卡/README',
          label: 'HPM6E70 板卡',
        },
        'common-04-连接JTAG与OpenOCD/README',
        'common-05-连接串口并查看日志/README',
      ],
    },
    {
      type: 'category',
      label: '一期 · 驱动、应用与设备树',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: '认识工程与开发流程',
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'p1-01-从example-application认识标准工程/README',
              label: '第 1 课：认识 example-application',
            },
            {
              type: 'doc',
              id: 'p1-02-一键开发工作流/README',
              label: '第 2 课：构建和烧录应用',
            },
          ],
        },
        {
          type: 'category',
          label: '准备应用工程',
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'p1-03-创建第一个应用工程/README',
              label: '第 3 课：创建第一个应用工程',
            },
          ],
        },
        {
          type: 'category',
          label: '完成第一个驱动',
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'p1-04-认识Zephyr驱动结构/README',
              label: '第 4 课：认识 Zephyr 驱动结构',
            },
            {
              type: 'doc',
              id: 'p1-05-描述模块与设备树节点/README',
              label: '第 5 课：描述模块与设备树节点',
            },
            {
              type: 'doc',
              id: 'p1-06-编写Devicetree-Binding/README',
              label: '第 6 课：编写 Devicetree Binding',
            },
            {
              type: 'doc',
              id: 'p1-07-使用Kconfig与CMake注册驱动/README',
              label: '第 7 课：使用 Kconfig 与 CMake 注册',
            },
            {
              type: 'doc',
              id: 'p1-08-完成第一个驱动/README',
              label: '第 8 课：完成第一个驱动',
            },
          ],
        },
        {
          type: 'category',
          label: '编写并验证应用',
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'p1-09-从应用调用驱动/README',
              label: '第 9 课：编写应用并调用驱动',
            },
            {
              type: 'doc',
              id: 'p1-10-编译烧录并验证模块/README',
              label: '第 10 课：编译烧录并验证模块',
            },
            {
              type: 'doc',
              id: 'p1-11-复用Zephyr已有驱动/README',
              label: '第 11 课：复用 Zephyr 已有驱动',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '二期 · 从零搭建完整工程',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: '建立 SDK Glue 工作区',
          items: [
            'p2-01-搭建SDK-Glue工作区/README',
            'p2-02-确认现有软件支持/README',
          ],
        },
        {
          type: 'category',
          label: '接入 SoC 与 Board',
          items: [
            'p2-03-建立Board身份/README',
            'p2-04-接入SoC与启动链/README',
          ],
        },
        {
          type: 'category',
          label: '接通基础硬件',
          items: [
            'p2-05-接通UART0控制台/README',
            'p2-06-配置板载LED与GPIO/README',
            'p2-07-配置XPI-NOR-Flash/README',
            'p2-08-编译烧录并验证/README',
          ],
        },
        {
          type: 'category',
          label: '接入板载 SDRAM',
          items: [
            'p2-09-认识SDRAM与FEMC/README',
            'p2-10-适配板载SDRAM/README',
            'p2-11-编写SDRAM测试/README',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '排查与资料',
      items: [
        'appendix-01-故障排查/README',
        'appendix-02-资料与下载/README',
      ],
    },
  ],
};

export default sidebars;
