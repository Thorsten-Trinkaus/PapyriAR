// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  userGuide: [
    {
      type: 'html',
      value: 'User Guide',
      className: 'sidebar-title',
    },
    'user/Introduction',
    'user/Using',
    {
      type: 'category',
      label: 'Creating a visualization',
      items: [
        'user/Create',
        'user/SetUp'
      ]
    }
  ],

  devGuide: [
    {
      type: 'html',
      value: 'Developer Guide',
      className: 'sidebar-title',
    },
    'dev/Introduction',
    {
      type: 'category',label: 'jsDoc',items: [
        "jsDoc/AFrameComp",
                "jsDoc/init",
                "jsDoc/sceneObjects",
                "jsDoc/scene",
                "jsDoc/fetcher",
                "jsDoc/generator",
            ],},],};
                                                                                        
export default sidebars;
