CS2 HUD 本地预览
========================

这不是原来的 LHM 运行程序。这是一个独立的本地预览文件夹。

使用方法：
  直接双击 index.html 打开即可，无需安装依赖、无需启动 CS/LHM、无需后端。

包含内容：
  - 1920x1080 的 HUD 画布（根据窗口自动缩放）
  - 原项目 src/HUD 组件、样式、动效，未重写 UI
  - 内置模拟的 CS2 GSI 数据
  - 场景切换（冻结期、进行中、下包、拆弹、回合结束、暂停、超时、赛间、结束）
  - 地图/雷达切换
  - Killfeed 击杀动效、信息框显隐

修改原 UI 后想重新生成这个文件夹：
  npm install
  npm run demo:build
然后重新打开 demo-mode/index.html。

开发实时预览（HMR）：
  npm run demo